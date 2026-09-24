import React, { useState } from 'react';
import {
  getAllPurchaseRequests,
  approvePurchaseRequest,
  rejectPurchaseRequest,
} from '../../services/store';
import { PurchaseRequest } from '../../types/erp';
import {
  ClipboardList,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  X,
  AlertTriangle,
} from 'lucide-react';

interface ManagerApprovalsViewProps {
  initialStatusFilter?: 'ALL' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
}

export const ManagerApprovalsView: React.FC<ManagerApprovalsViewProps> = ({
  initialStatusFilter = 'ALL',
}) => {
  const purchaseRequests = getAllPurchaseRequests();
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter);
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewingRequest, setReviewingRequest] = useState<PurchaseRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const filteredRequests = purchaseRequests.filter((pr) => {
    const matchesSearch =
      pr.prNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.createdByName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || pr.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: string) => {
    approvePurchaseRequest(id, 'Approved by Manager for procurement.');
    setReviewingRequest(null);
  };

  const handleReject = () => {
    if (!reviewingRequest || !rejectReason.trim()) return;
    rejectPurchaseRequest(reviewingRequest.id, rejectReason.trim());
    setReviewingRequest(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
              <ClipboardList className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              Purchase Requests &amp; Authorization Pipeline
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Review procurement requests triggered automatically by sales orders or minimum inventory levels.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by PR #, Product, or Requester..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">All ({purchaseRequests.length})</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="ORDERED">Ordered</option>
            <option value="RECEIVED">Received</option>
          </select>
        </div>
      </div>

      {/* Requests Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider">
                  PR #
                </th>
                <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-right font-bold text-slate-700 uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-4 py-3 text-right font-bold text-slate-700 uppercase tracking-wider">
                  Est. Cost
                </th>
                <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider">
                  Preferred Supplier
                </th>
                <th className="px-4 py-3 text-center font-bold text-slate-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider">
                  Workflow Details
                </th>
                <th className="px-4 py-3 text-right font-bold text-slate-700 uppercase tracking-wider">
                  Manager Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredRequests.map((pr) => {
                const isPending = pr.status === 'PENDING_APPROVAL';
                const isApproved = pr.status === 'APPROVED';
                const isRejected = pr.status === 'REJECTED';

                return (
                  <tr key={pr.id} className="hover:bg-slate-50/80 transition-colors">
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
                      {pr.suggestedSupplierName || 'Primary Supplier'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block rounded-md px-2.5 py-1 text-[10px] font-bold ${
                          isPending
                            ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                            : isApproved
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : isRejected
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {pr.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-[11px] max-w-xs">
                      <div className="font-medium text-slate-800">{pr.reason}</div>
                      {pr.managerComment && (
                        <div className="text-[10px] text-slate-600 mt-0.5">Manager: {pr.managerComment}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isPending ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleApprove(pr.id)}
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setReviewingRequest(pr)}
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-600">
                          {isApproved ? 'Approved' : isRejected ? 'Rejected' : 'Processed'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {reviewingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Reject Request {reviewingRequest.prNumber}
              </h3>
              <button
                onClick={() => setReviewingRequest(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Provide Mandatory Rejection Reason *
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explain why this request is declined..."
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:ring-2 focus:ring-red-500"
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
                onClick={handleReject}
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
