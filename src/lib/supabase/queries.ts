import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Database,
  UserRow,
  UserProfileRow,
  TemplateRow,
  LogoRow,
  LogoWithSignedUrl,
  CoverPageRow,
  EnrichedCoverPageRow,
  AuthProvider,
} from "./types";

// Flexible typed client that accepts clients created from @supabase/ssr or @supabase/supabase-js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TypedSupabaseClient = SupabaseClient<Database, any, any>;

// ============================================================================
// Users Queries
// ============================================================================

/**
 * Retrieves a user record by primary UUID.
 */
export async function getUserById(
  client: TypedSupabaseClient,
  userId: string
): Promise<UserRow | null> {
  const { data, error } = await client
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }
  return data;
}

/**
 * Retrieves a user record by OAuth provider and provider user ID.
 */
export async function getUserByProvider(
  client: TypedSupabaseClient,
  authProvider: AuthProvider,
  authProviderId: string
): Promise<UserRow | null> {
  const { data, error } = await client
    .from("users")
    .select("*")
    .eq("auth_provider", authProvider)
    .eq("auth_provider_id", authProviderId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}

/**
 * Retrieves a user record by registered email.
 */
export async function getUserByEmail(
  client: TypedSupabaseClient,
  email: string
): Promise<UserRow | null> {
  const { data, error } = await client
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}

/**
 * Creates a new user record.
 */
export async function createUserRecord(
  client: TypedSupabaseClient,
  payload: Database["public"]["Tables"]["users"]["Insert"]
): Promise<UserRow> {
  const { data, error } = await client
    .from("users")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export function isValidUuid(str?: string | null): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

// ============================================================================
// User Profiles Queries
// ============================================================================

/**
 * Retrieves a student profile by user ID.
 */
export async function getUserProfile(
  client: TypedSupabaseClient,
  userId: string
): Promise<UserProfileRow | null> {
  if (!isValidUuid(userId)) return null;

  const { data, error } = await client
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}

/**
 * Upserts a student profile (inserts if not present, updates if exists).
 */
export async function upsertUserProfile(
  client: TypedSupabaseClient,
  profile: Database["public"]["Tables"]["user_profiles"]["Insert"]
): Promise<UserProfileRow> {
  const { data, error } = await client
    .from("user_profiles")
    .upsert({
      ...profile,
      updated_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

// ============================================================================
// Templates Queries
// ============================================================================

/**
 * Retrieves all available institutional cover page templates.
 */
export async function getAllTemplates(
  client: TypedSupabaseClient
): Promise<TemplateRow[]> {
  const { data, error } = await client
    .from("templates")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
}

import { resolveTemplateId } from "@/lib/templates/slugs";

/**
 * Retrieves a single template by canonical UUID or alphabetical slug.
 */
export async function getTemplateById(
  client: TypedSupabaseClient,
  templateIdOrSlug: string
): Promise<TemplateRow | null> {
  const canonicalId = resolveTemplateId(templateIdOrSlug);

  const { data, error } = await client
    .from("templates")
    .select("*")
    .eq("id", canonicalId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}


// ============================================================================
// Logos Queries
// ============================================================================

/**
 * Retrieves accessible logos (all system logos + custom logos owned by userId)
 * enriched with time-limited signed URLs for secure rendering.
 */
export async function getAvailableLogos(
  client: TypedSupabaseClient,
  userId?: string
): Promise<LogoWithSignedUrl[]> {
  let query = client.from("logos").select("*");

  if (isValidUuid(userId)) {
    query = query.or(`is_system.eq.true,user_id.eq.${userId}`);
  } else {
    query = query.eq("is_system", true);
  }

  // System logos first, then newest custom uploads
  const { data, error } = await query
    .order("is_system", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!data || data.length === 0) return [];

  // Generate signed URLs in batch (valid for 1 hour = 3600 seconds)
  try {
    const paths = data.map((l) => l.storage_path);
    const { data: signedList, error: signError } = await client.storage
      .from("logos")
      .createSignedUrls(paths, 3600);

    if (signError || !signedList) {
      console.warn("Could not batch sign logo URLs:", signError);
      return data.map((logo) => ({ ...logo, signed_url: null }));
    }

    const signedMap = new Map<string, string>();
    for (const item of signedList) {
      if (item.path && item.signedUrl && !item.error) {
        signedMap.set(item.path, item.signedUrl);
      }
    }

    return data.map((logo) => ({
      ...logo,
      signed_url: signedMap.get(logo.storage_path) || null,
    }));
  } catch (storageErr) {
    console.error("Storage error generating signed URLs for logos:", storageErr);
    return data.map((logo) => ({ ...logo, signed_url: null }));
  }
}

/**
 * Creates a new custom logo record in the database.
 */
export async function createLogoRecord(
  client: TypedSupabaseClient,
  payload: Database["public"]["Tables"]["logos"]["Insert"]
): Promise<LogoRow> {
  const { data, error } = await client
    .from("logos")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

/**
 * Retrieves a single logo by ID.
 */
export async function getLogoById(
  client: TypedSupabaseClient,
  logoId: string
): Promise<LogoRow | null> {
  const { data, error } = await client
    .from("logos")
    .select("*")
    .eq("id", logoId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}

/**
 * Deletes a custom logo record owned by the user.
 */
export async function deleteLogoRecord(
  client: TypedSupabaseClient,
  logoId: string,
  userId: string
): Promise<boolean> {
  const { error } = await client
    .from("logos")
    .delete()
    .eq("id", logoId)
    .eq("user_id", userId)
    .eq("is_system", false);

  if (error) throw error;
  return true;
}

/**
 * Generates a signed URL for a specific logo storage path.
 */
export async function getLogoSignedUrl(
  client: TypedSupabaseClient,
  storagePath: string,
  expiresIn = 3600
): Promise<string | null> {
  const { data, error } = await client.storage
    .from("logos")
    .createSignedUrl(storagePath, expiresIn);

  if (error || !data) return null;
  return data.signedUrl;
}


// ============================================================================
// Cover Pages Queries
// ============================================================================

/**
 * Retrieves all cover pages generated by the current user,
 * enriched with template metadata and time-limited signed PDF download URLs.
 */
export async function getUserCoverPages(
  client: TypedSupabaseClient,
  userId: string
): Promise<EnrichedCoverPageRow[]> {
  if (!isValidUuid(userId)) return [];

  // Query cover pages with template join
  let data: any[] | null = null;
  const { data: joinData, error: joinError } = await client
    .from("cover_pages")
    .select("*, templates(name)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (joinError || !joinData) {
    const { data: rawData, error: rawError } = await client
      .from("cover_pages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (rawError) throw rawError;
    data = rawData;
  } else {
    data = joinData;
  }

  if (!data || data.length === 0) return [];

  // Collect PDF storage paths for batch signed URLs
  const paths = data
    .map((c) => c.pdf_storage_path)
    .filter((p): p is string => Boolean(p));

  const signedMap = new Map<string, string>();
  if (paths.length > 0) {
    try {
      const { data: signedList } = await client.storage
        .from("cover-pages")
        .createSignedUrls(paths, 3600);

      if (signedList) {
        for (const item of signedList) {
          if (item.path && item.signedUrl && !item.error) {
            signedMap.set(item.path, item.signedUrl);
          }
        }
      }
    } catch (e) {
      console.warn("Could not batch sign cover-pages URLs:", e);
    }
  }

  return data.map((row) => ({
    ...row,
    template_name: row.templates?.name || undefined,
    pdf_download_url: row.pdf_storage_path ? signedMap.get(row.pdf_storage_path) || null : null,
  }));
}

/**
 * Retrieves a single cover page by ID ensuring user ownership.
 */
export async function getCoverPageById(
  client: TypedSupabaseClient,
  coverPageId: string,
  userId: string
): Promise<CoverPageRow | null> {
  if (!isValidUuid(coverPageId) || !isValidUuid(userId)) return null;

  const { data, error } = await client
    .from("cover_pages")
    .select("*")
    .eq("id", coverPageId)
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}

/**
 * Records a newly generated cover page.
 */
export async function createCoverPageRecord(
  client: TypedSupabaseClient,
  payload: Database["public"]["Tables"]["cover_pages"]["Insert"]
): Promise<CoverPageRow> {
  const { data, error } = await client
    .from("cover_pages")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}
