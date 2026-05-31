export type LockLevel = "none" | "soft" | "hard" | "refresh" | "reauth";

const ONE_MINUTE = 60 * 1000;
const FIVE_MINUTES = 5 * ONE_MINUTE;
const THIRTY_MINUTES = 30 * ONE_MINUTE;
const TWENTY_FOUR_HOURS = 24 * 60 * ONE_MINUTE;

/**
 * Determines the lock level based on how long the app has been in the background.
 *
 * - < 1 min  → none    (no action needed)
 * - 1–5 min  → soft    (e.g. dim overlay, brief re-confirm)
 * - 5–30 min → hard    (biometric / PIN required)
 * - 30 min–24 hr → refresh (silent token refresh)
 * - > 24 hr  → reauth  (full re-authentication)
 */
export function determineLockLevel(backgroundDurationMs: number): LockLevel {
  if (backgroundDurationMs < ONE_MINUTE) return "none";
  if (backgroundDurationMs < FIVE_MINUTES) return "soft";
  if (backgroundDurationMs < THIRTY_MINUTES) return "hard";
  if (backgroundDurationMs < TWENTY_FOUR_HOURS) return "refresh";
  return "reauth";
}
