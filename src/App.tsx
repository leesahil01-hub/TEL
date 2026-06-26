import React, { useState, useEffect } from "react";
import { Receipt, UserSession, STREAM_ITEMS, MARKET_NAMES } from "./types";
import LoginScreen from "./components/LoginScreen";
import ReceiptForm from "./components/ReceiptForm";
import ReceiptPrint from "./components/ReceiptPrint";
import HistoryPanel from "./components/HistoryPanel";

// Seed receipts helper to populate realistic sample data on first load
const INITIAL_SEED_RECEIPTS = (): Receipt[] => {
  const seeds: Receipt[] = [];
  const collectors = ["Tel001", "Nar001", "Mul001"];
  const paymentModes: ("Cash" | "M-Pesa")[] = ["Cash", "M-Pesa"];

  // Base date for today (June 25, 2026)
  const baseDate = "2026-06-25";

  // Generate 8 realistic market receipts for today's collections
  const seedConfigs = [
    { collector: "Tel001", streamIdx: 0, qty: 10, time: "08:12:04", market: MARKET_NAMES[0], narration: "NAROK TO NAIROBI KCY133Z" },
    { collector: "Tel001", streamIdx: 1, qty: 3, time: "09:34:21", market: MARKET_NAMES[0], narration: "NAROK TO NAIROBI KBD 102A" },
    { collector: "Nar001", streamIdx: 3, qty: 5, time: "07:45:12", market: MARKET_NAMES[1], narration: "MULOT TO NAIROBI KDL 998Y" },
    { collector: "Nar001", streamIdx: 4, qty: 8, time: "10:15:44", market: MARKET_NAMES[1], narration: "NAROK CENTRAL LOCAL" },
    { collector: "Mul001", streamIdx: 1, qty: 4, time: "08:50:30", market: MARKET_NAMES[2], narration: "MULOT TO NAKURU KDM 412X" },
    { collector: "Mul001", streamIdx: 5, qty: 12, time: "11:22:15", market: MARKET_NAMES[2], narration: "NAROK TO BOMET KCW 234P" },
    { collector: "Tel001", streamIdx: 7, qty: 2, time: "12:05:40", market: MARKET_NAMES[0], narration: "LOCAL TRANSIT" },
    { collector: "Mul001", streamIdx: 6, qty: 1, time: "12:30:11", market: MARKET_NAMES[2], narration: "NAROK TOWN TRANSIT" },
  ];

  seedConfigs.forEach((config, idx) => {
    const stream = STREAM_ITEMS[config.streamIdx];
    const price = stream.defaultPrice;
    const total = price * config.qty;
    const receiptId = `901bf82863bc8399${idx}`;

    seeds.push({
      id: receiptId,
      timestamp: `${baseDate} ${config.time}`,
      collector: config.collector,
      subGroup: "Barter Market Cess",
      stream: stream.name,
      quantity: config.qty,
      pricePerUnit: price,
      totalAmount: total,
      paymentMode: paymentModes[idx % 2],
      narration: config.narration,
      marketName: config.market,
    });
  });

  return seeds;
};

export default function App() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [activeReceipt, setActiveReceipt] = useState<Receipt | null>(null);
  const [lastView, setLastView] = useState<"form" | "history">("form");

  // Load receipts from LocalStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("narok_cess_receipts");
    if (stored) {
      try {
        setReceipts(JSON.parse(stored));
      } catch (e) {
        // Fallback to seeds if corrupt
        const seeds = INITIAL_SEED_RECEIPTS();
        setReceipts(seeds);
        localStorage.setItem("narok_cess_receipts", JSON.stringify(seeds));
      }
    } else {
      // Seed with beautiful initial barter market receipts
      const seeds = INITIAL_SEED_RECEIPTS();
      setReceipts(seeds);
      localStorage.setItem("narok_cess_receipts", JSON.stringify(seeds));
    }
  }, []);

  // Save receipts to LocalStorage when changed
  const saveReceipts = (updatedList: Receipt[]) => {
    setReceipts(updatedList);
    localStorage.setItem("narok_cess_receipts", JSON.stringify(updatedList));
  };

  // Login handler
  const handleLogin = (userSession: UserSession) => {
    setSession(userSession);
    setLastView(userSession.role === "admin" ? "history" : "form");
  };

  // Logout handler
  const handleLogout = () => {
    setSession(null);
    setActiveReceipt(null);
  };

  // Receipt generation handler
  const handleReceiptGenerated = (newReceipt: Receipt) => {
    const updated = [newReceipt, ...receipts];
    saveReceipts(updated);
    setActiveReceipt(newReceipt);
    setLastView("form");
  };

  // Viewing individual receipts from history panel
  const handleViewReceiptFromHistory = (receipt: Receipt) => {
    setActiveReceipt(receipt);
    setLastView("history");
  };

  // Clearing history (convenient for reset)
  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear the receipt ledger history?")) {
      saveReceipts([]);
    }
  };

  // Route/View selector
  if (!session) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (activeReceipt) {
    return (
      <ReceiptPrint
        receipt={activeReceipt}
        onBack={() => {
          setActiveReceipt(null);
        }}
      />
    );
  }

  if (session.role === "admin") {
    return (
      <HistoryPanel
        receipts={receipts}
        onLogout={handleLogout}
        onViewReceipt={handleViewReceiptFromHistory}
        onClearHistory={handleClearHistory}
      />
    );
  }

  // Collector screen
  return (
    <ReceiptForm
      collectorUsername={session.username}
      onReceiptGenerated={handleReceiptGenerated}
      onLogout={handleLogout}
    />
  );
}
