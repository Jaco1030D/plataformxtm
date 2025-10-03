interface groupType {
    name: string,
    index: number,
    num: number,
    used: number
}
export interface groupPlussType {
    name: string,
    index: number[] | number,
    num: number,
    used: number
}

export const useTags = () => {
    
    const gropuByName = (data: groupType[]) => {

        const grouped: Record<string, { name: string; index: number[]; num: number; used: number }> = {}; //entender isso
    
        data.forEach(item => {
        const { name, index, num, used } = item;
    
        if (!grouped[name]) {
            grouped[name] = {
            name,
            index: [index],
            num,
            used
            };
        } else {
            grouped[name].index.push(index);
            grouped[name].num += num;
            grouped[name].used += used;
        }
        });
    
        return Object.values(grouped).map(item => ({
        ...item,
        index: item.index.length === 1 ? item.index[0] : item.index
        }));
    }

    const createTagSVG = (
        
        numero: string,
        width: number = 24,
        height: number = 18,
        backgroundColor: string = '#10b981',
        textColor: string = 'white'

    ) => {
        
        const fontSize = 10;
        
        const centerX = width / 2;
        
        const centerY = height / 2 + 1;
        
        const svgContent = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="${width}" height="${height}" rx="9" ry="9" fill="${backgroundColor}"/>
            <text x="${centerX}" y="${centerY}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif" font-size="${fontSize}" font-weight="500" fill="${textColor}" text-anchor="middle" dominant-baseline="central">${numero}</text>
        </svg>`;
        
        const encodedSVG = encodeURIComponent(svgContent);
        
        return `data:image/svg+xml,${encodedSVG}`;

    }

    const createDataTags = (text: string, regex: RegExp, tags?: string[]): groupPlussType[] => {
    
        // if (!text) {
        //     return []
        // }
        const matches = [...text.matchAll(regex)]

        const tagUsed  = tags
        
        const tagsExtracted = matches.map(item => {

            if (tagUsed && tagUsed?.length > 0 &&  tagUsed?.some(tag => tag === item[1])) {

                const data = {name: item[1], index: item.index, num: 1, used: 1}

                const index = tagUsed.findIndex(tag => tag === item[1])

                tagUsed.splice(index, 1)

                return data
                
            } else {

                return {name: item[1], index: item.index, num: 1, used:0}
            }
    
        
        }) 
    
        const result = gropuByName(tagsExtracted)
    
        return result
        
    }

    const turnTextInSpan = (arrayNodes: Node[]) => {

        arrayNodes.forEach((node, index) => {

            if (node?.nodeName === "#text") {                    
            
                const span = document.createElement('span')

                span.textContent = node.textContent

                arrayNodes[index] = span

            }

        })

    }

    const addHTMLElements = (childNodes: NodeList, tag:string|null = null, editableDiv: HTMLDivElement, turnInSpan:boolean = true) => {

        const arrayNodes = Array.from(childNodes)

        console.log(arrayNodes);
        

        editableDiv.innerHTML = ""

        if (turnInSpan) {

            turnTextInSpan(arrayNodes)
        
        }

        if (tag) {

            const imgTag = createTagElement(tag)
        
            arrayNodes.push(
                imgTag
            )
        }

        arrayNodes.forEach(node => {

            editableDiv?.appendChild(node)
        
        });

        console.log(arrayNodes);
        

        return arrayNodes

    }

    const createTagElement = (key: string) => {
        const img = document.createElement('img')

        const tagUrl = createTagSVG(key)

        img.src = tagUrl

        img.className = "inline mt-[-4px] pl-[2px] pr-[2px]"

        img.dataset.tag = key

        return img
    }

    // Novo: converte placeholders no formato {id} em elementos <img> gerados por createTagElement
    

    const renderTextWithTags = (text: string) => {
        if (!text) return { textTrated: '', tagsCreated: [] as string[] }
        const bracesRegex = /\{([^}]+)\}/g
        const tagsCreated: string[] = []

        const textTrated = text.replace(bracesRegex, (_, id: string) => {
            const idStr = String(id)
            tagsCreated.push(idStr)
            const element = createTagElement(idStr)
            return element.outerHTML
        })

        return { textTrated, tagsCreated }
    }

    // Converte <img ... data-tag="X" ...> em {X}
    const convertImgTagsToBraces = (html: string) => {
        if (!html) return ''
        return html.replace(
            /<img\b[^>]*data-tag=["']?([^"'\s>]+)["']?[^>]*\/?>(?:<\/img>)?/gi,
            (_, tag) => `{${String(tag).toLowerCase()}}`
        )
    }

    // Conta quantas vezes cada placeholder {id} aparece na string
    const countBracedTags = (text: string): Record<string, number> => {
        const counts: Record<string, number> = {}
        if (!text) return counts
        const regex = /\{([^}]+)\}/g
        for (const match of text.matchAll(regex) as any) {
            const key = String(match[1])
            counts[key] = (counts[key] || 0) + 1
        }
        return counts
    }

    // Prepara HTML do source/target com tags e retorna também tags usadas no target
    const prepareSegmentTextsWithTags = (segment: { source: string, translation: string }) => {
        const bracesRegex = /\{([^}]+)\}/g

        const {textTrated: sourceHTML} = renderTextWithTags(segment.source)
        
        const {textTrated: targetHTML, tagsCreated} = renderTextWithTags(segment.translation)

        const tagsUsed = createDataTags(segment.source, bracesRegex, tagsCreated)
        
        return { sourceHTML, targetHTML, tagsUsed }
    }

    const focusDiv = (editableDiv: HTMLDivElement) => {

        const range = document.createRange();
        
        range.selectNodeContents(editableDiv);
        
        range.collapse(false); 

        const selection = window.getSelection();
        
        selection?.removeAllRanges();
        
        selection?.addRange(range);

        editableDiv.focus();
    }

    const usedTag = (data: groupPlussType[], tagName: string, remove:boolean = false ) => {
        
        const tagData = data.find(item => item.name.toLowerCase() === tagName.toLowerCase())

        let changed = false
        
        if (tagData && tagData?.num > tagData?.used && !remove) {
            
            tagData.used += 1
      
            changed = true
            
        } else if (tagData && tagData.num > 0 && remove ) {

            tagData.used -=1
        
        }
        
        return {data, changed}
        
    }


    return {
        addHTMLElements,
        createDataTags,
        focusDiv,
        usedTag,
        createTagElement,
        renderTextWithTags,
        convertImgTagsToBraces,
        countBracedTags,
        prepareSegmentTextsWithTags
    }
}