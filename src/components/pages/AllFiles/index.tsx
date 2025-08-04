import { FileText, Calendar, Layers, HardDrive, ArrowRight, ArrowLeft } from "lucide-react";
import { useFunctions } from "./Functions";

const AllFiles = () => {
    const {state, formatDate, truncateFileName, backPage, chooseEditFile} = useFunctions() // Substitua por useFunctions()

    if (state.filesWithSegments.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <button onClick={backPage} className="absolute cursor-pointer top-6 left-6 z-10 flex bg-white text-gray-600 border-2 border-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 items-center space-x-2 shadow-sm">
                <ArrowLeft size={16}/>
                <span>Voltar</span>
            </button>
                <div className="text-center">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum arquivo encontrado</h3>
                    <p className="text-gray-500">Faça upload de arquivos para vê-los aqui.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 relative">
            {/* Botão Voltar - Position Absolute */}
            <button onClick={backPage} className="absolute cursor-pointer top-6 left-6 z-10 flex bg-white text-gray-600 border-2 border-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 items-center space-x-2 shadow-sm">
                <ArrowLeft size={16}/>
                <span>Voltar</span>
            </button>

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Arquivos</h1>
                    <p className="text-gray-600">
                        {state.filesWithSegments.length} arquivo{state.filesWithSegments.length !== 1 ? 's' : ''} processado{state.filesWithSegments.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                    {state.filesWithSegments.map((file, index) => (
                        <div
                            key={index}
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
                                    <span className="font-medium">Segmentos:</span>
                                    <span className="ml-auto">
                                        <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                                            {file.content.metadata.totalSegments}
                                        </span>
                                    </span>
                                </div>

                                {/* Data */}
                                <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                    <span className="font-medium">Extraído:</span>
                                </div>
                                <div className="text-xs text-gray-500 font-mono ml-6">
                                    {formatDate(file.content.metadata.extractedAt)}
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <button onClick={() => chooseEditFile(file)} className="w-full flex bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 items-center justify-center space-x-2">
                                    <span>Editar Segmentos</span>
                                    <ArrowRight size={14}/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats Footer */}
                <div className="mt-12 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-6">
                        <div>
                            <div className="text-2xl font-bold text-blue-600 mb-1">
                                {state.filesWithSegments.length}
                            </div>
                            <div className="text-sm text-gray-600">Arquivos Processados</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-green-600 mb-1">
                                {state.filesWithSegments.reduce((acc, file) => acc + file.content.metadata.totalSegments, 0)}
                            </div>
                            <div className="text-sm text-gray-600">Total de Segmentos</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-purple-600 mb-1">
                                {state.filesWithSegments.length > 0 ? Math.round(state.filesWithSegments.reduce((acc, file) => acc + file.content.metadata.totalSegments, 0) / state.filesWithSegments.length) : 0}
                            </div>
                            <div className="text-sm text-gray-600">Média por Arquivo</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllFiles;