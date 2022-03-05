import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export const InputPassword = (props: { show: boolean; [key: string]: any }) => {
    const { show, ...configs } = props;
    const [pwdShow, setPwdShow] = useState(show);
    const changeShow = () => {
        setPwdShow(!pwdShow);
    };
    return (
        <div className="container-input-password" style={{ position: 'relative' }}>
            <input
                autoComplete="off"
                style={{ backgroundImage: 'none' }}
                {...configs}
                type={pwdShow ? 'text' : 'password'}
            />
            {pwdShow ? (
                <Link
                    to=""
                    style={{ position: 'absolute', right: '0.5rem', top: '20%' }}
                    onClick={(e) => {
                        e.preventDefault();
                        changeShow();
                    }}
                >
                    <FontAwesomeIcon icon={faEyeSlash} size="1x" />
                </Link>
            ) : (
                <Link
                    to=""
                    style={{ position: 'absolute', right: '0.5rem', top: '20%' }}
                    onClick={(e) => {
                        e.preventDefault();
                        changeShow();
                    }}
                >
                    <FontAwesomeIcon icon={faEye} size="1x" />
                </Link>
            )}
        </div>
    );
};
