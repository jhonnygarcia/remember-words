import { Menu } from './components/Menu';
import { LoginPage } from './pages/login/LoginPage';

import { Navigate, Route, Routes } from 'react-router-dom';
import { Home } from './pages/home/Home';
import { MainPage } from './pages/main/MainPage';
import { useStateValue } from './context/WordsState';
import { useEffect, useState } from 'react';
import { ConfigModal } from './pages/main/ConfigModal';
import { IdentityInfo } from './common/dto/identity-info';
import { helper } from './common/helpers.function';
import { environment } from './environment';

interface Props {
    title?: string;
}
interface StateApp {
    show: boolean;
    loggedin: boolean;
}
export const App = ({ title = 'default title' }: Props) => {
    const initialState = {
        show: false,
        loggedin: false,
    };
    const { user, setToken, appService, setUser } = useStateValue();
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
    const getLogged = async () => {
        const token = localStorage.getItem(environment.keyTokenStorage);
        if (!token) return;
        const res = await helper.axiosCall({
            request: appService.userProfile(token),
            observe: 'body',
        });

        if (res.success) {
            setUser(res.response);
            setState({ ...state, loggedin: true });
        } else {
            setToken('');
            setState({ ...state, loggedin: false });
        }
    };

    const logoutOk = () => {
        setState({ ...state, loggedin: false });
    };

    const loggedinOk = () => {
        setState({ ...state, loggedin: true });
    };
    useEffect(() => {
        getLogged();
    }, []);

    return (
        <div className="bg-light" style={{ height: '100vh' }}>
            {state.loggedin && (
                <Menu afterLogout={logoutOk} openConfig={showModal} title={title} />
            )}
            <Routes>
                <Route
                    path="/home"
                    element={state.loggedin ? <Home /> : <Navigate to="/login" />}
                />
                <Route path="/login" element={state.loggedin ? <MainPage /> : <LoginPage loggedinOk={loggedinOk} />} />
                <Route
                    path="/"
                    element={state.loggedin ? <MainPage /> : <Navigate to="/login" />}
                ></Route>
                <Route
                    path="/main"
                    element={state.loggedin ? <MainPage /> : <Navigate to="/login" />}
                ></Route>
            </Routes>
            <ConfigModal show={state.show} close={closeModal} />
        </div>
    );
};
