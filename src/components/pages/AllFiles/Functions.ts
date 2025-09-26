import { useNavigate } from "react-router-dom"
import { useFilesUploadsContext } from "../../../context/FileUploads/utils"
import type { FileWithSegment } from "../../../context/FileUploads/types/context"
import { editSegmentsRoutes } from "../../../const/routes"

export const useFunctions = () => {
    const [state, actions] = useFilesUploadsContext()

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

    const truncateFileName = (name: string, maxLength = 20) => {
        if (name.length <= maxLength) return name;

        const extension = name.split('.').pop();

        const nameWithoutExt = name.substring(0, name.lastIndexOf('.'));
        
        const truncated = nameWithoutExt.substring(0, maxLength - (extension?.length ?? 0) - 4) + '...';
        
        return `${truncated}.${extension}`;
    };

    const chooseEditFile = (file: FileWithSegment) => {

        actions.addEditFile(file)

        navigate(editSegmentsRoutes)
    }

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        const value = parseFloat((bytes / Math.pow(k, i)).toFixed(2))
        return `${value} ${sizes[i]}`
    }

    const getFileStats = (file: FileWithSegment) => {
        const segments = Array.isArray(file.content) ? file.content : []
        const total = segments.length
        const byStatus = segments.reduce<Record<string, number>>((acc, s) => {
            const key = s.status || 'unknown'
            acc[key] = (acc[key] || 0) + 1
            return acc
        }, {})
        return { total, byStatus }
    }

    const getGlobalStats = () => {
        const files = state.filesWithSegments
        const totals = files.map(f => getFileStats(f).total)
        const totalSegments = totals.reduce((a, b) => a + b, 0)
        const filesCount = files.length
        const averagePerFile = filesCount ? Math.round(totalSegments / filesCount) : 0
        return { filesCount, totalSegments, averagePerFile }
    }

    return {
        state,
        chooseEditFile,
        filesForChoose: state.files,
        formatDate,
        truncateFileName,
        backPage: () => navigate('/'),
        formatBytes,
        getFileStats,
        getGlobalStats
    }
}