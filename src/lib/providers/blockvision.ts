import "server-only";

export type Holder = { address: string; balance: string };
type TokenKey = "yaki" | "chog" | "dak";

const CONTRACTS: Record<TokenKey, string> = {
  yaki: "0xfe140e1dCe99Be9F4F15d657CD9b7BF622270C50",
  chog: "0xE0590015A873bF326bd645c3E1266d4db41C4E6B",
  dak:  "0x0F0BDEbF0F83cD1EE3974779Bcb7315f9808c714",
};

const BASE = "https://api.blockvision.org/v2/monad/token/holders";


const RAM: Record<string, { exp: number; data: any }> = {};
const DAY = 24 * 60 * 60 * 1000;

function apiKey(): string {
  const k = process.env.BLOCKVISION_API_KEY;
  if (!k) throw new Error("BLOCKVISION_API_KEY is missing in .env.local");
  return k;
}


function depth(): "light" | "100" {
  const d = String(process.env.FETCH_DEPTH || "light").toLowerCase();
  return d === "100" ? "100" : "light";
}

async function fetchPage(contract: string, pageIndex: number, pageSize: number) {
  const url = `${BASE}?contractAddress=${contract}&pageIndex=${pageIndex}&pageSize=${pageSize}`;
  const res = await fetch(url, {
    headers: { "X-API-Key": apiKey(), Accept: "application/json" },
    next: { revalidate: 60 * 60 * 24 }, 
  });
  if (!res.ok) throw new Error(`BlockVision HTTP ${res.status}`);
  return (await res.json()) as any;
}

function normalize(items: any[]): Holder[] {
  return (items ?? [])
    .map((row: any) => ({
      address: String(row?.holder || row?.address || "").toLowerCase(),
      balance: String(row?.amount ?? "0").replace(/[,\s_]/g, ""),
    }))
    .filter(h => h.address.startsWith("0x"));
}

export async function getTopHoldersForToken(token: TokenKey) {
  const contract = CONTRACTS[token];
  if (!contract) throw new Error("Unknown token");

  const key = `holders:${token}:${depth()}`;
  const now = Date.now();
  if (RAM[key]?.exp > now) return RAM[key].data;

  const mode = depth();

  
  const pageSize = mode === "100" ? 50 : 5;
  const pages = mode === "100" ? 2 : 1;

  let holders: Holder[] = [];
  for (let p = 1; p <= pages; p++) {
    const json = await fetchPage(contract, p, pageSize);
    const list = Array.isArray(json?.result?.data) ? json.result.data : [];
    const batch = normalize(list);
    if (!batch.length) break;
    holders = holders.concat(batch);
  }

  if (!holders.length) throw new Error("No holders data (empty)");

  const data = {
    top5: holders.slice(0, 5),
    threshold100: mode === "100" ? holders[99]?.balance ?? null : null,
    threshold1000: null, 
    totalHolders: holders.length,
    mode,
  };

  RAM[key] = { exp: now + DAY, data };
  return data;
}
