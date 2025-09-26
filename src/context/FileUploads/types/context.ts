import type { Dispatch } from "react"
import type { addFileToEdit, addSegments, clearFileToEdit, removeAllFiles, removeFile, updateSegments, uploadFile } from "../actions-types"
  
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
export type UpdateProps = {
    targetText: string,
    id: number
}
type UpdateSegmentsAction = { 
    type: typeof updateSegments,
    payload: UpdateProps
 }

// Tipo de todas as ações
export type FileActions =
    | UploadFileAction
    | RemoveFileAction
    | RemoveAllFilesAction
    | AddFileToEditAction
    | AddSegmentsToFile
    | ClearFilesToEditAction
    | UpdateSegmentsAction

export type BuildActionsParams = Dispatch<FileActions>;

interface Match {
    metadata: string,
    score: string,
    sourceTm: string,
    targetTm: string
}

interface TM {
    matches: Match[],
    
}

export interface Segment {
    id: string,
    isLocked: boolean,
    source: string,
    target: string,
    status: string,
    statusMatch: string,
    tm: TM,
    changed?: boolean
}

interface Stats {
    total: number,
    completed: number,
    processing: number,
    error: number,
    tmMatches: number,
    statusBreakdown: object
};

interface Metadata {
    extractionDate: string,
    totalSegments: number,
    processingTime: number,
    processingStats: Stats,
    version: "1.0"
}

// Novo formato (example.json): lista de segmentos com campos simples
export interface ValidationMessage {
    type: string,
    message: string
}

export interface MigratedSegment {
    id: number,
    source: string,
    translation: string,
    status: string,
    languages?: string[],
    errors: ValidationMessage[],
    validations: ValidationMessage[],
    changed?: boolean
}

// Formato antigo (old.json suportado anteriormente): objeto com metadata e segments detalhados
export interface LegacyJSONContent {
    metadata: Metadata,
    segments: Segment[]
}

// JSONContent agora aceita tanto o novo formato (array) quanto o antigo (objeto)
export type JSONContent = MigratedSegment[];

export interface FileWithSegment{
    content: JSONContent,
    file: File,
    size: number,
    TypesErrors?: string[]
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
    updateSegments: (payload: UpdateProps) => void;
  };

export type FileContent = {
    id: number,
    content?: object,
}