export type TransactionToDisplay = {
  index: number;
  date: Date;
  description: string;
  amount: number;
  stringAmount: string;
  removed: boolean;
  negative: boolean;
  category: string;
  currency: string;
};
export type Categories = Record<string, { value: string; color: string }>;
export type User = {
  uid: string;
  email: string | null;
}
export type UserAuthenticatedContextType = {
  userSettings?: any,
  currencyRatio?: any,
  transactionCategories?: Categories,
}