// ══════════════════════════════════════════════════════════════════════════════
// DATE UTILITIES — shared date formatting helpers
// Think of these as the "date translators" — they take raw server dates
// (like "2026-07-03T14:30:00") and turn them into human-readable text
// (like "3 Jul 2026" or "3 Jul 2026, 2:30 PM").
// ══════════════════════════════════════════════════════════════════════════════

// ─── Core date parser ─────────────────────────────────────────
// Takes a date string from the server and converts it to a JavaScript Date object.
// Returns null if the input is empty or invalid (safe to use everywhere).
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr);
};

// ─── Short date format (no time) ─────────────────────────────
// Turns "2026-07-03T14:30:00" into "3 Jul 2026"
// Returns "-" if the date is missing or invalid.
const formatDate = (dateStr) => {
  const d = parseDate(dateStr);
  if (!d) return "-";
  return d.toLocaleDateString("en-ZW", { day: "numeric", month: "short", year: "numeric" });
};

// ─── Full date + time format ──────────────────────────────────
// Turns "2026-07-03T14:30:00" into "3 Jul 2026, 2:30 PM"
// Returns "-" if the date is missing or invalid.
const formatDateTime = (dateStr) => {
  const d = parseDate(dateStr);
  if (!d) return "-";
  return d.toLocaleDateString("en-ZW", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export { parseDate, formatDate, formatDateTime };
