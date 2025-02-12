import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'; // Для ссылки на регистрацию и навигации
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store'; // Убедитесь, что путь правильный
import { loginUserAsync } from '../../store/userSlice'; // Импортируем асинхронное действие
import './Login.css'; // Импортируем стили

interface LoginData {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState<LoginData>({
        email: '',
        password: '',
    });

    const error = useSelector((state: RootState) => state.users.error); // Получаем ошибку из состояния

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Выполняем асинхронное действие для авторизации
        const resultAction = await dispatch(loginUserAsync(loginData));
        // Если авторизация успешна, перенаправляем пользователя
        if (loginUserAsync.fulfilled.match(resultAction)) {
            navigate('/jobs'); // Замените на ваш маршрут
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <div className="login-form">
                        <h2 className="text-center mb-4">Вход</h2>
                        {error && <Alert variant="danger">{error}</Alert>} {/* Отображаем ошибку, если она есть */}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formEmail" className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="Введите email"
                                    value={loginData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formPassword" className="mb-3">
                                <Form.Label>Пароль</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Введите пароль"
                                    value={loginData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100 mb-3">
                                Войти
                            </Button>

                            <div className="text-center">
                                <span>Нет аккаунта? </span>
                                <Link to="/registration">Зарегистрируйтесь</Link>
                            </div>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;