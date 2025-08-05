import { FileText, ArrowLeft } from "lucide-react";
import { useFunctions } from "./Functions";
import CardFileForChoose from "../../organism/CardFileForChoose";

const AllFiles = () => {
    const {state, backPage} = useFunctions() // Substitua por useFunctions()

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
                        <CardFileForChoose file={file} key={index} />
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