import React from 'react';
import {
  getAllUsers,
  getAllProducts,
  getAllSalesOrders,
  getAllPurchaseOrders,
  getMonthlyMetrics,
  getAllStockTransactions,
  getAllPurchaseRequests,
  normalizeRole,
} from '../../services/store';
import {
  Users,
  Package,
  ShoppingCart,
  Truck,
  Boxes,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateTab: (tabId: string) => void;
  onOpenWorkflow: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateTab,
  onOpenWorkflow,
}) => {
  const users = getAllUsers();
  const products = getAllProducts();
  const salesOrders = getAllSalesOrders();
  const purchaseOrders = getAllPurchaseOrders();
  const monthlyMetrics = getMonthlyMetrics();
  const recentTransactions = getAllStockTransactions().slice(0, 6);
  const purchaseRequests = getAllPurchaseRequests();

  // Metrics calculation
  const totalUsers = users.length;
  const totalProducts = products.length;
  const totalSalesRevenue = salesOrders
    .filter((o) => o.status === 'COMPLETED')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const totalPurchaseCost = purchaseOrders
    .filter((o) => o.status === 'RECEIVED')
    .reduce((sum, o) => sum + o.totalCost, 0);

  const totalCurrentStockUnits = products.reduce((sum, p) => sum + p.currentStock, 0);
  const totalProfit = monthlyMetrics.reduce((sum, m) => sum + m.profit, 0);
  const totalLoss = monthlyMetrics.reduce((sum, m) => sum + m.loss, 0);

  const lowStockItems = products.filter((p) => p.currentStock <= p.minThreshold);
  const pendingApprovals = purchaseRequests.filter((pr) => pr.status === 'PENDING_APPROVAL');

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-purple-500/20 border border-purple-400/30 px-2 py-0.5 text-xs font-bold text-purple-300">
                System Administrator
              </span>
              <span className="text-xs text-slate-400">• Full Governance</span>
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Enterprise Operations Center
            </h1>
            <p className="mt-1 text-xs text-slate-300 max-w-2xl">
              Centralized monitoring of cross-module sales, procurement pipelines, real-time inventory levels, and annual profit/loss metrics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenWorkflow}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              <span>Automated Workflow Map</span>
            </button>
            <button
              onClick={() => onNavigateTab('history')}
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition-colors backdrop-blur-xs"
            >
              <span>12-Month History</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 7 KPI SUMMARY CARDS (Strictly matching Section 16 requirements) */}
      {/*
        "Example Admin:
        Total Users
        Total Products
        Total Sales
        Total Purchases
        Current Stock
        Profit
        Loss"
      */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            System Key Performance Indicators
          </h2>
          <span className="text-xs text-slate-400">Live database sync</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {/* 1. Total Users */}
          <div
            onClick={() => onNavigateTab('users')}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold text-slate-500">Total Users</span>
              <Users className="h-4 w-4 text-purple-600" />
            </div>
            <div className="mt-2 text-xl font-bold text-slate-900">{totalUsers}</div>
            <div className="mt-1 text-[10px] text-purple-600 font-medium flex items-center gap-0.5">
              <span>Manage roles</span>
              <ArrowUpRight className="h-3 w-3" />
            </div>
          </div>

          {/* 2. Total Products */}
          <div
            onClick={() => onNavigateTab('products')}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold text-slate-500">Total Products</span>
              <Package className="h-4 w-4 text-blue-600" />
            </div>
            <div className="mt-2 text-xl font-bold text-slate-900">{totalProducts}</div>
            <div className="mt-1 text-[10px] text-blue-600 font-medium flex items-center gap-0.5">
              <span>View catalog</span>
              <ArrowUpRight className="h-3 w-3" />
            </div>
          </div>

          {/* 3. Total Sales */}
          <div
            onClick={() => onNavigateTab('history')}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold text-slate-500">Total Sales</span>
              <ShoppingCart className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="mt-2 text-xl font-bold text-indigo-700">
              ${(totalSalesRevenue / 1000).toFixed(1)}k
            </div>
            <div className="mt-1 text-[10px] text-slate-500">
              {salesOrders.filter((o) => o.status === 'COMPLETED').length} fulfilled
            </div>
          </div>

          {/* 4. Total Purchases */}
          <div
            onClick={() => onNavigateTab('transactions')}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold text-slate-500">Purchases</span>
              <Truck className="h-4 w-4 text-amber-600" />
            </div>
            <div className="mt-2 text-xl font-bold text-slate-800">
              ${(totalPurchaseCost / 1000).toFixed(1)}k
            </div>
            <div className="mt-1 text-[10px] text-slate-500">
              Stock received
            </div>
          </div>

          {/* 5. Current Stock */}
          <div
            onClick={() => onNavigateTab('products')}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold text-slate-500">Current Stock</span>
              <Boxes className="h-4 w-4 text-cyan-600" />
            </div>
            <div className="mt-2 text-xl font-bold text-slate-900">
              {totalCurrentStockUnits} <span className="text-xs font-normal text-slate-400">units</span>
            </div>
            <div className="mt-1 text-[10px] text-amber-600 font-medium">
              {lowStockItems.length} low stock alerts
            </div>
          </div>

          {/* 6. Profit */}
          <div
            onClick={() => onNavigateTab('history')}
            className="cursor-pointer rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5 shadow-2xs hover:border-emerald-300 hover:shadow-xs transition-all"
          >
            <div className="flex items-center justify-between text-emerald-700">
              <span className="text-[11px] font-semibold text-emerald-800">Profit</span>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-xl font-bold text-emerald-600">
              +${(totalProfit / 1000).toFixed(1)}k
            </div>
            <div className="mt-1 text-[10px] text-emerald-700 font-medium">
              Positive margin
            </div>
          </div>

          {/* 7. Loss */}
          <div
            onClick={() => onNavigateTab('history')}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold text-slate-500">Loss</span>
              <span className="text-xs font-bold text-slate-400">$0</span>
            </div>
            <div className="mt-2 text-xl font-bold text-slate-600">
              ${totalLoss}
            </div>
            <div className="mt-1 text-[10px] text-emerald-600 font-medium">
              0 Deficits
            </div>
          </div>
        </div>
      </div>

      {/* Action / Alert Banner if Pending Approvals or Low Stock */}
      {(pendingApprovals.length > 0 || lowStockItems.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingApprovals.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-white">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-900">
                    {pendingApprovals.length} Purchase Request(s) Awaiting Manager Approval
                  </h4>
                  <p className="text-[11px] text-amber-700">
                    Cross-module restock workflow is currently pending Manager review.
                  </p>
                </div>
              </div>
            </div>
          )}

          {lowStockItems.length > 0 && (
            <div className="rounded-xl border border-red-200 bg-red-50/70 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500 text-white">
                  <Boxes className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-red-900">
                    {lowStockItems.length} Product(s) Below Minimum Threshold
                  </h4>
                  <p className="text-[11px] text-red-700">
                    {lowStockItems.map((p) => p.name).join(', ')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('products')}
                className="text-xs font-bold text-red-800 underline hover:text-red-950"
              >
                Inspect
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Content: Recent Cross-Module Transactions & System Users */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions Table */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Recent Cross-Module Transactions &amp; Audit Trail
              </h3>
              <p className="text-xs text-slate-500">
                Real-time stock movements and auto-triggered updates.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('transactions')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-xs">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">Product</th>
                  <th className="px-3 py-2 text-center font-semibold text-slate-600">Type</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-600">Quantity</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-600">Stock Balance</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-600">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-2.5 font-medium text-slate-900">
                      <div>{tx.productName}</div>
                      <div className="text-[10px] text-slate-600 font-mono">{tx.productSku}</div>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                          tx.type === 'SALES_OUT'
                            ? 'bg-blue-100 text-blue-800'
                            : tx.type === 'PURCHASE_IN'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {tx.type === 'SALES_OUT'
                          ? 'Sales Out'
                          : tx.type === 'PURCHASE_IN'
                          ? 'Stock In'
                          : tx.type}
                      </span>
                    </td>
                    <td
                      className={`px-3 py-2.5 text-right font-mono font-bold ${
                        tx.quantity < 0 ? 'text-blue-600' : 'text-emerald-600'
                      }`}
                    >
                      {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-600">
                      {tx.previousStock} &rarr; <strong className="text-slate-900">{tx.newStock}</strong>
                    </td>
                    <td className="px-3 py-2.5 text-slate-600">
                      <div className="font-mono text-[11px] font-semibold text-slate-700">
                        {tx.referenceNumber}
                      </div>
                      <div className="text-[10px] text-slate-600 truncate max-w-[140px]">
                        {tx.notes}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Role Distribution & Fast User Actions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              Staff &amp; Role Administration
            </h3>
            <p className="text-xs text-slate-500">
              Only Admin can provision accounts and assign roles.
            </p>
          </div>

          <div className="space-y-2">
            {users.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-700 text-xs">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{u.name}</div>
                    <div className="text-[10px] text-slate-600 font-mono">
                      {u.id} • {u.department}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                      normalizeRole(u.role) === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : normalizeRole(u.role) === 'manager'
                        ? 'bg-blue-100 text-blue-800'
                        : normalizeRole(u.role) === 'sales'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {u.role.toUpperCase()}
                  </span>
                  <div className="text-[9px] text-slate-600 mt-0.5">
                    {u.isActive ? 'Active' : 'Disabled'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateTab('users')}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Manage Users &amp; Create New Employee
          </button>
        </div>
      </div>
    </div>
  );
};
