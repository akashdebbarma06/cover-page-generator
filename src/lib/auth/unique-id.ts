import { customAlphabet } from "nanoid";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

// Alphanumeric alphabet without confusing characters (omits 0, O, 1, I, l)
const ALPHANUMERIC = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
export const generateCandidateId = customAlphabet(ALPHANUMERIC, 10);

/**
 * Generates a 10-character alphanumeric unique user ID with a collision check retry loop.
 * Matches specifications in design.md section 6.
 */
export async function generateUniqueUserId(
  client: SupabaseClient<Database>,
  maxRetries = 5
): Promise<string> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const candidateId = generateCandidateId();

    const { data, error } = await client
      .from("users")
      .select("id")
      .eq("unique_user_id", candidateId)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to check unique_user_id collision: ${error.message}`);
    }

    if (!data) {
      return candidateId;
    }
  }

  throw new Error(
    `Failed to generate a unique 10-character alphanumeric user ID after ${maxRetries} attempts.`
  );
}
