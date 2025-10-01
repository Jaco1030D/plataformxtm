import * as actionTypes from './actions-types';
import type { BuildActionsParams, BuildActionsReturnType } from './types/context';

export const buildActions = (dispatch: BuildActionsParams): BuildActionsReturnType => {
    return {
        createGroup: (payload) => {
            const groupId = crypto.randomUUID(); // Gera ID único
            dispatch({
                type: actionTypes.createGroup,
                payload: {
                    ...payload,
                    id: groupId // Adiciona o ID ao payload
                }
            });
            return groupId; // Retorna o ID gerado
        },

        deleteGroup: (groupId) => {
            dispatch({
                type: actionTypes.deleteGroup,
                payload: groupId
            });
        },

        setActiveGroup: (groupId) => {
            dispatch({
                type: actionTypes.setActiveGroup,
                payload: groupId
            });
        },

        addSegmentsForGroup: (payload) => {
            dispatch({
                type: actionTypes.addSegmentsForGroup,
                payload
            });
        },

        addGroup: (group) => {
            dispatch({
                type: actionTypes.addGroup,
                payload: group
            });
        }
    };
};
