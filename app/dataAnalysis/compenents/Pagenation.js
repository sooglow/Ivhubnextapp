import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import React from 'react';

function Pagenation({ currentPage, setCurrentPage, totalCount, maxListCount }) {
    const totalPages = Math.ceil(totalCount / maxListCount);

    const handlePreviousClick = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextClick = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className="flex items-center justify-end space-x-2 py-4 text-sm">
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={handlePreviousClick}
                            aria-disabled={currentPage <= 1}
                            tabIndex={currentPage <= 1 ? -1 : undefined}
                            className={
                                currentPage <= 1 ? "pointer-events-none opacity-50" : undefined
                            }
                        />
                    </PaginationItem>
                    {
                        Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + Math.max(1, Math.min(currentPage - 2, totalPages - 4)))
                            .map(page => (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        onClick={() => setCurrentPage(page)}
                                        isActive={currentPage === page}
                                        className="cursor-pointer"
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ))
                    }
                    {totalPages > currentPage + 2 && <PaginationEllipsis />}
                    <PaginationItem>
                        <PaginationNext
                            onClick={handleNextClick}
                            aria-disabled={currentPage >= totalPages}
                            tabIndex={currentPage >= totalPages ? -1 : undefined}
                            className={
                                currentPage >= totalPages ? "pointer-events-none opacity-50" : undefined
                            }
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}

export default Pagenation