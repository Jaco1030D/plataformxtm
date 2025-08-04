import { useContext } from "react";
import type { BuildActionsReturnType, State } from "../types/context";
import { Context } from "../context";

export const useFilesUploadsContext = (): [State, BuildActionsReturnType] => {
    const context = useContext(Context);  
  
    if (context === undefined) {
      throw new Error('Você está invocando essa função fora do escopo do context');
    }
  
    return [context.state, context.actions];
  };