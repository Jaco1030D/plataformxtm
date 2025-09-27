import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import { groupsReducer } from './reducer';
import { buildActions } from './build-actions';
import type { BuildActionsReturnType, GroupsState } from './types/context';

// Estado inicial
const initialState: GroupsState = {
    metadata: {},
    groups: [],
    activeGroup: null
};

// Contexto
const GroupsContext = createContext<{
    state: GroupsState;
    actions: BuildActionsReturnType;
} | null>(null);

// Provider
interface GroupsProviderProps {
    children: ReactNode;
}

export const GroupsProvider: React.FC<GroupsProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(groupsReducer, initialState);
    const actions = buildActions(dispatch);

    return (
        <GroupsContext.Provider value={{ state, actions }}>
            {children}
        </GroupsContext.Provider>
    );
};

// Hook para usar o contexto
export const useGroups = () => {
    const context = useContext(GroupsContext);
    if (!context) {
        throw new Error('useGroups deve ser usado dentro de um GroupsProvider');
    }
    return context;
};
