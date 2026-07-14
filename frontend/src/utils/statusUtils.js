// ══════════════════════════════════════════════════════════════════════════════
// STATUS UTILITIES — shared order status constants and helpers
// Single source of truth for status colors, transitions, and display.
// ══════════════════════════════════════════════════════════════════════════════

// ─── Status transition rules ─────────────────────────────────
// Defines which status changes are allowed from each current status.
// Used by the Orders page to decide which buttons to show in the dropdown.
const STATUS_TRANSITIONS = {
  PENDING: [
    { status: "READY_FOR_COLLECTION", label: "Ready for Collection" },
    { status: "CANCELLED", label: "Cancel Order" },
  ],
  IN_PRODUCTION: [
    { status: "READY_FOR_COLLECTION", label: "Ready for Collection" },
    { status: "CANCELLED", label: "Cancel Order" },
  ],
  READY_FOR_COLLECTION: [
    { status: "COMPLETED", label: "Mark Collected" },
    { status: "CANCELLED", label: "Cancel Order" },
  ],
  COMPLETED: [],
  CANCELLED: [],
};

// ─── Status text colors ──────────────────────────────────────
// Plain colored text classes for each order status.
// Used everywhere: Orders table, OrderDetails page, UserDetails activity list.
const STATUS_COLORS = {
  PENDING: "text-gray-600",
  IN_PRODUCTION: "text-amber-600",
  READY_FOR_COLLECTION: "text-blue-600",
  COMPLETED: "text-emerald-600",
  CANCELLED: "text-red-600",
};

export { STATUS_TRANSITIONS, STATUS_COLORS };
