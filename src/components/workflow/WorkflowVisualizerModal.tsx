import React from 'react';
import {
  getAllSalesOrders,
  getAllPurchaseRequests,
  getAllPurchaseOrders,
  getAllProducts,
} from '../../services/store';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowDown,
  ShoppingCart,
  Boxes,
  ClipboardCheck,
  Truck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface WorkflowVisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (role: string, tab: string) => void;
}

export const WorkflowVisualizerModal: React.FC<WorkflowVisualizerModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const salesOrders = getAllSalesOrders();
  const purchaseRequests = getAllPurchaseRequests();
  const purchaseOrders = getAllPurchaseOrders();
  const products = getAllProducts();

  const totalSales = salesOrders.length;
  const pendingStockOrders = salesOrders.filter((o) => o.status === 'PENDING_STOCK');
  const completedOrders = salesOrders.filter((o) => o.status === 'COMPLETED');

  const pendingApprovals = purchaseRequests.filter((r) => r.status === 'PENDING_APPROVAL');
  const approvedPRs = purchaseRequests.filter((r) => r.status === 'APPROVED');
  const rejectedPRs = purchaseRequests.filter((r) => r.status === 'REJECTED');

  const activePOs = purchaseOrders.filter((o) => o.status === 'ORDERED');
  const receivedPOs = purchaseOrders.filter((o) => o.status === 'RECEIVED');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Sparkles className="h-4 w-4" />
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Automated Cross-Module ERP Workflow
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              One business action automatically triggers the next cross-department step in real time.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Live Interactive Workflow Stepper */}
        <div className="mt-6 space-y-6">
          {/* STEP 1: SALES ORDER */}
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-900">
                      STEP 1: Sales Order Creation
                    </span>
                    <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                      Sales Staff Role
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Sales Staff enters customer details, product, and requested quantity.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-lg bg-white px-3 py-1.5 font-semibold text-slate-700 border border-indigo-100 shadow-xs">
                  {totalSales} Total Orders
                </span>
                <span className="rounded-lg bg-emerald-100 px-3 py-1.5 font-semibold text-emerald-800">
                  {completedOrders.length} Fulfilled
                </span>
              </div>
            </div>
          </div>

          {/* CONNECTOR: AUTOMATIC STOCK CHECK */}
          <div className="flex flex-col items-center justify-center text-slate-400">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 shadow-xs">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Automatic System Stock Check</span>
            </div>
            <ArrowDown className="h-5 w-5 my-1 text-indigo-400" />
          </div>

          {/* TWO BRANCHES: STOCK AVAILABLE VS INSUFFICIENT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* BRANCH A: STOCK AVAILABLE */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-900">
                    Branch A: Stock Is Available
                  </h4>
                  <p className="text-[11px] text-emerald-700">
                    Current stock &gt;= requested quantity
                  </p>
                </div>
              </div>
              <div className="mt-3 space-y-2 text-xs text-slate-700 bg-white/80 p-3 rounded-lg border border-emerald-100">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Inventory immediately deducted from warehouse</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Sales Order marked as <strong className="text-emerald-700 font-bold">COMPLETED</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Revenue &amp; profit recorded into Admin P&amp;L history</span>
                </div>
              </div>
            </div>

            {/* BRANCH B: STOCK INSUFFICIENT */}
            <div className="rounded-xl border border-amber-300 bg-amber-50/50 p-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 text-white">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-900">
                    Branch B: Stock Insufficient / Low
                  </h4>
                  <p className="text-[11px] text-amber-700">
                    Current stock &lt; requested quantity
                  </p>
                </div>
              </div>
              <div className="mt-3 space-y-2 text-xs text-slate-700 bg-white/80 p-3 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span>Sales Order placed in <strong className="text-amber-700 font-bold">AWAITING RESTOCK</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span>System <strong>automatically generates Purchase Request</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span>Approval notification dispatched to Manager</span>
                </div>
              </div>
              {pendingStockOrders.length > 0 && (
                <div className="mt-2 text-[11px] font-semibold text-amber-800 bg-amber-100/60 p-2 rounded-md">
                  Currently {pendingStockOrders.length} order(s) awaiting restock.
                </div>
              )}
            </div>
          </div>

          {/* CONNECTOR */}
          <div className="flex justify-center text-slate-400">
            <ArrowDown className="h-5 w-5 text-indigo-400" />
          </div>

          {/* STEP 2: MANAGER APPROVAL */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                  <ClipboardCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-900">
                      STEP 2: Manager Approval Gate
                    </span>
                    <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                      Manager Role
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Manager reviews estimated cost, supplier, and inventory deficit.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-lg bg-amber-100 px-3 py-1.5 font-semibold text-amber-800">
                  {pendingApprovals.length} Pending
                </span>
                <span className="rounded-lg bg-emerald-100 px-3 py-1.5 font-semibold text-emerald-800">
                  {approvedPRs.length} Approved
                </span>
                <span className="rounded-lg bg-red-100 px-3 py-1.5 font-semibold text-red-800">
                  {rejectedPRs.length} Rejected
                </span>
              </div>
            </div>
          </div>

          {/* CONNECTOR */}
          <div className="flex justify-center text-slate-400">
            <ArrowDown className="h-5 w-5 text-indigo-400" />
          </div>

          {/* STEP 3 & 4: PURCHASE ORDER & GOODS RECEIPT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-600 text-white shadow-sm">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-900">
                      STEP 3: Purchase Order Placed
                    </span>
                    <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                      Purchase Staff
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Purchase Staff transmits order to supplier. Timeline: Requested &rarr; Approved &rarr; Ordered.
                  </p>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-700 bg-white/80 p-3 rounded-lg border border-amber-100">
                <span className="font-semibold text-amber-900">{activePOs.length} POs</span> currently in transit.
              </div>
            </div>

            <div className="rounded-xl border border-purple-200 bg-purple-50/40 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm">
                  <Boxes className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-purple-900">
                      STEP 4: Goods Received &amp; Stock Auto-Updated
                    </span>
                    <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700">
                      Auto ERP Fulfilment
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Stock increases in database. Any awaiting Sales Order is <strong>automatically fulfilled</strong>!
                  </p>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-700 bg-white/80 p-3 rounded-lg border border-purple-100">
                <span className="font-semibold text-purple-900">{receivedPOs.length} Deliveries</span> received into stock.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            Close Workflow Map
          </button>
        </div>
      </div>
    </div>
  );
};
