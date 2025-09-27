import type { Dispatch } from "react"
import type { createGroup, deleteGroup, setActiveGroup } from "../actions-types.ts"

// Tipo da ação
type CreateGroupAction = {
    type: typeof createGroup;
    payload: {
        id: string; // ID gerado no build-actions
        name: string;
        color?: string;
        description?: string;
        userId?: string;
        segmentIds?: number[];
    };
};

type DeleteGroupAction = {
    type: typeof deleteGroup;
    payload: string; // groupId
};

type SetActiveGroupAction = {
    type: typeof setActiveGroup;
    payload: string; // groupId
};

// Tipo de todas as ações
export type GroupActions = CreateGroupAction | DeleteGroupAction | SetActiveGroupAction;

export type BuildActionsParams = Dispatch<GroupActions>;

// Interface para um grupo
export interface Group {
    id: string;
    name: string;
    color?: string;
    description?: string;
    userId?: string;
    segmentIds: number[];
    createdAt: Date;
}

// Interface para metadata (futuro)
export interface GroupsMetadata {
    // Propriedades futuras para metadata
}

// Estado do contexto de grupos
export type GroupsState = {
    metadata: GroupsMetadata;
    groups: Group[];
    activeGroup: Group | null; // ID do grupo ativo
};

// Tipo de retorno das ações
export type BuildActionsReturnType = {
    createGroup: (payload: {
        name: string;
        color?: string;
        description?: string;
        userId?: string;
        segmentIds?: number[];
    }) => string; // Retorna o ID do grupo criado
    deleteGroup: (groupId: string) => void;
    setActiveGroup: (groupId: string) => void;
};
