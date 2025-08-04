import { useState } from "react";
import { useFilesUploadsContext } from "../context/FileUploads/utils";

export const useReaderJSON = () => {
    const [state, actions] = useFilesUploadsContext()
    const [jsonData, setJsonData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const reader = new FileReader();

    const extractContent = (file: File) => {

        setIsLoading(true);
        
        setError(null);

        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                
                const parsedData = JSON.parse(content);

                const fileForAddSegments = state.files.filter(file => file.size === e.total)[0]

                actions.addSegments({
                    content: parsedData,
                    file: fileForAddSegments,
                    size: file.size
                })
                
                setJsonData(parsedData);
                
            } catch (err) {

                const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
                
                setError(`Erro ao parsear JSON: ${errorMessage}`);
                
                console.error("Erro ao parsear JSON:", err);
            
            } finally {
                
                setIsLoading(false);
            
            }
        };

        reader.onerror = (error) => {

            setError("Erro ao ler o arquivo");
            
            setIsLoading(false);
            
            console.error("Erro ao ler o arquivo:", error);
        };

        // Use readAsText para arquivos JSON
        reader.readAsText(file);
    };

    const getFormattedJson = () => {
        return jsonData ? JSON.stringify(jsonData, null, 2) : null;
    };

    const clearData = () => {

        setJsonData(null);
        
        setError(null);
    };

    return {
        // Dados
        jsonData,       // Dados parseados (objeto/array JS)
        isLoading,
        error,
        
        // Métodos
        extractContent,     // Lê e processa o arquivo
        getFormattedJson,   // Retorna JSON formatado para exibição
        clearData           // Limpa todos os dados
    };
};