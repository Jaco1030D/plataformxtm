import React, { useMemo, useState } from 'react';
import { CheckCircle, ChevronDown, ChevronUp, Hash, Tag, DollarSign, Shield } from 'lucide-react';
import type { MigratedSegment, ValidationMessage } from '../../../context/FileUploads/types/context';

interface ValidationsDisplayProps {
    segment: MigratedSegment;
}

const ValidationsDisplay: React.FC<ValidationsDisplayProps> = React.memo(({ segment }) => {
    const [isOpen, setIsOpen] = useState(false);

    const iconFor = (key: string) => {
        if (key.toLowerCase().includes('decimal')) return <Hash className="w-4 h-4" />
        if (key.toLowerCase().includes('number')) return <DollarSign className="w-4 h-4" />
        if (key.toLowerCase().includes('symbol')) return <Shield className="w-4 h-4" />
        if (key.toLowerCase().includes('tag')) return <Tag className="w-4 h-4" />
        return <CheckCircle className="w-4 h-4" />
    }

    const validationsByType = useMemo(() => {
        const map = new Map<string, ValidationMessage[]>();
        const list = Array.isArray(segment.validations) ? segment.validations : [];
        for (const val of list) {
            if (!val || typeof val.type !== 'string') continue;
            const key = val.type;
            const arr = map.get(key) || [];
            arr.push(val);
            map.set(key, arr);
        }
        return map;
    }, [segment.validations]);

    const totalValidations = useMemo(() => {
        const list = Array.isArray(segment.validations) ? segment.validations : [];
        return list.length;
    }, [segment.validations]);

    if (totalValidations === 0) return null;

    return (
        <div className="mt-3">
            {/* Botão de Abertura */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors duration-200"
            >
                <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                        {totalValidations} validação{totalValidations !== 1 ? 'ões' : ''} encontrada{totalValidations !== 1 ? 's' : ''}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-xs text-green-600 bg-green-200 px-2 py-1 rounded-full">
                        {validationsByType.size} tipo{validationsByType.size !== 1 ? 's' : ''}
                    </span>
                    {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-green-600" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-green-600" />
                    )}
                </div>
            </button>

            {/* Dropdown de Validações */}
            {isOpen && (
                <div className="mt-2 space-y-2">
                    {Array.from(validationsByType.entries()).map(([key, list]) => (
                        <div key={key} className={`p-3 rounded-lg border bg-green-50 border-green-200`}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    <div className="text-green-600">
                                        {iconFor(key)}
                                    </div>
                                    <span className={`text-sm font-medium text-green-700`}>
                                        {key}
                                    </span>
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full text-green-700 bg-white`}>
                                    {list.length}
                                </span>
                            </div>
                            <div className="space-y-1">
                                {list.map((val, idx) => (
                                    <div key={idx} className="text-xs text-gray-700 bg-white p-2 rounded border-l-2 border-green-300">
                                        {val.message}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
})

export default ValidationsDisplay;
