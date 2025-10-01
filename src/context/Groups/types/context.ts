import type { Dispatch } from "react"
import type { createGroup, deleteGroup, setActiveGroup, addSegmentsForGroup, addGroup } from "../actions-types.ts"

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

type AddSegmentsForGroupAction = {
    type: typeof addSegmentsForGroup;
    payload: {
        groupId: string;
        segmentIds: number[];
    };
};

type AddGroupAction = {
    type: typeof addGroup;
    payload: Group[]; // Grupo completo
};

// Tipo de todas as ações
export type GroupActions = CreateGroupAction | DeleteGroupAction | SetActiveGroupAction | AddSegmentsForGroupAction | AddGroupAction;

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
    [key: string]: unknown;
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
    addSegmentsForGroup: (payload: {
        groupId: string;
        segmentIds: number[];
    }) => void;
    addGroup: (group: Group[]) => void; // Adiciona um grupo completo diretamente
};
