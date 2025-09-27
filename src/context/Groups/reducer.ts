import * as actionTypes from './actions-types';
import type { GroupActions, GroupsState } from './types/context';

export const groupsReducer = (state: GroupsState, action: GroupActions): GroupsState => {
    switch (action.type) {
        case actionTypes.createGroup: {
            const { id, name, color, description, userId, segmentIds = [] } = action.payload;
            
            const newGroup: GroupsState['groups'][0] = {
                id, // Usa o ID que veio no payload
                name,
                color: color || '#3B82F6', // Azul padrão
                description,
                userId,
                segmentIds,
                createdAt: new Date()
            };

            return {
                ...state,
                groups: [...state.groups, newGroup]
            };
        }

        case actionTypes.deleteGroup: {
            const groupId = action.payload;
            
            return {
                ...state,
                groups: state.groups.filter(group => group.id !== groupId),
                // Se o grupo deletado era o ativo, limpa o activeGroup
                activeGroup: state.activeGroup?.id === groupId ? null : state.activeGroup
            };
        }

        case actionTypes.setActiveGroup: {
            const groupId = action.payload;
            const group = state.groups.find(group => group.id === groupId);
            return {
                ...state,
                activeGroup: group || null
            };
        }

        default:
            return state;
    }
};
