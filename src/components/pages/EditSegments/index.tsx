import { ArrowLeft, Download, Edit3, FileSpreadsheet } from "lucide-react";
import { useFunctions } from "./Functions";
import SegmentContainer from "../../organism/SegmentContainer";
import { useRef, useState } from "react";
import { useFilesUploadsContext } from "../../../context/FileUploads/utils";
import { usePagination } from "../../../hooks/usePagination";
import type { ErrorFilterKey } from "../../../hooks/usePagination";
import LoadingOverlay from "../../organism/LoadingOverlay";
import FilterSidebar from "../../organism/FilterSidebar";
import ErrorFilterSidebar from "../../organism/ErrorFilterSidebar";
import StatusFilterSidebar from "../../organism/StatusFilterSidebar";
import { useGroups } from "../../../context/Groups";
import * as XLSX from 'xlsx';


const EditSegments = () => {
    const { back, segments, typeErrors, typeStatus } = useFunctions()
    const [filterErrors, setFilterErrors] = useState<ErrorFilterKey[]>([])
    const [filterStatus, setFilterStatus] = useState<string[]>([])
    const [selectedGroupId] = useState<string | null>(null)
    const perPage = 50
    const { nextPage, prevPage, currentView, loading, nextLoadCount, prevLoadCount, binarySearch, filteredSegments } = usePagination(perPage, segments, filterErrors, selectedGroupId, filterStatus)
    const [state] = useFilesUploadsContext()
    const {state: groupsState} = useGroups()
    const numforGoToRef = useRef<HTMLInputElement>(null)
    
    const [selectedSegments, setSelectedSegments] = useState<Set<number>>(new Set())
    
    // Funções para gerenciar seleção
    const toggleSegmentSelection = (segmentId: number) => {
        setSelectedSegments(prev => {
            const newSet = new Set(prev)
            if (newSet.has(segmentId)) {
                newSet.delete(segmentId)
            } else {
                newSet.add(segmentId)
            }
            return newSet
        })
    }



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
                
                result += perPage

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

    const downloadFile = (blob: Blob) => {


        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
      
        a.href = url;

        a.download = "changedSegments - " + state.editValue?.file.name|| "edited_segments.json"; 
        
        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);

        URL.revokeObjectURL(url);

    }

    const download = () => {
        const segments = Array.isArray(state.editValue?.content) ? state.editValue?.content : []
        const changedSegments = segments.filter(s => s.changed) || []

        const jsonString = JSON.stringify(changedSegments, null, 2);

        const blob = new Blob([jsonString], { type: 'application/json' });
        downloadFile(blob)
        
    }

    const saveWork = () => {
        
        const object = {
            groups: groupsState.groups,
            segments: Array.isArray(state.editValue?.content) ? state.editValue?.content : [],
        }

        const jsonString = JSON.stringify(object, null, 2);

        const blob = new Blob([jsonString], { type: 'application/json' });

        downloadFile(blob)

    }

    const exportToExcel = () => {
        // Filtrar apenas os segmentos selecionados
        const allSegments = Array.isArray(state.editValue?.content) ? state.editValue?.content : [];
        const selectedSegmentsData = allSegments.filter(segment => selectedSegments.has(segment.id));
        
        // Preparar dados para o Excel
        const excelData = selectedSegmentsData.map(segment => ({
            'ID': segment.id,
            'Source': segment.source,
            'Translation': segment.translation,
            'Status': segment.status || 'N/A',
            'Errors': Array.isArray(segment.errors) ? segment.errors.map(e => e.message).join(', ') : 'Nenhum'
        }));
        
        // Criar workbook e worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);
        
        // Adicionar worksheet ao workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Segmentos Selecionados');
        
        // Gerar arquivo Excel
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        // Download do arquivo
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `segmentos_selecionados_${new Date().toISOString().split('T')[0]}.xlsx`;
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
            <div className="cursor-pointer fixed top-32 bg-white right-6 z-10 flex text-gray-600 border-2 border-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 items-center space-x-2 shadow-sm">
                <button onClick={saveWork} title="Baixar estado atual" className="flex gap-1 cursor-pointer">Salvar trabalho <Download /> </button>
            </div>
            
            {/* Botão Exportar Excel - aparece apenas quando há segmentos selecionados */}
            {selectedSegments.size > 0 && (
                <div className="cursor-pointer fixed top-44 bg-white right-6 z-10 flex text-gray-600 border-2 border-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 items-center space-x-2 shadow-sm">
                    <button onClick={exportToExcel} title={`Exportar ${selectedSegments.size} segmento(s) selecionado(s) para Excel`} className="flex gap-1 cursor-pointer">
                        Exportar Excel ({selectedSegments.size}) <FileSpreadsheet />
                    </button>
                </div>
            )}

            <input type="text" />

            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Segmentos {selectedGroupId ? `- Grupo: ${groupsState.groups.find(g => g.id === selectedGroupId)?.name}` : ''}</h1>
                    <p className="text-gray-600">
                        {filteredSegments.length} segmento{filteredSegments.length !== 1 ? 's' : ''} para edição
                    </p>
                </div>

                {/* Layout principal com flex */}
                <div className="flex gap-6">
                    {/* Container dos segmentos */}
                    <div className="flex-1 space-y-4 relative">
                    {prevLoadCount > 0 && (
                        <button 
                        className="flex w-[100%] bg-white text-blue-600 px-4 py-2 border-2 border-blue-600 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 items-center justify-center space-x-2" 
                        onClick={prevPage} 
                        >
                            Carregar mais {prevLoadCount}
                        </button>
                    )}
                    {currentView && currentView.segments.map((segment) => (
                        <SegmentContainer 
                            key={segment.id} 
                            segment={segment} 
                            onNextPage={() => nextPage()} 
                            fileName={state.editValue?.file.name}
                            isSelected={selectedSegments.has(segment.id)}
                            onToggleSelection={() => toggleSegmentSelection(segment.id)}
                        />
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

                    {/* Lateral de filtros */}
                    <div className="w-80 flex-shrink-0">
                        <FilterSidebar>
                            <ErrorFilterSidebar 
                                filteredSegments={filteredSegments}
                                errorTypes={typeErrors}
                                onApply={setFilterErrors} 
                            />
                            <StatusFilterSidebar 
                                filteredSegments={filteredSegments}
                                statusTypes={typeStatus}
                                onApply={setFilterStatus} 
                            />
                        </FilterSidebar>
                    </div>
                </div>

                {/* Footer Stats */}
                <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <div className="text-xl font-bold text-blue-600 mb-1">
                                {filteredSegments.length}
                                
                            </div>
                            <div className="text-sm text-gray-600">Filtrados</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-green-600 mb-1">
                                {filteredSegments.filter(s => s.status === 'confirmed' || s.status === 'MT').length}
                            </div>
                            <div className="text-sm text-gray-600">Confirmados</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-red-600 mb-1">
                                {filteredSegments.filter(s => Array.isArray(s.errors) && s.errors.length > 0).length}
                            </div>
                            <div className="text-sm text-gray-600">Com Erros</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-yellow-600 mb-1">
                                {filteredSegments.filter(s => s.status === 'new' || s.status === 'review').length}
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