import DragDrop from '../../organism/DragDrop';
import DragDropSaveWork from '../../organism/DragDropSaveWork';
import { ArrowRight, Loader, FileText, Download } from 'lucide-react';
import { useFunctions } from './Functions';

const Home = () => {
    const {handleClick, handleUploadFile, processingFiles, state} = useFunctions()
    
    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4'>
            <div className="max-w-6xl mx-auto">

                {/* Duas colunas para as áreas de upload */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Área para Novos Arquivos */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Novos Arquivos</h2>
                                <p className="text-sm text-gray-500">Carregue arquivos JSON para tradução</p>
                            </div>
                        </div>
                        
                        <DragDrop onSelectedFiles={handleUploadFile} />
                        
                        
                    </div>

                    {/* Área para Save Work */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <Download className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Trabalho Salvo</h2>
                                <p className="text-sm text-gray-500">Continue um trabalho exportado anteriormente</p>
                            </div>
                        </div>
                        
                        <DragDropSaveWork onSelectedFiles={handleUploadFile} />
                    </div>

                    {state.files.length > 0 && (
                            <div className="mt-6 lg:col-span-2">
                                <button 
                                    onClick={handleClick}
                                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                                >
                                    <span>Processar {state.files.length} arquivo(s) e ir para próxima página</span>
                                    {processingFiles ? <Loader size={18} /> : <ArrowRight size={18}/>}
                                </button>   
                            </div>
                        )}
                </div>

                {/* Informações adicionais */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                        Como funciona?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                        <div>
                            <strong>Novos Arquivos:</strong> Carregue arquivos JSON com segmentos para tradução. O sistema processará e organizará os segmentos para edição.
                        </div>
                        <div>
                            <strong>Trabalho Salvo:</strong> Carregue arquivos exportados pelo botão "Save Work" para continuar de onde parou, mantendo grupos e edições.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;