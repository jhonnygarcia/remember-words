import React from 'react';
import { Pagination } from 'react-bootstrap';
export interface PagedInfo {
    totalPages: number;
    totalRecords?: number;
    pageSize: number;
    currentPage: number;
}
interface PagedModel {
    totalRecords?: number;
    pageSize: number;
    maxSize: number;
    currentPage: number;
    onPageChange: (info: PagedInfo) => void;
}

const range = (from: number, to: number, step = 1) => {
    let i = from;
    const range = [];

    while (i <= to) {
        range.push(i);
        i += step;
    }

    return range;
};
const PrivatePaged = ({ currentPage, pageSize, maxSize, totalRecords, onPageChange }: PagedModel) => {
    if (!totalRecords || pageSize <= 0) return null;
    const totalPages = Math.ceil(totalRecords / pageSize);
    if (totalPages === 1) return null;

    const fetchPageNumbers = (): any[] => {
        if (totalPages > maxSize) {
            let right = Math.ceil(maxSize / 2) - (maxSize % 2);
            if (currentPage + right > totalPages) {
                right = totalPages - currentPage;
            }
            const left = maxSize - right - 1;
            let startPage = currentPage - left;
            let endPage = currentPage + right;
            if (startPage < 1) {
                startPage = 1;
                endPage = maxSize;
            }
            const pages = range(startPage, endPage);
            return pages;
        }
        return range(1, totalPages);
    };
    const pages = fetchPageNumbers();

    const gotoPage = (page: number) => {
        onPageChange({
            currentPage: page,
            pageSize: pageSize,
            totalPages: totalPages,
            totalRecords: totalRecords
        });
    };
    const handleClick = (page: number) => {
        gotoPage(page);
    };
    const handleMoveLeft = () => {
        gotoPage(currentPage - 1);
    };
    const handleMoveRight = () => {
        gotoPage(currentPage + 1);
    };

    return (
        <div className="d-flex flex-row flex-wrap justify-content-between">
            <span>
                Mostrando desde {(currentPage - 1) * pageSize + 1} hasta{' '}
                {currentPage * pageSize > totalRecords ? totalRecords : currentPage * pageSize} de {totalRecords}{' '}
                registros
            </span>
            <Pagination>
                <Pagination.First
                    disabled={currentPage == 1}
                    onClick={(e) => {
                        e.preventDefault();
                        handleClick(1);
                    }}
                />
                <Pagination.Prev
                    disabled={currentPage == 1}
                    onClick={(e) => {
                        e.preventDefault();
                        handleMoveLeft();
                    }}
                />
                {pages.map((page, index) => {
                    return (
                        <Pagination.Item
                            key={index}
                            active={page == currentPage}
                            onClick={(e) => {
                                e.preventDefault();
                                handleClick(page);
                            }}
                        >
                            {page}
                        </Pagination.Item>
                    );
                })}
                <Pagination.Next
                    disabled={currentPage == totalPages}
                    onClick={(e) => {
                        e.preventDefault();
                        handleMoveRight();
                    }}
                />
                <Pagination.Last
                    disabled={currentPage == totalPages}
                    onClick={(e) => {
                        e.preventDefault();
                        handleClick(totalPages);
                    }}
                />
            </Pagination>
        </div>
    );
};
export const Paged = React.memo(PrivatePaged, (prev, next) => {
    return (
        prev.currentPage == next.currentPage &&
        prev.maxSize == next.maxSize &&
        prev.pageSize == next.pageSize &&
        prev.totalRecords == next.totalRecords
    );
});
