import React, { useEffect, useRef, useState } from 'react';
import { Filter, X, CheckCircle, AlertTriangle, Hash, Tag, DollarSign } from 'lucide-react';
import type { MigratedSegment } from '../../../context/FileUploads/types/context';
import type { ErrorFilterKey } from '../../../hooks/usePagination';

interface ErrorFilterProps {
    filteredSegments: MigratedSegment[]; // ✅ Segmentos já filtrados por grupo
    errorTypes: string[];
    onApply: (filters: ErrorFilterKey[]) => void;
}

// Removido tipo antigo baseado em propriedades que não existem mais

const ErrorFilter: React.FC<ErrorFilterProps> = ({ filteredSegments, errorTypes, onApply }) => {
    const [selectedFilters, setSelectedFilters] = useState<ErrorFilterKey[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null)

    const iconFor = (key: string) => {
        if (key.includes('decimal')) return <Hash className="w-4 h-4" />
        if (key.includes('number')) return <DollarSign className="w-4 h-4" />
        if (key.includes('symbol')) return <AlertTriangle className="w-4 h-4" />
        if (key.includes('tag')) return <Tag className="w-4 h-4" />
        return <CheckCircle className="w-4 h-4" />
    }

    // Calcular estatísticas de erros baseado nos segmentos filtrados por grupo
    const getErrorStats = () => {
        const stats = errorTypes.map(key => {
            const count = filteredSegments.filter(segment => 
                Array.isArray(segment.errors) && segment.errors.some(err => err.type === key)
            ).length;
            return { key, label: key, icon: iconFor(key), color: 'text-gray-700', count } as any;
        })
        return stats;
    };

    const errorStats = getErrorStats();

    const toggleFilter = (filterKey: ErrorFilterKey) => {
        setSelectedFilters(prev => 
            prev.includes(filterKey) 
                ? prev.filter(f => f !== filterKey)
                : [...prev, filterKey]
        );
    };

    const clearAllFilters = () => {
        setSelectedFilters([]);
    };

    const getTotalFilteredCount = () => {
        if (selectedFilters.length === 0) return filteredSegments.length;
        
        const filtered = filteredSegments.filter(segment => {
            return Array.isArray(segment.errors) && segment.errors.some(err => selectedFilters.includes(err.type));
        });
        
        return filtered.length;
    };

    // Fechar ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!isOpen) return;
            const target = event.target as Node;
            if (containerRef.current && !containerRef.current.contains(target)) {
                setIsOpen(false)
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen])

    return (
        <div ref={containerRef} className="relative">
            {/* Botão de Abertura */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
            >
                <Filter className="w-4 h-4" />
                <span>Filtrar Erros</span>
                {selectedFilters.length > 0 && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                        {selectedFilters.length}
                    </span>
                )}
            </button>

            {/* Dropdown de Filtros */}
            {isOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 transform mt-2 w-[44rem] bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-4">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Filtrar por Erros</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Estatísticas */}
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600 mb-2">
                                <strong>{getTotalFilteredCount()}</strong> de <strong>{filteredSegments.length}</strong> segmentos
                            </div>
                            {selectedFilters.length > 0 && (
                                <button
                                    onClick={clearAllFilters}
                                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                                >
                                    Limpar todos os filtros
                                </button>
                            )}
                        </div>

                        {/* Lista de Filtros em colunas (3 itens por coluna) */}
                        {(() => {
                            const chunk = <T,>(arr: T[], size: number): T[][] => {
                                const res: T[][] = [];
                                for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
                                return res;
                            };
                            const columns = chunk(errorStats, 3);
                            return (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {columns.map((col, colIdx) => (
                                        <div key={colIdx} className="flex flex-col space-y-3">
                                            {col.map((errorType) => (
                                                <label
                                                    key={errorType.key}
                                                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedFilters.includes(errorType.key as ErrorFilterKey)}
                                                        onChange={() => toggleFilter(errorType.key as ErrorFilterKey)}
                                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <div className={`${errorType.color}`}>
                                                        {errorType.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {errorType.label}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {errorType.count} segmento{errorType.count !== 1 ? 's' : ''} com erro
                                                        </div>
                                                    </div>
                                                    {errorType.count > 0 && (
                                                        <div className="text-xs font-bold text-gray-600">
                                                            {errorType.count}
                                                        </div>
                                                    )}
                                                </label>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            );
                        })()}

                        {/* Footer */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex justify-between items-center text-sm text-gray-600">
                                <span>
                                    {selectedFilters.length === 0 ? 'Mostrando todos os segmentos' : `${selectedFilters.length} filtro${selectedFilters.length !== 1 ? 's' : ''} ativo${selectedFilters.length !== 1 ? 's' : ''}`}
                                </span>
                                <button
                                    onClick={() => { onApply(selectedFilters); setIsOpen(false); }}
                                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Aplicar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ErrorFilter;
