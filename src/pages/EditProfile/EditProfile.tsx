import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { updateUserAsync, fetchCurrentUserAsync } from '../../store/userSlice';
import { useNavigate } from 'react-router-dom';

const EditProfile: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    // Загружаем данные пользователя
    const { id, email, firstName, lastName, error, isAuthenticated } = useSelector((state: RootState) => state.users);

    // Локальное состояние формы
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
    });

    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Когда данные приходят, обновляем `formData`
    useEffect(() => {
        if (email && firstName && lastName) {
            setFormData({ email, firstName, lastName });
        }
    }, [email, firstName, lastName]);

    // Запрос данных пользователя при заходе на страницу
    useEffect(() => {
        if (isAuthenticated && !id) {
            dispatch(fetchCurrentUserAsync());
        }
    }, [dispatch, isAuthenticated, id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!id) return;

        const requestData = {
            id,
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
        };

        const result = await dispatch(updateUserAsync(requestData));
        if (updateUserAsync.fulfilled.match(result)) {
            setSuccessMessage('Данные успешно обновлены');
            setTimeout(() => {
                setSuccessMessage(null);
                navigate('/profile');
            }, 2000);
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <div className="edit-profile-form">
                        <h2 className="text-center mb-4">Изменение данных</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {successMessage && <Alert variant="success">{successMessage}</Alert>}
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

                            <Button variant="primary" type="submit" className="w-100 mb-3">
                                Сохранить изменения
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default EditProfile;
