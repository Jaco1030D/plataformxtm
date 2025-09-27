import React, { useState } from 'react';
import { Check } from 'lucide-react';
import Modal from '../../Atoms/Modal';

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateGroup: (groupName: string) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ 
    isOpen, 
    onClose, 
    onCreateGroup 
}) => {
    const [groupName, setGroupName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (groupName.trim()) {
            onCreateGroup(groupName.trim());
            setGroupName('');
            onClose();
        }
    };

    const handleClose = () => {
        setGroupName('');
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Criar Novo Grupo"
        >
            <form onSubmit={handleSubmit} className="p-6">
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Grupo
                    </label>
                    <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Digite o nome do grupo"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        autoFocus
                    />
                </div>

                <div className="flex space-x-3">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={!groupName.trim()}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                        <Check className="w-4 h-4" />
                        <span>Criar</span>
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateGroupModal;
