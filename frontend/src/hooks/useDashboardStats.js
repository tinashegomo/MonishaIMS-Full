import { useMemo } from "react";
import { isWithinDays, groupCount, groupSum, getWeeklyTrend } from "@/components/dashboard/dashboardShared";

/**
 * Custom hook to compute all business statistics and chart data
 * from raw orders, products, and batches arrays.
 * Moves complex data-crunching logic out of the Dashboard component.
 */
export function useDashboardStats({ orders = [], products = [], batches = [] }) {
  // ─── Core KPI Stats ───────────────────────────────────────────
  // Computes lifetime revenue, unpaid balances, profit, loss, and stock quantities
  const stats = useMemo(() => {
    // Total revenue — sum of every order's totalAmount
    const totalRevenue = orders.reduce((acc, o) => acc + (Number(o.totalAmount) || 0), 0);

    // Outstanding balance — sum of every order's balance (uncollected payments)
    const outstandingBalance = orders.reduce((acc, o) => acc + (Number(o.balance) || 0), 0);

    // Orders currently in production
    const ordersInProduction = orders.filter(o => o.orderStatus === "IN_PRODUCTION").length;

    // Total physical items across all warehouse batches
    const totalStockUnits = batches.reduce((acc, b) => acc + (b.totalQuantity || 0), 0);

    // Total cost/valuation of all warehouse batch stock (cost price * qty)
    const batchStockValue = batches.reduce((acc, b) => acc + (b.totalQuantity || 0) * (b.batchPrice || 0), 0);

    // Total valuation of all product stock (selling price * qty)
    const productStockValue = products.reduce((acc, p) => acc + (p.totalQuantity || 0) * (p.productPrice || 0), 0);

    // Pre-build a lookup dictionary: batchId -> batchPrice
    // Ensures constant-time O(1) cost lookups when looping products below
    const batchPriceLookup = {};
    batches.forEach(b => {
      batchPriceLookup[b.batchId] = b.batchPrice || 0;
    });

    // Calculate margins to derive aggregate profit and loss
    let profit = 0;
    let loss = 0;
    products.forEach(p => {
      const margin = ((p.productPrice || 0) - (batchPriceLookup[p.batchId] || 0)) * (p.totalQuantity || 0);
      if (margin >= 0) {
        profit += margin;
      } else {
        loss += Math.abs(margin);
      }
    });

    return {
      totalRevenue,
      outstandingBalance,
      profit,
      loss,
      totalOrders: orders.length,
      totalProducts: products.length,
      ordersInProduction,
      totalStockUnits,
      batchStockValue,
      productStockValue,
    };
  }, [orders, products, batches]);

  // ─── Chart Data ───────────────────────────────────────────────

  // Counts of orders grouped by status (PENDING, COMPLETED, etc.) for donut chart
  const statusData = useMemo(() => 
    Object.entries(groupCount(orders, "orderStatus")).map(([name, value]) => ({ name, value })),
    [orders]
  );

  const totalOrders = statusData.reduce((acc, d) => acc + d.value, 0) || 1;

  // Percentage of total revenue that has been collected
  const collectionPercentage = useMemo(() => {
    const revenue = orders.reduce((acc, o) => acc + (Number(o.totalAmount) || 0), 0);
    const paidAmount = orders.reduce((acc, o) => acc + (Number(o.paidAmount) || 0), 0);
    return revenue > 0 ? Math.round((paidAmount / revenue) * 100) : 0;
  }, [orders]);

  // Last 12 weeks of weekly order trends for the line chart
  const trendData = useMemo(() => getWeeklyTrend(12, orders), [orders]);

  // Units grouped by batch type, sorted highest to lowest
  const stockByType = useMemo(() =>
    Object.entries(groupSum(batches, "type", "totalQuantity"))
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value),
    [batches]
  );

  const totalStock = stockByType.reduce((acc, d) => acc + d.value, 0) || 1;

  // Top 6 products by quantity for vertical bar chart
  const topProducts = useMemo(() =>
    [...products]
      .sort((a, b) => (b.totalQuantity || 0) - (a.totalQuantity || 0))
      .slice(0, 6)
      .map(p => ({
        name: p.productName?.length > 22 ? p.productName.slice(0, 22) + "…" : p.productName,
        qty: p.totalQuantity || 0,
      })),
    [products]
  );

  // Distribution between school orders and individual walk-in shop orders
  const schoolVsShopData = useMemo(() => {
    const schoolOrderCount = orders.filter(o => o.schoolOrder).length;
    const shopOrderCount = orders.filter(o => !o.schoolOrder).length;
    return [
      { name: "School", value: schoolOrderCount },
      { name: "Shop", value: shopOrderCount },
    ];
  }, [orders]);

  // ─── Info Panel Lists ─────────────────────────────────────────

  // Orders due to be collected within 7 days, excluding COMPLETED and CANCELLED
  const upcomingCollections = useMemo(() =>
    orders
      .filter(o => o.collectionDate && isWithinDays(o.collectionDate, 7) && o.orderStatus !== "COMPLETED" && o.orderStatus !== "CANCELLED")
      .sort((a, b) => new Date(a.collectionDate) - new Date(b.collectionDate))
      .slice(0, 5),
    [orders]
  );

  // Products with critically low stock level (less than 5 units left)
  const lowStockProducts = useMemo(() =>
    products
      .filter(p => (p.totalQuantity || 0) < 5)
      .sort((a, b) => (a.totalQuantity || 0) - (b.totalQuantity || 0))
      .slice(0, 5),
    [products]
  );

  return {
    stats,
    statusData,
    totalOrders,
    collectionPercentage,
    trendData,
    stockByType,
    totalStock,
    topProducts,
    schoolVsShopData,
    upcomingCollections,
    lowStockProducts,
  };
}
