import React, { useState } from 'react';
import {
  getAllPurchaseRequests,
  getAllPurchaseOrders,
  getAllProducts,
  getAllSuppliers,
  createPurchaseOrderFromRequest,
  receivePurchaseOrderGoods,
} from '../../services/store';
import {
  Truck,
  ClipboardList,
  CheckCircle,
  Clock,
  Boxes,
  PlusCircle,
  PackageCheck,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Building,
} from 'lucide-react';

interface PurchaseDashboardProps {
  onOpenWorkflow: () => void;
  onNavigateTab: (tab: string) => void;
}

export const PurchaseDashboard: React.FC<PurchaseDashboardProps> = ({
  onOpenWorkflow,
  onNavigateTab,
}) => {
  const purchaseRequests = getAllPurchaseRequests();
  const purchaseOrders = getAllPurchaseOrders();
  const products = getAllProducts();
  const suppliers = getAllSuppliers();

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // 4 KPI Summary Cards for Purchase Staff (per Section 16):
  // Pending Requests, Approved Requests, Active Purchase Orders, Pending Deliveries
  const pendingRequests = purchaseRequests.filter((pr) => pr.status === 'PENDING_APPROVAL');
  const approvedRequests = purchaseRequests.filter((pr) => pr.status === 'APPROVED');
  const activePOs = purchaseOrders.filter((po) => po.status === 'ORDERED');
  const pendingDeliveries = purchaseOrders.filter((po) => po.status === 'ORDERED');

  const handleConvertPR = (prId: string) => {
    const res = createPurchaseOrderFromRequest(prId);
    if (res.success) {
      setNotificationMsg(res.message);
      setTimeout(() => setNotificationMsg(null), 3000);
    }
  };

  const handleReceiveGoods = (poId: string) => {
    const res = receivePurchaseOrderGoods(poId);
    if (res.success) {
      setNotificationMsg(res.message);
      setTimeout(() => setNotificationMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-linear-to-r from-amber-900 via-yellow-950 to-slate-900 p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-amber-500/20 border border-amber-400/30 px-2 py-0.5 text-xs font-bold text-amber-300">
                Procurement &amp; Supply Chain
              </span>
              <span className="text-xs text-slate-300">• Automatic Replenishment</span>
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Purchasing Terminal
            </h1>
            <p className="mt-1 text-xs text-slate-300 max-w-xl">
              Turn manager-approved requests into supplier orders, log inbound shipments, and trigger auto-fulfillment for waiting sales orders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenWorkflow}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-amber-400 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              <span>Workflow Engine</span>
            </button>
            <button
              onClick={() => onNavigateTab('tracking')}
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition-colors backdrop-blur-xs"
            >
              <span>PO Tracking</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {notificationMsg && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-bold text-emerald-900 flex items-center gap-2 shadow-xs">
          <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* 4 SUMMARY CARDS (Strictly matching Section 16 requirements) */}
      {/*
        "Purchase Staff:
        Pending Requests
        Approved Requests
        Active Purchase Orders
        Pending Deliveries"
      */}
      <div>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Procurement Pipeline Status
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Pending Requests */}
          <div
            onClick={() => onNavigateTab('pending-requests')}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:border-amber-400 transition-all"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold text-slate-500">Pending Requests</span>
              <ClipboardList className="h-4 w-4 text-amber-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              {pendingRequests.length}
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Awaiting manager review
            </p>
          </div>

          {/* 2. Approved Requests */}
          <div
            onClick={() => onNavigateTab('pending-requests')}
            className="cursor-pointer rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-xs hover:border-emerald-400 transition-all"
          >
            <div className="flex items-center justify-between text-emerald-700">
              <span className="text-xs font-semibold text-emerald-800">Approved Requests</span>
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-emerald-800">
              {approvedRequests.length}
            </div>
            <p className="mt-1 text-[11px] text-emerald-700 font-medium">
              Ready to generate PO
            </p>
          </div>

          {/* 3. Active Purchase Orders */}
          <div
            onClick={() => onNavigateTab('purchase-orders')}
            className="cursor-pointer rounded-xl border border-blue-200 bg-blue-50/50 p-4 shadow-xs hover:border-blue-400 transition-all"
          >
            <div className="flex items-center justify-between text-blue-700">
              <span className="text-xs font-semibold text-blue-800">Active POs</span>
              <Truck className="h-4 w-4 text-blue-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-blue-800">
              {activePOs.length}
            </div>
            <p className="mt-1 text-[11px] text-blue-700 font-medium">
              Issued to vendors
            </p>
          </div>

          {/* 4. Pending Deliveries */}
          <div
            onClick={() => onNavigateTab('tracking')}
            className="cursor-pointer rounded-xl border border-purple-200 bg-purple-50/50 p-4 shadow-xs hover:border-purple-400 transition-all"
          >
            <div className="flex items-center justify-between text-purple-700">
              <span className="text-xs font-semibold text-purple-800">Pending Deliveries</span>
              <Clock className="h-4 w-4 text-purple-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-purple-800">
              {pendingDeliveries.length}
            </div>
            <p className="mt-1 text-[11px] text-purple-700 font-medium">
              Awaiting dock receipt
            </p>
          </div>
        </div>
      </div>

      {/* APPROVED REQUESTS READY TO BECOME POs */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Approved Requests — Ready to Issue Purchase Order
            </h3>
            <p className="text-xs text-slate-500">
              Manager has approved these items. Click "Generate PO" to dispatch orders to suppliers.
            </p>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 font-mono text-xs font-bold text-emerald-800">
            {approvedRequests.length} Approved
          </span>
        </div>

        {approvedRequests.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-600">
            No manager-approved requests awaiting PO conversion.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-xs">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-4 py-2.5 text-left font-bold text-slate-700">PR #</th>
                  <th className="px-4 py-2.5 text-left font-bold text-slate-700">Product</th>
                  <th className="px-4 py-2.5 text-right font-bold text-slate-700">Quantity</th>
                  <th className="px-4 py-2.5 text-right font-bold text-slate-700">Est. Total</th>
                  <th className="px-4 py-2.5 text-left font-bold text-slate-700">Supplier</th>
                  <th className="px-4 py-2.5 text-right font-bold text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {approvedRequests.map((pr) => (
                  <tr key={pr.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-indigo-700">
                      {pr.prNumber}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{pr.productName}</div>
                      <div className="text-[10px] text-slate-600 font-mono">SKU: {pr.productSku}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      {pr.requestedQuantity}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      ${pr.estimatedCost.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {pr.suggestedSupplierName}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleConvertPR(pr.id)}
                        className="rounded-lg bg-amber-600 px-3 py-1.5 font-bold text-white shadow-xs hover:bg-amber-700 transition-colors flex items-center gap-1.5 ml-auto"
                      >
                        <Truck className="h-3.5 w-3.5" />
                        <span>Generate PO</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ACTIVE PURCHASE ORDERS & GOODS RECEIPT */}
      {/*
        "AFTER THE GOODS ARRIVE:
        -> Purchase Staff updates the system.
        -> Stock quantity automatically increases in the database.
        -> Inventory records are updated.
        -> If a Sales Order was waiting for this stock, it can now be processed."
      */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Inbound Shipments &amp; Dock Receipt Station
            </h3>
            <p className="text-xs text-slate-500">
              When goods arrive at the warehouse, click "Receive Goods". Stock increments automatically and awaiting sales orders are fulfilled!
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-xs">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-4 py-2.5 text-left font-bold text-slate-700">PO Number</th>
                <th className="px-4 py-2.5 text-left font-bold text-slate-700">Supplier</th>
                <th className="px-4 py-2.5 text-left font-bold text-slate-700">Product</th>
                <th className="px-4 py-2.5 text-right font-bold text-slate-700">Quantity</th>
                <th className="px-4 py-2.5 text-right font-bold text-slate-700">Cost</th>
                <th className="px-4 py-2.5 text-center font-bold text-slate-700">Status</th>
                <th className="px-4 py-2.5 text-right font-bold text-slate-700">Warehouse Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {purchaseOrders.map((po) => {
                const isReceived = po.status === 'RECEIVED';

                return (
                  <tr key={po.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-indigo-700">
                      {po.poNumber}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {po.supplierName}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{po.productName}</div>
                      <div className="text-[10px] text-slate-600 font-mono">SKU: {po.productSku}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      {po.quantity}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                      ${po.totalCost.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block rounded-md px-2.5 py-1 text-[10px] font-bold ${
                          isReceived
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200 animate-pulse'
                        }`}
                      >
                        {isReceived ? 'Received & Stock Added' : 'In Transit / Ordered'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {!isReceived ? (
                        <button
                          onClick={() => handleReceiveGoods(po.id)}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors flex items-center gap-1.5 ml-auto"
                        >
                          <PackageCheck className="h-3.5 w-3.5" />
                          <span>Receive Goods &amp; Auto-Update</span>
                        </button>
                      ) : (
                        <div className="flex items-center justify-end gap-1 text-emerald-700 font-bold text-[11px]">
                          <CheckCircle className="h-4 w-4" />
                          <span>Docked</span>
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
    </div>
  );
};
