import type { Currency, Trade } from "@/types/trade";

export interface DayCell {
  /** yyyy-mm-dd */
  key: string;
  date: Date;
  inMonth: boolean;
  trades: number;
  pnl: number;
  rr: number; // net RR for the day
}

export interface WeekRow {
  key: string;
  days: DayCell[];
  trades: number;
  pnl: number;
  label: string;
  rr: number; // net RR for the week
}

export const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Build a Monday-start month grid with per-day and per-week P/L totals. */
export function buildMonthGrid(
  trades: Trade[],
  year: number,
  month: number,
  currency: Currency,
): { weeks: WeekRow[]; monthPnl: number; monthTrades: number; monthRr: number } {
  const byDay = new Map<string, { trades: number; pnl: number }>();
  const byDayRr = new Map<string, { rr: number }>();
  for (const t of trades) {
    if ((t.currency ?? "USD") !== currency) continue;
    const d = new Date(t.date);
    if (Number.isNaN(d.getTime())) continue;
    const key = dayKey(d);
    const cur = byDay.get(key) ?? { trades: 0, pnl: 0 };
    cur.trades += 1;
    cur.pnl += Number(t.pnl) || 0;
    byDay.set(key, cur);
    const rrCur = byDayRr.get(key) ?? { rr: 0 };
    if (t.status === "Win" && t.rr !== null) rrCur.rr += Number(t.rr);
    else if (t.status === "Lose") rrCur.rr -= 1;
    byDayRr.set(key, rrCur);
  }

  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7; // Monday start
  const start = new Date(year, month, 1 - offset);
  const last = new Date(year, month + 1, 0);
  const totalCells = Math.ceil((offset + last.getDate()) / 7) * 7;

  const weeks: WeekRow[] = [];
  let monthPnl = 0;
  let monthTrades = 0;
  let monthRr = 0;

  for (let w = 0; w < totalCells / 7; w++) {
    const days: DayCell[] = [];
    let pnl = 0;
    let count = 0;
    let weekRr = 0;
    for (let i = 0; i < 7; i++) {
      const date = new Date(start.getTime());
      date.setDate(start.getDate() + w * 7 + i);
      const key = dayKey(date);
      const stat = byDay.get(key) ?? { trades: 0, pnl: 0 };
      const rrStat = byDayRr.get(key) ?? { rr: 0 };
      const inMonth = date.getMonth() === month;
      days.push({ key, date, inMonth, trades: stat.trades, pnl: stat.pnl, rr: Math.round((rrStat.rr ?? 0) * 100) / 100 });
      if (inMonth) {
        pnl += stat.pnl;
        count += stat.trades;
        weekRr += rrStat.rr ?? 0;
      }
    }
    weeks.push({
      key: `w${w}`,
      days,
      pnl: Math.round(pnl * 100) / 100,
      trades: count,
      rr: Math.round(weekRr * 100) / 100,
      label: `Week ${w + 1}`,
    });
    monthPnl += pnl;
    monthTrades += count;
    monthRr += weekRr;
  }

  return { weeks, monthPnl: Math.round(monthPnl * 100) / 100, monthTrades, monthRr: Math.round(monthRr * 100) / 100 };
}

export const WEEKDAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export function monthLabel(year: number, month: number) {
  return new Date(year, month, 1).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
}
