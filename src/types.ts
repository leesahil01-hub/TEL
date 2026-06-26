export interface Receipt {
  id: string;
  timestamp: string;
  collector: string;
  subGroup: string;
  stream: string;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  paymentMode: "Cash" | "M-Pesa";
  customerName?: string;
  marketName: string;
  narration?: string;
}

export interface UserSession {
  username: string;
  role: "collector" | "admin";
}

export interface StreamItem {
  name: string;
  defaultPrice: number;
  unit: string;
}

export const STREAM_ITEMS: StreamItem[] = [
  { name: "Potatoes", defaultPrice: 50, unit: "Bag" },
  { name: "Sheep / Goat (Small Stock)", defaultPrice: 50, unit: "Head" },
  { name: "Cow / Bull (Large Stock)", defaultPrice: 150, unit: "Head" },
  { name: "Donkey / Camel", defaultPrice: 100, unit: "Head" },
  { name: "Cereals / Maize Bag", defaultPrice: 40, unit: "Bag" },
  { name: "Vegetables Crate", defaultPrice: 30, unit: "Crate" },
  { name: "Charcoal Sack", defaultPrice: 50, unit: "Sack" },
  { name: "General Goods Stall", defaultPrice: 50, unit: "Stall" },
  { name: "Handcart (Mkokoteni)", defaultPrice: 80, unit: "Cart" },
];

export const MARKET_NAMES = [
  "Narok Central Barter Market",
  "Mulot Barter Market",
  "Enabelbel Barter Market",
  "Kilgoris Barter Market",
  "Lolgorian Barter Market",
];
