// reducer.ts

import * as actionTypes from "./actions-types";
import { initialState } from "./data";
import type { FileActions, State } from "./types/context";

export const reducer = (state: State = initialState, action: FileActions): State => {
    switch (action.type) {
        case actionTypes.uploadFile:
            
            return {
                ...state,
                files: [...state.files, ...action.payload]
            };

        case actionTypes.removeFile:
            
            return {
                ...state,
                files: state.files.filter(file => file !== action.payload)
            };

        case actionTypes.removeAllFiles:

            return {
                ...state,
                files: []
            };

        case actionTypes.addFileToEdit:
            console.log("Adicionou");
            
            
            return {
                ...state,
                editValue: action.payload
            }
        
        case actionTypes.clearFileToEdit:

            return {
                ...state,
                editValue: null
            }

        case actionTypes.addSegments:

            return {
                ...state,
                filesWithSegments: [...state.filesWithSegments, action.payload]
                
            }

        case actionTypes.updateSegments: {

            const {id, targetText} = action.payload;

            const editValue = state.editValue;

            if (!editValue) return state;

            if (Array.isArray(editValue.content)) {
                
                const index = Number(id) - 1;

                if (editValue.content[index]) {
                    
                    
                    editValue.content[index].changed = true
                    editValue.content[index].translation = targetText

                }
            }

            return {
                ...state,
                editValue
            }
        }

        case actionTypes.addIdGroup: {
            const { segmentIds, groupId } = action.payload;
            const editValue = state.editValue;
            
            if (!editValue || !Array.isArray(editValue.content)) {
                return state;
            }

            // Criar nova referência do array de segmentos
            const newContent = editValue.content.map(segment => {
                // Verificar se o segmento está na lista de IDs para adicionar o grupo
                if (segmentIds.includes(segment.id)) {
                    return {
                        ...segment,
                        groups: segment.groups 
                            ? [...segment.groups, groupId] // Adicionar o grupo se já existir groups
                            : [groupId] // Criar array com o grupo se não existir
                    };
                }
                return segment;
            });

            return {
                ...state,
                editValue: {
                    ...editValue,
                    content: newContent
                }
            };
        }
        
        default:
            return state;
    }
};
