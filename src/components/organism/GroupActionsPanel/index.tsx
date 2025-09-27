import React from 'react';
import { Users, Plus } from 'lucide-react';

interface GroupActionsPanelProps {
    selectedCount: number;
    onCreateGroup: () => void;
    onAddToGroup: () => void;
}

const GroupActionsPanel: React.FC<GroupActionsPanelProps> = ({ 
    selectedCount, 
    onCreateGroup, 
    onAddToGroup 
}) => {
    if (selectedCount === 0) return null;

    return (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-3">
            <div className="flex items-center space-x-4">
                <h3 className="text-sm font-medium text-gray-900 whitespace-nowrap">
                    Grupos ({selectedCount})
                </h3>
                
                <div className="flex space-x-2">
                    <button
                        onClick={onCreateGroup}
                        className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                    >
                        <Plus className="w-3 h-3" />
                        <span>Criar</span>
                    </button>

                    <button
                        onClick={onAddToGroup}
                        className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                    >
                        <Users className="w-3 h-3" />
                        <span>Adicionar</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GroupActionsPanel;
