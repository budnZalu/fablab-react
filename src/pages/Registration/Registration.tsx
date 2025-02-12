import React, { useState } from 'react';
import {Form, Button, Container, Row, Col, Alert} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { registerUserAsync } from '../../store/userSlice';
import { useNavigate } from 'react-router-dom';

const Registration: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const error = useSelector((state: RootState) => state.users.error);

    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const requestData = {
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            password: formData.password,
        }
        const result = await dispatch(registerUserAsync(requestData));
        if (registerUserAsync.fulfilled.match(result)) {
            navigate('/login'); // Перенаправление при успешной регистрации
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <div className="registration-form">
                        <h2 className="text-center mb-4">Регистрация</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formEmail" className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="Введите email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formFirstName" className="mb-3">
                                <Form.Label>Имя</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="firstName"
                                    placeholder="Введите имя"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formLastName" className="mb-3">
                                <Form.Label>Фамилия</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="lastName"
                                    placeholder="Введите фамилию"
                                    value={formData.lastName}
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
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100 mb-3">
                                Зарегистрироваться
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Registration;
