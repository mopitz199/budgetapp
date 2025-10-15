import { Categories } from "@/types";
import { createContext, Dispatch, useContext } from "react";

export const TransactionCategoriesContext = createContext<{
  transactionCategories: Categories,
  setTransactionCategories: Dispatch<any>
} | null>(null);

export function useTransactionCategoriesContext(){
  const transactionCategories = useContext(TransactionCategoriesContext)
  if(transactionCategories === null || transactionCategories === undefined){
    throw new Error("useTransactionCategoriesContext must be used within a TransactionCategoriesContext.Provider with a valid value.");
  }
  return transactionCategories
}