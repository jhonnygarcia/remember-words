import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { isMobile } from 'react-device-detect';

import Word from './Word';
import { NewWord } from './NewWord';
import { useQueryWords } from '../../hooks/words.hook';
import { Paged, PagedInfo } from '../../components/Paged';

export const MainPage = () => {
    const [search, setSearch] = useState('');
    const [paginate, setPaginate] = useState({
        perPage: 10,
        currentPage: 1
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

    const changeInput = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };
    const keyPress = (e: KeyboardEvent) => {
        if (e.key?.toLowerCase() == 'enter') {
            refetch();
        }
    };
    const pageChanged = (info: PagedInfo) => {
        setPaginate({
            ...paginate,
            currentPage: info.currentPage
        });
    };
    useEffect(() => {
        refetch();
    }, [paginate]);
    return (
        <>
            <div className="container-fluid p-4 page-main">
                <div className="row">
                    <div className={isMobile ? 'col container' : 'col-8 container'}>
                        <div className="input-group mb-3">
                            <input
                                onChange={changeInput}
                                onKeyPress={keyPress}
                                type="text"
                                value={search}
                                className="form-control"
                            />
                            <button onClick={() => refetch()} className="btn btn-primary">
                                <FontAwesomeIcon icon={faMagnifyingGlass} size="3x" />
                            </button>
                        </div>
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
                                    <Word word={word} />
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
                            maxSize={5}
                            onPageChange={pageChanged}
                        ></Paged>
                    </div>
                </div>
            </div>
        </>
    );
};
