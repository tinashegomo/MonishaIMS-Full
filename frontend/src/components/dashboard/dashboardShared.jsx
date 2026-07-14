import { Link } from "react-router-dom";

/* ── Colors ── */
export const C = {
  brand: "#e60000", brandLight: "#ffe0e0",
  success: "#22c55e", successLight: "#dcfce7",
  warning: "#f59e0b", warningLight: "#fef3c7",
  info: "#3b82f6", infoLight: "#dbeafe",
  purple: "#8b5cf6", purpleLight: "#ede9fe",
  slate: "#64748b", gray: "#94a3b8",
};

export const STATUS_C = {
  PENDING: C.gray, IN_PRODUCTION: C.warning,
  READY_FOR_COLLECTION: C.info, COMPLETED: C.success, CANCELLED: C.brand,
};

export const PALETTE = [C.brand, C.success, C.warning, C.info, C.purple, C.slate];

/* ── Helpers ────────────────────────────────────────────────────── */

// Format a number as currency (e.g., 1500 → "$1,500"). Returns "$0" for null/undefined.
export const formatCurrency = (value) => {
  if (value == null) return "$0";
  return "$" + Number(value).toLocaleString();
};

// Format a date as short display (e.g., "2026-07-03" → "3 Jul"). No year. Returns "—" if missing.
// NOTE: intentionally different from dateUtils.formatDate which includes the year.
export const formatShortDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

// Check if a date falls within the next N days from today (inclusive).
// Used for "upcoming collections" panel — shows orders due soon.
export const isWithinDays = (dateStr, numberOfDays) => {
  if (!dateStr) return false;
  const targetDate = new Date(dateStr);
  const today = new Date();
  const millisecondsPerDay = 864e5; // 24 * 60 * 60 * 1000
  return targetDate >= today && (targetDate - today) / millisecondsPerDay <= numberOfDays;
};

// Count how many items share the same value for a given key.
// Example: gCount(orders, "orderStatus") → { PENDING: 3, COMPLETED: 12 }
// Used for the order status donut chart.
export const groupCount = (items, key) => {
  return items.reduce((result, item) => {
    const value = item[key] || "Unknown";
    result[value] = (result[value] || 0) + 1;
    return result;
  }, {});
};

// Sum a numeric field, grouped by another field.
// Example: gSum(batches, "type", "totalQuantity") → { Shirts: 150, Trousers: 80 }
// Used for the stock-by-type progress bars.
export const groupSum = (items, groupKey, sumKey) => {
  return items.reduce((result, item) => {
    const group = item[groupKey] || "Unknown";
    result[group] = (result[group] || 0) + (item[sumKey] || 0);
    return result;
  }, {});
};

// Generate weekly trend data for the last N weeks.
// Returns an array like [{ w: "23 Jun", n: 5 }, { w: "30 Jun", n: 8 }, ...]
// where "w" is the week label and "n" is the order count for that week.
// Used for the orders-over-time line chart.
export const getWeeklyTrend = (numberOfWeeks, orders) => {
  const result = [];
  const now = new Date();

  for (let i = numberOfWeeks - 1; i >= 0; i--) {
    // Calculate the start of this week (Monday)
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() - i * 7);
    weekStart.setHours(0, 0, 0, 0);

    // Calculate the end of this week (Sunday)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // Count orders created within this week
    const ordersThisWeek = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= weekStart && orderDate <= weekEnd;
    }).length;

    result.push({
      w: formatShortDate(weekStart), // week label (e.g., "23 Jun")
      n: ordersThisWeek,             // order count for this week
    });
  }

  return result;
};

/* ── Tooltip ── */
export function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border-default bg-surface-default px-14 py-10 shadow-lg">
      {label && <p className="mb-6 text-[11px] font-medium text-text-muted">{label}</p>}
      {payload.map((e, i) => (
        <p key={i} className="text-[11px] text-text-secondary">
          <span className="mr-6 inline-block h-7 w-7 rounded-full align-middle" style={{ backgroundColor: e.color }} />
          {e.name}: {typeof e.value === "number" ? e.value.toLocaleString() : e.value}
        </p>
      ))}
    </div>
  );
}

/* ── Donut Center ── */
export function DonutCenter({ value, label }) {
  return (
    <>
      <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" className="fill-text-primary" fontSize="16" fontWeight="700">{value}</text>
      <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="fill-text-muted" fontSize="9" fontWeight="500">{label}</text>
    </>
  );
}

/* ── Donut Legend ── */
export function Legend({ data, colors }) {
  return (
    <div className="space-y-12">
      {data.map((d, i) => (
        <div key={d.name} className="flex items-center gap-10">
          <span className="h-10 w-10 shrink-0 rounded-full" style={{ backgroundColor: colors[i] }} />
          <span className="flex-1 text-xs text-text-muted truncate">{d.label || d.name.replace(/_/g, " ")}</span>
          <span className="text-xs font-semibold text-text-primary tabular-nums">{d.value?.toLocaleString?.() ?? d.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Hero Stat Card ── */
export function HeroStat({ label, value, sub, icon: Ic, color, accent, href }) {
  return (
    <Link to={href} className="relative rounded-2xl border border-border-default bg-surface-default p-20 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group overflow-hidden">
      <div className="absolute top-0 left-0 h-1 w-full rounded-t-2xl" style={{ backgroundColor: accent }} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-medium text-text-muted uppercase tracking-wider">{label}</p>
          <p className="mt-8 text-4xl font-bold text-text-primary leading-tight">{value}</p>
          {sub && <p className="mt-6 text-xs font-medium" style={{ color: accent }}>{sub}</p>}
        </div>
        <div className={`flex h-44 w-44 shrink-0 items-center justify-center rounded-2xl ${color} transition-transform duration-300 group-hover:scale-110`}>
          <Ic className="h-22 w-22" />
        </div>
      </div>
    </Link>
  );
}

/* ── Small Stat Card ── */
export function SmStat({ label, value, icon: Ic, color, accent, href }) {
  return (
    <Link to={href} className="relative rounded-2xl border border-border-default bg-surface-default p-14 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group overflow-hidden">
      <div className="absolute top-0 left-0 h-1 w-full rounded-t-2xl" style={{ backgroundColor: accent }} />
      <div className="flex items-center gap-10">
        <div className={`flex h-32 w-32 shrink-0 items-center justify-center rounded-xl ${color} transition-transform duration-300 group-hover:scale-110`}>
          <Ic className="h-16 w-16" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider">{label}</p>
          <p className="mt-4 text-lg sm:text-xl font-bold text-text-primary leading-tight whitespace-nowrap">{value}</p>
        </div>
      </div>
    </Link>
  );
}

/* ── Chart Card ── */
export function ChartCard({ title, subtitle, action, children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-border-default bg-surface-default p-24 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
      <div className="flex items-start justify-between mb-20">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
          {subtitle && <p className="mt-2 text-xs text-text-muted">{subtitle}</p>}
        </div>
        {action && <span className="rounded-full bg-surface-muted px-8 py-4 text-[10px] font-medium text-text-secondary">{action}</span>}
      </div>
      {children}
    </div>
  );
}
