import { useState } from 'react';
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
export const Paged = (props: PagedModel) => {
    const [currentPage, setCurrentPage] = useState(props.currentPage || 1);

    if (!props.totalRecords || props.pageSize <= 0) return null;
    const totalPages = Math.ceil(props.totalRecords / props.pageSize);
    if (totalPages === 1) return null;

    const fetchPageNumbers = (): any[] => {
        if (totalPages > props.maxSize) {
            let right = Math.ceil(props.maxSize / 2) - (props.maxSize % 2);
            if (currentPage + right > totalPages) {
                right = totalPages - currentPage;
            }
            const left = props.maxSize - right - 1;
            let startPage = currentPage - left;
            let endPage = currentPage + right;
            if (startPage < 1) {
                startPage = 1;
                endPage = props.maxSize;
            }
            const pages = range(startPage, endPage);
            return pages;
        }
        return range(1, totalPages);
    };
    const pages = fetchPageNumbers();
    const gotoPage = (page: number) => {
        setCurrentPage(page);
        props.onPageChange({
            currentPage: page,
            pageSize: props.pageSize,
            totalPages: totalPages,
            totalRecords: props.totalRecords
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
                Mostrando desde {(currentPage - 1) * props.pageSize + 1} hasta{' '}
                {currentPage * props.pageSize > props.totalRecords ? props.totalRecords : currentPage * props.pageSize}{' '}
                de {props.totalRecords} registros
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
                            active={currentPage == page}
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
