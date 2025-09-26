import { useRef, useState } from "react"
import { useTags } from "./useTags"
import { useFilesUploadsContext } from "../context/FileUploads/utils"

interface useInputSegmentsProps {
    text: string,
}

export const useInputSegments = ({text}:useInputSegmentsProps) => {
    const {usedTag, createDataTags, addHTMLElements, focusDiv} = useTags()

    const context = useFilesUploadsContext();

    const actions = context[1]

    const [tagConfig, setTagConfig] = useState(createDataTags(text, /<tag\b[^>]*id=["']?([^"'\s>]+)["']?[^>]*\/?>/gi))    

    const tagNames = tagConfig.map(item => Number(item.name) ? item.name : "0")
    
    const inputRef = useRef<null|HTMLDivElement>(null)
    
    const convertImgToTag = (div: string) => {

        const html = div?.replace(
            /<img\b[^>]*data-tag=["']?([^"'\s>]+)["']?[^>]*\/?>/gi,
            (_, type) => `<tag id="${type}" type="${type}" />`
        );
  
        return html
  
    }
        
    
    const convertSpanToTxt = (html: string) => 
        html?.replace(
            /<span\b>(.*?)<\/span>/gi,
            (_, content) => {

                return `<txt>${content}</txt>`;
            }
        );

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, id: string) => {

        if (event.altKey && tagNames.some(item => item === event.key) && inputRef.current) {

            let key = event.key

            if (key === "0") {

                key = "SP"
            }
            
            const result = usedTag(tagConfig, key)

            if (!result.changed) {
                return
            }

            addHTMLElements(inputRef.current.childNodes, key, inputRef.current, false)

            focusDiv(inputRef.current)

            setTagConfig(result.data)
            
        }

        if (event.key === "Enter" && inputRef.current) {
            
            event.preventDefault()

            addHTMLElements(inputRef.current.childNodes, null, inputRef.current)

            focusDiv(inputRef.current)

            const convertedHTML = convertImgToTag(inputRef.current?.innerHTML)

            const finalHTML = convertSpanToTxt(convertedHTML)

            actions.updateSegments({targetText: finalHTML, id: Number(id)})
            
            
        }

        if (event.key === "Backspace" && inputRef.current && inputRef.current.childNodes.length > 0) {
            
            const arrayNodes = Array.from(inputRef.current.childNodes)
            
            console.log(arrayNodes);
            
            const lastSpan = arrayNodes.pop()
            
            if (lastSpan?.nodeName === "IMG") {
                event.preventDefault()
                
                const dataTagValue = (lastSpan as HTMLImageElement).getAttribute("data-tag") as string
                
                const result = usedTag(tagConfig, dataTagValue, true)

                setTagConfig(result.data)

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
        
    };


    return {
        inputRef,
        tagConfig,
        handleKeyDown,
        setTagConfig
    }
}