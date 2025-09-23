export type Transaction = {
  index: number;
  date: Date;
  description: string;
  amount: Number;
  stringAmount: string;
  removed: boolean;
  negative: boolean;
  category: string;
  currency: string;
};
export type Categories = Record<string, { value: string; color: string }>;