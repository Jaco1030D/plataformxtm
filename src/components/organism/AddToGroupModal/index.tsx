import React, { useState } from 'react';
import { Users, Check } from 'lucide-react';
import Modal from '../../Atoms/Modal';
import { useGroups } from '../../../context/Groups';

// Dados mock para grupos
// const mockGroups = [
//     { id: 1, name: 'Grupo de Revisão', count: 5, color: 'bg-blue-100 text-blue-800' },
//     { id: 2, name: 'Segmentos Críticos', count: 12, color: 'bg-red-100 text-red-800' },
//     { id: 3, name: 'Tradução Automática', count: 8, color: 'bg-green-100 text-green-800' },
//     { id: 4, name: 'Pendentes QA', count: 3, color: 'bg-yellow-100 text-yellow-800' },
//     { id: 5, name: 'Aprovados', count: 15, color: 'bg-purple-100 text-purple-800' },
// ];

interface AddToGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddToGroup: (groupId: string) => void;
    selectedCount: number;
}

const AddToGroupModal: React.FC<AddToGroupModalProps> = ({ 
    isOpen, 
    onClose, 
    onAddToGroup,
    selectedCount 
}) => {
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const {state: groupsState} = useGroups()

    const handleSubmit = () => {
        if (selectedGroupId) {
            onAddToGroup(selectedGroupId);
            setSelectedGroupId(null);
            onClose();
        }
    };

    const handleClose = () => {
        setSelectedGroupId(null);
        onClose();
    };

    const onSelectGroups = (groupId: string) => {
        if (groupId === selectedGroupId) {

            setSelectedGroupId(null)
        
        } else {

            setSelectedGroupId(groupId);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Adicionar a Grupo"
        >
            <div className="p-6">
                <p className="text-sm text-gray-600 mb-6">
                    Adicionar {selectedCount} segmento{selectedCount !== 1 ? 's' : ''} selecionado{selectedCount !== 1 ? 's' : ''} a um grupo
                </p>

                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                    {groupsState.groups.map((group) => (
                        <button
                            key={group.id}
                            onClick={() => onSelectGroups(group.id)}
                            className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                                selectedGroupId === group.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-3 h-3 rounded-full ${group.color?.split(' ')[0]}`} />
                                    <span className="font-medium text-gray-900">
                                        {group.name}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={`text-xs px-2 py-1 rounded-full ${group.color}`}>
                                        {group.segmentIds.length} segmentos
                                    </span>
                                    {selectedGroupId === group.id && (
                                        <Check className="w-5 h-5 text-blue-600" />
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={handleClose}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedGroupId}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                        <Users className="w-4 h-4" />
                        <span>Adicionar</span>
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AddToGroupModal;
