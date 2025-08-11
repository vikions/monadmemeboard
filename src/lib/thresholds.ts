import { Holder } from "./types";

const toBig = (v: string | number | bigint) => BigInt(v);

export function computeThresholds(holders: Holder[]) {
  
  const top5 = holders.slice(0, 5);
  const threshold100 = holders[99]?.balance ?? "0";
  const threshold1000 = holders[999]?.balance ?? "0";
  return { top5, threshold100, threshold1000 };
}

export function sortHoldersDesc(holders: Holder[]): Holder[] {
  return [...holders].sort((a, b) => {
    const da = toBig(a.balance);
    const db = toBig(b.balance);
    return db === da ? 0 : db > da ? 1 : -1;
  });
}