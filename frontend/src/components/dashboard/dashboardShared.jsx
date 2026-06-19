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

/* ── Helpers ── */
export const fmt$ = (v) => v == null ? "$0" : "$" + Number(v).toLocaleString();
export const fmtD = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "—";
export const withinDays = (d, n) => { if (!d) return false; const t = new Date(d), now = new Date(); return t >= now && (t - now) / 864e5 <= n; };
export const gCount = (a, k) => a.reduce((r, i) => { const v = i[k] || "Unknown"; r[v] = (r[v] || 0) + 1; return r; }, {});
export const gSum = (a, g, s) => a.reduce((r, i) => { const v = i[g] || "Unknown"; r[v] = (r[v] || 0) + (i[s] || 0); return r; }, {});
export const wk = (n, o) => { const r = [], now = new Date(); for (let i = n - 1; i >= 0; i--) { const s = new Date(now); s.setDate(now.getDate() - now.getDay() - i * 7); s.setHours(0, 0, 0, 0); const e = new Date(s); e.setDate(s.getDate() + 6); e.setHours(23, 59, 59, 999); r.push({ w: s.toLocaleDateString("en-GB", { day: "numeric", month: "short" }), n: o.filter(x => { const d = new Date(x.createdAt); return d >= s && d <= e; }).length }); } return r; };

/* ── Tooltip ── */
export function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-14 py-10 shadow-lg">
      {label && <p className="mb-6 text-[11px] font-medium text-gray-400">{label}</p>}
      {payload.map((e, i) => (
        <p key={i} className="text-[11px] text-gray-700">
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
      <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-900" fontSize="16" fontWeight="700">{value}</text>
      <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-400" fontSize="9" fontWeight="500">{label}</text>
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
          <span className="flex-1 text-xs text-gray-500 truncate">{d.label || d.name.replace(/_/g, " ")}</span>
          <span className="text-xs font-semibold text-gray-900 tabular-nums">{d.value?.toLocaleString?.() ?? d.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Hero Stat Card ── */
export function HeroStat({ label, value, sub, icon: Ic, color, accent, href }) {
  return (
    <Link to={href} className="relative rounded-2xl border border-gray-200/60 bg-white p-20 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group overflow-hidden">
      <div className="absolute top-0 left-0 h-1 w-full rounded-t-2xl" style={{ backgroundColor: accent }} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{label}</p>
          <p className="mt-8 text-4xl font-bold text-gray-900 leading-tight">{value}</p>
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
    <Link to={href} className="relative rounded-2xl border border-gray-200/60 bg-white p-18 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group overflow-hidden">
      <div className="absolute top-0 left-0 h-1 w-full rounded-t-2xl" style={{ backgroundColor: accent }} />
      <div className="flex items-center gap-12">
        <div className={`flex h-36 w-36 shrink-0 items-center justify-center rounded-xl ${color} transition-transform duration-300 group-hover:scale-110`}>
          <Ic className="h-18 w-18" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider truncate">{label}</p>
          <p className="mt-4 text-2xl font-bold text-gray-900 leading-tight truncate">{value}</p>
        </div>
      </div>
    </Link>
  );
}

/* ── Chart Card ── */
export function ChartCard({ title, subtitle, action, children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-gray-200/60 bg-white p-24 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
      <div className="flex items-start justify-between mb-20">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="mt-2 text-xs text-gray-400">{subtitle}</p>}
        </div>
        {action && <span className="rounded-full bg-gray-100 px-8 py-4 text-[10px] font-medium text-gray-500">{action}</span>}
      </div>
      {children}
    </div>
  );
}
