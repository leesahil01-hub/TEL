import React from "react";
import { Receipt } from "../types";
import MaasaiLogo from "./MaasaiLogo";
import SpacedQRCode from "./SpacedQRCode";
import { Printer, ArrowLeft } from "lucide-react";

interface ReceiptPrintProps {
  receipt: Receipt;
  onBack: () => void;
}

export default function ReceiptPrint({ receipt, onBack }: ReceiptPrintProps) {
  const handlePrint = () => {
    window.print();
  };

  const appUrl = window.location.origin;
  const verificationUrl = `${appUrl}/verify/${receipt.id}`;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start p-4 pb-12 font-sans select-none print:bg-white print:p-0">
      {/* Control Actions - hidden during print */}
      <div className="w-full max-w-[280px] flex justify-between items-center mb-4 print:hidden">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-white hover:bg-slate-200 px-3 py-2 rounded-lg border border-slate-200 shadow-sm transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>New Entry</span>
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1 text-xs font-bold text-white bg-slate-900 hover:bg-slate-950 px-4 py-2 rounded-lg shadow-md transition-all active:scale-95"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print (POS 58mm)</span>
        </button>
      </div>

      {/* 58mm -> 37.7mm (35% reduced size) Thermal Receipt Wrapper */}
      <div 
        id="thermal-receipt"
        className="w-[37.7mm] bg-white text-black p-2 flex flex-col items-center border border-slate-300 shadow-lg font-mono text-[7.5px] leading-tight print:bg-white print:text-black print:border-none print:shadow-none print:p-2 print:w-full print:m-0"
        style={{ color: "#000000", fontFamily: "'Courier New', 'Lucida Console', Courier, monospace", backgroundColor: "#ffffff" }}
      >
        {/* Centered Logo (Always use Maasai Logo) */}
        <div className="w-full flex justify-center mb-1">
          <MaasaiLogo className="w-11 h-11" />
        </div>

        {/* Receipt Header Text */}
        <div className="w-full uppercase space-y-1 font-mono mb-2 text-center">
          <p className="text-[7.5px] leading-tight tracking-wider font-black text-black">COUNTY GOVERNMENT OF NAROK</p>
          <p className="text-[6.8px] tracking-normal mt-0.5 text-black uppercase font-black">Collection Receipt</p>
        </div>

        {/* Standard Metadata Fields - Spaced & colon aligned exactly as in physical print */}
        <div className="w-full grid grid-cols-[46px_6px_1fr] text-left font-black text-[6.5px] gap-y-0.5 font-mono text-black">
          <span className="font-black">Invoice</span>
          <span className="font-black">:</span>
          <span className="font-black select-text break-all">{receipt.id}</span>

          <span className="font-black">Stream</span>
          <span className="font-black">:</span>
          <span className="font-black">{receipt.stream}</span>

          <span className="font-black">Sub Group</span>
          <span className="font-black">:</span>
          <span className="font-black">{receipt.subGroup}</span>

          <span className="font-black">Narration</span>
          <span className="font-black">:</span>
          <span className="font-black">{receipt.narration || "NAROK TO NAIROBI KCY133Z"}</span>

          <span className="font-black">Served By</span>
          <span className="font-black">:</span>
          <span className="font-black">{receipt.collector}</span>

          <span className="font-black">Date</span>
          <span className="font-black">:</span>
          <span className="font-black">{receipt.timestamp}</span>
        </div>

        {/* Spacer */}
        <div className="h-1.5"></div>

        {/* Pricing Summary Section */}
        <div className="w-full font-black font-mono text-[6.8px] text-black uppercase space-y-1">
          <div className="flex justify-between items-center font-black">
            <span>{receipt.quantity} x Ksh {receipt.pricePerUnit}</span>
            <span>KES {receipt.totalAmount}</span>
          </div>

          <div className="flex justify-between items-center text-[7.2px] font-black tracking-widest pt-0.5">
            <span>TOTAL</span>
            <span>KES {receipt.totalAmount}</span>
          </div>
        </div>

        {/* Spacer */}
        <div className="h-2"></div>

        {/* Centered QR Code */}
        <div className="w-full flex justify-center">
          <SpacedQRCode value={receipt.id} size={48} />
        </div>
      </div>

      {/* Print styles loaded only in app context */}
      <style>{`
        #thermal-receipt, #thermal-receipt * {
          font-family: 'Courier New', 'Lucida Console', Courier, monospace !important;
          font-weight: 900 !important;
        }
        @media print {
          body * {
            visibility: hidden;
          }
          #thermal-receipt, #thermal-receipt * {
            visibility: visible;
            font-family: 'Courier New', 'Lucida Console', Courier, monospace !important;
            font-weight: 900 !important;
          }
          #thermal-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 37.7mm;
            padding: 2mm;
            margin: 0;
            border: none;
            box-shadow: none;
            background-color: #ffffff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          @page {
            size: 37.7mm auto;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
