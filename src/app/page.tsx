import TokenCard from "@/components/TokenCard";

const TOKENS = {
  yaki: {
    name: "Moyaki",
    symbol: "YAKI",
    address: "0xfe140e1dCe99Be9F4F15d657CD9b7BF622270C50",
  },
  chog: {
    name: "Chog",
    symbol: "CHOG",
    address: "0xE0590015A873bF326bd645c3E1266d4db41C4E6B",
  },
  dak: {
    name: "Molandak",
    symbol: "DAK",
    address: "0x0F0BDEbF0F83cD1EE3974779Bcb7315f9808c714",
  },
} as const;

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-4xl font-bold mb-2">MonadMemeBoard</h1>
      <p className="text-sm text-zinc-400 mb-8">
        Top holders and thresholds for entering Top-100 / Top-1000 across{" "}
        <span className="font-semibold">YAKI</span> ·{" "}
        <span className="font-semibold">CHOG</span> ·{" "}
        <span className="font-semibold">DAK</span>. 
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        <TokenCard
          token="yaki"
          name={TOKENS.yaki.name}
          symbol={TOKENS.yaki.symbol}
          address={TOKENS.yaki.address}
          icon={<span>🟣</span>}
        />
        <TokenCard
          token="chog"
          name={TOKENS.chog.name}
          symbol={TOKENS.chog.symbol}
          address={TOKENS.chog.address}
          icon={<span>🟣</span>}
        />
        <TokenCard
          token="dak"
          name={TOKENS.dak.name}
          symbol={TOKENS.dak.symbol}
          address={TOKENS.dak.address}
          icon={<span>🟣</span>}
        />
      </div>

      <p className="text-xs text-zinc-500 mt-8">
        Open-source. Built for Monad testnet. 
      </p>
    </main>
  );
}
