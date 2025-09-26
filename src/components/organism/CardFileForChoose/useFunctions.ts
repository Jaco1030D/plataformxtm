import { useNavigate } from "react-router-dom"
import { useFilesUploadsContext } from "../../../context/FileUploads/utils"
import type { FileWithSegment } from "../../../context/FileUploads/types/context"
import { editSegmentsRoutes } from "../../../const/routes"
import { useCallback, useState } from "react"

export const useFunctions = () => {
    const [state, actions] = useFilesUploadsContext()
    const [loading, setLoading] = useState<boolean>(false)

    const navigate = useNavigate()

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    const getSegmentsStats = useCallback((file: FileWithSegment) => {
        const segments = Array.isArray(file.content) ? file.content : []
        const total = segments.length
        // No novo formato não há isLocked; consideramos bloqueados = 0
        const lockeds = 0
        const editable = total - lockeds
        return { total, lockeds, editable }
    },[])

    const truncateFileName = (name: string, maxLength = 20) => {
        if (name.length <= maxLength) return name;

        const extension = name.split('.').pop();

        const nameWithoutExt = name.substring(0, name.lastIndexOf('.'));
        
        const truncated = nameWithoutExt.substring(0, maxLength - (extension?.length ?? 0) - 4) + '...';
        
        return `${truncated}.${extension}`;
    };

    const chooseEditFile = (file: FileWithSegment) => {

        setLoading(true)

        actions.addEditFile(file)

        navigate(editSegmentsRoutes)
    }

    return {
        state,
        chooseEditFile,
        filesForChoose: state.files,
        formatDate,
        truncateFileName,
        backPage: () => navigate('/'),
        getSegmentsStats,
        loading
    }
}