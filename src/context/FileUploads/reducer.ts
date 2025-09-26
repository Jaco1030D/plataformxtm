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

            
        
        default:
            return state;
    }
};
