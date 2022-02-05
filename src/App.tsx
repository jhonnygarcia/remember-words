import logo from './logo.svg';
import WordList from './components/WordList';
import WordForm from './components/WordForm';
import Menu from './components/Menu';
import { Home } from './components/Home';

import { WordProvider } from './context/WordsState';
import { Route, Routes } from 'react-router-dom';
interface Props {
    title?: string;
}

export const MainWords = () => {
    return (
        <main className="container-fluid p-4">
            <div className="row">
                <div className="col-md-3">
                    <WordForm />
                </div>
                <div className="col-md-9">
                    <div className="row">
                        <WordList />
                    </div>
                </div>
            </div>
        </main>
    );
};

export const App = ({ title = 'default title' }: Props) => {
    return (
        <div className="bg-light" style={{ height: '100vh' }}>
            <WordProvider>
                <Menu title={title} logo={logo} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/main" element={<MainWords />} />
                </Routes>
            </WordProvider>
        </div>
    );
};
