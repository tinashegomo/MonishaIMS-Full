import {
  DollarSign, AlertCircle, ShoppingCart, Package, Scissors,
  TrendingUp, TrendingDown,
} from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, LineChart, Line, CartesianGrid,
} from "recharts";
import {
  C, STATUS_C, PALETTE, fmt$, Tip, DonutCenter, Legend, HeroStat, SmStat, ChartCard,
} from "./dashboardShared";

/* ── Hero Stats ── */
export function HeroStats({ s }) {
  return (
    <div className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-16">
      <HeroStat label="Total Revenue" value={fmt$(s.rev)} sub="Lifetime earnings" icon={DollarSign} color="bg-red-50 text-red-600" accent={C.brand} href="/orders" />
      <HeroStat label="Outstanding Balance" value={fmt$(s.bal)} sub="Awaiting collection" icon={AlertCircle} color="bg-amber-50 text-amber-600" accent={C.warning} href="/orders" />
    </div>
  );
}

/* ── Secondary Stats ── */
export function SecondaryStats({ s }) {
  return (
    <div className="mb-40 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-12">
      <SmStat label="Profit" value={fmt$(s.profit)} icon={TrendingUp} color="bg-emerald-50 text-emerald-600" accent={C.success} href="/orders" />
      <SmStat label="Loss" value={fmt$(s.loss)} icon={TrendingDown} color="bg-red-50 text-red-600" accent={C.brand} href="/orders" />
      <SmStat label="Orders" value={s.orders} icon={ShoppingCart} color="bg-amber-50 text-amber-600" accent={C.warning} href="/orders" />
      <SmStat label="Products" value={s.products} icon={Package} color="bg-purple-50 text-purple-600" accent={C.purple} href="/products" />
      <SmStat label="In Production" value={s.inP} icon={Scissors} color="bg-blue-50 text-blue-600" accent={C.info} href="/tailoring" />
    </div>
  );
}

/* ── Orders Trend ── */
export function OrdersTrend({ trendData }) {
  return (
    <div className="mb-20">
      <ChartCard title="Orders Over Time" subtitle="Weekly trend — last 12 weeks" action="12 Weeks">
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="w" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<Tip />} />
            <Line type="natural" dataKey="n" stroke={C.brand} strokeWidth={3} dot={false} activeDot={{ r: 5 }} name="Orders" />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

/* ── Status Donut + Stock by Type ── */
export function StatusAndStock({ statusData, totalOrders, typeData, totalStock }) {
  return (
    <div className="mb-20 grid grid-cols-1 xl:grid-cols-12 gap-20">
      <ChartCard title="Order Status" subtitle="Distribution by lifecycle" action={`${totalOrders} Total`} className="xl:col-span-4">
        {statusData.length > 0 ? (
          <div className="flex items-center gap-16">
            <div className="relative shrink-0">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={42} outerRadius={58} paddingAngle={3} dataKey="value" strokeWidth={0}>
                    {statusData.map(e => <Cell key={e.name} fill={STATUS_C[e.name] || C.gray} />)}
                  </Pie>
                  <Tooltip content={<Tip />} />
                  <DonutCenter value={totalOrders} label="Orders" />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 min-w-0">
              <Legend data={statusData} colors={statusData.map(e => STATUS_C[e.name] || C.gray)} />
            </div>
          </div>
        ) : <p className="py-40 text-center text-sm text-gray-400">No orders yet</p>}
      </ChartCard>

      <ChartCard title="Stock by Type" subtitle="Units per batch type" action={`${totalStock.toLocaleString()} Units`} className="xl:col-span-8">
        {typeData.length > 0 ? (
          <div className="space-y-14">
            {typeData.map((d, i) => {
              const pct = Math.round((d.value / totalStock) * 100);
              return (
                <div key={d.name}>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-medium text-gray-700 capitalize">{d.name}</span>
                    <span className="text-xs font-semibold text-gray-900 tabular-nums">{d.value.toLocaleString()}</span>
                  </div>
                  <div className="h-8 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: PALETTE[i % PALETTE.length] }} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : <p className="py-40 text-center text-sm text-gray-400">No stock data</p>}
      </ChartCard>
    </div>
  );
}

/* ── Revenue + School vs Shop + Top Products ── */
export function RevenueSchoolProducts({ s, orders, schoolData, topProd, paidPct }) {
  return (
    <div className="mb-20 grid grid-cols-1 xl:grid-cols-12 gap-20">
      {/* Revenue Progress */}
      <ChartCard title="Revenue Overview" subtitle="Collection performance" action={`${paidPct}% Collected`} className="xl:col-span-4">
        <div className="space-y-20">
          <div>
            <div className="flex items-end justify-between mb-8">
              <span className="text-xs font-medium text-gray-500">Total Revenue</span>
              <span className="text-2xl font-bold text-gray-900">{fmt$(s.rev)}</span>
            </div>
            <div className="h-10 w-full rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500 transition-all duration-700" style={{ width: `${paidPct}%` }} />
            </div>
            <div className="flex items-center justify-between mt-8">
              <span className="text-[11px] text-emerald-600 font-medium">{fmt$((Number(orders.reduce((a, o) => a + (Number(o.paidAmount) || 0), 0))))} collected</span>
              <span className="text-[11px] text-amber-600 font-medium">{fmt$(s.bal)} outstanding</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-12 pt-12 border-t border-gray-100">
            <div className="text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-4">Revenue</p>
              <p className="text-sm font-bold text-gray-900">{fmt$(s.rev)}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-4">Collected</p>
              <p className="text-sm font-bold text-emerald-600">{fmt$((Number(orders.reduce((a, o) => a + (Number(o.paidAmount) || 0), 0))))}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-4">Outstanding</p>
              <p className="text-sm font-bold text-amber-600">{fmt$(s.bal)}</p>
            </div>
          </div>
        </div>
      </ChartCard>

      {/* School vs Shop Donut */}
      <ChartCard title="School vs Shop" subtitle="Order split by channel" action={`${s.orders} Total`} className="xl:col-span-4">
        {schoolData.some(d => d.value > 0) ? (
          <div className="flex items-center gap-16">
            <div className="relative shrink-0">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={schoolData} cx="50%" cy="50%" innerRadius={42} outerRadius={58} paddingAngle={3} dataKey="value" strokeWidth={0}>
                    <Cell fill={C.info} />
                    <Cell fill={C.brand} />
                  </Pie>
                  <Tooltip content={<Tip />} />
                  <DonutCenter value={s.orders} label="Orders" />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1">
              <Legend data={schoolData} colors={[C.info, C.brand]} />
            </div>
          </div>
        ) : <p className="py-40 text-center text-sm text-gray-400">No orders yet</p>}
      </ChartCard>

      {/* Top Products */}
      <ChartCard title="Top Products" subtitle="By quantity in inventory" action="Top 6" className="xl:col-span-4">
        {topProd.length > 0 ? (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={topProd} layout="vertical" barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} width={110} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="qty" fill={C.brand} radius={[0, 6, 6, 0]} barSize={18} name="Quantity" />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="py-40 text-center text-sm text-gray-400">No products yet</p>}
      </ChartCard>
    </div>
  );
}
