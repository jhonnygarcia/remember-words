import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { isMobile } from 'react-device-detect';

import { useStateValue } from '../../context/WordsState';
import { WordDto, PagedListDto } from '../../common/dto';
import Word from './Word';
import { NewWord } from './NewWord';
import { WordFormModal } from './WordFormModal';

interface MainState {
    search: string;
    showForm: boolean;
    wordId: string | null;
}
export const MainPage = () => {
    const initialState = {
        search: '',
        showForm: false,
        wordId: null,
    };
    const [state, setState] = useState<MainState>(initialState);
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
    const openNewWord = () => {
        setState({ ...state, wordId: null, showForm: true });
    };
    const openEditWord = (wordId: string) => {
        setState({ ...state, showForm: true, wordId: wordId });
    };
    const closeModal = () => {
        setState({ ...state, showForm: false });
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
                            <div className="col-sm-3 col-md-3 mt-2">
                                <NewWord openNewWord={openNewWord} />
                            </div>
                            {words.map((word) => (
                                <div key={word._id} className="col-sm-3 col-md-3 mt-2">
                                    <Word
                                        refreshWords={getWords}
                                        word={word}
                                        openEdit={openEditWord}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <WordFormModal
                refreshWords={getWords}
                wordId={state.wordId}
                show={state.showForm}
                close={closeModal}
            />
        </>
    );
};
