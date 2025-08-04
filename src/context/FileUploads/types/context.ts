import type { Dispatch } from "react"
import type { addFileToEdit, addSegments, clearFileToEdit, removeAllFiles, removeFile, uploadFile } from "../actions-types"
  
// Tipo da ação
type UploadFileAction = {
    type: typeof uploadFile; //retorna o tipo do uploadFile
    payload: File[]; // Altere o tipo conforme necessário
};

type RemoveFileAction = {
    type: typeof removeFile;
    payload: File; // Altere o tipo conforme necessário
};

type RemoveAllFilesAction = {
    type: typeof removeAllFiles;
};
type ClearFilesToEditAction = {
    type: typeof clearFileToEdit;
};

type AddFileToEditAction = {
    type: typeof addFileToEdit,
    payload: FileWithSegment
}
type AddSegmentsToFile = {
    type: typeof addSegments,
    payload: FileWithSegment
}

// Tipo de todas as ações
export type FileActions =
    | UploadFileAction
    | RemoveFileAction
    | RemoveAllFilesAction
    | AddFileToEditAction
    | AddSegmentsToFile
    | ClearFilesToEditAction

export type BuildActionsParams = Dispatch<FileActions>;

interface TM {
    metadata: string,
    score: string,
    sourceTm: string,
    targetTm: string
}

export interface Segment {
    id: string,
    isLocked: boolean,
    source: string,
    target: string,
    status: string,
    statusMatch: string,
    tm: TM
}

interface Metadata {
    url: string,
    totalSegments: number,
    extractedAt: string
}

interface JSONContent {
    metadata: Metadata,
    segments: Segment[]
}

export interface FileWithSegment{
    content: JSONContent,
    file: File,
    size: number
}


export type State = {
  files: File[];
  filesWithSegments: FileWithSegment[];
  editValue: FileWithSegment | null;
};

export type BuildActionsReturnType = {
    uploadFiles: (payload: File[]) => void;
    removeFile: (payload: File) => void;
    removeAllFiles: () => void;
    addEditFile: (payload: FileWithSegment) => void;
    addSegments: (payload: FileWithSegment) => void;
    clearEditFile: () => void;
  };

export type FileContent = {
    id: number,
    content?: object,
}