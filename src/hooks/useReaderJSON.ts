import { useState } from "react";
import { useFilesUploadsContext } from "../context/FileUploads/utils";

export const useReaderJSON = () => {
    const [state, actions] = useFilesUploadsContext()
    const [jsonData, setJsonData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // const abortControllerRef = useRef<AbortController | null>(null);

    // if (abortControllerRef.current) {
    //     abortControllerRef.current.abort();
    //   }
      
    //   abortControllerRef.current = new AbortController();
    //   const signal = abortControllerRef.current.signal;

    const reader = new FileReader();

    const extractContent = (file: File) => {

        setIsLoading(true);
        
        setError(null);

        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                
                const parsedData = JSON.parse(content);

                // Coletar todos os tipos de erro presentes nos segmentos
                let TypesErrors: string[] = [];
                try {
                    if (Array.isArray(parsedData)) {
                        const typesSet = new Set<string>();
                        for (const seg of parsedData) {
                            const errors = (seg && Array.isArray(seg.errors)) ? seg.errors : [];
                            for (const err of errors) {
                                if (err && typeof err.type === 'string') {
                                    typesSet.add(err.type);
                                }
                            }
                        }
                        TypesErrors = Array.from(typesSet);
                    }
                } catch (_) {
                    // silencioso: se der erro, mantemos TypesErrors vazio
                }

                const fileForAddSegments = state.files.filter(file => file.size === e.total)[0]

                actions.addSegments({
                    content: parsedData,
                    file: fileForAddSegments,
                    size: file.size,
                    TypesErrors
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

    // useEffect(() => {
    //     return () => {
    //       if (abortControllerRef.current) {
    //         abortControllerRef.current.abort();
    //       }
    //     };
    // }, []);

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