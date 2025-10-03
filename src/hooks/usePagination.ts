import { useEffect, useMemo, useState, useTransition } from "react";
import type { MigratedSegment } from "../context/FileUploads/types/context";

export type ErrorFilterKey = string; // agora baseado em errors[].type

interface CurrentViewProps {
    segments: MigratedSegment[],
    index: number
}

// Bug para resolver:
// - Quando temos poucos elemsntos por chunk o gotosegments não funciona como o esperado

export const usePagination = (chunkSize: number, segments: MigratedSegment[], filterErrors: ErrorFilterKey[], selectedGroupId?: string | null, filterStatus?: string[]) => {
    const [currentView, setCurrentView] = useState<CurrentViewProps|null>(null)
    const [isPending, startTransition] = useTransition()

    const filtered = useMemo(() => {
        let filteredSegments = segments;

        // Filtro por grupo (prioridade)
        if (selectedGroupId) {
            filteredSegments = filteredSegments.filter(segment =>
                Array.isArray(segment.groups) && segment.groups.includes(selectedGroupId)
            );
        }

        // Filtro por erros
        if (filterErrors && filterErrors.length > 0) {
            filteredSegments = filteredSegments.filter(segment =>
                Array.isArray(segment.errors) && segment.errors.some(err => typeof err?.type === 'string' && filterErrors.includes(err.type))
            );
        }

        // Filtro por status
        if (filterStatus && filterStatus.length > 0) {
            filteredSegments = filteredSegments.filter(segment =>
                filterStatus.includes(segment.status)
            );
        }

        return filteredSegments;
    }, [segments, selectedGroupId, filterErrors, filterStatus])

    const filteredIds = useMemo(() => {
        return filtered.map(segment => segment.id).sort((a, b) => a - b)
    }, [filtered])

    const chunks = useMemo(() => {
        if (!filtered.length) return null;
        return Array.from(
          { length: Math.ceil(filtered.length / chunkSize) },
          (_, i) => filtered.slice(i * chunkSize, (i + 1) * chunkSize)
        );
    }, [chunkSize, filtered]);

    const prevPage = () => {
        if (!chunks || !currentView) return;
        const index = currentView.index - 1;

        if (!chunks[index]) return;

        startTransition(() => {
            setCurrentView({
                segments: [...(chunks[index] || []), ...currentView.segments],
                index
            })
        })
    }

    const nextPage = (indexSelected?: number) => {
        if (!chunks || !currentView) return;
        const index = (indexSelected || currentView.index) + 1;
        console.log(index);
        
        if (!chunks[index]) return;
        
        startTransition(() => {
            if (indexSelected) {
                
                setCurrentView({
                    segments: [...(chunks[index] || [])],
                    index
                })
                
            }  else {

                setCurrentView({
                    segments: [...currentView.segments, ...(chunks[index] || [])],
                    index
                })
            }
        })
    }

    useEffect(() => {
        if (!chunks) {
          setCurrentView(null);
          return;
        }
        setCurrentView({ segments: chunks[0], index: 0 });
    }, [chunks]);

    // const remainingCount = useMemo(() => {
    //     if (!chunks || !currentView) return 0;
    //     const total = filtered.length;
    //     const loaded = currentView.segments.length;
    //     return Math.max(total - loaded, 0);
    // }, [chunks, currentView, filtered.length]);

    const nextLoadCount = useMemo(() => {
        if (!chunks || !currentView) return 0;
        const nextChunk = chunks[currentView.index + 1];
        if (!nextChunk) return 0;
        return nextChunk.length;
    }, [chunks, currentView]);

    const prevLoadCount = useMemo(() => {
        if (!chunks || !currentView) return 0;
        const prevChunk = chunks[currentView.index - 1];
        if (prevChunk &&prevChunk[0]?.id === 1) {
            return 0;
        }
        if (!prevChunk) return 0;
        return prevChunk.length;
    }, [chunks, currentView]);

    // Função de binary search para verificar se um ID existe nos segmentos filtrados
    const binarySearch = (id: number): boolean => {
        let left = 0;
        let right = filteredIds.length - 1;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            
            if (filteredIds[mid] === id) {
                return true;
            } else if (filteredIds[mid] < id) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return false;
    };

    return {
        nextPage,
        prevPage,
        currentView,
        loading: isPending,
        nextLoadCount,
        prevLoadCount,
        filteredIds,
        binarySearch,
        filteredSegments: filtered // ✅ Expor os segmentos filtrados
    }
}