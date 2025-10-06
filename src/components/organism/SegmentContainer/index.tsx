import InputDiv from '../../Molecules/InputDiv';
import InfosDisplay from '../InfosDisplay';
import SegmentCheckbox from '../../Atoms/SegmentCheckbox';
import type { MigratedSegment, ValidationMessage } from "../../../context/FileUploads/types/context";
import { useFilesUploadsContext } from '../../../context/FileUploads/utils';
import { useTags } from '../../../hooks/useTags';

const SegmentContainer = ({segment, onNextPage, fileName, isSelected, onToggleSelection}: {
    segment: MigratedSegment, 
    onNextPage?: () => void, 
    fileName?: string,
    isSelected?: boolean,
    onToggleSelection?: () => void
}) => {    
    const {prepareSegmentTextsWithTags} = useTags()
    const { sourceHTML, targetHTML, tagsUsed } = prepareSegmentTextsWithTags({source: segment.source, translation: segment.translation})
    const [, actions] = useFilesUploadsContext()
    
    const handleAddFakeInfo = (segmentId: number, fakeInfo: ValidationMessage) => {
        actions.addFakeInfo({ segmentId, fakeInfo });
        console.log(segmentId, fakeInfo);
        
    };
    
    
    return (
        <div 
            id={`seg-${segment.id}`} 
            className={`segments_cards rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 border relative ${
                segment.changed 
                    ? 'bg-green-50 border-green-300 hover:border-green-400' 
                    : 'bg-white border-gray-100 hover:border-gray-200'
            }`}
        >
            {/* Checkbox de Seleção */}
            {onToggleSelection && (
                <div className="absolute top-3 right-3">
                    <SegmentCheckbox 
                        isSelected={isSelected || false} 
                        onToggle={onToggleSelection} 
                    />
                </div>
            )}

            {/* Header compacto */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                    {/* Numeração */}
                    <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                        {segment.id}
                    </div>
                    
                    {/* Status */}
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                        segment.status === 'confirmed' ? 'bg-green-100 text-green-800 border-green-200' :
                        segment.status === 'translated' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        segment.status === 'review' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        'bg-gray-100 text-gray-800 border-gray-200'
                    }`}>
                        {segment.status}
                    </span>
                </div>

                {/* Indicador de alteração */}
                {segment.changed && (
                    <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        <span>✓</span>
                        <span>Alterado</span>
                    </div>
                )}
            </div>

            {/* Layout em colunas estilo planilha */}
            <div className="grid grid-cols-5 gap-3">
                {/* Coluna 1: Source (40%) */}
                <div className="col-span-2">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Source
                        </label>
                        <div className="bg-gray-50 border border-gray-200 rounded p-2 min-h-[60px]">
                            <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{__html: sourceHTML}} />
                        </div>
                    </div>
                </div>

                {/* Coluna 2: Target (40%) */}
                <div className="col-span-2">
                    <div>
                        <div className="relative">
                            <div 
                                ref={(el) => {
                                    if (el) {
                                        const inputDiv = el.querySelector('[contenteditable="true"]') as HTMLDivElement;
                                        if (inputDiv) {
                                            inputDiv.className = 'w-full min-h-[60px] bg-white border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none';
                                        }
                                    }
                                }}
                            >
                                <InputDiv segment={segment} targetValue={{tratedText: targetHTML, tagsUsed}} onNextPage={onNextPage} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Coluna 3: Erros e Validações (20%) */}
                <div className="col-span-1">
                    <div className="space-y-2">
                        {/* Erros */}
                        {segment.errors.length > 0 && !segment.changed && (
                            <div className="relative">
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Erros
                                </label>
                                <div className="min-h-[60px]">
                                    <InfosDisplay 
                                        segment={segment} 
                                        fileName={fileName}
                                        infoTypes="errors"
                                        colorScheme={{
                                            primary: 'text-red-600',
                                            secondary: 'bg-red-200',
                                            background: 'bg-red-50',
                                            border: 'border-red-200',
                                            text: 'text-red-800',
                                            icon: 'text-red-600'
                                        }}
                                        title="Erro"
                                        onAddFakeInfo={handleAddFakeInfo}
                                    />
                                </div>
                            </div>
                        )}
                        
                        {/* Validações */}
                        <div className="relative">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Validações
                            </label>
                            <div className="min-h-[60px]">
                                <InfosDisplay 
                                    segment={segment} 
                                    fileName={fileName}
                                    infoTypes="validations"
                                    colorScheme={{
                                        primary: 'text-green-600',
                                        secondary: 'bg-green-200',
                                        background: 'bg-green-50',
                                        border: 'border-green-200',
                                        text: 'text-green-800',
                                        icon: 'text-green-600'
                                    }}
                                    title="Validação"
                                    onAddFakeInfo={handleAddFakeInfo}
                                />
                            </div>
                        </div>
                        
                        {/* Fake Infos */}
                        {segment.fakeInfos && segment.fakeInfos.length > 0 && (
                            <div className="relative">
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Informações Ocultas
                                </label>
                                <div className="min-h-[60px]">
                                    <InfosDisplay 
                                        segment={segment} 
                                        fileName={fileName}
                                        infoTypes="fakeInfos"
                                        colorScheme={{
                                            primary: 'text-orange-600',
                                            secondary: 'bg-orange-200',
                                            background: 'bg-orange-50',
                                            border: 'border-orange-200',
                                            text: 'text-orange-800',
                                            icon: 'text-orange-600'
                                        }}
                                        title="Informação Ocultada"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SegmentContainer;