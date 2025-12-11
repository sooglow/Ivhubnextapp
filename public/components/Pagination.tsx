// components/Pagination.tsx
import React from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    canPreviousPage: boolean;
    canNextPage: boolean;
    maxVisiblePages?: number;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    canPreviousPage,
    canNextPage,
    maxVisiblePages = 5,
}: PaginationProps) {
    const getVisiblePages = () => {
        const pages = [];
        const halfVisible = Math.floor(maxVisiblePages / 2);
        let startPage = Math.max(0, currentPage - halfVisible);
        const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

        // 끝에서 시작점 조정
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(0, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    const buttonBaseClass =
        "inline-flex justify-center items-center w-8 h-8 ml-1 border border-[#ddd] rounded-[5px] text-[#3f3e4e] text-[0.9rem] no-underline hover:text-blue-500 transition-colors";
    const activeButtonClass = "bg-[#a5abb9] text-white hover:text-white";
    const disabledButtonClass = "opacity-50 cursor-not-allowed hover:text-[#3f3e4e]";

    return (
        <div className="flex justify-center mt-[15px]">
            <ul className="list-none p-0 flex">
                {/* 첫 페이지 */}
                <li>
                    <button
                        onClick={() => onPageChange(0)}
                        disabled={!canPreviousPage}
                        className={`${buttonBaseClass} ${
                            !canPreviousPage ? disabledButtonClass : ""
                        }`}
                        aria-label="첫 페이지"
                    >
                        {"<<"}
                    </button>
                </li>

                {/* 이전 페이지 */}
                <li>
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={!canPreviousPage}
                        className={`${buttonBaseClass} ${
                            !canPreviousPage ? disabledButtonClass : ""
                        }`}
                        aria-label="이전 페이지"
                    >
                        {"<"}
                    </button>
                </li>

                {/* 페이지 번호들 */}
                {getVisiblePages().map((pageIndex) => (
                    <li key={pageIndex} className={pageIndex === currentPage ? "active" : ""}>
                        <button
                            onClick={() => onPageChange(pageIndex)}
                            className={`${buttonBaseClass} ${
                                pageIndex === currentPage ? activeButtonClass : ""
                            }`}
                            aria-label={`${pageIndex + 1}페이지`}
                            aria-current={pageIndex === currentPage ? "page" : undefined}
                        >
                            {pageIndex + 1}
                        </button>
                    </li>
                ))}

                {/* 다음 페이지 */}
                <li>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={!canNextPage}
                        className={`${buttonBaseClass} ${!canNextPage ? disabledButtonClass : ""}`}
                        aria-label="다음 페이지"
                    >
                        {">"}
                    </button>
                </li>

                {/* 마지막 페이지 */}
                <li>
                    <button
                        onClick={() => onPageChange(totalPages - 1)}
                        disabled={!canNextPage}
                        className={`${buttonBaseClass} ${!canNextPage ? disabledButtonClass : ""}`}
                        aria-label="마지막 페이지"
                    >
                        {">>"}
                    </button>
                </li>
            </ul>
        </div>
    );
}
