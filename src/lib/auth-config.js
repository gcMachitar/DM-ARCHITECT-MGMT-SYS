/**
 * Hard-coded gate passwords for the operations dashboard based on roles.
 * Change passwords here — not stored in Supabase or any database.
 */
export const ARCHITECT_PASSWORD = "dm-architect";
export const STAFF_PASSWORD = "dm-staff";

/** Cookie name set after a successful login */
export const AUTH_COOKIE_NAME = "dm_authenticated_role";

/** Session length in seconds (default: 7 days) */
export const AUTH_SESSION_MAX_AGE = 60 * 60 * 24 * 7;
