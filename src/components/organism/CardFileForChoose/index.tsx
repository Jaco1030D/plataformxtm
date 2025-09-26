import { FileText, Calendar, Layers, HardDrive, ArrowRight, Loader } from "lucide-react";
import { useFunctions } from "./useFunctions";
import type { FileWithSegment } from "../../../context/FileUploads/types/context";

interface CardFileForChooseProps {
    file: FileWithSegment
}

const CardFileForChoose = ({file}: CardFileForChooseProps) => {
    const  {chooseEditFile, truncateFileName, getSegmentsStats, loading} = useFunctions()
    const stats = getSegmentsStats(file)
    return (
        <div
            className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 w-full max-w-sm border border-gray-100 hover:border-gray-200 group cursor-pointer transform hover:-translate-y-1"
        >
            {/* Header do Card */}
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors duration-200">
                    <FileText className="w-8 h-8 text-yellow-500" />
                </div>
                <div className="text-right">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Processado
                    </span>
                </div>
            </div>

            {/* Nome do Arquivo */}
            <div className="mb-4">
                <h3 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors duration-200">
                    {truncateFileName(file.file.name, 25)}
                </h3>
                <p className="text-sm text-gray-500 font-mono">
                    JSON
                </p>
            </div>

            {/* Estatísticas */}
            <div className="space-y-3">
                {/* Tamanho */}
                <div className="flex items-center text-sm text-gray-600">
                    <HardDrive className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">Tamanho:</span>
                    <span className="ml-auto font-mono">{file.size}</span>
                </div>

                {/* Segmentos */}
                <div className="flex items-center text-sm text-gray-600">
                    <Layers className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">Segmentos editáveis:</span>
                    <span className="ml-auto">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                            {stats.editable}
                        </span>
                    </span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                    <Layers className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">Segmentos bloqueados:</span>
                    <span className="ml-auto">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                            {stats.lockeds}
                        </span>
                    </span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                    <Layers className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">Segmentos Totais:</span>
                    <span className="ml-auto">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-grenn-600 text-xs font-bold rounded-full">
                            {stats.total}
                        </span>
                    </span>
                </div>

                {/* Data */}
                <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">Extraído:</span>
                </div>
                <div className="text-xs text-gray-500 font-mono ml-6"/>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
                <button onClick={() => chooseEditFile(file)} className="w-full flex bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 items-center justify-center space-x-2">
                    <span>Editar Segmentos</span>
                    
                    {loading ? <Loader size={14}/> : <ArrowRight size={14}/>}
                </button>
            </div>
        </div>
    );
};

export default CardFileForChoose;