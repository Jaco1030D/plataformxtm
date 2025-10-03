import React, { useState } from 'react';
import { CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { MigratedSegment } from '../../../context/FileUploads/types/context';

interface StatusFilterSidebarProps {
    filteredSegments: MigratedSegment[];
    statusTypes: string[];
    onApply: (filters: string[]) => void;
}

const StatusFilterSidebar: React.FC<StatusFilterSidebarProps> = ({
    filteredSegments,
    statusTypes,
    onApply
}) => {
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [showAllStatuses, setShowAllStatuses] = useState(false);
    
    const maxVisibleStatuses = 4;
    const visibleStatusTypes = showAllStatuses ? statusTypes : statusTypes.slice(0, maxVisibleStatuses);
    
    const handleFilterToggle = (statusType: string) => {
        setSelectedFilters(prev => {
            if (prev.includes(statusType)) {
                return prev.filter(filter => filter !== statusType);
            } else {
                return [...prev, statusType];
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
    
    const getStatusCount = (statusType: string) => {
        return filteredSegments.filter(segment => 
            segment.status === statusType
        ).length;
    };
    
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <CheckCircle className="w-4 h-4" />;
            case 'translated':
                return <CheckCircle className="w-4 h-4" />;
            case 'review':
                return <CheckCircle className="w-4 h-4" />;
            case 'new':
                return <CheckCircle className="w-4 h-4" />;
            default:
                return <CheckCircle className="w-4 h-4" />;
        }
    };
    
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'text-green-600';
            case 'translated':
                return 'text-blue-600';
            case 'review':
                return 'text-yellow-600';
            case 'new':
                return 'text-gray-600';
            default:
                return 'text-gray-600';
        }
    };
    
    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <h4 className="text-md font-medium text-gray-900">Filtrar por Status</h4>
            </div>
            
            <div className="space-y-2">
                {visibleStatusTypes.map((statusType) => {
                    const count = getStatusCount(statusType);
                    const isSelected = selectedFilters.includes(statusType);
                    
                    return (
                        <label 
                            key={statusType} 
                            className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                isSelected 
                                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleFilterToggle(statusType)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <div className="flex-1">
                                <div className={`flex items-center space-x-2 text-sm font-medium capitalize ${getStatusColor(statusType)}`}>
                                    {getStatusIcon(statusType)}
                                    <span>{statusType ? statusType.replace(/([A-Z])/g, ' $1').trim() : "N/A"}</span>
                                </div>
                                <div className="text-xs text-gray-500">
                                    {count} segmento{count !== 1 ? 's' : ''}
                                </div>
                            </div>
                        </label>
                    );
                })}
            </div>
            
            {statusTypes.length > maxVisibleStatuses && (
                <button
                    onClick={() => setShowAllStatuses(!showAllStatuses)}
                    className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                    {showAllStatuses ? (
                        <>
                            <ChevronUp className="w-4 h-4" />
                            <span>Mostrar menos</span>
                        </>
                    ) : (
                        <>
                            <ChevronDown className="w-4 h-4" />
                            <span>Mostrar todos os status ({statusTypes.length - maxVisibleStatuses} mais)</span>
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

export default StatusFilterSidebar;
