import HeaderSegments from '../../Molecules/HeaderSegments';
import SourceInput from '../../Atoms/SourceInput';
import InputDiv from '../../Molecules/InputDiv';
import ErrorDisplay from '../ErrorDisplay';
import ValidationsDisplay from '../ValidationsDisplay';
import SegmentCheckbox from '../../Atoms/SegmentCheckbox';
import type { MigratedSegment } from "../../../context/FileUploads/types/context";
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
    
    
    return (
        <div 
            id={`seg-${segment.id}`} 
            className={`segments_cards rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border relative ${
                segment.changed 
                    ? 'bg-green-50 border-green-300 hover:border-green-400' 
                    : 'bg-white border-gray-100 hover:border-gray-200'
            }`}
        >
            {/* Checkbox de Seleção */}
            {onToggleSelection && (
                <div className="absolute top-4 right-4">
                    <SegmentCheckbox 
                        isSelected={isSelected || false} 
                        onToggle={onToggleSelection} 
                    />
                </div>
            )}

            <HeaderSegments segment={segment} />

            <div className="space-y-4">
                <SourceInput text={sourceHTML} />
                <InputDiv segment={segment} targetValue={{tratedText: targetHTML, tagsUsed}} onNextPage={onNextPage} />
                
                {/* Exibição de Erros */}
                
                {!segment.changed && <ErrorDisplay segment={segment} fileName={fileName} />}
                
                {/* Exibição de Validações */}
                <ValidationsDisplay segment={segment} />
            </div>
        
        </div>
    );
}

export default SegmentContainer;