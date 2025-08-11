export type Holder = {
  address: string;
  balance: string; 
};

export type HolderStats = {
  top5: Holder[];
  threshold100: string; 
  threshold1000: string; 
  totalHolders: number;
};