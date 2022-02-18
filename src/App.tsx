import { Menu } from './components/Menu';
import { LoginPage } from './pages/login/LoginPage';

import { Navigate, Route, Routes } from 'react-router-dom';
import { Home } from './pages/home/Home';
import { MainPage } from './pages/main/MainPage';
import { useStateValue } from './context/WordsState';
import { useState } from 'react';
import { ConfigModal } from './pages/main/ConfigModal';

interface Props {
    title?: string;
}
interface StateApp {
    show: boolean;
}
export const App = ({ title = 'default title' }: Props) => {
    const initialState = {
        show: false
    };
    const { userToken } = useStateValue();
    const [state, setState] = useState<StateApp>(initialState);
    const closeModal = () => {
        setState({
            ...state,
            show: false,
        });
    };
    const showModal = () => {
        setState({
            ...state,
            show: true,
        });
    };

    return (
        <div className="bg-light" style={{ height: '100vh' }}>
            {userToken && <Menu openConfig={showModal} title={title} />}
            <Routes>
                <Route
                    path="/home"
                    element={userToken ? <Home /> : <Navigate to="/login" />}
                />
                <Route
                    path="/login"
                    element={userToken ? <MainPage /> : <LoginPage />}
                />
                <Route
                    path="/"
                    element={userToken ? <MainPage /> : <Navigate to="/login" />}
                ></Route>
                <Route
                    path="/main"
                    element={userToken ? <MainPage /> : <Navigate to="/login" />}
                ></Route>
            </Routes>
            <ConfigModal show={state.show} close={closeModal} />
        </div>
    );
};
