import { useDragDrop } from "../../../hooks/useDragDrop";
import { X, Check, File, Download } from "lucide-react";

interface DragDropSaveWorkProps {
    onSelectedFiles: (files: File[]) => void;
}

const DragDropSaveWork = ({onSelectedFiles}: DragDropSaveWorkProps) => {
    const {files, handleDrop, handleInputChange, clear} = useDragDrop()

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6">
            {/* Área de Drop */}
            <div 
                onDragOver={(event) => event.preventDefault()} 
                onDrop={handleDrop}
                className={`
                    relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
                    ${files && files.length > 0 
                        ? 'border-purple-400 bg-purple-50 hover:bg-purple-100' 
                        : 'border-purple-300 bg-purple-50 hover:border-purple-400 hover:bg-purple-100'
                    }
                `}
            >
                <input 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    type="file" 
                    id="savework-upload" 
                    onChange={handleInputChange} 
                    multiple 
                    accept=".json"
                />
                
                <div className="flex flex-col items-center space-y-4">
                    {files && files.length > 0 ? (
                        <>
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                                <Check className="w-8 h-8 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-purple-700">
                                    {files.length} arquivo{files.length > 1 ? 's' : ''} de trabalho selecionado{files.length > 1 ? 's' : ''}
                                </h3>
                                <p className="text-sm text-purple-600">
                                    Clique para adicionar mais arquivos ou arraste novos arquivos aqui
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                                <Download className="w-8 h-8 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-purple-700">
                                    Carregar trabalho salvo
                                </h3>
                                <p className="text-sm text-purple-500">
                                    Arraste seus arquivos de savework aqui ou clique para selecionar
                                </p>
                                <p className="text-xs text-purple-400 mt-1">
                                    Arquivos exportados pelo botão "Save Work"
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Lista de Arquivos */}
            {files && files.length > 0 && (
                <div className="mt-6 space-y-3">
                    <h4 className="text-sm font-medium text-purple-700 mb-3">
                        Arquivos de trabalho selecionados:
                    </h4>
                    
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {files.map((file, index) => (
                            <div 
                                key={index} 
                                className="flex items-center justify-between p-3 bg-white border border-purple-200 rounded-lg shadow-sm"
                            >
                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <File className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatFileSize(file.size)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex space-x-3 pt-4">
                        <button 
                            onClick={() => onSelectedFiles(files)}
                            className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                        >
                            <Download className="w-4 h-4" />
                            <span>Carregar {files.length} arquivo{files.length > 1 ? 's' : ''}</span>
                        </button>
                        
                        <button 
                            onClick={clear}
                            className="px-4 py-2 border border-purple-300 text-purple-700 rounded-lg font-medium hover:bg-purple-50 transition-colors duration-200 flex items-center space-x-2"
                        >
                            <X className="w-4 h-4" />
                            <span>Limpar</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DragDropSaveWork;
