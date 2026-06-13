/**
 * Hard-coded gate password for the operations dashboard.
 * Change ACCESS_PASSWORD here — not stored in Supabase or any database.
 */
export const ACCESS_PASSWORD = "dm-operations";

/** Cookie name set after a successful login */
export const AUTH_COOKIE_NAME = "dm_authenticated";

/** Session length in seconds (default: 7 days) */
export const AUTH_SESSION_MAX_AGE = 60 * 60 * 24 * 7;
