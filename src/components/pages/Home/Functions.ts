import { useFilesUploadsContext } from '../../../context/FileUploads/utils';
import { useReaderJSON } from '../../../hooks/useReaderJSON';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { allFilesRoutes } from '../../../const/routes';

export const useFunctions = () => {
    const [state, actions] = useFilesUploadsContext()

    const {extractContent, isLoading} = useReaderJSON()

    const [processingFiles, setProcessingFiles] = useState(false)
    
    const [finalized, setFinalized] = useState(false);

    const navigate = useNavigate()

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const handleClick = async () => {

        setProcessingFiles(true)

        for (const file of state.files) {

            while (isLoading) {
            
                await delay(100)
            
            }

            extractContent(file)

            await delay(100)
        }

        setProcessingFiles(false)
        setFinalized(true)
        
    }    
    
    const handleUploadFile = (files: File[]) => {
    
        console.log(files);

        actions.uploadFiles(files)


    }

    useEffect(() => {

        if (finalized) {
            navigate(allFilesRoutes)
        }
    
    }, [finalized])

    return {
        handleUploadFile,
        handleClick,
        processingFiles,
        state
    }
}