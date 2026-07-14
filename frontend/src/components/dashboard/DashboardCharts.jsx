import {DollarSign, AlertCircle, ShoppingCart, Package, Scissors,TrendingUp, TrendingDown,} from "lucide-react";
import {PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,ResponsiveContainer, LineChart, Line, CartesianGrid,} from "recharts";
import {C, STATUS_C, PALETTE, formatCurrency, Tip, DonutCenter, Legend, HeroStat, SmStat, ChartCard,} from "./dashboardShared";

// ─── Helpers ──────────────────────────────────────────────────

const getPercentage = (value, total) => Math.round((value / total) * 100);

/* ── Hero Stats ── */
export function HeroStats({ stats }) {
  return (
    <div className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-16">
      <HeroStat label="Total Revenue" value={formatCurrency(stats.totalRevenue)} sub="Lifetime earnings" icon={DollarSign} color="bg-red-50 text-red-600" accent={C.brand} href="/orders" />
      <HeroStat label="Outstanding Balance" value={formatCurrency(stats.outstandingBalance)} sub="Awaiting collection" icon={AlertCircle} color="bg-amber-50 text-amber-600" accent={C.warning} href="/orders" />
    </div>
  );
}

/* ── Secondary Stats ── */
export function SecondaryStats({ stats }) {
  return (
    <div className="mb-40 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-12">
      <SmStat label="Profit" value={formatCurrency(stats.profit)} icon={TrendingUp} color="bg-emerald-50 text-emerald-600" accent={C.success} href="/orders" />
      <SmStat label="Loss" value={formatCurrency(stats.loss)} icon={TrendingDown} color="bg-red-50 text-red-600" accent={C.brand} href="/orders" />
      <SmStat label="Orders" value={stats.totalOrders} icon={ShoppingCart} color="bg-amber-50 text-amber-600" accent={C.warning} href="/orders" />
      <SmStat label="Products" value={stats.totalProducts} icon={Package} color="bg-purple-50 text-purple-600" accent={C.purple} href="/products" />
      <SmStat label="In Production" value={stats.ordersInProduction} icon={Scissors} color="bg-blue-50 text-blue-600" accent={C.info} href="/tailoring" />
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
export function StatusAndStock({ statusData, totalOrders, stockByType, totalStock }) {
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
        ) : <p className="py-40 text-center text-sm text-text-muted">No orders yet</p>}
      </ChartCard>

      <ChartCard title="Stock by Type" subtitle="Units per batch type" action={`${totalStock.toLocaleString()} Units`} className="xl:col-span-8">
        {stockByType.length > 0 ? (
          <div className="space-y-14">
            {stockByType.map((type, i) => {
              return (
                <div key={type.name}>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-medium text-text-secondary capitalize">{type.name}</span>
                    <span className="text-xs font-semibold text-text-primary tabular-nums">{type.value.toLocaleString()}</span>
                  </div>
                  <div className="h-8 w-full rounded-full bg-surface-muted overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${getPercentage(type.value, totalStock)}%`, backgroundColor: PALETTE[i % PALETTE.length] }} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : <p className="py-40 text-center text-sm text-text-muted">No stock data</p>}
      </ChartCard>
    </div>
  );
}

/* ── Revenue + School vs Shop + Top Products ── */
export function RevenueSchoolProducts({ stats, orders, schoolVsShopData, topProducts, collectionPercentage }) {
  return (
    <div className="mb-20 grid grid-cols-1 xl:grid-cols-12 gap-20">
      {/* Revenue Progress */}
      <ChartCard title="Revenue Overview" subtitle="Collection performance" action={`${collectionPercentage}% Collected`} className="xl:col-span-4">
        <div className="space-y-20">
          <div>
            <div className="flex items-end justify-between mb-8">
              <span className="text-xs font-medium text-text-muted">Total Revenue</span>
              <span className="text-2xl font-bold text-text-primary">{formatCurrency(stats.totalRevenue)}</span>
            </div>
            <div className="h-10 w-full rounded-full bg-surface-muted overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500 transition-all duration-700" style={{ width: `${collectionPercentage}%` }} />
            </div>
            <div className="flex items-center justify-between mt-8">
              <span className="text-[11px] text-emerald-600 font-medium">{formatCurrency((Number(orders.reduce((accumulator, order) => accumulator + (Number(order.paidAmount) || 0), 0))))} collected</span>
              <span className="text-[11px] text-amber-600 font-medium">{formatCurrency(stats.outstandingBalance)} outstanding</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-12 pt-12 border-t border-border-default">
            <div className="text-center">
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-4">Revenue</p>
              <p className="text-sm font-bold text-text-primary">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-4">Collected</p>
              <p className="text-sm font-bold text-emerald-600">{formatCurrency((Number(orders.reduce((accumulator, order) => accumulator + (Number(order.paidAmount) || 0), 0))))}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-4">Outstanding</p>
              <p className="text-sm font-bold text-amber-600">{formatCurrency(stats.outstandingBalance)}</p>
            </div>
          </div>
        </div>
      </ChartCard>

      {/* School vs Shop Donut */}
      <ChartCard title="School vs Shop" subtitle="Order split by channel" action={`${stats.totalOrders} Total`} className="xl:col-span-4">
        {schoolVsShopData.some(channel => channel.value > 0) ? (
          <div className="flex items-center gap-16">
            <div className="relative shrink-0">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={schoolVsShopData} cx="50%" cy="50%" innerRadius={42} outerRadius={58} paddingAngle={3} dataKey="value" strokeWidth={0}>
                    <Cell fill={C.info} />
                    <Cell fill={C.brand} />
                  </Pie>
                  <Tooltip content={<Tip />} />
                  <DonutCenter value={stats.totalOrders} label="Orders" />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1">
              <Legend data={schoolVsShopData} colors={[C.info, C.brand]} />
            </div>
          </div>
        ) : <p className="py-40 text-center text-sm text-text-muted">No orders yet</p>}
      </ChartCard>

      {/* Top Products */}
      <ChartCard title="Top Products" subtitle="By quantity in inventory" action="Top 6" className="xl:col-span-4">
        {topProducts.length > 0 ? (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={topProducts} layout="vertical" barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} width={110} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="qty" fill={C.brand} radius={[0, 6, 6, 0]} barSize={18} name="Quantity" />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="py-40 text-center text-sm text-text-muted">No products yet</p>}
      </ChartCard>
    </div>
  );
}
