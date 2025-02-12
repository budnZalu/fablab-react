// src/pages/PrintingList.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Container, Spinner, Alert } from 'react-bootstrap';
import { AppDispatch, RootState } from '../../store/store';
import { getPrintings } from '../../store/printingsSlice';
import { useNavigate } from 'react-router-dom';

// Маппинг статусов для отображения
const statuses: { [key: string]: string } = {
    draft: 'Черновик',
    deleted: 'Удалена',
    complete: 'Завершена',
    formed: 'Сформирована',
    rejected: 'Отклонена',
};

const PrintingList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { printings, loading, error } = useSelector(
        (state: RootState) => state.printings
    );

    const isAuthenticated = useSelector(
        (state: RootState) => state.users.isAuthenticated
    );

    // Если пользователь не авторизован — отправляем на страницу входа
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // Если не авторизован, ничего не рендерим (перенаправление уже запущено)
    if (!isAuthenticated) return null;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        dispatch(getPrintings());
    }, [dispatch]);

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" variant="primary" />
                <span className="ms-2">Загрузка...</span>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <h1>Мои заявки на печать</h1>
            <Table striped bordered hover responsive className="mt-3">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Статус</th>
                    <th>Автор</th>
                    <th>Модератор</th>
                    <th>Создана</th>
                    <th>Стоимость</th>
                </tr>
                </thead>
                <tbody>
                {printings.map((printing) => (
                    <tr
                        key={printing.id}
                        onClick={() => navigate(`/printings/${printing.id}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        <td>{printing.id}</td>
                        <td>{printing.name || '-'}</td>
                        <td>{statuses[printing.status] || printing.status}</td>
                        <td>{printing.author}</td>
                        <td>{printing.moderator || '-'}</td>
                        <td>{new Date(printing.created_at).toLocaleString()}</td>
                        <td>{printing.total_price !== null ? printing.total_price : '-'}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default PrintingList;
