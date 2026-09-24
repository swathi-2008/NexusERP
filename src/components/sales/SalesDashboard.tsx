import React, { useState } from 'react';
import {
  getAllSalesOrders,
  getAllProducts,
  getAllCustomers,
} from '../../services/store';
import { CreateSalesOrderModal } from './CreateSalesOrderModal';
import {
  ShoppingCart,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Boxes,
  ArrowRight,
  Sparkles,
  Building2,
  Users,
} from 'lucide-react';

interface SalesDashboardProps {
  onOpenWorkflow: () => void;
  onNavigateTab: (tab: string) => void;
}

export const SalesDashboard: React.FC<SalesDashboardProps> = ({
  onOpenWorkflow,
  onNavigateTab,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const salesOrders = getAllSalesOrders();
  const products = getAllProducts();
  const customers = getAllCustomers();

  // 4 KPI Summary Cards for Sales Staff (per Section 16):
  // Today's Orders, Pending Orders, Completed Orders, Low Stock Products
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysOrders = salesOrders.filter((o) => o.createdAt.startsWith(todayStr));
  const pendingOrders = salesOrders.filter((o) => o.status === 'PENDING_STOCK');
  const completedOrders = salesOrders.filter((o) => o.status === 'COMPLETED');
  const lowStockProducts = products.filter((p) => p.currentStock <= p.minThreshold);

  return (
    <div className="space-y-6">
      {/* Sales Action Banner */}
      <div className="rounded-2xl bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 text-xs font-bold text-emerald-300">
                Commercial Sales Operations
              </span>
              <span className="text-xs text-slate-300">• Automated Replenishment</span>
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Sales Order Terminal
            </h1>
            <p className="mt-1 text-xs text-slate-300 max-w-xl">
              Create orders, verify live warehouse stock, and let the ERP automatically dispatch Purchase Requests when inventory is depleted.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-900 shadow-md hover:bg-emerald-400 transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create Sales Order</span>
            </button>
            <button
              onClick={onOpenWorkflow}
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition-colors backdrop-blur-xs"
            >
              <Sparkles className="h-4 w-4" />
              <span>Workflow Engine</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 SUMMARY CARDS (Strictly matching Section 16 requirements) */}
      {/*
        "Sales Staff:
        Today's Orders
        Pending Orders
        Completed Orders
        Low Stock Products"
      */}
      <div>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Sales Performance Summary
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Today's Orders */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold text-slate-500">Today's Orders</span>
              <ShoppingCart className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              {todaysOrders.length}
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Logged in current cycle
            </p>
          </div>

          {/* 2. Pending Orders */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-xs">
            <div className="flex items-center justify-between text-amber-700">
              <span className="text-xs font-semibold text-amber-800">Pending Orders</span>
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-amber-800">
              {pendingOrders.length}
            </div>
            <p className="mt-1 text-[11px] text-amber-700">
              Awaiting PR/PO restock
            </p>
          </div>

          {/* 3. Completed Orders */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold text-slate-500">Completed Orders</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              {completedOrders.length}
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Fulfilled &amp; stock deducted
            </p>
          </div>

          {/* 4. Low Stock Products */}
          <div className="rounded-xl border border-red-200 bg-red-50/50 p-4 shadow-xs">
            <div className="flex items-center justify-between text-red-700">
              <span className="text-xs font-semibold text-red-800">Low Stock Products</span>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-red-800">
              {lowStockProducts.length}
            </div>
            <p className="mt-1 text-[11px] text-red-700">
              At or below min threshold
            </p>
          </div>
        </div>
      </div>

      {/* Orders Table with Cross-Module Status */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Recent Sales Orders &amp; Automated Pipeline
            </h3>
            <p className="text-xs text-slate-500">
              Track order fulfillment status and automatic purchase request linkages.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Order</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-xs">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-4 py-2.5 text-left font-bold text-slate-700">Order #</th>
                <th className="px-4 py-2.5 text-left font-bold text-slate-700">Customer</th>
                <th className="px-4 py-2.5 text-left font-bold text-slate-700">Product</th>
                <th className="px-4 py-2.5 text-right font-bold text-slate-700">Quantity</th>
                <th className="px-4 py-2.5 text-right font-bold text-slate-700">Total ($)</th>
                <th className="px-4 py-2.5 text-center font-bold text-slate-700">Workflow Status</th>
                <th className="px-4 py-2.5 text-left font-bold text-slate-700">Automated Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {salesOrders.map((order) => {
                const isPendingStock = order.status === 'PENDING_STOCK';
                const isCompleted = order.status === 'COMPLETED';

                return (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-indigo-700">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{order.customerName}</div>
                      <div className="text-[10px] text-slate-600">{order.customerEmail}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{order.productName}</div>
                      <div className="text-[10px] text-slate-600 font-mono">SKU: {order.productSku}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      {order.quantity}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      ${order.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block rounded-md px-2.5 py-1 text-[10px] font-bold ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : isPendingStock
                            ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {isCompleted
                          ? 'Fulfilled & Stock Deducted'
                          : isPendingStock
                          ? 'Awaiting Restock'
                          : order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-[11px]">
                      {isPendingStock ? (
                        <div className="flex items-center gap-1.5 text-amber-800 font-medium">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                          <span>Auto PR dispatched to Manager</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>Fulfilled immediately</span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Available Stock Quick Glance */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Boxes className="h-5 w-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Live Stock Availability for Sales Quoting
            </h3>
          </div>
          <span className="text-xs text-slate-500">Updated in real-time</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {products.map((p) => {
            const isLow = p.currentStock <= p.minThreshold;
            return (
              <div
                key={p.id}
                className={`rounded-xl border p-3.5 text-xs transition-all ${
                  isLow
                    ? 'border-amber-300 bg-amber-50/50'
                    : 'border-slate-200 bg-slate-50/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 truncate">{p.name}</span>
                  <span
                    className={`font-mono text-xs font-extrabold px-2 py-0.5 rounded-md ${
                      isLow ? 'bg-amber-200 text-amber-900' : 'bg-white text-slate-900 border'
                    }`}
                  >
                    {p.currentStock} {p.unit}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Price: ${p.unitPrice}</span>
                  <span>Min Threshold: {p.minThreshold}</span>
                </div>
                {isLow && (
                  <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-amber-800">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Orders over {p.currentStock} will trigger auto-PR</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <CreateSalesOrderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};
