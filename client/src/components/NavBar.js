import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { NavLink } from 'react-router-dom';
import { ADMIN_ROUTE, INFOPAGE_ROUTE, LOGIN_ROUTE } from '../utils/consts';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { IoMdSettings } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";

const NavBar = observer(() => {
    const { user } = useContext(Context);
    const navigate = useNavigate();

    const logOut = () => {
        user.setUser({});
        user.setIsAuth(false);
    };

    return (
        <>
            <Navbar style={{ position: "sticky", zIndex: "10", top: "0", left: "0" }} bg="dark" data-bs-theme="dark">
                <Container>
                    <NavLink
                        style={{ color: 'white', fontSize: '35px', textDecoration: 'none', fontWeight: "600", userSelect: 'none' }}
                        to={INFOPAGE_ROUTE}
                    >
                        СИН
                    </NavLink>
                    {user.isAuth ?
                        <Nav className="mr-auto" style={{ color: 'white', alignItems: "center" }}>
                            <span style={{ color: 'white', marginLeft: '15px', marginRight: '15px', border: "2px solid white", padding: "5px", borderRadius: "5px" }}>
                                Вы: {user.user.name}
                            </span>
                            {user.user.role === 'ADMIN' && (
                                <Button
                                    variant={'outline-light'}
                                    onClick={() => navigate(ADMIN_ROUTE)}
                                >
                                    Админ панель
                                </Button>
                            )}
                            <Button
                                variant={'outline-light'}
                                className="ms-4"
                                onClick={() => {
                                    navigate(LOGIN_ROUTE);
                                    logOut();
                                }}
                            >
                                Выйти
                            </Button>
                            {user.user.role === 'ADMIN' && (
                                user.edit ?
                                    <IoMdSettings
                                        style={{
                                            fontSize: "30px",
                                            cursor: "pointer",
                                            marginLeft: "20px",
                                            color: "white"
                                        }}
                                        onClick={() => { user.setEdit(false) }}
                                    />
                                    :
                                    <IoSettingsOutline
                                        style={{
                                            fontSize: "30px",
                                            cursor: "pointer",
                                            marginLeft: "20px",
                                            color: "white"
                                        }}
                                        onClick={() => { user.setEdit(true) }}
                                    />
                            )}
                        </Nav>
                        :
                        <Nav className="mr-auto" style={{ color: 'white' }}>
                            <Button variant={'outline-light'} onClick={() => navigate(LOGIN_ROUTE)}>Авторизация</Button>
                        </Nav>
                    }
                </Container>
            </Navbar>
        </>
    );
});

export default NavBar;
