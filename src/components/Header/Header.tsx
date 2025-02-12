import React from "react";
import { Link, useNavigate } from "react-router-dom";
import './Header.css';
import { Navbar, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store"; // Убедитесь в правильности пути
import { logoutUserAsync } from "../../store/userSlice"; // Импортируем экшен для выхода

const Header: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state: RootState) => state.users.isAuthenticated);
    const firstName = useSelector((state: RootState) => state.users.firstName);
    const lastName = useSelector((state: RootState) => state.users.lastName);

    const handleLogout = async () => {
        try {
            await dispatch(logoutUserAsync()).unwrap();
            navigate("/"); // Перенаправляем на главную после выхода
        } catch (error) {
            console.error("Ошибка при выходе:", error);
        }
    };

    return (
        <Navbar expand="lg" className="header">
            <Navbar.Brand as={Link} to="/" className="header-title-link">
                <h2 className="title">FabLab Moscow</h2>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav">
                <Nav className="ms-auto">
                    <Nav.Link as={Link} to="/jobs" className="header-link">
                        Работы
                    </Nav.Link>

                    {isAuthenticated ? (
                        <>
                            <Nav.Link as={Link} to="/printings" className="header-link">
                                Заявки
                            </Nav.Link>
                            <Nav.Link as={Link} to="/profile" className="header-link">
                                {firstName} {lastName}
                            </Nav.Link>
                            <Nav.Link
                                as="button"
                                className="header-link"
                                onClick={handleLogout}
                            >
                                Выйти
                            </Nav.Link>
                        </>
                    ) : (
                        <>
                            <Nav.Link as={Link} to="/login" className="header-link">
                                Войти
                            </Nav.Link>
                            <Nav.Link as={Link} to="/registration" className="header-link">
                                Регистрация
                            </Nav.Link>
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;