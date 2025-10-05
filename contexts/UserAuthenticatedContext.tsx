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