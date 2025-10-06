import { UserAuthenticatedContextType } from "@/types";
import { createContext, useContext } from "react";

export const UserAuthenticatedContext = createContext<UserAuthenticatedContextType | null>(null);

export function useUserSettingContext(){
  const userAuthenticatedContext = useContext(UserAuthenticatedContext)
  const userSettings = userAuthenticatedContext?.userSettings
  if(userSettings === null){
    throw new Error("useUserSettingContext must be used within a UserAuthenticatedContext.Provider with a valid value.");
  }
  return userSettings;
}

export function useCurrencyRatioContext(){
  const userAuthenticatedContext = useContext(UserAuthenticatedContext)
  const currencyRatio = userAuthenticatedContext?.currencyRatio
  if(currencyRatio === null){
    throw new Error("useCurrencyRatioContext must be used within a UserAuthenticatedContext.Provider with a valid value.");
  }
  return currencyRatio;
}

export function useTransactionCategoriesContext(){
  const userAuthenticatedContext = useContext(UserAuthenticatedContext)
  const transactionCategories = userAuthenticatedContext?.transactionCategories
  if(transactionCategories === null || transactionCategories === undefined){
    throw new Error("useTransactionCategoriesContext must be used within a UserAuthenticatedContext.Provider with a valid value.");
  }
  return transactionCategories;
}