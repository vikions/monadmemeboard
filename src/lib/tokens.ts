export type TokenInfo = {
  key: "yaki" | "chog" | "dak";
  name: string;
  symbol: string;
  address: string;
  image: string; 
};

export const TOKENS: TokenInfo[] = [
  {
    key: "yaki",
    name: "Moyaki",
    symbol: "YAKI",
    address: "0xfe140e1dCe99Be9F4F15d657CD9b7BF622270C50",
    image: "/tokens/yaki.png",
  },
  {
    key: "chog",
    name: "Chog",
    symbol: "CHOG",
    address: "0xE0590015A873bF326bd645c3E1266d4db41C4E6B",
    image: "/tokens/chog.png",
  },
  {
    key: "dak",
    name: "Molandak",
    symbol: "DAK",
    address: "0x0F0BDEbF0F83cD1EE3974779Bcb7315f9808c714",
    image: "/tokens/dak.png",
  },
];
