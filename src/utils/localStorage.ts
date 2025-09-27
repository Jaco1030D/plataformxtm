export interface SegmentChange {
    id: number;
    text: string;
    changed: boolean;
}

export interface FakeError {
    segmentId: number;
    errorKey: string;
    error: {
        type: string;
        message: string;
    };
}

export const saveSegmentChange = (id: number, text: string, changed: boolean, fileName: string): void => {
    try {
        const existingData = localStorage.getItem('segments-' + fileName);
        let segments: SegmentChange[] = existingData ? JSON.parse(existingData) : [];
        
        // Verificar se já existe uma entrada para este segmento
        const existingIndex = segments.findIndex(seg => seg.id === id);
        
        const segmentChange: SegmentChange = {
            id,
            text,
            changed
        };
        
        if (existingIndex >= 0) {
            // Atualizar entrada existente
            segments[existingIndex] = segmentChange;
        } else {
            // Adicionar nova entrada
            segments.push(segmentChange);
        }
        
        localStorage.setItem('segments-' + fileName, JSON.stringify(segments));
        console.log(`Segmento ${id} salvo no localStorage:`, segmentChange);
    } catch (error) {
        console.error('Erro ao salvar no localStorage:', error);
    }
};

export const getSegmentChanges = (fileName: string): SegmentChange[] => {
    try {
        const data = localStorage.getItem('segments-' + fileName);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Erro ao ler do localStorage:', error);
        return [];
    }
};

export const clearSegmentChanges = (): void => {
    try {
        localStorage.removeItem('segments');
        console.log('Dados de segmentos removidos do localStorage');
    } catch (error) {
        console.error('Erro ao limpar localStorage:', error);
    }
};

export const saveFakeError = (segmentId: number, errorKey: string, error: { type: string; message: string }, fileName: string): void => {
    try {
        const existingData = localStorage.getItem('fakeErrors-' + fileName);
        let fakeErrors: FakeError[] = existingData ? JSON.parse(existingData) : [];
        
        // Verificar se já existe uma entrada para este erro específico
        const existingIndex = fakeErrors.findIndex(fakeErr => 
            fakeErr.segmentId === segmentId && fakeErr.errorKey === errorKey
        );
        
        const fakeError: FakeError = {
            segmentId,
            errorKey,
            error
        };
        
        if (existingIndex >= 0) {
            // Atualizar entrada existente
            fakeErrors[existingIndex] = fakeError;
        } else {
            // Adicionar nova entrada
            fakeErrors.push(fakeError);
        }
        
        localStorage.setItem('fakeErrors-' + fileName, JSON.stringify(fakeErrors));
        console.log(`Falso erro salvo no localStorage:`, fakeError);
    } catch (error) {
        console.error('Erro ao salvar falso erro no localStorage:', error);
    }
};

export const getFakeErrors = (fileName: string): FakeError[] => {
    try {
        const data = localStorage.getItem('fakeErrors-' + fileName);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Erro ao ler falsos erros do localStorage:', error);
        return [];
    }
};
