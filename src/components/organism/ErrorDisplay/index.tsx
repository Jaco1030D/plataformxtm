import React, { useMemo, useState, useEffect } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, CheckCircle, Hash, Tag, DollarSign, X } from 'lucide-react';
import type { MigratedSegment, ValidationMessage } from '../../../context/FileUploads/types/context';
import { getFakeErrors, saveFakeError } from '../../../utils/localStorage';

interface ErrorDisplayProps {
    segment: MigratedSegment;
    fileName?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = React.memo(({ segment, fileName }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hiddenErrors, setHiddenErrors] = useState<Set<string>>(new Set());

    const iconFor = (key: string) => {
        if (key.toLowerCase().includes('decimal')) return <Hash className="w-4 h-4" />
        if (key.toLowerCase().includes('number')) return <DollarSign className="w-4 h-4" />
        if (key.toLowerCase().includes('symbol')) return <AlertTriangle className="w-4 h-4" />
        if (key.toLowerCase().includes('tag')) return <Tag className="w-4 h-4" />
        return <CheckCircle className="w-4 h-4" />
    }

    const hideError = (error: ValidationMessage) => {
        const errorKey = `${error.type}-${error.message}`;

        saveFakeError(segment.id, errorKey, error, fileName || "");
        
        setHiddenErrors(prev => new Set([...prev, errorKey]));
    }

    const restoreAllErrors = () => {
        setHiddenErrors(new Set());
    }

    // Carregar falsos erros salvos no localStorage
    useEffect(() => {
        if (!fileName) return;
        
        const savedFakeErrors = getFakeErrors(fileName);
        const segmentFakeErrors = savedFakeErrors.filter(fakeErr => fakeErr.segmentId === segment.id);
        
        // Criar chaves para os erros que devem ser ocultos
        const errorKeys = segmentFakeErrors.map(fakeErr => 
            fakeErr.errorKey
        );
        
        if (errorKeys.length > 0) {
            setHiddenErrors(new Set(errorKeys));
        }
    }, []);

    const errorsByType = useMemo(() => {
        const map = new Map<string, ValidationMessage[]>();
        const list = Array.isArray(segment.errors) ? segment.errors : [];
        
        // Filtrar erros que não estão ocultos
        const visibleErrors = list.filter(err => {
            if (!err || typeof err.type !== 'string') return false;
            const errorKey = `${err.type}-${err.message}`;
            return !hiddenErrors.has(errorKey);
        });
        
        for (const err of visibleErrors) {
            const key = err.type;
            const arr = map.get(key) || [];
            arr.push(err);
            map.set(key, arr);
        }
        return map;
    }, [segment.errors, hiddenErrors]);

    const totalErrors = useMemo(() => {
        const list = Array.isArray(segment.errors) ? segment.errors : [];
        const visibleErrors = list.filter(err => {
            if (!err || typeof err.type !== 'string') return false;
            const errorKey = `${err.type}-${err.message}`;
            return !hiddenErrors.has(errorKey);
        });
        return visibleErrors.length;
    }, [segment.errors, hiddenErrors]);

    if (totalErrors === 0) return null;

    return (
        <div className="mt-1">
            {/* Botão de Abertura compacto */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-2 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors duration-200"
            >
                <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-3 h-3 text-red-600" />
                    <span className="text-xs font-medium text-red-800">
                        {totalErrors} erro{totalErrors !== 1 ? 's' : ''}
                    </span>
                </div>
                <div className="flex items-center space-x-1">
                    <span className="text-xs text-red-600 bg-red-200 px-1 py-0.5 rounded">
                        {errorsByType.size}
                    </span>
                    {hiddenErrors.size > 0 && (
                        <button
                            onClick={restoreAllErrors}
                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                            title="Restaurar erros ocultos"
                        >
                            ({hiddenErrors.size})
                        </button>
                    )}
                    {isOpen ? (
                        <ChevronUp className="w-3 h-3 text-red-600" />
                    ) : (
                        <ChevronDown className="w-3 h-3 text-red-600" />
                    )}
                </div>
            </button>

            {/* Dropdown de Erros sobreposto */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                    <div className="p-2 space-y-1">
                        {Array.from(errorsByType.entries()).map(([key, list]) => (
                            <div key={key} className={`p-2 rounded border bg-red-50 border-red-200`}>
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center space-x-1">
                                        <div className="text-red-600">
                                            {iconFor(key)}
                                        </div>
                                        <span className={`text-xs font-medium text-red-700`}>
                                            {key}
                                        </span>
                                    </div>
                                    <span className={`text-xs font-bold px-1 py-0.5 rounded text-red-700 bg-white`}>
                                        {list.length}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    {list.map((err, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-xs text-gray-700 bg-white p-1 rounded border-l-2 border-gray-300 group hover:bg-gray-50 transition-colors">
                                            <span className="flex-1 truncate">{err.message}</span>
                                            <button
                                                onClick={() => hideError(err)}
                                                className="ml-1 p-0.5 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                                title="Marcar como falso positivo"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
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

export default ErrorDisplay;
