import { useDragDrop } from "../../../hooks/useDragDrop";
import { Upload, X, Check, File } from "lucide-react";

interface DragDropProps {
    onSelectedFiles: (files: File[]) => void;
}

const DragDrop = ({onSelectedFiles}: DragDropProps) => {
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
                        ? 'border-green-400 bg-green-50 hover:bg-green-100' 
                        : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
                    }
                `}
            >
                <input 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    type="file" 
                    id="file-upload" 
                    onChange={handleInputChange} 
                    multiple 
                    accept=".json"
                />
                
                <div className="flex flex-col items-center space-y-4">
                    {files && files.length > 0 ? (
                        <>
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <Check className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-green-700">
                                    {files.length} arquivo{files.length > 1 ? 's' : ''} selecionado{files.length > 1 ? 's' : ''}
                                </h3>
                                <p className="text-sm text-green-600">
                                    Clique para adicionar mais arquivos ou arraste novos arquivos aqui
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                <Upload className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700">
                                    Arraste seus arquivos aqui
                                </h3>
                                <p className="text-sm text-gray-500">
                                    ou clique para selecionar arquivos
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Lista de Arquivos */}
            {files && files.length > 0 && (
                <div className="mt-6 space-y-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Arquivos selecionados:
                    </h4>
                    
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {files.map((file, index) => (
                            <div 
                                key={index} 
                                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm"
                            >
                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <File className="w-4 h-4 text-blue-600" />
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
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                        >
                            <Upload className="w-4 h-4" />
                            <span>Enviar {files.length} arquivo{files.length > 1 ? 's' : ''}</span>
                        </button>
                        
                        <button 
                            onClick={clear}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
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

export default DragDrop;