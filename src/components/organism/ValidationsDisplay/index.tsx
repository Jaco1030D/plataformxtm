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
        <div className="mt-1">
            {/* Botão de Abertura compacto */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded hover:bg-green-100 transition-colors duration-200"
            >
                <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span className="text-xs font-medium text-green-800">
                        {totalValidations} validação{totalValidations !== 1 ? 'ões' : ''}
                    </span>
                </div>
                <div className="flex items-center space-x-1">
                    <span className="text-xs text-green-600 bg-green-200 px-1 py-0.5 rounded">
                        {validationsByType.size}
                    </span>
                    {isOpen ? (
                        <ChevronUp className="w-3 h-3 text-green-600" />
                    ) : (
                        <ChevronDown className="w-3 h-3 text-green-600" />
                    )}
                </div>
            </button>

            {/* Dropdown de Validações sobreposto */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                    <div className="p-2 space-y-1">
                        {Array.from(validationsByType.entries()).map(([key, list]) => (
                            <div key={key} className={`p-2 rounded border bg-green-50 border-green-200`}>
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center space-x-1">
                                        <div className="text-green-600">
                                            {iconFor(key)}
                                        </div>
                                        <span className={`text-xs font-medium text-green-700`}>
                                            {key}
                                        </span>
                                    </div>
                                    <span className={`text-xs font-bold px-1 py-0.5 rounded text-green-700 bg-white`}>
                                        {list.length}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    {list.map((val, idx) => (
                                        <div key={idx} className="text-xs text-gray-700 bg-white p-1 rounded border-l-2 border-green-300 truncate">
                                            {val.message}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
})

export default ValidationsDisplay;
