import { Link } from "react-router-dom";
import { Calendar, AlertTriangle, ChevronRight } from "lucide-react";
import { formatShortDate } from "./dashboardShared";

export function InfoPanels({ upcomingCollections, lowStockProducts }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
      {/* Upcoming Collections */}
      <div className="rounded-2xl border border-border-default bg-surface-default p-24 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="mb-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex h-40 w-40 items-center justify-center rounded-xl bg-blue-50">
              <Calendar className="h-20 w-20 text-blue-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Upcoming Collections</h3>
              <p className="mt-2 text-xs text-text-muted">Next 7 days</p>
            </div>
          </div>
          {upcomingCollections.length > 0 && (
            <Link to="/orders" className="flex items-center gap-4 text-xs font-medium text-brand-primary hover:text-brand-hover transition-colors">
              View all <ChevronRight className="w-12 h-12" />
            </Link>
          )}
        </div>
        {upcomingCollections.length > 0 ? (
          <div className="space-y-10">
            {upcomingCollections.map(order => (
              <div key={order.orderId} className="flex items-center justify-between rounded-xl border border-border-default px-14 py-12 hover:bg-surface-muted transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-text-primary truncate">{order.orderNumber}</p>
                  <p className="text-[11px] text-text-muted truncate">{order.customerName}</p>
                </div>
                <div className="flex items-center gap-10 shrink-0 ml-12">
                  <span className="text-[11px] text-text-secondary whitespace-nowrap">{order.orderStatus?.replace(/_/g, " ")}</span>
                  <span className="text-[11px] text-text-muted whitespace-nowrap">{formatShortDate(order.collectionDate)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : <p className="py-24 text-center text-xs text-text-muted">No upcoming collections</p>}
      </div>

      {/* Low Stock Alert */}
      <div className="rounded-2xl border border-border-default bg-surface-default p-24 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="mb-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex h-40 w-40 items-center justify-center rounded-xl bg-amber-50">
              <AlertTriangle className="h-20 w-20 text-amber-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Low Stock Alert</h3>
              <p className="mt-2 text-xs text-text-muted">Products below 5 units</p>
            </div>
          </div>
          {lowStockProducts.length > 0 && (
            <Link to="/products" className="flex items-center gap-4 text-xs font-medium text-brand-primary hover:text-brand-hover transition-colors">
              View all <ChevronRight className="w-12 h-12" />
            </Link>
          )}
        </div>
        {lowStockProducts.length > 0 ? (
          <div className="space-y-10">
            {lowStockProducts.map(product => (
              <div key={product.productId} className="flex items-center justify-between rounded-xl border border-border-default px-14 py-12 hover:bg-surface-muted transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-text-primary truncate">{product.productName}</p>
                  <p className="text-[11px] text-text-muted capitalize">{product.type} · {product.variant}</p>
                </div>
                <span className={`text-xs font-bold tabular-nums shrink-0 ml-12 ${(product.totalQuantity || 0) === 0 ? "text-danger-main" : "text-warning-main"}`}>
                  {product.totalQuantity || 0} left
                </span>
              </div>
            ))}
          </div>
        ) : <p className="py-24 text-center text-xs text-text-muted">All stock levels healthy</p>}
      </div>
    </div>
  );
}
