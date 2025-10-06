import React, { useMemo, useState, useEffect, useRef } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, CheckCircle, Hash, Tag, DollarSign, X, Shield } from 'lucide-react';
import type { MigratedSegment, ValidationMessage } from '../../../context/FileUploads/types/context';
import { getFakeErrors, saveFakeError } from '../../../utils/localStorage';

interface InfosDisplayProps {
    segment: MigratedSegment;
    fileName?: string;
    infoTypes: 'errors' | 'validations' | 'fakeInfos';
    colorScheme: {
        primary: string;
        secondary: string;
        background: string;
        border: string;
        text: string;
        icon: string;
    };
    title: string;
    onAddFakeInfo?: (segmentId: number, fakeInfo: ValidationMessage) => void;
}

const InfosDisplay: React.FC<InfosDisplayProps> = React.memo(({ 
    segment, 
    fileName, 
    infoTypes, 
    colorScheme, 
    title,
    onAddFakeInfo
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hiddenInfos, setHiddenInfos] = useState<Set<string>>(new Set());
    const dropdownRef = useRef<HTMLDivElement>(null);

    const iconFor = (key: string) => {
        if (key.toLowerCase().includes('decimal')) return <Hash className="w-4 h-4" />
        if (key.toLowerCase().includes('number')) return <DollarSign className="w-4 h-4" />
        if (key.toLowerCase().includes('symbol')) return <Shield className="w-4 h-4" />
        if (key.toLowerCase().includes('tag')) return <Tag className="w-4 h-4" />
        return <CheckCircle className="w-4 h-4" />
    }

    const hideInfo = (info: ValidationMessage) => {
        const infoKey = `${info.type}-${info.message}`;
        saveFakeError(segment.id, infoKey, info, fileName || "");
        setHiddenInfos(prev => new Set([...prev, infoKey]));
        
        // Adicionar ao estado global se a função foi fornecida
        if (onAddFakeInfo) {
            onAddFakeInfo(segment.id, info);
        }
    }

    // Carregar falsos relatórios salvos no localStorage
    useEffect(() => {
        if (!fileName) return;
        
        const savedFakeErrors = getFakeErrors(fileName);
        const segmentFakeErrors = savedFakeErrors.filter(fakeErr => fakeErr.segmentId === segment.id);
        
        // Criar chaves para as informações que devem ser ocultas
        const infoKeys = segmentFakeErrors.map(fakeErr => fakeErr.errorKey);
        
        if (infoKeys.length > 0) {
            setHiddenInfos(new Set(infoKeys));
        }
    }, [fileName, segment.id]);

    // Fechar dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const infosByType = useMemo(() => {
        const map = new Map<string, ValidationMessage[]>();
        const list = infoTypes === 'errors' 
            ? (Array.isArray(segment.errors) ? segment.errors : [])
            : infoTypes === 'validations'
            ? (Array.isArray(segment.validations) ? segment.validations : [])
            : (Array.isArray(segment.fakeInfos) ? segment.fakeInfos : []);
        
        // Filtrar informações que não estão ocultas (apenas para errors e validations)
        const visibleInfos = infoTypes === 'fakeInfos' 
            ? list // fakeInfos sempre são visíveis
            : list.filter(info => {
                if (!info || typeof info.type !== 'string') return false;
                const infoKey = `${info.type}-${info.message}`;
                return !hiddenInfos.has(infoKey);
            });
        
        for (const info of visibleInfos) {
            const key = info.type;
            const arr = map.get(key) || [];
            arr.push(info);
            map.set(key, arr);
        }
        return map;
    }, [segment.errors, segment.validations, segment.fakeInfos, hiddenInfos, infoTypes]);

    const totalInfos = useMemo(() => {
        const list = infoTypes === 'errors' 
            ? (Array.isArray(segment.errors) ? segment.errors : [])
            : infoTypes === 'validations'
            ? (Array.isArray(segment.validations) ? segment.validations : [])
            : (Array.isArray(segment.fakeInfos) ? segment.fakeInfos : []);
        
        const visibleInfos = infoTypes === 'fakeInfos' 
            ? list // fakeInfos sempre são visíveis
            : list.filter(info => {
                if (!info || typeof info.type !== 'string') return false;
                const infoKey = `${info.type}-${info.message}`;
                return !hiddenInfos.has(infoKey);
            });
        return visibleInfos.length;
    }, [segment.errors, segment.validations, segment.fakeInfos, hiddenInfos, infoTypes]);

    if (totalInfos === 0) return null;

    return (
        <div ref={dropdownRef} className="mt-1">
            {/* Botão de Abertura compacto */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between p-2 ${colorScheme.background} border ${colorScheme.border} rounded hover:opacity-80 transition-colors duration-200`}
            >
                <div className="flex items-center space-x-2">
                    <AlertTriangle className={`w-3 h-3 ${colorScheme.icon}`} />
                    <span className={`text-xs font-medium ${colorScheme.text}`}>
                        {totalInfos} {title.toLowerCase()}{totalInfos !== 1 ? 's' : ''}
                    </span>
                </div>
                <div className="flex items-center space-x-1">
                    <span className={`text-xs ${colorScheme.text} ${colorScheme.secondary} px-1 py-0.5 rounded`}>
                        {infosByType.size}
                    </span>
                    {/* {hiddenInfos.size > 0 && (
                        <button
                            onClick={restoreAllInfos}
                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                            title="Restaurar relatórios ocultos"
                        >
                            ({hiddenInfos.size})
                        </button>
                    )} */}
                    {isOpen ? (
                        <ChevronUp className={`w-3 h-3 ${colorScheme.icon}`} />
                    ) : (
                        <ChevronDown className={`w-3 h-3 ${colorScheme.icon}`} />
                    )}
                </div>
            </button>

            {/* Dropdown de Informações sobreposto */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto min-w-[300px] w-max max-w-[500px]">
                    <div className="p-3 space-y-2">
                        {Array.from(infosByType.entries()).map(([key, list]) => (
                            <div key={key} className={`p-3 rounded border ${colorScheme.background} ${colorScheme.border}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                        <div className={colorScheme.icon}>
                                            {iconFor(key)}
                                        </div>
                                        <span className={`text-sm font-medium ${colorScheme.text}`}>
                                            {key}
                                        </span>
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${colorScheme.text} bg-white`}>
                                        {list.length}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {list.map((info, idx) => (
                                        <div key={idx} className="flex items-start justify-between text-sm text-gray-700 bg-white p-2 rounded border-l-2 border-gray-300 group hover:bg-gray-50 transition-colors">
                                            <span className="flex-1 break-words pr-2">{info.message}</span>
                                            {infoTypes !== 'fakeInfos' && (
                                                <button
                                                    onClick={() => hideInfo(info)}
                                                    className="flex-shrink-0 p-1 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Marcar como falso relatório"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
})

export default InfosDisplay;
