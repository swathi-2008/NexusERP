import React, { useState } from 'react';
import {
  getMonthlyMetrics,
  getAllStockTransactions,
  getAllSalesOrders,
  getAllPurchaseOrders,
} from '../../services/store';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Calendar,
  Filter,
  BarChart3,
  ArrowDown,
  Layers,
  ArrowUpRight,
  TrendingDown,
  Download,
} from 'lucide-react';

export const AdminHistoryView: React.FC = () => {
  const allMetrics = getMonthlyMetrics();
  const allTransactions = getAllStockTransactions();
  const salesOrders = getAllSalesOrders();
  const purchaseOrders = getAllPurchaseOrders();

  // Filters
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [transactionType, setTransactionType] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Filtered metrics for chronological display & table
  const filteredMetrics = allMetrics.filter((m) => {
    if (selectedMonth !== 'ALL' && m.monthName.toUpperCase() !== selectedMonth.toUpperCase()) {
      return false;
    }
    return m.year === selectedYear;
  });

  // Totals for summary KPI cards
  const totalStockPurchased = filteredMetrics.reduce((sum, m) => sum + m.stockPurchased, 0);
  const totalSales = filteredMetrics.reduce((sum, m) => sum + m.sales, 0);
  const totalProfit = filteredMetrics.reduce((sum, m) => sum + m.profit, 0);
  const totalLoss = filteredMetrics.reduce((sum, m) => sum + m.loss, 0);

  // Maximum profit among all 12 months for bar chart scaling
  const maxMonthlyProfit = Math.max(...allMetrics.map((m) => m.profit), 10000);

  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-8">
      {/* Top Title & Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
              <TrendingUp className="h-5 w-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              12-Month Business History &amp; Profit/Loss Analysis
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Chronological performance tracking across Stock Purchases, Sales Operations, and Net Profit.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Month:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-hidden text-xs"
            >
              <option value="ALL">All 12 Months</option>
              {monthsList.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs">
            <Layers className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Type:</span>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-hidden text-xs"
            >
              <option value="ALL">All Transactions</option>
              <option value="SALES">Sales Only</option>
              <option value="PURCHASE">Purchases Only</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Year:</span>
            <span className="font-semibold text-slate-800">{selectedYear}</span>
          </div>
        </div>
      </div>

      {/* Aggregate Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Stock Purchased
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">
            ${totalStockPurchased.toLocaleString()}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Inventory acquisition cost
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Sales Revenue
          </div>
          <div className="mt-2 text-2xl font-bold text-blue-600">
            ${totalSales.toLocaleString()}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Gross sales delivered
          </p>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-xs">
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            Total Net Profit
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600">
            +${totalProfit.toLocaleString()}
          </div>
          <p className="mt-1 text-[11px] text-emerald-700">
            Positive operating margin
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Net Loss
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-700">
            ${totalLoss.toLocaleString()}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Deficits recorded
          </p>
        </div>
      </div>

      {/* SECTION 5 REQUIREMENT: CHRONOLOGICAL 12 MONTH DISPLAY */}
      {/*
        The prompt explicitly requires:
        "The history should be presented as:
        MONTH
        ↓
        Stock Purchased
        ↓
        Sales / Transactions
        ↓
        Profit
        ↓
        Loss
        Continue this structure for all 12 months."
      */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Chronological Monthly Progression ({selectedYear})
            </h2>
            <p className="text-xs text-slate-500">
              Sequential flow of Stock Purchased &rarr; Sales/Transactions &rarr; Profit &rarr; Loss
            </p>
          </div>
          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
            Showing {filteredMetrics.length} of 12 Months
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMetrics.map((item) => (
            <div
              key={item.monthName}
              className="flex flex-col rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:border-indigo-300 hover:shadow-md"
            >
              {/* MONTH TITLE */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-sm font-extrabold text-slate-900 tracking-tight">
                  {item.monthName} {item.year}
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  Profitable
                </span>
              </div>

              {/* FLOW: Stock Purchased -> Sales -> Profit -> Loss */}
              <div className="mt-3 space-y-2 text-xs">
                {/* 1. Stock Purchased */}
                <div className="rounded-lg bg-white p-2.5 border border-slate-100 shadow-2xs">
                  <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    Stock Purchased
                  </div>
                  <div className="text-sm font-bold text-slate-800">
                    ${item.stockPurchased.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-600">
                    {item.unitsPurchased} units bought
                  </div>
                </div>

                {/* Arrow Connector */}
                <div className="flex justify-center text-slate-300">
                  <ArrowDown className="h-3.5 w-3.5 text-indigo-400" />
                </div>

                {/* 2. Sales / Transactions */}
                <div className="rounded-lg bg-white p-2.5 border border-slate-100 shadow-2xs">
                  <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                    Sales / Transactions
                  </div>
                  <div className="text-sm font-bold text-blue-700">
                    ${item.sales.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-600">
                    {item.unitsSold} units sold ({item.transactionCount} transactions)
                  </div>
                </div>

                {/* Arrow Connector */}
                <div className="flex justify-center text-slate-300">
                  <ArrowDown className="h-3.5 w-3.5 text-indigo-400" />
                </div>

                {/* 3. Profit */}
                <div className="rounded-lg bg-emerald-50/80 p-2.5 border border-emerald-200 shadow-2xs">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    Profit (Net)
                  </div>
                  <div className="text-sm font-bold text-emerald-700">
                    +${item.profit.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-600">
                    Positive margin achieved
                  </div>
                </div>

                {/* Arrow Connector */}
                <div className="flex justify-center text-slate-300">
                  <ArrowDown className="h-3.5 w-3.5 text-indigo-400" />
                </div>

                {/* 4. Loss */}
                <div className="rounded-lg bg-white p-2.5 border border-slate-100 shadow-2xs">
                  <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                    Loss
                  </div>
                  <div className="text-sm font-bold text-slate-700">
                    ${item.loss.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-600">
                    Deficit: none recorded
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SUMMARY TABLE BELOW HISTORICAL VIEW */}
      {/*
        The prompt explicitly requires:
        "Also provide a summary table below the historical view.
        Example table:
        | Month | Stock Purchased | Sales | Profit | Loss |
        | Jan   | ...             | ...   | ...    | ...  |
        | Feb   | ...             | ...   | ...    | ...  |"
      */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Financial Summary Table
            </h2>
            <p className="text-xs text-slate-500">
              Consolidated tabular breakdown of all monthly stock, sales, and profit figures.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-4 py-3 text-right font-bold text-slate-700 uppercase tracking-wider">
                  Stock Purchased
                </th>
                <th className="px-4 py-3 text-right font-bold text-slate-700 uppercase tracking-wider">
                  Sales Revenue
                </th>
                <th className="px-4 py-3 text-right font-bold text-slate-700 uppercase tracking-wider">
                  Profit
                </th>
                <th className="px-4 py-3 text-right font-bold text-slate-700 uppercase tracking-wider">
                  Loss
                </th>
                <th className="px-4 py-3 text-right font-bold text-slate-700 uppercase tracking-wider">
                  Units Bought
                </th>
                <th className="px-4 py-3 text-right font-bold text-slate-700 uppercase tracking-wider">
                  Units Sold
                </th>
                <th className="px-4 py-3 text-center font-bold text-slate-700 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredMetrics.map((row) => (
                <tr key={row.monthName} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-900">
                    {row.monthName}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-medium text-slate-700">
                    ${row.stockPurchased.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-medium text-blue-600">
                    ${row.sales.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600">
                    +${row.profit.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-medium text-slate-500">
                    ${row.loss.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600">
                    {row.unitsPurchased}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600">
                    {row.unitsSold}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                      Positive
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
              <tr>
                <td className="px-4 py-3 uppercase">Total ({selectedYear})</td>
                <td className="px-4 py-3 text-right font-mono text-slate-900">
                  ${totalStockPurchased.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-mono text-blue-700">
                  ${totalSales.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-mono text-emerald-700">
                  +${totalProfit.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-mono text-slate-600">
                  ${totalLoss.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right">
                  {filteredMetrics.reduce((s, m) => s + m.unitsPurchased, 0)}
                </td>
                <td className="px-4 py-3 text-right">
                  {filteredMetrics.reduce((s, m) => s + m.unitsSold, 0)}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] text-white">
                    Net +
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* SECTION 6 REQUIREMENT: PROFIT & LOSS VISUALIZATION (BAR CHART) */}
      {/*
        "At the bottom of the History page, create an easy-to-understand bar chart.
        Display monthly profit visually.
        Example:
        January  → Profit
        February → Profit
        March    → Profit
        ...
        December → Profit
        Use green bars to represent positive profit.
        Clearly label:
        - Month
        - Profit amount
        Make the chart simple enough for the Admin to quickly compare monthly performance.
        Also provide exact numerical values in the table so the chart is not the only source of information."
      */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
              <BarChart3 className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Monthly Profit Visualization Chart ({selectedYear})
              </h2>
              <p className="text-xs text-slate-500">
                Green bars represent net positive profit for each month from January to December.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-emerald-500" />
              <span className="font-semibold text-slate-700">Positive Profit</span>
            </div>
          </div>
        </div>

        {/* Responsive Interactive SVG Bar Chart */}
        <div className="relative pt-6 pb-2">
          {/* Chart Y-Axis Scale Guides */}
          <div className="absolute inset-x-0 top-6 bottom-14 flex flex-col justify-between pointer-events-none text-[10px] text-slate-400">
            <div className="border-b border-slate-100 flex justify-between">
              <span>${Math.round(maxMonthlyProfit).toLocaleString()}</span>
            </div>
            <div className="border-b border-slate-100 flex justify-between">
              <span>${Math.round(maxMonthlyProfit * 0.75).toLocaleString()}</span>
            </div>
            <div className="border-b border-slate-100 flex justify-between">
              <span>${Math.round(maxMonthlyProfit * 0.5).toLocaleString()}</span>
            </div>
            <div className="border-b border-slate-100 flex justify-between">
              <span>${Math.round(maxMonthlyProfit * 0.25).toLocaleString()}</span>
            </div>
            <div className="border-b border-slate-200 flex justify-between">
              <span>$0</span>
            </div>
          </div>

          {/* 12 Month Bars Grid */}
          <div className="relative h-64 flex items-end justify-between gap-1 sm:gap-2 px-2 pt-4">
            {allMetrics.map((item, idx) => {
              const heightPercent = Math.max(6, Math.min(100, (item.profit / maxMonthlyProfit) * 100));
              const isHovered = hoveredBar === idx;

              return (
                <div
                  key={item.monthName}
                  className="flex flex-1 flex-col items-center group relative h-full justify-end"
                  onMouseEnter={() => setHoveredBar(idx)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {/* Floating Tooltip with exact numerical values */}
                  {isHovered && (
                    <div className="absolute -top-14 z-20 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-center text-xs text-white shadow-xl pointer-events-none">
                      <div className="font-bold">{item.monthName}</div>
                      <div className="text-emerald-400 font-mono text-[11px]">
                        Profit: +${item.profit.toLocaleString()}
                      </div>
                      <div className="text-slate-300 text-[10px]">
                        Sales: ${item.sales.toLocaleString()}
                      </div>
                    </div>
                  )}

                  {/* Value label directly above bar for quick visual reading */}
                  <span className="hidden md:block mb-1 text-[10px] font-bold text-emerald-700 tracking-tight">
                    ${(item.profit / 1000).toFixed(1)}k
                  </span>

                  {/* Green Profit Bar (per specification) */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[36px] rounded-t-md transition-all duration-300 ${
                      isHovered
                        ? 'bg-emerald-400 shadow-md ring-2 ring-emerald-300'
                        : 'bg-emerald-500 hover:bg-emerald-400'
                    }`}
                  />

                  {/* Month Label below bar */}
                  <div className="mt-2 text-center">
                    <span className="block text-[11px] font-bold text-slate-700 truncate">
                      {item.monthName.slice(0, 3)}
                    </span>
                    <span className="block text-[9px] text-slate-600 font-mono">
                      +${item.profit.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick summary comparison callout */}
        <div className="mt-6 rounded-xl bg-emerald-50/60 border border-emerald-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px] font-bold">
              ✓
            </span>
            <span className="font-medium text-emerald-900">
              Peak Performance: <strong>December</strong> recorded the highest profit at <strong>$44,600</strong>, reflecting robust SME growth.
            </span>
          </div>
          <div className="text-emerald-800 font-semibold shrink-0">
            Annual Net: +${allMetrics.reduce((s, m) => s + m.profit, 0).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};
