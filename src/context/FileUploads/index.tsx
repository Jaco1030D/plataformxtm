import { useReducer, useRef } from "react";
import type { ReactNode } from "react";
import { buildActions } from "./build-actions";
import { reducer } from "./reducer";
import { initialState } from "./data";
import type { BuildActionsReturnType, State } from "./types/context";
import { Context } from "./context";


export type FilesUploadsContext = {
  state: State;
  actions: BuildActionsReturnType;
};

interface ContextFilesUploadsProps {
  children: ReactNode;
}

export const ContextFilesUploads: React.FC<ContextFilesUploadsProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const actions = useRef(buildActions(dispatch));

  const contextValue: FilesUploadsContext = {
    state,
    actions: actions.current,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};