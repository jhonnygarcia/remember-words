import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';

export const InputSearch = (props: {
    search?: () => void;
    clean?: () => void;
    changeSearch?: (value: string) => void;
    searchValue?: string;
    [key: string]: any;
}) => {
    const input = useRef<HTMLInputElement>(null);
    const { search, searchValue: inputValue, clean, changeSearch, ...config } = props;
    const [text, setText] = useState(inputValue ?? '');
    useEffect(() => {}, [search]);
    return (
        <div style={{ position: 'relative' }}>
            <FontAwesomeIcon
                style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '2em'
                }}
                className="text-primary"
                size="2x"
                icon={faMagnifyingGlass}
                onClick={() => {
                    if (search) search();
                    input.current?.focus();
                }}
            />
            <input
                ref={input}
                style={{ fontSize: '1.9em', width: '100%', padding: '0 2.4rem 0 2.8rem' }}
                type="text"
                value={text}
                onChange={(e) => {
                    setText(e.target.value);
                    changeSearch && changeSearch(e.target.value);
                }}
                {...config}
            />
            {text.length > 0 && (
                <FontAwesomeIcon
                    style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '2em'
                    }}
                    className="text-primary"
                    size="2x"
                    icon={faXmark}
                    onClick={() => {
                        setText('');
                        changeSearch && changeSearch('');
                        input.current?.focus();
                        setTimeout(() => {
                            clean && clean();
                        }, 200);
                    }}
                />
            )}
        </div>
    );
};
