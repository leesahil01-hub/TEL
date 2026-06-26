import React, { useState } from "react";
import { Receipt } from "../types";
import MaasaiLogo from "./MaasaiLogo";
import { LogOut, Search, Filter, RefreshCw, Eye, Printer, Calendar, DollarSign, Users, Award } from "lucide-react";

interface HistoryPanelProps {
  receipts: Receipt[];
  onLogout: () => void;
  onViewReceipt: (receipt: Receipt) => void;
  onClearHistory?: () => void;
}

export default function HistoryPanel({
  receipts,
  onLogout,
  onViewReceipt,
  onClearHistory,
}: HistoryPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCollector, setFilterCollector] = useState("all");
  const [filterMarket, setFilterMarket] = useState("all");

  // Get current active date in YYYY-MM-DD format (metadata indicates 2026-06-25)
  const todayStr = "2026-06-25";

  // Filter receipts based on search and drop-downs
  const filteredReceipts = receipts.filter((r) => {
    const matchesSearch = r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.narration && r.narration.toLowerCase().includes(searchTerm.toLowerCase())) ||
      r.stream.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCollector = filterCollector === "all" || r.collector.toLowerCase() === filterCollector.toLowerCase();
    const matchesMarket = filterMarket === "all" || r.marketName.toLowerCase() === filterMarket.toLowerCase();

    return matchesSearch && matchesCollector && matchesMarket;
  });

  // Unique lists for filters
  const uniqueCollectors = Array.from(new Set(receipts.map((r) => r.collector)));
  const uniqueMarkets = Array.from(new Set(receipts.map((r) => r.marketName)));

  // Calculate Daily Totals of Collectors (grouped by collector name)
  // Filtering for receipts that contain the current day or we can calculate for all registered days
  const collectorDailyTotals = uniqueCollectors.map((collectorName) => {
    // Filter receipts for this collector on 'today' (containing 2026-06-25)
    const collectorReceiptsToday = receipts.filter(
      (r) => r.collector.toLowerCase() === collectorName.toLowerCase() && r.timestamp.startsWith(todayStr)
    );

    const totalInvoices = collectorReceiptsToday.length;
    const totalCash = collectorReceiptsToday
      .filter((r) => r.paymentMode === "Cash")
      .reduce((sum, r) => sum + r.totalAmount, 0);
    const totalMPesa = collectorReceiptsToday
      .filter((r) => r.paymentMode === "M-Pesa")
      .reduce((sum, r) => sum + r.totalAmount, 0);
    const totalAmount = collectorReceiptsToday.reduce((sum, r) => sum + r.totalAmount, 0);

    return {
      collectorName,
      totalInvoices,
      totalCash,
      totalMPesa,
      totalAmount,
    };
  }).filter((t) => t.totalInvoices > 0 || receipts.some((r) => r.collector === t.collectorName)); // keep all defined collectors visible

  // Grand totals for today
  const grandTotalReceiptsToday = receipts.filter((r) => r.timestamp.startsWith(todayStr)).length;
  const grandTotalAmountToday = receipts
    .filter((r) => r.timestamp.startsWith(todayStr))
    .reduce((sum, r) => sum + r.totalAmount, 0);

  // Overall database totals (all days)
  const overallTotalCount = receipts.length;
  const overallTotalAmount = receipts.reduce((sum, r) => sum + r.totalAmount, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between font-sans">
      {/* Top Admin Navigation Header */}
      <div className="w-full bg-slate-900 text-white py-4 px-6 flex items-center justify-between border-b-4 border-yellow-500 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-white rounded-full shadow-sm">
            <MaasaiLogo className="w-13 h-13" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-yellow-500 uppercase tracking-widest leading-none">Admin Control Desk</span>
            <span className="text-lg font-black tracking-widest text-white leading-none">OF NAROK - REVENUE SYSTEM</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-block text-xs font-mono font-bold text-slate-400">
            SECURE AUDIT VIEW
          </span>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-xs transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Close Console</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Statistics Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl shadow border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg text-yellow-600">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-500 uppercase">Today's Collections ({todayStr})</span>
              <span className="text-xl font-black text-slate-900 font-mono">
                KSH {grandTotalAmountToday.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-500 uppercase">Today's Total Receipts</span>
              <span className="text-xl font-black text-slate-900 font-mono">
                {grandTotalReceiptsToday} Receipts
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg text-green-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-500 uppercase">Lifetime Receipts Count</span>
              <span className="text-xl font-black text-slate-900 font-mono">
                {overallTotalCount} (Ksh {overallTotalAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
              </span>
            </div>
          </div>
        </div>

        {/* Filters and Search Log */}
        <div className="bg-white rounded-xl shadow border border-slate-100 p-4 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-slate-500" />
              <span>Real-time Invoices Ledger</span>
            </h3>

            {onClearHistory && receipts.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-[10px] font-bold text-red-600 hover:bg-red-50 border border-red-200 px-2.5 py-1 rounded transition-all cursor-pointer"
              >
                Clear Mock History
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Search Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search Receipt ID, item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            {/* Filter by Collector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase shrink-0">Collector:</span>
              <select
                value={filterCollector}
                onChange={(e) => setFilterCollector(e.target.value)}
                className="block w-full py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none"
              >
                <option value="all">All Collectors</option>
                <option value="Tel001">Tel001</option>
                <option value="Nar001">Nar001</option>
                <option value="Mul001">Mul001</option>
              </select>
            </div>

            {/* Filter by Market */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase shrink-0">Market:</span>
              <select
                value={filterMarket}
                onChange={(e) => setFilterMarket(e.target.value)}
                className="block w-full py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none"
              >
                <option value="all">All Markets</option>
                {uniqueMarkets.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* History Table - Bold columns to be visible */}
        <div className="bg-white rounded-xl shadow border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-[10px] uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3.5 px-4">Receipt ID</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Market Location</th>
                  {/* Distinct Column that shows username credentials that generated invoice as requested */}
                  <th className="py-3.5 px-4 text-yellow-400 font-extrabold">Authorized Creator ID</th>
                  <th className="py-3.5 px-4">Subgroup / Stream</th>
                  <th className="py-3.5 px-4 text-center">Qty</th>
                  <th className="py-3.5 px-4 text-right">Price</th>
                  <th className="py-3.5 px-4 text-right text-yellow-400">Total Amount</th>
                  <th className="py-3.5 px-4 text-center">Pay Mode</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-extrabold text-slate-900">
                {filteredReceipts.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-400 text-xs font-medium">
                      No invoices found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredReceipts.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] font-black">{r.id}</td>
                      <td className="py-3 px-4 font-mono text-slate-600 text-[10.5px]">{r.timestamp}</td>
                      <td className="py-3 px-4 truncate max-w-[130px]">{r.marketName}</td>
                      {/* Authorized Creator Column */}
                      <td className="py-3 px-4 text-slate-900 font-black">
                        <span className="bg-slate-100 px-2.5 py-1 rounded text-[11px] font-mono border border-slate-200">
                          {r.collector}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="block text-[9px] text-slate-400 uppercase leading-none">{r.subGroup}</span>
                        <span className="text-[11px] font-bold text-slate-700">{r.stream}</span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono">{r.quantity}</td>
                      <td className="py-3 px-4 text-right font-mono">Ksh {r.pricePerUnit.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-950 font-black text-[12px]">
                        Ksh {r.totalAmount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                            r.paymentMode === "Cash"
                              ? "bg-slate-100 text-slate-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {r.paymentMode}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center items-center gap-1.5">
                          <button
                            onClick={() => onViewReceipt(r)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-900 hover:text-white rounded text-slate-600 transition-all cursor-pointer"
                            title="View/Print Thermal Invoice"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Daily Totals of Collectors section - Bold all to be visible as requested */}
        <div className="bg-white rounded-xl shadow border border-slate-100 p-5 space-y-4">
          <div className="border-l-4 border-yellow-500 pl-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-950 flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-500" />
              <span>Collector Daily Operations Summary ({todayStr})</span>
            </h3>
            <p className="text-[11px] text-slate-500 font-bold uppercase mt-0.5">
              Strictly Audited Terminal Ledger Aggregates
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-2">
            {collectorDailyTotals.map((tot) => (
              <div
                key={tot.collectorName}
                className="bg-slate-900 text-white rounded-xl p-4 border-2 border-slate-800 flex flex-col justify-between font-bold"
              >
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-xs text-yellow-500 font-black tracking-widest font-mono">
                    COLLECTOR: {tot.collectorName}
                  </span>
                  <span className="text-[10px] bg-slate-800 text-white px-2 py-0.5 rounded font-mono">
                    {tot.totalInvoices} Invoices
                  </span>
                </div>
                
                <div className="py-3.5 space-y-2 text-xs font-extrabold uppercase">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cash Collections:</span>
                    <span className="font-mono text-white">Ksh {tot.totalCash.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">M-Pesa Collections:</span>
                    <span className="font-mono text-green-400">Ksh {tot.totalMPesa.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-[10px] text-yellow-500 uppercase font-black">Daily Total:</span>
                  <span className="text-sm font-mono font-black text-white">
                    Ksh {tot.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}

            {/* Daily Grand Total Aggregator Box */}
            <div className="bg-gradient-to-br from-yellow-500 to-amber-600 text-slate-950 rounded-xl p-4 flex flex-col justify-between font-black border border-yellow-400">
              <div className="flex justify-between items-center pb-2 border-b border-yellow-600/35">
                <span className="text-xs uppercase tracking-wider">AGGREGATE TOTAL</span>
                <span className="text-[10px] bg-slate-950 text-yellow-400 px-2 py-0.5 rounded font-mono">
                  {grandTotalReceiptsToday} Invoices
                </span>
              </div>

              <div className="py-4 text-center">
                <span className="block text-[9px] uppercase tracking-wider text-slate-800 font-bold">
                  CONSOLIDATED DAILY TAX CESS
                </span>
                <span className="text-xl font-mono block mt-1 tracking-tight">
                  KSH {grandTotalAmountToday.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="text-[8px] text-slate-800 text-center font-bold uppercase tracking-wide">
                County Government of Narok Revenue
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Footer */}
      <div className="w-full py-3 bg-slate-900 border-t border-slate-800 text-center text-[10px] text-slate-500 font-bold">
        <p>© 2026 COUNTY GOVERNMENT OF NAROK • REVENUE SERVICE ASSURANCE LEDGER</p>
      </div>
    </div>
  );
}
