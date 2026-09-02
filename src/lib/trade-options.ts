import { formatRRValue } from "@/lib/rr";
import type { Bias, Killzone, Position, TradeDraft, TradeStatus } from "@/types/trade";

export const BIAS_OPTIONS: Bias[] = ["Bullish", "Bearish"];
export const POSITION_OPTIONS: Position[] = ["Long", "Short"];
export const STATUS_OPTIONS: TradeStatus[] = ["Win", "Lose", "Running", "Close", "SL+", "BE"];
export const KILLZONE_OPTIONS: Killzone[] = [
  "Asian",
  "London Open",
  "NY AM",
  "NY PM",
  "London Close",
  "Silver Bullet",
];
export const ENTRY_MODEL_OPTIONS = [
  "MSS",
  "FVG Rejection",
  "Order Block",
  "Breaker",
  "Turtle Soup",
  "Liquidity Sweep",
];
export const DOL_SUGGESTIONS = [
  "Daily High",
  "Daily Low",
  "Previous Session High",
  "Previous Session Low",
  "Weekly High",
  "Equal Lows",
];

/** Tone classes are intentionally explicit per the trading-journal colour spec. */
export const BIAS_TONE: Record<Bias, string> = {
  Bullish: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Bearish: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

export const POSITION_TONE: Record<Position, string> = {
  Long: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Short: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

export const STATUS_TONE: Record<TradeStatus, string> = {
  Win: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Lose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  Running: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Close: "bg-pink-500/10 text-pink-300 border-pink-500/20",
  "SL+": "bg-sky-500/10 text-sky-300 border-sky-500/20",
  BE: "bg-gray-500/10 text-gray-300 border-gray-500/20",
};

export function formatRR(rr: number | null): string {
  return formatRRValue(rr);
}

export function formatTradeDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function localDateTimeValue(d = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function emptyTradeDraft(): TradeDraft {
  return {
    date: localDateTimeValue(),
    pair: "",
    bias: "Bullish",
    dol: "",
    entryModel: "MSS",
    killzone: "London Open",
    position: "Long",
    status: "Running",
    rr: null,
    pnl: 0,
    currency: "USD",
    screenshot: null,
    notes: "",
  };
}
