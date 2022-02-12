import './index.css';
import 'bootswatch/dist/zephyr/bootstrap.min.css';
import 'react-bootstrap/dist/react-bootstrap.min.js';
import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import reportWebVitals from './reportWebVitals';
import { registerServiceWorker } from './serviceWorker';
import { ToastContainer } from 'react-toastify';
import { StateProvider } from './context/WordsState';

ReactDOM.render(
    <React.StrictMode>
        <StateProvider>
            <BrowserRouter>
                <App title="Learning words" />
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </BrowserRouter>
        </StateProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

registerServiceWorker();
