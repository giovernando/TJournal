import { BottomNav } from "@/components/trades/BottomNav";
import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/kit/Card";
import { Select } from "@/components/kit/Input";
import { useTrades } from "@/hooks/useTrades";
import { WEEKDAY_LABELS, buildMonthGrid, monthLabel, dayKey } from "@/lib/calendar";
import { RRValue } from "@/components/trades/RRValue";
import { Modal } from "@/components/kit/Modal";
import { Button } from "@/components/kit/Button";
import { CURRENCY_OPTIONS, formatMoney } from "@/lib/money";
import type { Currency } from "@/types/trade";

function toneOf(pnl: number, trades: number) {
  if (trades === 0) return "border-border/40 bg-card/25 text-muted-foreground";
  if (pnl > 0) return "border-emerald-500/25 bg-emerald-500/10 text-emerald-400";
  if (pnl < 0) return "border-rose-500/25 bg-rose-500/10 text-rose-400";
  return "border-border/50 bg-card/40 text-muted-foreground";
}

export function CalendarPage() {
  const { trades, hydrated, error } = useTrades();
  const today = new Date();
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [currency, setCurrency] = useState<Currency>("USD");

  const { weeks, monthPnl, monthTrades, monthRr } = useMemo(
    () => buildMonthGrid(trades, cursor.year, cursor.month, currency),
    [trades, cursor, currency],
  );

  const shift = (delta: number) => {
    const d = new Date(cursor.year, cursor.month + delta, 1);
    setCursor({ year: d.getFullYear(), month: d.getMonth() });
  };
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const [selectedDate, setSelectedDate] = useState(null as string | null);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 -top-40 h-96 bg-[radial-gradient(60%_60%_at_50%_0%,var(--glow),transparent)]" />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-6 pb-24 sm:px-6 sm:py-10 sm:pb-24">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Kalender Performa
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              Profit harian & mingguan
            </h1>
    const [selectedDate, setSelectedDate] = useState(null as string | null);
            <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
              Setiap tanggal menampilkan total profit/loss dan jumlah trade hari itu, dengan
              rekap mingguan di kolom paling kanan.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/"
              className="rounded-xl border border-border/60 bg-card/50 px-3.5 py-2 text-xs font-semibold backdrop-blur-sm transition-colors hover:bg-card"
            >
              ← Journal
            </Link>
            <Link
              to="/reports"
              className="rounded-xl border border-border/60 bg-card/50 px-3.5 py-2 text-xs font-semibold backdrop-blur-sm transition-colors hover:bg-card"
            >
              Laporan
            </Link>
          </div>
        </header>

        <Card className="mt-6 min-w-0">
          <CardHeader
            title={`Monthly P/L: ${formatMoney(monthPnl, currency)}`}
            description={
              <>
                {monthTrades} trade • Total RR: <RRValue rr={monthRr ?? null} />
              </>
            }
            action={
              <div className="flex items-center gap-2">
                <div className="w-28">
                  <Select
                    aria-label="Mata uang"
                    options={CURRENCY_OPTIONS}
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                  />
                </div>
                <div className="flex items-center gap-1 rounded-xl border border-border/60 bg-card/40 p-0.5">
                  <button
                    type="button"
                    aria-label="Bulan sebelumnya"
                    onClick={() => shift(-1)}
                    className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    ‹
                  </button>
                  <span className="min-w-[110px] px-1 text-center text-xs font-semibold">
                    {monthLabel(cursor.year, cursor.month)}
                  </span>
                  <button
                    type="button"
                    aria-label="Bulan berikutnya"
                    onClick={() => shift(1)}
                    className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    ›
                  </button>
                </div>
              </div>
            }
          />
          <CardBody className="min-w-0">
            {error ? (
              <p className="mb-4 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </p>
            ) : null}
            {!hydrated ? (
              <p className="py-12 text-center text-sm text-muted-foreground">Memuat data…</p>
            ) : (
              <div className="-mx-4 w-full max-w-full overflow-x-auto px-4 [-webkit-overflow-scrolling:touch] sm:-mx-6 sm:px-6">
                <div className="min-w-[720px]">
                  <div className="grid grid-cols-8 gap-1.5 pb-1.5">
                    {WEEKDAY_LABELS.map((d) => (
                      <p
                        key={d}
                        className="text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
                      >
                        {d}
                      </p>
                    ))}
                    <p className="text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Week
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    {weeks.map((week) => (
                      <div key={week.key} className="grid grid-cols-8 gap-1.5">
                        {week.days.map((day) => (
                          <div
                            key={day.key}
                            onClick={() => setSelectedDate(day.key)}
                            role="button"
                            tabIndex={0}
                            className={`rounded-xl border px-2 py-2 text-center backdrop-blur-sm transition-colors cursor-pointer ${toneOf(
                              day.pnl,
                              day.trades,
                            )} ${day.inMonth ? "" : "opacity-35"}`}
                          >
                            <p className="text-[11px] font-semibold text-foreground/70">
                              {day.date.getDate()}
                            </p>
                            {day.trades > 0 ? (
                              <>
                                <p className="mt-1 text-xs font-bold tabular-nums">
                                  {formatMoney(day.pnl, currency)}
                                </p>
                                <p className="text-[10px] text-muted-foreground">{day.trades} trade</p>
                                <div className="mt-1">
                                  <RRValue rr={day.rr ?? null} />
                                </div>
                              </>
                            ) : (
                              <p className="mt-1 text-[10px] text-muted-foreground/60">—</p>
                            )}
                          </div>
                        ))}
                        <div className="rounded-xl border border-border/60 bg-card/50 px-2 py-2 text-center backdrop-blur-sm">
                          <p className="text-[11px] font-semibold text-foreground/70">
                            {week.label}
                          </p>
                          <p
                            className={`mt-1 text-xs font-bold tabular-nums ${
                              week.pnl > 0
                                ? "text-emerald-400"
                                : week.pnl < 0
                                  ? "text-rose-400"
                                  : "text-muted-foreground"
                            }`}
                          >
                            {formatMoney(week.pnl, currency)}
                          </p>
                          <p className="text-[10px] text-muted-foreground">{week.trades} trade</p>
                          <div className="mt-1">
                            <RRValue rr={week.rr ?? null} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
      <BottomNav />
      <Modal
        open={selectedDate !== null}
        onClose={() => setSelectedDate(null)}
        title={selectedDate ? `Ringkasan ${selectedDate}` : "Ringkasan"}
      >
        {selectedDate ? (
          (() => {
            const tradesForDay = trades.filter((t) => dayKey(new Date(t.date)) === selectedDate);
            if (tradesForDay.length === 0)
              return <p className="text-sm text-muted-foreground">Tidak ada trade.</p>;

            return (
              <div className="space-y-3">
                {tradesForDay.map((t) => (
                  <div key={t.id} className="rounded-md border border-border/50 px-3 py-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold truncate">{t.pair} — {t.entryModel}</div>
                        <div className="text-xs text-muted-foreground">{new Date(t.date).toLocaleString()}</div>
                        {t.notes ? <div className="mt-2 text-xs text-muted-foreground truncate">{t.notes}</div> : null}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold tabular-nums">{formatMoney(t.pnl, t.currency)}</div>
                        <div className="mt-1"><RRValue rr={t.rr} /></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()
        ) : null}
        <div className="mt-4 flex justify-end">
          <Button onClick={() => setSelectedDate(null)}>Tutup</Button>
        </div>
      </Modal>
    </div>
  );
}
