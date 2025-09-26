import * as actionTypes from './actions-types';
import type { BuildActionsParams, FileWithSegment, UpdateProps } from './types/context';

export const buildActions = (dispatch: BuildActionsParams) => {

  return {
    uploadFiles: (payload: File[]) => dispatch({ type: actionTypes.uploadFile, payload}),
    removeFile: (payload: File) => dispatch({ type: actionTypes.removeFile, payload}),
    removeAllFiles: () => dispatch({ type: actionTypes.removeAllFiles}),
    addEditFile: (payload: FileWithSegment) => dispatch({type: actionTypes.addFileToEdit, payload}),
    addSegments: (payload: FileWithSegment) => dispatch({type: actionTypes.addSegments, payload}),
    clearEditFile: () => dispatch({type: actionTypes.clearFileToEdit}),
    updateSegments: (payload: UpdateProps) => dispatch({type: actionTypes.updateSegments, payload})
  }
}