import React, { useEffect, useRef, useState } from 'react';
import { Users, X, FolderOpen } from 'lucide-react';
import type { Group } from '../../../context/Groups/types/context';

interface GroupFilterProps {
    groups: Group[];
    onApply: (groupId: string | null) => void;
}

const GroupFilter: React.FC<GroupFilterProps> = ({ groups, onApply }) => {
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const getGroupStats = () => {
        return groups.map(group => ({
            id: group.id,
            name: group.name,
            color: group.color || '#3B82F6',
            segmentCount: group.segmentIds.length,
            description: group.description
        }));
    };

    const groupStats = getGroupStats();

    const selectGroup = (groupId: string | null) => {
        setSelectedGroup(groupId);
    };

    const clearSelection = () => {
        setSelectedGroup(null);
    };

    const getSelectedGroupName = () => {
        if (!selectedGroup) return 'Todos os Grupos';
        const group = groups.find(g => g.id === selectedGroup);
        return group?.name || 'Grupo Selecionado';
    };

    const getTotalSegments = () => {
        if (!selectedGroup) {
            // Se nenhum grupo selecionado, retorna total de segmentos únicos
            const allSegmentIds = new Set();
            groups.forEach(group => {
                group.segmentIds.forEach(id => allSegmentIds.add(id));
            });
            return allSegmentIds.size;
        }
        
        const group = groups.find(g => g.id === selectedGroup);
        return group?.segmentIds.length || 0;
    };

    // Fechar ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!isOpen) return;
            const target = event.target as Node;
            if (containerRef.current && !containerRef.current.contains(target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div ref={containerRef} className="relative">
            {/* Botão de Abertura */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm"
            >
                <Users className="w-4 h-4" />
                <span>{getSelectedGroupName()}</span>
                {selectedGroup && (
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                        {getTotalSegments()}
                    </span>
                )}
            </button>

            {/* Dropdown de Grupos */}
            {isOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 transform mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-4">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Filtrar por Grupos</h3>
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
                                {!selectedGroup ? (
                                    <><strong>{getTotalSegments()}</strong> segmentos agrupados ao total</>
                                ) : (

                                    <><strong>{getTotalSegments()}</strong> segmentos no grupo selecionado</>
                                )}
                            </div>
                            {selectedGroup && (
                                <button
                                    onClick={clearSelection}
                                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                                >
                                    Mostrar todos os segmentos
                                </button>
                            )}
                        </div>

                        {/* Lista de Grupos */}
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {/* Opção "Todos os Grupos" */}
                            <label
                                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                                    !selectedGroup 
                                        ? 'bg-blue-50 border border-blue-200' 
                                        : 'hover:bg-gray-50'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="group"
                                    checked={!selectedGroup}
                                    onChange={() => selectGroup(null)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <div className="flex items-center space-x-2">
                                    <FolderOpen className="w-4 h-4 text-gray-500" />
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-900">
                                            Mostrar todos os segmentos
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            
                                        </div>
                                    </div>
                                </div>
                            </label>

                            {/* Grupos Individuais */}
                            {groupStats.map((group) => (
                                <label
                                    key={group.id}
                                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                                        selectedGroup === group.id 
                                            ? 'bg-blue-50 border border-blue-200' 
                                            : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="group"
                                        checked={selectedGroup === group.id}
                                        onChange={() => selectGroup(group.id)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <div className="flex items-center space-x-2">
                                        <div 
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: group.color }}
                                        />
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-gray-900">
                                                {group.name}
                                            </div>
                                            {group.description && (
                                                <div className="text-xs text-gray-500">
                                                    {group.description}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-xs font-bold text-gray-600">
                                            {group.segmentCount}
                                        </div>
                                    </div>
                                </label>
                            ))}

                            {/* Mensagem quando não há grupos */}
                            {groups.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm">Nenhum grupo criado</p>
                                    <p className="text-xs">Crie grupos para organizar seus segmentos</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex justify-between items-center text-sm text-gray-600">
                                <span>
                                    {selectedGroup ? 'Grupo selecionado' : 'Mostrando todos os segmentos'}
                                </span>
                                <button
                                    onClick={() => { onApply(selectedGroup); setIsOpen(false); }}
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

export default GroupFilter;
