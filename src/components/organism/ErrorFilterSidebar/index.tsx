import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import type { ErrorFilterKey } from '../../../hooks/usePagination';
import type { MigratedSegment } from '../../../context/FileUploads/types/context';

interface ErrorFilterSidebarProps {
    filteredSegments: MigratedSegment[];
    errorTypes: string[];
    onApply: (filters: ErrorFilterKey[]) => void;
}

const ErrorFilterSidebar: React.FC<ErrorFilterSidebarProps> = ({
    filteredSegments,
    errorTypes,
    onApply
}) => {
    const [selectedFilters, setSelectedFilters] = useState<ErrorFilterKey[]>([]);
    const [showAllErrors, setShowAllErrors] = useState(false);
    
    const maxVisibleErrors = 4;
    const visibleErrorTypes = showAllErrors ? errorTypes : errorTypes.slice(0, maxVisibleErrors);
    
    const handleFilterToggle = (errorType: string) => {
        setSelectedFilters(prev => {
            if (prev.includes(errorType as ErrorFilterKey)) {
                return prev.filter(filter => filter !== errorType);
            } else {
                return [...prev, errorType as ErrorFilterKey];
            }
        });
    };
    
    const handleApply = () => {
        onApply(selectedFilters);
    };
    
    const handleClear = () => {
        setSelectedFilters([]);
        onApply([]);
    };
    
    const getErrorCount = (errorType: string) => {
        return filteredSegments.filter(segment => 
            Array.isArray(segment.errors) && 
            segment.errors.some(err => err.type === errorType)
        ).length;
    };
    
    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h4 className="text-md font-medium text-gray-900">Filtrar por Erros</h4>
            </div>
            
            <div className="space-y-2">
                {visibleErrorTypes.map((errorType) => {
                    const count = getErrorCount(errorType);
                    const isSelected = selectedFilters.includes(errorType as ErrorFilterKey);
                    
                    return (
                        <label 
                            key={errorType} 
                            className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                isSelected 
                                    ? 'bg-red-50 border-red-200 text-red-700' 
                                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleFilterToggle(errorType)}
                                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                            />
                            <div className="flex-1">
                                <div className="text-sm font-medium capitalize">
                                    {errorType.replace(/([A-Z])/g, ' $1').trim()}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {count} segmento{count !== 1 ? 's' : ''}
                                </div>
                            </div>
                        </label>
                    );
                })}
            </div>
            
            {errorTypes.length > maxVisibleErrors && (
                <button
                    onClick={() => setShowAllErrors(!showAllErrors)}
                    className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                    {showAllErrors ? (
                        <>
                            <ChevronUp className="w-4 h-4" />
                            <span>Mostrar menos</span>
                        </>
                    ) : (
                        <>
                            <ChevronDown className="w-4 h-4" />
                            <span>Mostrar todos os erros ({errorTypes.length - maxVisibleErrors} mais)</span>
                        </>
                    )}
                </button>
            )}
            
            <div className="flex space-x-2 pt-4 border-t border-gray-200">
                <button
                    onClick={handleApply}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                    Aplicar Filtros
                </button>
                <button
                    onClick={handleClear}
                    className="px-4 py-2 text-sm text-gray-400 cursor-pointer hover:bg-gray-100 rounded-lg hover:text-gray-800 transition-colors"
                >
                    Limpar
                </button>
            </div>
        </div>
    );
};

export default ErrorFilterSidebar;
