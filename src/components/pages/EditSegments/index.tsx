import { ArrowLeft, Edit3 } from "lucide-react";
import { useFunctions } from "./Functions";
import SegmentEditor from "../../organism/SegmentEditor";
import { useState } from "react";
import type { filterProps } from "..";

const EditSegments = () => {
    const {state, back} = useFunctions()
    const [filter, setFilter] = useState<filterProps>({
        viewLocked: true
    })
    

    const handleFilter = (prop: string) => {

        const value = filter[prop] 

        setFilter(prev => {
            const newData = {...prev, [prop]: !value}

            return newData
        })
    }
    const segments = state.editValue?.content?.segments || [];

    if (segments.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative">
                
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
                        <SegmentEditor segment={segment} key={index} filter={filter} />
                    )
                    )}
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