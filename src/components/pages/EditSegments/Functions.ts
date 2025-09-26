import { useNavigate } from "react-router-dom";
import { useFilesUploadsContext } from "../../../context/FileUploads/utils";
import { allFilesRoutes } from "../../../const/routes";
import type { JSONContent } from "../../../context/FileUploads/types/context";


export const useFunctions = () => {
    const [state] = useFilesUploadsContext();
    // const [chunks, setChunks] = useState([])
    // const [loadingCreateChunk, setLoadingCreateChunk] = useState(false)
    const navigate = useNavigate()
    
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'translated':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'review':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'new':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getMatchColor = (statusMatch: string) => {
        switch (statusMatch) {
            case 'exact':
                return 'bg-green-50 text-green-700';
            case 'fuzzy':
                return 'bg-orange-50 text-orange-700';
            case 'no_match':
                return 'bg-red-50 text-red-700';
            default:
                return 'bg-gray-50 text-gray-700';
        }
    };

    // useEffect(() => {
    //     const chunkSize = 100

    //     if (state.editValue?.content?.segments && state.editValue?.content?.segments.length > 0) {
            
    //         const chunks = Array.from(
    //             { length: Math.ceil(state.editValue?.content?.segments.length / chunkSize) },
    //             (_, index) => state.editValue?.content?.segments.slice(index * chunkSize, (index + 1) * chunkSize)
    //         );

    //         console.log(
    //             chunks
    //         );
            
    //     }


    // },[])

    const createChunks = (chunkSize: number, segmentsContent: JSONContent) => {

        let chunks = null

        const segments = Array.isArray(segmentsContent) ? segmentsContent : []

        if (segments && segments.length > 0) {
            chunks = Array.from(
                { length: Math.ceil(segments.length / chunkSize) },
                (_, index) => segments.slice(index * chunkSize, (index + 1) * chunkSize)
            );
        }
        
        return chunks
    }

    return {
        getMatchColor,
        getStatusColor,
        state,
        back: () => navigate(allFilesRoutes),
        segments: (Array.isArray(state.editValue?.content) ? state.editValue?.content : []),
        typeErrors: state.editValue?.TypesErrors || [],
        createChunks,
    }
}