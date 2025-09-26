import DragDrop from '../../organism/DragDrop';
import { ArrowRight, Loader } from 'lucide-react';
import { useFunctions } from './Functions';

const Home = () => {
    const {handleClick, handleUploadFile, processingFiles, state} = useFunctions()
    
    return (
        <div className='flex flex-col'>

            <DragDrop onSelectedFiles={handleUploadFile} />
            {
                state.files.length > 0 && (
                    <button 
                        onClick={handleClick}
                        className="max-w-2xl self-center flex bg-white text-blue-600 px-4 py-2 border-2 border-blue-600 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 items-center justify-center space-x-2"
                    >
                        <span>Processar e ir para proxima pagina </span>
                        {processingFiles ? <Loader size={18} /> : <ArrowRight size={18}/>}
                    </button>   
                )
            }

        </div>
    );
};

export default Home;