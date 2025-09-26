import React, { useMemo, useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, CheckCircle, Hash, Tag, DollarSign } from 'lucide-react';
import type { MigratedSegment, ValidationMessage } from '../../../context/FileUploads/types/context';

interface ErrorDisplayProps {
    segment: MigratedSegment;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = React.memo(({ segment }) => {
    const [isOpen, setIsOpen] = useState(false);

    const iconFor = (key: string) => {
        if (key.toLowerCase().includes('decimal')) return <Hash className="w-4 h-4" />
        if (key.toLowerCase().includes('number')) return <DollarSign className="w-4 h-4" />
        if (key.toLowerCase().includes('symbol')) return <AlertTriangle className="w-4 h-4" />
        if (key.toLowerCase().includes('tag')) return <Tag className="w-4 h-4" />
        return <CheckCircle className="w-4 h-4" />
    }

    const errorsByType = useMemo(() => {
        const map = new Map<string, ValidationMessage[]>();
        const list = Array.isArray(segment.errors) ? segment.errors : [];
        for (const err of list) {
            if (!err || typeof err.type !== 'string') continue;
            const key = err.type;
            const arr = map.get(key) || [];
            arr.push(err);
            map.set(key, arr);
        }
        return map;
    }, [segment.errors]);

    const totalErrors = useMemo(() => {
        const list = Array.isArray(segment.errors) ? segment.errors : [];
        return list.length;
    }, [segment.errors]);

    if (totalErrors === 0) return null;

    return (
        <div className="mt-3">
            {/* Botão de Abertura */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors duration-200"
            >
                <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">
                        {totalErrors} erro{totalErrors !== 1 ? 's' : ''} encontrado{totalErrors !== 1 ? 's' : ''}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-xs text-red-600 bg-red-200 px-2 py-1 rounded-full">
                        {errorsByType.size} tipo{errorsByType.size !== 1 ? 's' : ''}
                    </span>
                    {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-red-600" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-red-600" />
                    )}
                </div>
            </button>

            {/* Dropdown de Erros */}
            {isOpen && (
                <div className="mt-2 space-y-2">
                    {Array.from(errorsByType.entries()).map(([key, list]) => (
                        <div key={key} className={`p-3 rounded-lg border bg-red-50 border-red-200`}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    <div className="text-red-600">
                                        {iconFor(key)}
                                    </div>
                                    <span className={`text-sm font-medium text-red-700`}>
                                        {key}
                                    </span>
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full text-red-700 bg-white`}>
                                    {list.length}
                                </span>
                            </div>
                            <div className="space-y-1">
                                {list.map((err, idx) => (
                                    <div key={idx} className="text-xs text-gray-700 bg-white p-2 rounded border-l-2 border-gray-300">
                                        {err.message}
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

export default ErrorDisplay;
