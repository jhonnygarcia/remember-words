import { ChangeEvent, FormEvent, useContext, useState } from 'react';
import { Navbar, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { WordContext } from '../context/WordsState';

interface Props {
    title: string;
    logo: string;
}
export default function Menu({ logo, title }: Props) {
    const { search, setSearch, searchWord } = useContext(WordContext);
    const changeInput = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        searchWord(e.target.value);
    };
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSearch(search);
    };
    return (
        <Navbar className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container-fluid">
                <img src={logo} alt="React Logo" style={{ width: '4rem' }} />
                <Link className="navbar-brand" to="/">
                    {title}
                </Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse className="collapse navbar-collapse" id="basic-navbar-nav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/main">
                                Words
                            </Link>
                        </li>
                    </ul>
                    <Form onSubmit={onSubmit} className="d-flex">
                        <input
                            onChange={changeInput}
                            className="form-control me-2"
                            type="search"
                            value={search}
                            placeholder="Search"
                            aria-label="Search"
                        />
                        <button className="btn btn-secondary my-2 my-sm-0" type="submit">
                            Buscar
                        </button>
                    </Form>
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
}
