import { Menu } from './components/Menu';
import { LoginPage } from './pages/login/LoginPage';

import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Home } from './pages/HomePage';
import { MainPage } from './pages/main/MainPage';
import { useState } from 'react';
import { ConfigModal } from './pages/main/ConfigModal';
import { RegisterPage } from './pages/register/RegisterPage';
import { UsersPage } from './pages/user/UsersPage';
import { NoPrivilegesPage } from './pages/NoPrivilegesPage';
import { userTokenStorage, useQueryUserInfo } from './hooks';
import { UserPage } from './pages/user/UserPage';
import { UserEditPage } from './pages/user/UserEditPage';
import { environment } from './environment';
import { IdentityInfo } from './dto/identity-info';
import { appRoutes } from './common/app.routes';
import { NotFoundPage } from './pages/NotFoundPage';
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
    const navigate = useNavigate();
    const location = useLocation();
    const storageUser = userTokenStorage.getUserStorage();
    const [identityInfo, setIdentity] = useState<IdentityInfo | null>(storageUser);
    const {} = useQueryUserInfo({
        staleTime: Infinity,
        onSuccess: (data: IdentityInfo) => {
            setIdentity(data);
        },
        onError: () => {
            setIdentity(null);
            navigate(location.pathname);
        }
    });

    const [state, setState] = useState<StateApp>(initialState);
    const closeModal = () => {
        setState({
            ...state,
            show: false
        });
    };
    const showModal = () => {
        setState({
            ...state,
            show: true
        });
    };

    return (
        <div className="bg-light" style={{ height: '100vh' }}>
            {identityInfo && <Menu openConfig={showModal} title={title} />}
            <Routes>
                <Route path={appRoutes.home} element={identityInfo ? <Home /> : <Navigate to={appRoutes.login} />} />
                <Route
                    path={appRoutes.login}
                    element={identityInfo ? <Navigate to={appRoutes.home} /> : <LoginPage />}
                />
                <Route
                    path={appRoutes.empty}
                    element={identityInfo ? <Navigate to={appRoutes.home} /> : <Navigate to={appRoutes.login} />}
                ></Route>
                <Route
                    path={appRoutes.main}
                    element={identityInfo ? <MainPage /> : <Navigate to={appRoutes.login} />}
                ></Route>
                <Route
                    path={appRoutes.register}
                    element={identityInfo ? <Navigate to={appRoutes.home} /> : <RegisterPage />}
                ></Route>
                <Route
                    path={appRoutes.users}
                    element={
                        identityInfo?.roles.some((r) => r == environment.ROLE_ADMIN) == true ? (
                            <UsersPage />
                        ) : (
                            <Navigate to={appRoutes.no_privileges} />
                        )
                    }
                ></Route>
                <Route
                    path={appRoutes.user_show}
                    element={
                        identityInfo?.roles.some((r) => r == environment.ROLE_ADMIN) == true ? (
                            <UserPage />
                        ) : (
                            <Navigate to={appRoutes.no_privileges} />
                        )
                    }
                ></Route>
                <Route
                    path={appRoutes.user_edit}
                    element={identityInfo ? <UserEditPage /> : <Navigate to={appRoutes.no_privileges} />}
                ></Route>
                <Route path={appRoutes.no_privileges} element={<NoPrivilegesPage />}></Route>
                <Route path={appRoutes.not_found} element={<NotFoundPage />}></Route>
            </Routes>
            <ConfigModal show={state.show} close={closeModal} />
        </div>
    );
};
