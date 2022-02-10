import './MainPage.css';
import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { isMobile } from 'react-device-detect';

import { useStateValue } from '../../context/WordsState';
import { WordDto, PagedListDto } from '../../common/dto';
import Word from './Word';

export const MainPage = () => {
    const initialState = {
        search: '',
    };
    const [state, setState] = useState(initialState);
    const { words, setWords, appService } = useStateValue();

    const getWords = async (empty = false) => {
        const payload = {
            search: empty ? '' : state.search,
            page: 1,
            perPage: 100,
        };
        const response = await appService.getWords(payload);
        const resPaged: PagedListDto<WordDto> = response.data;
        setWords(resPaged.data);
    };
    useEffect(() => {
        getWords();
    }, []);
    const searchClick = async () => {
        await getWords();
    };
    const changeInput = (e: ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            search: e.target.value,
        });
        const prevValue = state.search;
        const newValue = e.target.value;
        if (prevValue.length > 0 && newValue == '') {
            getWords(true);
        }
    };
    const keyPress = async (e: KeyboardEvent) => {
        if (e.key?.toLowerCase() == 'enter') {
            await getWords();
        }
    };
    return (
        <div className="container-fluid p-4 page-main">
            <div className="row">
                <div className={isMobile ? 'col container' : 'col-8 container'}>
                    <div className="input-group mb-3">
                        <input
                            onChange={changeInput}
                            onKeyPress={keyPress}
                            type="search"
                            value={state.search}
                            className="form-control"
                        />
                        <button onClick={searchClick} className="btn btn-primary">
                            <FontAwesomeIcon icon={faMagnifyingGlass} size="3x" />
                        </button>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="row">
                        {words.map((word) => (
                            <div key={word._id} className="col-md-3 mt-2">
                                <Word word={word} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
