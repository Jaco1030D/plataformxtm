import { useDragDrop } from "../../../hooks/useDragDrop";

interface DropdownProps {
    onSelectedFiles: (files: File[]) => void;
}

const Dropdown = ({onSelectedFiles}: DropdownProps) => {
    const {files, handleDrop, handleInputChange, clear} = useDragDrop()

    
    return (
        <div onDragOver={(event) => event.preventDefault()} onDrop={handleDrop}>

            <input className="hidden" type="file" id="file-upload" onChange={handleInputChange} multiple />

            <label htmlFor="file-upload">Vamos ver se ativa o nput</label>
            
            <button onClick={clear}>Limpar seleção</button>

            {files && files.length > 0 && (
                <button onClick={() => onSelectedFiles(files)}>Confirmar envio de {files.length} arquivos</button>
            )}

        </div>
    );
};

export default Dropdown;