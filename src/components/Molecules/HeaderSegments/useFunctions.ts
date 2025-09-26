import { useNavigate } from "react-router-dom";
import { useFilesUploadsContext } from "../../../context/FileUploads/utils";
import { allFilesRoutes } from "../../../const/routes";
import { useCallback } from "react";


export const useFunctions = () => {
    const [state] = useFilesUploadsContext();
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

    const createConfig = (segmentText: string) => {

        const regex = /<tag value="(.*?)"\s*\/>/g;
        const counts: Record<string, number> = {};
        let match;

        while ((match = regex.exec(segmentText)) !== null) {

            const value = match[1];
            
            counts[value] = (counts[value] || 0) + 1
        
        }

        return counts;
        

    }

    const removeTxtTags = useCallback((input: string) => {
        let tratedText = input.replace(/<txt class="text-node">(.*?)<\/txt>/g, "$1")

        tratedText = tratedText.replace(/<txt class="text-node text-node--term">(.*?)<\/txt>/g, "<i>$1</i>")

        tratedText = tratedText.replace(/<tag value="(.*?)"\s*\/>/g, ' <span class="inline-flex items-center px-2.5 py-1 rounded border text-xs font-medium text-gray-700 border-gray-300 hover:border-gray-400 transition-colors duration-200 $1">$1</span> ');

        return tratedText
    },[])

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

    return {
        getMatchColor,
        getStatusColor,
        state,
        back: () => navigate(allFilesRoutes),
        removeTxtTags,
        createConfig
    }
}