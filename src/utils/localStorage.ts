export interface SegmentChange {
    id: number;
    text: string;
    changed: boolean;
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
