/**
 * Canonical mapping between URL slugs and Template UUIDs.
 * Ensures clean, professional, SEO-friendly alphabetical URLs:
 * e.g. /create?template=standard-institutional instead of /create?template=11111111-1111-...
 */

export const TEMPLATE_SLUGS: Record<string, string> = {
  "standard-institutional": "11111111-1111-1111-1111-111111111111",
  "academic-minimal": "22222222-2222-2222-2222-222222222222",
  "technical-laboratory": "33333333-3333-3333-3333-333333333333",
};

export const TEMPLATE_ID_TO_SLUG: Record<string, string> = {
  "11111111-1111-1111-1111-111111111111": "standard-institutional",
  "22222222-2222-2222-2222-222222222222": "academic-minimal",
  "33333333-3333-3333-3333-333333333333": "technical-laboratory",
};

/**
 * Resolves any template identifier (slug or UUID) to its canonical UUID.
 */
export function resolveTemplateId(slugOrId?: string | null): string {
  if (!slugOrId) return TEMPLATE_SLUGS["standard-institutional"];
  if (TEMPLATE_SLUGS[slugOrId]) return TEMPLATE_SLUGS[slugOrId];
  return slugOrId;
}

/**
 * Resolves a template UUID to its canonical alphabetical slug.
 */
export function resolveTemplateSlug(idOrSlug?: string | null): string {
  if (!idOrSlug) return "standard-institutional";
  if (TEMPLATE_ID_TO_SLUG[idOrSlug]) return TEMPLATE_ID_TO_SLUG[idOrSlug];
  // If already a known slug, return it
  if (TEMPLATE_SLUGS[idOrSlug]) return idOrSlug;
  return idOrSlug;
}
