import { ArrowLeft, Download, Edit3 } from "lucide-react";
import { useFunctions } from "./Functions";
import SegmentContainer from "../../organism/SegmentContainer";
import { useMemo, useRef, useState } from "react";
import { useFilesUploadsContext } from "../../../context/FileUploads/utils";
import { usePagination } from "../../../hooks/usePagination";
import type { ErrorFilterKey } from "../../../hooks/usePagination";
import LoadingOverlay from "../../organism/LoadingOverlay";
import ErrorFilter from "../../organism/ErrorFilter";


const EditSegments = () => {
    const { back, segments, typeErrors } = useFunctions()
    const [filters, setFilters] = useState<ErrorFilterKey[]>([])
    const perPage = 50
    const { nextPage, prevPage, currentView, loading, nextLoadCount, prevLoadCount, binarySearch } = usePagination(perPage, segments, filters)
    const [state] = useFilesUploadsContext()
    const numforGoToRef = useRef<HTMLInputElement>(null)
    

    const goToSegment = async (id: number) => {

        const segment = document.querySelector(`#seg-${id}`);

        if (segment) {

            segment.scrollIntoView({behavior: 'smooth', block: 'center'});
        
        } else {

            if (!binarySearch(id)) {

                alert(`O segmento ${id} não está disponível com os filtros atuais aplicados.`);
                
                return;
            }

            let index = 0

            let result = 0

            while (result < id) {
                
                result += 50

                index++
            }
            
            nextPage(index - 2)
            
            // Aguardar a transição ser concluída antes de procurar o segmento
            const waitForSegment = () => {
                return new Promise<void>((resolve) => {
                    const checkSegment = () => {
                        console.log("Caçando");
                        
                        const segment = document.querySelector(`#seg-${id}`);
                        if (segment) {
                            resolve();
                        } else {
                            // Verificar novamente após um pequeno delay
                            setTimeout(checkSegment, 50);
                        }
                    };
                    checkSegment();
                });
            };

            try {
                await waitForSegment();
                // Agora que o segmento está disponível, fazer o scroll
                const segment = document.querySelector(`#seg-${id}`);
                if (segment) {
                    segment.scrollIntoView({behavior: 'smooth', block: 'center'});
                }
            } catch (error) {
                console.error('Erro ao aguardar segmento:', error);
            }

        }

    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        
        const numforGoTo = Number(numforGoToRef.current?.value)
    
        if (event.key === "Enter" && numforGoTo && numforGoTo <= segments.length) {

            goToSegment(numforGoTo)
            
        } else if (numforGoTo > segments.length ) {

            alert("Possuimos " + segments.length + " segmentos, você esta buscando por: " + numforGoTo)
        }
    }

    const download = () => {
        const segments = Array.isArray(state.editValue?.content) ? state.editValue?.content : []
        const changedSegments = segments.filter(s => s.changed) || []

        console.log(changedSegments);

        const jsonString = JSON.stringify(changedSegments, null, 2);

        const blob = new Blob([jsonString], { type: 'application/json' });

        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
      
        a.href = url;

        a.download = "changedSegments - " + state.editValue?.file.name|| "edited_segments.json"; 
        
        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);

        URL.revokeObjectURL(url);
        
    }
    
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

    if (currentView?.segments.length === 0) {
        return (
            <div>
                Carregando...
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 relative">
            
            <button onClick={back} className="fixed top-6 left-6 z-10 flex bg-white text-gray-600 border-2 border-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 items-center space-x-2 shadow-sm">
                <ArrowLeft size={16}/>
                <span>Voltar</span>
            </button>
            <div className="fixed top-6 right-6 z-10 flex bg-white text-gray-600 border-2 border-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 items-center space-x-2 shadow-sm">
                <input type="number" placeholder="N°" ref={numforGoToRef} onKeyDown={handleKeyDown} className="w-12 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none outline-0" name="" id="" />
            </div>

            <div className="cursor-pointer fixed top-20 bg-white right-6 z-10 flex text-gray-600 border-2 border-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 items-center space-x-2 shadow-sm">
                <button onClick={download} title="Baixar segmentos editados" className="flex gap-1 cursor-pointer">Download <Download /> </button>
            </div>
            <input type="text" />

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Segmentos</h1>
                    <p className="text-gray-600">
                        {useMemo(() => {
                            if (!filters.length) return segments.length
                            return segments.filter(s => Array.isArray(s.errors) && s.errors.some(e => filters.includes(e.type))).length
                        }, [segments, filters])} segmento{useMemo(() => {
                            if (!filters.length) return segments.length
                            return segments.filter(s => Array.isArray(s.errors) && s.errors.some(e => filters.includes(e.type))).length
                        }, [segments, filters]) !== 1 ? 's' : ''} para edição
                    </p>
                </div>

                {/* Filtro de Erros */}
                <div className="mb-6 flex justify-center">
                    <ErrorFilter 
                        segments={segments} 
                        errorTypes={typeErrors}
                        onApply={setFilters} 
                    />
                </div>

                <div className="space-y-4 relative">
                    {prevLoadCount > 0 && (
                        <button 
                        className="flex w-[100%] bg-white text-blue-600 px-4 py-2 border-2 border-blue-600 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 items-center justify-center space-x-2" 
                        onClick={prevPage} 
                        >
                            Carregar mais {prevLoadCount}
                        </button>
                    )}
                    {currentView && currentView.segments.map((segment) => (
                        <SegmentContainer key={segment.id} segment={segment} onNextPage={() => nextPage()} />
                    )
                    )}
                    <LoadingOverlay open={Boolean(loading)} label="Carregando" />
                    {nextLoadCount > 0 && (
                        <button 
                        className="flex w-[100%] bg-white text-blue-600 px-4 py-2 border-2 border-blue-600 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 items-center justify-center space-x-2" 
                        onClick={() => nextPage()} 
                        >
                            Carregar mais {nextLoadCount}
                        </button>
                    )}
                </div>


                

                {/* Footer Stats */}
                <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <div className="text-xl font-bold text-blue-600 mb-1">
                                {useMemo(() => {
                                    if (!filters.length) return segments.length
                                    return segments.filter(s => Array.isArray(s.errors) && s.errors.some(e => filters.includes(e.type))).length
                                }, [segments, filters])}
                            </div>
                            <div className="text-sm text-gray-600">Filtrados</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-green-600 mb-1">
                                {useMemo(() => {
                                    const base = !filters.length ? segments : segments.filter(s => Array.isArray(s.errors) && s.errors.some(e => filters.includes(e.type)))
                                    return base.filter(s => s.status === 'confirmed' || s.status === 'MT').length
                                }, [segments, filters])}
                            </div>
                            <div className="text-sm text-gray-600">Confirmados</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-red-600 mb-1">
                                {useMemo(() => {
                                    const base = !filters.length ? segments : segments.filter(s => Array.isArray(s.errors) && s.errors.some(e => filters.includes(e.type)))
                                    return base.filter(s => Array.isArray(s.errors) && s.errors.length > 0).length
                                }, [segments, filters])}
                            </div>
                            <div className="text-sm text-gray-600">Com Erros</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-yellow-600 mb-1">
                                {useMemo(() => {
                                    const base = !filters.length ? segments : segments.filter(s => Array.isArray(s.errors) && s.errors.some(e => filters.includes(e.type)))
                                    return base.filter(s => s.status === 'new' || s.status === 'review').length
                                }, [segments, filters])}
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