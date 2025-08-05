import { Lock, Unlock, CheckCircle, AlertCircle, Clock } from "lucide-react";

import type { Segment } from '../../../context/FileUploads/types/context';
import { useFunctions } from "./useFunctions";
import type { filterProps } from "../../pages";

interface SegmentEditorProps {
    segment: Segment,
    filter: filterProps
}

const SegmentEditor = ({segment, filter}: SegmentEditorProps) => {

    const {getMatchColor, getStatusColor} = useFunctions()
    
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <CheckCircle className="w-4 h-4" />;
            case 'translated':
                return <CheckCircle className="w-4 h-4" />;
            case 'review':
                return <AlertCircle className="w-4 h-4" />;
            case 'new':
                return <Clock className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    if (segment.isLocked && !filter.viewLocked) {
        return null
    }
    
    return (
        <div
            key={segment.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-100 hover:border-gray-200"
        >
            {/* Header do Segmento */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    {/* Numeração */}
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 text-sm font-bold rounded-full">
                        {segment.id}
                    </div>
                    
                    {/* Status */}
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(segment.status)}`}>
                        {getStatusIcon(segment.status)}
                        <span className="ml-1 capitalize">{segment.status}</span>
                    </span>

                    {/* Match Status */}
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getMatchColor(segment.statusMatch)}`}>
                        {segment.statusMatch}
                    </span>
                </div>

                {/* Lock Status */}
                <div className="flex items-center space-x-2">
                    {segment.isLocked ? (
                        <div className="flex items-center text-red-600">
                            <Lock className="w-4 h-4 mr-1" />
                            <span className="text-xs font-medium">Bloqueado</span>
                        </div>
                    ) : (
                        <div className="flex items-center text-green-600">
                            <Unlock className="w-4 h-4 mr-1" />
                            <span className="text-xs font-medium">Editável</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Conteúdo do Segmento */}
            <div className="space-y-4">
                {/* Source */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Texto Original (Source)
                    </label>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <p className="text-gray-800 leading-relaxed">{segment.source}</p>
                    </div>
                </div>

                {/* Target */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tradução (Target)
                    </label>
                    {segment.isLocked ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-gray-800 leading-relaxed">
                                {segment.target || (
                                    <span className="text-gray-500 italic">Sem tradução disponível</span>
                                )}
                            </p>
                        </div>
                    ) : (
                        <textarea
                            className="w-full bg-white border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                            rows={3}
                            defaultValue={segment.target}
                            placeholder="Digite a tradução aqui..."
                        />
                    )}
                </div>
            </div>

            {/* Actions */}
            {!segment.isLocked && (
                <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                    <div className="flex space-x-2">
                        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                            Descartar
                        </button>
                        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                            Salvar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SegmentEditor;

// const parseToStructuredArray = str =>
//     [...str.matchAll(/<txt>(.*?)<\/txt>|<tag\s+value="(\d+)"\s*\/>/g)].map(match =>
//       match[1]
//         ? { text: match[1] }
//         : { tag: { value: match[2] } }
//     );