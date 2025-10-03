import { useFilesUploadsContext } from '../../../context/FileUploads/utils';
import { useReaderJSON } from '../../../hooks/useReaderJSON';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { allFilesRoutes } from '../../../const/routes';
import { useGroups } from '../../../context/Groups';

export const useFunctions = () => {
    const [state, actions] = useFilesUploadsContext()
    const {actions: actionsGroups} = useGroups()
    const [errors] = useState(false)

    const {extractContent, getTypeErrors} = useReaderJSON()

    const [processingFiles, setProcessingFiles] = useState(false)
    
    const [finalized, setFinalized] = useState(false);
    
    const navigate = useNavigate()

    const handleClick = async () => {

        setProcessingFiles(true)

        for (const file of state.files) {
            
            const data = await extractContent(file)

            const fileForAddSegments = state.files.filter(f => f.size === file.size)[0]

            const infos = getTypeErrors(data)

            if (Array.isArray(data)) {

                
                
                actions.addSegments({
                    content: data,
                    file: fileForAddSegments,
                    size: file.size,
                    TypesErrors: infos.TypesErrors,
                    TypesStatus: infos.typeStatus
                })

            } else {
                const groups = data.groups
                const segments = data.segments

                actions.addSegments({
                    content: segments,
                    file: fileForAddSegments,
                    size: file.size,
                    TypesErrors: infos.TypesErrors,
                    TypesStatus: infos.typeStatus
                })
                
                actionsGroups.addGroup(groups)
            }
        }

        

        setProcessingFiles(false)
        setFinalized(true)
        
    }    
    
    const handleUploadFile = (files: File[]) => {

        actions.uploadFiles(files)


    }

    const handleSaveWorkFile = (files: File[]) => {
        console.log('Arquivos de savework selecionados:', files);
        // TODO: Implementar processamento de arquivos de savework
        // Por enquanto apenas log
    }

    useEffect(() => {

        if (errors) {

           alert("Esse Tipo de json não é suportado") 
           
           return
        }

        if (finalized && !errors) {
            navigate(allFilesRoutes)
        }
    
    }, [finalized, navigate, errors])

    return {
        handleUploadFile,
        handleSaveWorkFile,
        handleClick,
        processingFiles,
        state
    }
}