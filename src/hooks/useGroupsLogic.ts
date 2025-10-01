import { useState, useEffect } from "react";
import { useFilesUploadsContext } from "../context/FileUploads/utils";
import { useGroups } from "../context/Groups";

export const useGroupsLogic = (selectedGroupId: string | null, currentView: any) => {
    const [state, actions] = useFilesUploadsContext();
    const { state: groupsState, actions: groupsActions } = useGroups();
    
    // Estado para seleção de segmentos
    const [selectedSegments, setSelectedSegments] = useState<Set<number>>(new Set());
    
    // Estado para modais
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
    const [showAddToGroupModal, setShowAddToGroupModal] = useState(false);
    
    // Funções para gerenciar seleção
    const toggleSegmentSelection = (segmentId: number) => {
        setSelectedSegments(prev => {
            const newSet = new Set(prev);
            if (newSet.has(segmentId)) {
                newSet.delete(segmentId);
            } else {
                newSet.add(segmentId);
            }
            return newSet;
        });
    };
    
    // Funções para ações dos grupos
    const handleCreateGroup = () => {
        setShowCreateGroupModal(true);
    };
    
    const handleAddToGroup = () => {
        setShowAddToGroupModal(true);
    };
    
    const onCreateGroup = (groupName: string) => {
        const id = groupsActions.createGroup({
            name: groupName,
            segmentIds: Array.from(selectedSegments),
        });
        
        setSelectedSegments(new Set()); // Limpar seleção após criar grupo
        
        // Adiciona id do grupo nos segmentos
        actions.addIdGroup({
            groupId: id,
            segmentIds: Array.from(selectedSegments)
        });
    };
    
    const onAddToGroup = (groupId: string) => {
        console.log('Adicionando segmentos:', Array.from(selectedSegments), 'ao grupo:', groupId);
        
        groupsActions.addSegmentsForGroup({
            groupId,
            segmentIds: Array.from(selectedSegments)
        });
        
        setSelectedSegments(new Set()); // Limpar seleção após adicionar
        
        actions.addIdGroup({
            groupId,
            segmentIds: Array.from(selectedSegments)
        });
    };
    
    // Função para salvar trabalho (grupos + segmentos)
    const saveWork = () => {
        const object = {
            groups: groupsState.groups,
            segments: Array.isArray(state.editValue?.content) ? state.editValue?.content : [],
        };
        
        const jsonString = JSON.stringify(object, null, 2);
        
        // Função de download (pode ser movida para utils se necessário)
        const downloadFile = (jsonString: string) => {
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "saveWork - " + (state.editValue?.file.name || "edited_segments.json");
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };
        
        downloadFile(jsonString);
    };
    
    // Effect para garantir que segmentos do grupo sejam carregados
    useEffect(() => {
        const group = groupsState.groups.find(g => g.id === selectedGroupId);
        const renderizedComponents = currentView?.segments.length || 0;
        
        if (group && group?.segmentIds.length > renderizedComponents) {
            console.log("O bug ocorreu");
            actions.addIdGroup({
                groupId: group.id,
                segmentIds: group.segmentIds
            });
        }
    }, [selectedGroupId, currentView, groupsState.groups, actions]);
    
    return {
        // Estados
        selectedSegments,
        showCreateGroupModal,
        showAddToGroupModal,
        groupsState,
        
        // Funções de seleção
        toggleSegmentSelection,
        
        // Funções de modal
        handleCreateGroup,
        handleAddToGroup,
        setShowCreateGroupModal,
        setShowAddToGroupModal,
        
        // Funções de grupo
        onCreateGroup,
        onAddToGroup,
        saveWork,
    };
};
