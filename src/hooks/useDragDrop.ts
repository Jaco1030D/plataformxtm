import { useState } from "react"

export const useDragDrop = () => {
    const [files, setFiles] = useState<File[]>([])
    

    
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {

        event.preventDefault();
        
        const droppedFiles = event.dataTransfer.files;
        
        setFiles((prev) => [...prev, ...droppedFiles]);
    
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    
        setFiles((prev) => [...prev, ...event.target.files!]);
    
    };

    const clear = () => {

        setFiles([])
    
    }

    return {
        files,
        handleDrop,
        handleInputChange,
        clear
    }
}