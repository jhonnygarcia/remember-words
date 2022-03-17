import { KeyboardEvent, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';

import Word from './Word';
import { NewWord } from './NewWord';
import { useQueryWords } from '../../hooks/words.hook';
import { Paged, PagedInfo } from '../../components/Paged';
import { useQueryConfig } from '../../hooks';
import { InputSearch } from '../../components/InputSearch';

export const MainPage = () => {
    const [search, setSearch] = useState('');

    const [paginate, setPaginate] = useState({
        perPage: 10,
        currentPage: 1
    });
    const { data: config } = useQueryConfig({
        staleTime: Infinity
    });
    const { data, refetch } = useQueryWords(
        () => {
            const payload = {
                search,
                page: paginate.currentPage,
                perPage: paginate.perPage
            };
            return payload;
        },
        {
            enabled: false
        }
    );

    const pageChanged = (info: PagedInfo) => {
        setPaginate({ ...paginate, currentPage: info.currentPage });
    };
    const changeSearchInput = (value: string) => {
        setSearch(value);
    };
    const keyPress = (e: KeyboardEvent) => {
        if (e.key?.toLowerCase() == 'enter') {
            setPaginate({ ...paginate, currentPage: 1 });
        }
    };
    useEffect(() => {
        refetch();
    }, [paginate]);
    return (
        <div className="container-fluid p-4 page-main">
            <div className="row">
                <div className={isMobile ? 'col container' : 'col-8 container'}>
                    <InputSearch
                        onKeyPress={keyPress}
                        searchValue={search}
                        changeSearch={changeSearchInput}
                        clean={() => {
                            setPaginate({ ...paginate, currentPage: 1 });
                        }}
                        search={() => {
                            setPaginate({ ...paginate, currentPage: 1 });
                        }}
                        className="form-control"
                    />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="row">
                        <div className="col-sm-3 col-md-3 mt-2">
                            <NewWord />
                        </div>
                        {data?.data.map((word) => (
                            <div key={word._id} className="col-sm-3 col-md-3 mt-2">
                                <Word word={word} sort_spanish_first={config?.sort_spanish_first || false} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="row my-3">
                <div className="col">
                    <Paged
                        totalRecords={data?.meta.totalCount}
                        pageSize={paginate.perPage}
                        currentPage={paginate.currentPage}
                        maxSize={4}
                        onPageChange={pageChanged}
                    />
                </div>
            </div>
        </div>
    );
};
