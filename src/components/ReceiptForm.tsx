import React, { useState, useEffect } from "react";
import { Receipt, STREAM_ITEMS, MARKET_NAMES } from "../types";
import MaasaiLogo from "./MaasaiLogo";
import { Plus, Minus, LogOut, FileText, CheckCircle2 } from "lucide-react";

interface ReceiptFormProps {
  collectorUsername: string;
  onReceiptGenerated: (receipt: Receipt) => void;
  onLogout: () => void;
}

export default function ReceiptForm({
  collectorUsername,
  onReceiptGenerated,
  onLogout,
}: ReceiptFormProps) {
  const [marketName, setMarketName] = useState(MARKET_NAMES[0]);
  const [selectedStreamIndex, setSelectedStreamIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [paymentMode, setPaymentMode] = useState<"Cash" | "M-Pesa">("Cash");
  const [narration, setNarration] = useState("NAROK TO NAIROBI KCY133Z");
  const [servedBy, setServedBy] = useState(collectorUsername);

  useEffect(() => {
    setServedBy(collectorUsername);
  }, [collectorUsername]);

  const selectedStream = STREAM_ITEMS[selectedStreamIndex];
  const activePrice = selectedStream.defaultPrice;
  const totalAmount = activePrice * quantity;

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate unique 17-character hex string like 901bf82863bc8399d
    const characters = "0123456789abcdef";
    let receiptId = "";
    for (let i = 0; i < 17; i++) {
      receiptId += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Format current date and time: YYYY-MM-DD HH:MM:SS
    const now = new Date();
    const pad = (num: number) => String(num).padStart(2, "0");
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate()
    )} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const newReceipt: Receipt = {
      id: receiptId,
      timestamp,
      collector: servedBy.trim() ? servedBy.trim().toUpperCase() : collectorUsername,
      subGroup: "Barter Market Cess", // strictly hardcoded
      stream: selectedStream.name,
      quantity,
      pricePerUnit: activePrice,
      totalAmount,
      paymentMode,
      marketName,
      narration: narration.trim() ? narration.trim().toUpperCase() : undefined,
    };

    onReceiptGenerated(newReceipt);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-800">
      {/* Top Navigation */}
      <div className="w-full bg-slate-900 text-white py-3.5 px-4 sm:px-6 flex items-center justify-between border-b-4 border-yellow-500 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-white rounded-full shadow-sm">
            <MaasaiLogo className="w-12 h-12" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-yellow-500 uppercase tracking-widest leading-none">County Government</span>
            <span className="text-base font-black tracking-widest text-white leading-none">OF NAROK</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="block text-[9px] text-slate-400 font-bold uppercase">Terminal Active</span>
            <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
              Collector: {collectorUsername}
            </span>
          </div>
          <button
            onClick={onLogout}
            className="p-2 bg-slate-800 hover:bg-red-600 hover:text-white rounded-lg text-slate-300 transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Form container */}
      <div className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 space-y-6">
        <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
          {/* Form Header info */}
          <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-yellow-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider">Cess Generation Terminal</h2>
            </div>
            <span className="text-[10px] font-bold text-yellow-400 bg-yellow-500/10 px-2.5 py-1 rounded border border-yellow-500/20 font-mono">
              SUB GROUP: BARTER MARKET FEES
            </span>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-5">
            {/* Market Selection (Editable Cess Point) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Cess Point / Market Hub (Editable)
              </label>
              <input
                type="text"
                value={marketName}
                onChange={(e) => setMarketName(e.target.value)}
                placeholder="e.g. NAROK TOWN, MULOT, KILGORIS, etc."
                className="block w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-bold uppercase"
                style={{ height: "46px" }}
                required
              />
            </div>

            {/* Stream Selector (Revenue stream as item select) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Cess Revenue Stream (Item Select)
              </label>
              <select
                value={selectedStreamIndex}
                onChange={(e) => setSelectedStreamIndex(Number(e.target.value))}
                className="block w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-bold"
                style={{ height: "46px" }} // touch target
              >
                {STREAM_ITEMS.map((item, idx) => (
                  <option key={item.name} value={idx}>
                    {item.name} (Ksh {item.defaultPrice})
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity Counter */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Quantity ({selectedStream.unit}s)
              </label>
              <div className="flex items-center w-full" style={{ height: "46px" }}>
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="h-full px-4 bg-slate-100 border border-r-0 border-slate-200 rounded-l-lg text-slate-600 hover:bg-slate-200 active:bg-slate-300 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="h-full w-full bg-slate-50 border border-slate-200 text-center text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 font-mono"
                />
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="h-full px-4 bg-slate-100 border border-l-0 border-slate-200 rounded-r-lg text-slate-600 hover:bg-slate-200 active:bg-slate-300 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Narration input field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Narration / Route & Vehicle Details
              </label>
              <input
                type="text"
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
                placeholder="e.g. NAROK TO NAIROBI KCY133Z"
                className="block w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-mono uppercase font-semibold"
                style={{ height: "46px" }}
              />
            </div>

            {/* Payment Mode Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Payment Mode
              </label>
              <div className="grid grid-cols-2 gap-2 h-[46px]">
                <button
                  type="button"
                  onClick={() => setPaymentMode("Cash")}
                  className={`flex items-center justify-center gap-1.5 border rounded-lg text-sm font-bold transition-all cursor-pointer ${
                    paymentMode === "Cash"
                      ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span>Cash</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode("M-Pesa")}
                  className={`flex items-center justify-center gap-1.5 border rounded-lg text-sm font-bold transition-all cursor-pointer ${
                    paymentMode === "M-Pesa"
                      ? "border-green-600 bg-green-600 text-white shadow-sm"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span>M-Pesa</span>
                </button>
              </div>
            </div>

            {/* Served By (Editable Collector Name) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Served By (Editable Collector)
              </label>
              <input
                type="text"
                value={servedBy}
                onChange={(e) => setServedBy(e.target.value)}
                placeholder="Collector Name"
                className="block w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 font-bold uppercase"
                style={{ height: "46px" }}
                required
              />
            </div>

            {/* Total Highlight */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-bold text-yellow-800 uppercase tracking-wider leading-none">Cess Total Charge</span>
                <span className="text-xs text-yellow-600 font-bold mt-0.5 block">{quantity} x Ksh {activePrice}</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-slate-900 font-mono">
                  KSH {totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              className="w-full h-12 bg-slate-900 hover:bg-slate-950 text-white hover:text-yellow-400 font-black uppercase tracking-wider rounded-lg text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Generate Cess Receipt</span>
            </button>
          </form>
        </div>
      </div>

      {/* Mini Legal Warning */}
      <div className="w-full py-3 bg-slate-900 border-t border-slate-800 text-center text-[10px] text-slate-400">
        <p>REVENUE DEPT CESS TERMINAL - OFFLINE-READY LOCAL TRANSACTION VAULT</p>
      </div>
    </div>
  );
}
