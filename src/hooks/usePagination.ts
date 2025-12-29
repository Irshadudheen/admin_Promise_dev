import { useState, useMemo } from 'react'

export interface UsePaginationProps<T> {
    items: T[]
    initialItemsPerPage?: number
}

export interface UsePaginationReturn<T> {
    currentPage: number
    itemsPerPage: number
    totalPages: number
    currentItems: T[]
    goToPage: (page: number) => void
    nextPage: () => void
    previousPage: () => void
    setItemsPerPage: (count: number) => void
    startIndex: number
    endIndex: number
    totalItems: number
}

export function usePagination<T>({
    items,
    initialItemsPerPage = 10
}: UsePaginationProps<T>): UsePaginationReturn<T> {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPageState] = useState(initialItemsPerPage)

    const totalPages = Math.ceil(items.length / itemsPerPage)

    const currentItems = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        return items.slice(startIndex, endIndex)
    }, [items, currentPage, itemsPerPage])

    const startIndex = (currentPage - 1) * itemsPerPage + 1
    const endIndex = Math.min(currentPage * itemsPerPage, items.length)

    const goToPage = (page: number) => {
        const pageNumber = Math.max(1, Math.min(page, totalPages))
        setCurrentPage(pageNumber)
    }

    const nextPage = () => {
        goToPage(currentPage + 1)
    }

    const previousPage = () => {
        goToPage(currentPage - 1)
    }

    const setItemsPerPage = (count: number) => {
        setItemsPerPageState(count)
        setCurrentPage(1) // Reset to first page when changing items per page
    }

    return {
        currentPage,
        itemsPerPage,
        totalPages,
        currentItems,
        goToPage,
        nextPage,
        previousPage,
        setItemsPerPage,
        startIndex,
        endIndex,
        totalItems: items.length
    }
}
