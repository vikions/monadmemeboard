"use client";

import { useEffect, useState } from "react";

function formatAmount(input: string | number) {
  const n = Number(input);
  if (!Number.isFinite(n)) return String(input);
  if (Math.abs(n) >= 1_000_000) {
    return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(n);
  }
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n);
}

type Holder = { address: string; balance: string };
type TokenKey = "yaki" | "chog" | "dak";

type ApiResp = {
  top5: Holder[];
  threshold100: string | null;
  threshold1000: string | null;
  totalHolders: number;
  mode?: "light" | "100";
};

type Props = {
  token: TokenKey;
  name: string;
  symbol: string;
  address: string;
  icon?: React.ReactNode;
};

export default function TokenCard({ token, name, symbol, address, icon }: Props) {
  const [data, setData] = useState<ApiResp | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const saddr = (a: string) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "");

  async function load() {
    try {
      setErr(null);
      setLoading(true);
     
      const res = await fetch(`/api/holders?token=${token}`);
      if (!res.ok) throw new Error((await res.text()) || `HTTP ${res.status}`);
      const json = (await res.json()) as ApiResp;
      setData(json);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(); 
  }, [token]);

  return (
    <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-5 w-full max-w-[460px] shadow-md">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-200">
          {icon ?? "₿"}
        </div>
        <div>
          <div className="font-semibold text-zinc-100">
            {name} <span className="text-zinc-400">({symbol})</span>
          </div>
          <div className="text-xs text-zinc-500">{saddr(address)}</div>
        </div>
        <div className="ml-auto">
          <button
            onClick={load}
            className="text-xs px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
            disabled={loading}
            title="Refresh now"
          >
            {loading ? "…" : "Refresh"}
          </button>
        </div>
      </div>

      <div className="mt-3">
        {err ? (
          <div className="text-sm text-red-400">
            Couldn’t load holders (provider error). Will retry when you press Refresh.
          </div>
        ) : loading && !data ? (
          <div className="text-sm text-zinc-400">Loading top holders…</div>
        ) : data ? (
          <>
            <div className="text-sm text-zinc-300 mb-2">Top-5 holders</div>
            <ul className="text-sm space-y-1">
              {data.top5.map((h, i) => (
                <li key={h.address + i} className="flex justify-between font-mono text-zinc-200">
                  <span className="pr-2">#{i + 1} {saddr(h.address)}</span>
                  <span className="tabular-nums">{formatAmount(h.balance)}</span>
                </li>
              ))}
              {!data.top5.length && <li className="text-zinc-400">No data available.</li>}
            </ul>

            <div className="mt-4 flex items-center gap-2 text-xs">
              <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-200">
                Top-100 — <span className="font-semibold">
                  {data.threshold100 ? formatAmount(data.threshold100) : "—"}
                </span>
              </span>
              <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-200">
                Top-1000 — <span className="font-semibold">
                  {data.threshold1000 ? formatAmount(data.threshold1000) : "—"}
                </span>
              </span>
            </div>

            <div className="mt-3 text-[11px] text-zinc-500">
              Total holders fetched: {data.totalHolders ?? 0}
              {data.mode ? ` · mode: ${data.mode}` : null}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
