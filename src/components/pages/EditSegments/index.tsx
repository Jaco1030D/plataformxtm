import { ArrowLeft, Lock, Unlock, CheckCircle, AlertCircle, Clock, Edit3 } from "lucide-react";
import { useFunctions } from "./Functions";
import { useState } from "react";
import type { Segment } from "../../../context/FileUploads/types/context";

const EditSegments = () => {
    const {getMatchColor, getStatusColor, state, back} = useFunctions()
    const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null)

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

    console.log(selectedSegment);
    

    const segments = state.editValue?.content?.segments || [];

    if (segments.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
                {/* Botão Voltar */}
                <button onClick={back} className="absolute top-6 left-6 z-10 flex bg-white text-gray-600 border-2 border-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 items-center space-x-2 shadow-sm">
                    <ArrowLeft size={16}/>
                    <span>Voltar</span>
                </button>

                <div className="text-center">
                    <Edit3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum segmento encontrado</h3>
                    <p className="text-gray-500">Não há segmentos para editar neste arquivo.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 relative">
            {/* Botão Voltar - Position Absolute */}
            <button onClick={back} className="absolute top-6 left-6 z-10 flex bg-white text-gray-600 border-2 border-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 items-center space-x-2 shadow-sm">
                <ArrowLeft size={16}/>
                <span>Voltar</span>
            </button>

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Segmentos</h1>
                    <p className="text-gray-600">
                        {segments.length} segmento{segments.length !== 1 ? 's' : ''} para edição
                    </p>
                </div>

                {/* Segmentos List */}
                <div className="space-y-4">
                    {segments.map((segment, index) => (
                        <div
                            key={segment.id}
                            onClick={() => setSelectedSegment(segment)}
                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-100 hover:border-gray-200"
                        >
                            {/* Header do Segmento */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    {/* Numeração */}
                                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 text-sm font-bold rounded-full">
                                        {index + 1}
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
                    ))}
                </div>

                {/* Footer Stats */}
                <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <div className="text-xl font-bold text-blue-600 mb-1">
                                {segments.length}
                            </div>
                            <div className="text-sm text-gray-600">Total</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-green-600 mb-1">
                                {segments.filter(s => s.status === 'confirmed').length}
                            </div>
                            <div className="text-sm text-gray-600">Confirmados</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-red-600 mb-1">
                                {segments.filter(s => s.isLocked).length}
                            </div>
                            <div className="text-sm text-gray-600">Bloqueados</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-yellow-600 mb-1">
                                {segments.filter(s => s.status === 'new' || s.status === 'review').length}
                            </div>
                            <div className="text-sm text-gray-600">Pendentes</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditSegments;