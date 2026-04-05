/**
 * Shared pure helpers (formatting, parsing, etc.).
 * Domain-specific logic lives next to features when it stays small.
 */
export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}
