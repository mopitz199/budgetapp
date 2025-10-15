import { createContext, useContext } from "react";

export const UserAuthenticatedContext = createContext<any | null>(null);

export function useUserAuthenticatedContext(){
  const userSettings = useContext(UserAuthenticatedContext)
  if(userSettings === null || userSettings === undefined){
    throw new Error("useUserAuthenticatedContext must be used within a UserAuthenticatedContext.Provider with a valid value.");
  }
  return userSettings;
}