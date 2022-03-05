import { ChangeEvent, KeyboardEvent, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { isMobile } from 'react-device-detect';

import { WordDto } from '../../dto';
import Word from './Word';
import { NewWord } from './NewWord';
import { useQueryWords } from '../../hooks/words.hook';

interface MainState {
    search: string;
    words: WordDto[];
}
export const MainPage = () => {
    const initialState = {
        search: '',
        words: [],
    };
    const [state, setState] = useState<MainState>(initialState);

    const { data: pagedWords, refetch } = useQueryWords(state.search);

    const changeInput = (e: ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, search: e.target.value });
    };
    const keyPress = (e: KeyboardEvent) => {
        if (e.key?.toLowerCase() == 'enter') {
            refetch();
        }
    };
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
                                value={state.search}
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
                            {pagedWords?.data.map((word) => (
                                <div key={word._id} className="col-sm-3 col-md-3 mt-2">
                                    <Word word={word} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
