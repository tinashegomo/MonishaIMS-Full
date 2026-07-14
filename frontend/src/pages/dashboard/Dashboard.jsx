import { useGetCurrentUser, useGetAllOrders, useGetAllProducts, useGetAllWarehouseBatches } from "@/hooks/InventoryHooks";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { HeroStats, SecondaryStats, OrdersTrend, StatusAndStock, RevenueSchoolProducts } from "@/components/dashboard/DashboardCharts";
import { InfoPanels } from "@/components/dashboard/DashboardInfoPanels";
import { exportToExcel, exportToPDF } from "@/utils/exportUtils";
import { FileSpreadsheet, FileText } from "lucide-react";

const ORDER_COLUMNS = [
  { header: "Order #", key: "orderNumber" },
  { header: "Customer", key: "customerName" },
  { header: "Status", key: "orderStatus" },
  { header: "Total", key: "totalAmount" },
  { header: "Paid", key: "paidAmount" },
  { header: "Date", key: "createdAt" },
];

export default function Dashboard() {
  const { data: user } = useGetCurrentUser();
  const { data: orders = [] } = useGetAllOrders();
  const { data: products = [] } = useGetAllProducts();
  const { data: batches = [] } = useGetAllWarehouseBatches();

  const dashboard = useDashboardStats({ orders, products, batches });

  return (
    <div className="min-h-screen bg-bg-default">
      <div className="animate-fade-in">
        {/* Welcome Banner */}
        <div className="mb-40 flex flex-col gap-16 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Welcome back, {user?.userName || "there"}</h1>
            <p className="mt-8 text-sm text-text-muted">Here&apos;s what&apos;s happening in your inventory today.</p>
          </div>
          <div className="flex items-center gap-8">
            {orders.length > 0 && (
              <>
                <button
                  onClick={() => exportToExcel(orders, ORDER_COLUMNS, "orders")}
                  className="inline-flex items-center justify-center gap-8 rounded-input border border-border-default bg-surface-default px-14 py-8 text-sm font-medium text-text-secondary hover:bg-surface-muted transition-all duration-200 press-scale"
                >
                  <FileSpreadsheet className="h-16 w-16" />
                  Orders Excel
                </button>
                <button
                  onClick={() => exportToPDF(orders, ORDER_COLUMNS, "Orders", "orders")}
                  className="inline-flex items-center justify-center gap-8 rounded-input border border-border-default bg-surface-default px-14 py-8 text-sm font-medium text-text-secondary hover:bg-surface-muted transition-all duration-200 press-scale"
                >
                  <FileText className="h-16 w-16" />
                  Orders PDF
                </button>
              </>
            )}
          </div>
        </div>

        <HeroStats stats={dashboard.stats} />
        <SecondaryStats stats={dashboard.stats} />
        <OrdersTrend trendData={dashboard.trendData} />
        <StatusAndStock
          statusData={dashboard.statusData}
          totalOrders={dashboard.totalOrders}
          stockByType={dashboard.stockByType}
          totalStock={dashboard.totalStock}
        />
        <RevenueSchoolProducts
          stats={dashboard.stats}
          orders={orders}
          schoolVsShopData={dashboard.schoolVsShopData}
          topProducts={dashboard.topProducts}
          collectionPercentage={dashboard.collectionPercentage}
        />
        <InfoPanels
          upcomingCollections={dashboard.upcomingCollections}
          lowStockProducts={dashboard.lowStockProducts}
        />
      </div>
    </div>
  );
}
