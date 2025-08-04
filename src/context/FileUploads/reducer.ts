// reducer.ts

import * as actionTypes from "./actions-types";
import { initialState } from "./data";
import type { FileActions, State } from "./types/context";

// Estado inicial

// Tipifica o reducer
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
            // Lógica para remover todos os arquivos
            return {
                ...state,
                files: []
            };

        case actionTypes.addFileToEdit:
            
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
        default:
            return state;
    }
};
