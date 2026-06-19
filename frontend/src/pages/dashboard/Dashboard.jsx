import { useMemo } from "react";
import {useGetCurrentUser, useGetAllOrders, useGetAllProducts, useGetAllWarehouseBatches,} from "@/hooks/InventoryHooks";
import { withinDays, gCount, gSum, wk } from "@/components/dashboard/dashboardShared";
import {HeroStats, SecondaryStats, OrdersTrend, StatusAndStock, RevenueSchoolProducts,} from "@/components/dashboard/DashboardCharts";
import { InfoPanels } from "@/components/dashboard/DashboardInfoPanels";

export default function Dashboard() {
  const { data: user } = useGetCurrentUser();
  const { data: orders = [] } = useGetAllOrders();
  const { data: products = [] } = useGetAllProducts();
  const { data: batches = [] } = useGetAllWarehouseBatches();

  /* ── Stats ── */
  const s = useMemo(() => {
    const rev = orders.reduce((a, o) => a + (Number(o.totalAmount) || 0), 0);
    const bal = orders.reduce((a, o) => a + (Number(o.balance) || 0), 0);
    const inP = orders.filter(o => o.orderStatus === "IN_PRODUCTION").length;
    const stk = batches.reduce((a, b) => a + (b.totalQuantity || 0), 0);
    const bVal = batches.reduce((a, b) => a + (b.totalQuantity || 0) * (b.batchPrice || 0), 0);
    const pVal = products.reduce((a, p) => a + (p.totalQuantity || 0) * (p.productPrice || 0), 0);
    const bMap = {}; batches.forEach(b => { bMap[b.batchId] = b.batchPrice || 0; });

    let profit = 0, loss = 0;
    products.forEach(p => {
      const m = ((p.productPrice || 0) - (bMap[p.batchId] || 0)) * (p.totalQuantity || 0);
      m >= 0 ? profit += m : loss += Math.abs(m);
    });
    return { rev, bal, profit, loss, orders: orders.length, products: products.length, inP, stk, bVal, pVal };
  }, [orders, products, batches]);

  /* ── Chart data ── */
  const statusData = useMemo(() => Object.entries(gCount(orders, "orderStatus")).map(([name, value]) => ({ name, value })), [orders]);
  const totalOrders = statusData.reduce((a, d) => a + d.value, 0) || 1;

  const paidPct = useMemo(() => {
    const r = orders.reduce((a, o) => a + (Number(o.totalAmount) || 0), 0);
    const p = orders.reduce((a, o) => a + (Number(o.paidAmount) || 0), 0);
    return r > 0 ? Math.round((p / r) * 100) : 0;
  }, [orders]);

  const trendData = useMemo(() => wk(12, orders), [orders]);

  const typeData = useMemo(() =>
    Object.entries(gSum(batches, "type", "totalQuantity"))
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value), [batches]);
  const totalStock = typeData.reduce((a, d) => a + d.value, 0) || 1;

  const topProd = useMemo(() =>
    [...products].sort((a, b) => (b.totalQuantity || 0) - (a.totalQuantity || 0))
      .slice(0, 6)
      .map(p => ({ name: p.productName?.length > 22 ? p.productName.slice(0, 22) + "…" : p.productName, qty: p.totalQuantity || 0 })), [products]);

  const schoolData = useMemo(() => {
    const sch = orders.filter(o => o.schoolOrder).length;
    const shop = orders.filter(o => !o.schoolOrder).length;
    return [{ name: "School", value: sch }, { name: "Shop", value: shop }];
  }, [orders]);

  const upcoming = useMemo(() =>
    orders.filter(o => o.collectionDate && withinDays(o.collectionDate, 7) && o.orderStatus !== "COMPLETED" && o.orderStatus !== "CANCELLED")
      .sort((a, b) => new Date(a.collectionDate) - new Date(b.collectionDate))
      .slice(0, 5), [orders]);

  const lowStock = useMemo(() =>
    products.filter(p => (p.totalQuantity || 0) < 5)
      .sort((a, b) => (a.totalQuantity || 0) - (b.totalQuantity || 0))
      .slice(0, 5), [products]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="animate-fade-in">
        {/* ── Welcome ── */}
        <div className="mb-40">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.userName || "there"}</h1>
          <p className="mt-8 text-sm text-gray-500">Here&apos;s what&apos;s happening in your inventory today.</p>
        </div>

        <HeroStats s={s} />
        <SecondaryStats s={s} />
        <OrdersTrend trendData={trendData} />
        <StatusAndStock statusData={statusData} totalOrders={totalOrders} typeData={typeData} totalStock={totalStock} />
        <RevenueSchoolProducts s={s} orders={orders} schoolData={schoolData} topProd={topProd} paidPct={paidPct} />
        <InfoPanels upcoming={upcoming} lowStock={lowStock} />
      </div>
    </div>
  );
}
