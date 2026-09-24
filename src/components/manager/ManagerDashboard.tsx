import React, { useState } from 'react';
import {
  getAllPurchaseRequests,
  getAllProducts,
  getAllSalesOrders,
  getAllPurchaseOrders,
  approvePurchaseRequest,
  rejectPurchaseRequest,
} from '../../services/store';
import { PurchaseRequest } from '../../types/erp';
import {
  ClipboardCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileText,
  DollarSign,
  Package,
  Sparkles,
  X,
} from 'lucide-react';

interface ManagerDashboardProps {
  onOpenWorkflow: () => void;
  onNavigateTab: (tab: string) => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  onOpenWorkflow,
  onNavigateTab,
}) => {
  const purchaseRequests = getAllPurchaseRequests();
  const products = getAllProducts();
  const salesOrders = getAllSalesOrders();
  const purchaseOrders = getAllPurchaseOrders();

  const [reviewingRequest, setReviewingRequest] = useState<PurchaseRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  // 4 KPI Summary Cards for Manager (per Section 16):
  // Pending Approvals, Approved Requests, Rejected Requests, Low Stock Items
  const pendingApprovals = purchaseRequests.filter((pr) => pr.status === 'PENDING_APPROVAL');
  const approvedRequests = purchaseRequests.filter((pr) => pr.status === 'APPROVED');
  const rejectedRequests = purchaseRequests.filter((pr) => pr.status === 'REJECTED');
  const lowStockItems = products.filter((p) => p.currentStock <= p.minThreshold);

  const handleApprove = (id: string) => {
    approvePurchaseRequest(id, 'Approved for procurement dispatch.');
    setReviewingRequest(null);
  };

  const handleReject = (id: string) => {
    if (!rejectReason.trim()) return;
    rejectPurchaseRequest(id, rejectReason.trim());
    setReviewingRequest(null);
    setRejectReason('');
    setIsRejecting(false);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-linear-to-r from-blue-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-blue-500/20 border border-blue-400/30 px-2 py-0.5 text-xs font-bold text-blue-300">
                Operational Management
              </span>
              <span className="text-xs text-slate-300">• Procurement Gatekeeper</span>
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Manager Approval Hub
            </h1>
            <p className="mt-1 text-xs text-slate-300 max-w-xl">
              Authorize stock replenishment requests generated automatically by sales order deficits or low stock inventory thresholds.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenWorkflow}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              <span>Workflow Engine</span>
            </button>
            <button
              onClick={() => onNavigateTab('purchase-requests')}
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition-colors backdrop-blur-xs"
            >
              <span>View All Requests</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 SUMMARY CARDS (Strictly matching Section 16 requirements) */}
      {/*
        "Manager:
        Pending Approvals
        Approved Requests
        Rejected Requests
        Low Stock Items"
      */}
      <div>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Manager Key Performance Indicators
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Pending Approvals */}
          <div
            onClick={() => onNavigateTab('purchase-requests')}
            className="cursor-pointer rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-xs hover:border-amber-400 transition-all"
          >
            <div className="flex items-center justify-between text-amber-700">
              <span className="text-xs font-semibold text-amber-800">Pending Approvals</span>
              <ClipboardCheck className="h-4 w-4 text-amber-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-amber-800">
              {pendingApprovals.length}
            </div>
            <p className="mt-1 text-[11px] text-amber-700 font-medium">
              Requires authorization
            </p>
          </div>

          {/* 2. Approved Requests */}
          <div
            onClick={() => onNavigateTab('approved-requests')}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:border-indigo-300 transition-all"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold text-slate-500">Approved Requests</span>
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              {approvedRequests.length}
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Dispatched to Purchase Staff
            </p>
          </div>

          {/* 3. Rejected Requests */}
          <div
            onClick={() => onNavigateTab('rejected-requests')}
            className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:border-indigo-300 transition-all"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold text-slate-500">Rejected Requests</span>
              <XCircle className="h-4 w-4 text-red-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
              {rejectedRequests.length}
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Stopped with recorded reason
            </p>
          </div>

          {/* 4. Low Stock Items */}
          <div
            onClick={() => onNavigateTab('stock-alerts')}
            className="cursor-pointer rounded-xl border border-red-200 bg-red-50/50 p-4 shadow-xs hover:border-red-400 transition-all"
          >
            <div className="flex items-center justify-between text-red-700">
              <span className="text-xs font-semibold text-red-800">Low Stock Items</span>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-red-800">
              {lowStockItems.length}
            </div>
            <p className="mt-1 text-[11px] text-red-700 font-medium">
              Below threshold
            </p>
          </div>
        </div>
      </div>

      {/* Urgent Approval Queue */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Urgent Purchase Requests Awaiting Manager Action
            </h3>
            <p className="text-xs text-slate-500">
              Approving advances the request to Purchase Staff to generate a Purchase Order. Rejecting notifies relevant staff.
            </p>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 font-mono text-xs font-bold text-amber-800">
            {pendingApprovals.length} Action Items
          </span>
        </div>

        {pendingApprovals.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-700">
            <CheckCircle className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
            <div className="font-bold text-slate-700">No Pending Approvals</div>
            <p className="text-slate-600 mt-1">
              All purchase requests have been reviewed. When Sales Staff enters orders with insufficient inventory, new requests will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-xs">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-4 py-2.5 text-left font-bold text-slate-700">PR Number</th>
                  <th className="px-4 py-2.5 text-left font-bold text-slate-700">Product</th>
                  <th className="px-4 py-2.5 text-right font-bold text-slate-700">Requested Qty</th>
                  <th className="px-4 py-2.5 text-right font-bold text-slate-700">Est. Cost</th>
                  <th className="px-4 py-2.5 text-left font-bold text-slate-700">Reason / Auto-Trigger</th>
                  <th className="px-4 py-2.5 text-right font-bold text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingApprovals.map((pr) => (
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
                    <td className="px-4 py-3 text-slate-600 text-[11px] max-w-sm">
                      <div className="font-medium text-slate-800">{pr.reason}</div>
                      {pr.salesOrderId && (
                        <span className="inline-block mt-0.5 rounded-sm bg-indigo-50 px-1.5 py-0.2 text-[9px] font-mono text-indigo-700">
                          Linked Order: {pr.salesOrderId}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleApprove(pr.id)}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setReviewingRequest(pr);
                            setIsRejecting(true);
                          }}
                          className="rounded-lg border border-red-200 px-3 py-1.5 font-bold text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review / Reject Dialog */}
      {reviewingRequest && isRejecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Reject Purchase Request {reviewingRequest.prNumber}
              </h3>
              <button
                onClick={() => setReviewingRequest(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-600">
              Provide a clear reason for rejection. This will be logged in the audit trail and sent to the initiating department.
            </p>

            <div className="mt-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Rejection Reason *
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Budget ceiling reached for this quarter, or pending alternative supplier quote..."
                className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => setReviewingRequest(null)}
                className="rounded-lg border px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(reviewingRequest.id)}
                disabled={!rejectReason.trim()}
                className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
