import { getSegmentChanges, saveSegmentChange } from '../../../utils/localStorage';
import type { MigratedSegment } from '../../../context/FileUploads/types/context';
import { useFilesUploadsContext } from '../../../context/FileUploads/utils';
import { useEffect, useRef, useState } from 'react';
import { useTags, type groupPlussType } from '../../../hooks/useTags';
// import { useTags } from '../../../hooks/useTags';

interface InputDivProps {
    targetValue?: {
        tratedText: string,
        tagsUsed: groupPlussType[]
    },
    segment: MigratedSegment,
    onNextPage?: () => void
}
const InputDiv = ({targetValue, segment, onNextPage}: InputDivProps) => {
    const {focusDiv, usedTag, addHTMLElements, convertImgTagsToBraces, countBracedTags} = useTags()
    const [state, actions] = useFilesUploadsContext()
    const [targetText, setTargetText] = useState(targetValue?.tratedText)
    const [tagsData, setTagsData] = useState<groupPlussType[] | []>(targetValue?.tagsUsed || [])

    const fileName = state.editValue?.file.name

    const tagNames = tagsData.map(item => Number(item.name) ? item.name : "0")

    const inputRef = useRef<null|HTMLDivElement>(null)

    
    const onSave = () => {
        
        if (inputRef.current) {

            const currentText = inputRef.current.innerHTML || inputRef.current.innerText || '';
            
            
            saveSegmentChange(segment.id, convertImgTagsToBraces(currentText), true, fileName || "undefined.json");
            
            actions.updateSegments({id: segment.id, targetText: convertImgTagsToBraces(currentText)})

            setTargetText(currentText)
        }
    }

    const handleKeyDownWithSave = (e: React.KeyboardEvent<HTMLDivElement>) => {
        // Verificar se Alt + Enter foi pressionado
        if (e.altKey && e.key === 'Enter' && inputRef.current) {
            
            e.preventDefault();
            
            const data = tagsData.filter(item => item.used !== item.num)

            if (data.length > 0) {

                alert("Há tags faltando no segmento")

                return
            }

            onSave();
            
            // Ir para o próximo segmento navegando pelo DOM
            const currentContainer = inputRef.current?.closest('[id^="seg-"]') as HTMLElement | null
            if (currentContainer) {
                // Encontrar o próximo segmento irmão
                let nextContainer = currentContainer.nextElementSibling as HTMLElement | null
                
                // Se não há próximo irmão, tentar carregar próxima página
                if (!nextContainer && onNextPage) {
                    onNextPage();
                    
                    // Aguardar um pouco para o DOM ser atualizado e tentar novamente
                    setTimeout(() => {
                        const newNextContainer = currentContainer.nextElementSibling as HTMLElement | null
                        if (newNextContainer && newNextContainer.id.startsWith('seg-')) {
                            newNextContainer.scrollIntoView({behavior: 'smooth', block: 'center'})
                            const nextEditable = newNextContainer.querySelector('[contenteditable="true"]') as HTMLDivElement | null
                            if (nextEditable) {
                                setTimeout(() => focusDiv(nextEditable), 100)
                            }
                        }
                    }, 200);
                    return;
                }
                
                // Verificar se o próximo elemento é realmente um segmento
                if (nextContainer && nextContainer.id.startsWith('seg-')) {
                    nextContainer.scrollIntoView({behavior: 'smooth', block: 'center'})
                    const nextEditable = nextContainer.querySelector('[contenteditable="true"]') as HTMLDivElement | null
                    if (nextEditable) {
                        setTimeout(() => focusDiv(nextEditable), 100)
                    }
                }
            }
            
            return;
        }

        if (e.altKey && tagNames.some(item => item === e.key) && inputRef.current) {

            let key = e.key

            if (key === "0") {

                key = "SP"
            }
            
            const result = usedTag(tagsData, key)

            // console.log(result);
            

            if (!result.changed) {
                return
            }

            addHTMLElements(inputRef.current.childNodes, key, inputRef.current, false)

            focusDiv(inputRef.current)

            setTagsData(result.data)
            
        }

        if (e.key === "Backspace" && inputRef.current && inputRef.current.childNodes.length > 0) {
            
            const arrayNodes = Array.from(inputRef.current.childNodes)
            
            console.log(arrayNodes);
            
            const lastSpan = arrayNodes.pop()
            
            if (lastSpan?.nodeName === "IMG") {
                e.preventDefault()
                
                const dataTagValue = (lastSpan as HTMLImageElement).getAttribute("data-tag") as string
                
                const result = usedTag(tagsData, dataTagValue, true)

                setTagsData(result.data)

                inputRef.current.innerHTML = ""

                arrayNodes.forEach(node => {

                    inputRef.current?.appendChild(node)
                    
                
                });

                setTimeout(() => {
                    focusDiv(inputRef.current!)
                }, 10);
            }

            if (lastSpan?.textContent?.length === 1) {

                inputRef.current.innerHTML = ""

                arrayNodes.forEach(node => {

                    inputRef.current?.appendChild(node)
                    
                
                });

                setTimeout(() => {
                    focusDiv(inputRef.current!)
                }, 10);
            }
             
        }
    }

    useEffect(() => {

        const segementsSaveds = getSegmentChanges(fileName || "")

        const segmentActual = segementsSaveds.find(seg => seg.id === segment.id)

        if (segmentActual?.text && segmentActual.text !== targetValue?.tratedText) {

            actions.updateSegments({id: segment.id, targetText: segmentActual.text})

            // Atualiza contagem de tags usadas a partir do texto salvo (com chaves)
            const counts = countBracedTags(segmentActual.text)
            if (tagsData && tagsData.length > 0) {
                const updated = tagsData.map(tag => ({
                    ...tag,
                    used: counts[tag.name] ?? 0
                }))
                setTagsData(updated)
            }

        }

    },[segment])

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Tradução (Target) - numero de tags {tagsData && tagsData?.length > 0 && tagsData.length}
            </label>
            <div className='flex flex-col'>

                <div 
                    ref={inputRef} 
                    contentEditable
                    onKeyDown={handleKeyDownWithSave}
                    dangerouslySetInnerHTML={{__html: targetText || ""}}
                    suppressContentEditableWarning 
                    className='w-full min-h-12 items-center bg-white border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none'
                />
            </div>
        </div>

    );
};

export default InputDiv;