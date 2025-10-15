import { createContext, Dispatch, useContext } from "react";

export const CurrencyRatioContext = createContext<{
  currencyRatio: Record<string, number>,
  setCurrencyRatio: Dispatch<any>
} | null>(null);

export function useCurrencyRatioContext(){
  const currencyRatio = useContext(CurrencyRatioContext)
  if(currencyRatio === null || currencyRatio === undefined){
    throw new Error("useCurrencyRatioContext must be used within a CurrencyRatioContext.Provider with a valid value.");
  }
  return currencyRatio;
}