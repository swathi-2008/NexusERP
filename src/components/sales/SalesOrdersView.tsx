import React, { useState } from 'react';
import { getAllSalesOrders } from '../../services/store';
import { SalesOrder } from '../../types/erp';
import { CreateSalesOrderModal } from './CreateSalesOrderModal';
import {
  ShoppingCart,
  PlusCircle,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
} from 'lucide-react';

export const SalesOrdersView: React.FC = () => {
  const salesOrders = getAllSalesOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredOrders = salesOrders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
              <ShoppingCart className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              Sales Orders &amp; Fulfillment Registry
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Real-time tracking of sales orders, stock deductions, and auto-triggered purchase requests.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Create New Sales Order</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order #, Customer, or Product..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Status Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">All Orders ({salesOrders.length})</option>
            <option value="COMPLETED">Fulfilled / Completed</option>
            <option value="PENDING_STOCK">Awaiting Restock</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider">
                  Order Number
                </th>
                <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-right font-bold text-slate-700 uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-4 py-3 text-right font-bold text-slate-700 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-center font-bold text-slate-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider">
                  Automated Workflow Notes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredOrders.map((order) => {
                const isPending = order.status === 'PENDING_STOCK';
                const isCompleted = order.status === 'COMPLETED';

                return (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
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
                            : isPending
                            ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {isCompleted
                          ? 'Fulfilled & Stock Deducted'
                          : isPending
                          ? 'Awaiting Restock'
                          : order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-[11px] whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-[11px]">
                      {isPending ? (
                        <div className="flex items-center gap-1.5 text-amber-800 font-medium">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                          <span>{order.notes || 'Auto-PR generated. Awaiting PO receipt.'}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>{order.notes || 'Fulfilled from active stock.'}</span>
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

      <CreateSalesOrderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};
