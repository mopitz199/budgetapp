import type { User } from "@/types";
import { createContext, useContext } from "react";

export const UserAuthenticatedContext = createContext<User | null>(null);

export function useUserSettingContext(){
  const userAuthenticatedContext = useContext(UserAuthenticatedContext)
}