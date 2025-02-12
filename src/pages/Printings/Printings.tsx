import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Table, Container, Spinner, Alert, Button, Row, Col, Form} from 'react-bootstrap';
import {AppDispatch, RootState} from '../../store/store';
import {completePrinting, deletePrinting, getPrintings} from '../../store/printingsSlice';
import {useNavigate} from 'react-router-dom';
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs.tsx";
import timeImg from '../../assets/images/time.svg'
import openImg from '../../assets/images/open.svg'
import './Printings.css'

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

    const { isAuthenticated, isStaff } = useSelector((state: RootState) => state.users);

    const [filters, setFilters] = useState({
        status: '',
        start_date: '',
        end_date: ''
    });

    useEffect(() => {
        dispatch(getPrintings(filters));
        const intervalId = setInterval(() => {
            dispatch(getPrintings(filters));
        }, 10000);

        return () => {
            clearInterval(intervalId);
        };
    }, [dispatch, filters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value
        }));
    };

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" variant="primary" />
                <span className="ms-2">Загрузка...</span>
            </Container>
        );
    }

    if (!isAuthenticated) {
        navigate('/login');
        return
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    const handleActionClick = (e: React.MouseEvent, printingId: number, action: 'delete' | 'complete' | 'reject') => {
        e.stopPropagation();

        if (action === 'delete') {
            dispatch(deletePrinting(printingId.toString()));
        } else if (action === 'complete') {
            dispatch(completePrinting({ id: printingId.toString(), status: 'complete' }));
        } else if (action === 'reject') {
            dispatch(completePrinting({ id: printingId.toString(), status: 'reject' }));
        }
    };
    return (
        <Container fluid className="mt-5">
            <Breadcrumbs items={[{label: "Главная", path: "/"}, {label: "Заявки", path: "/printings"}]}/>
            <Row className="mb-3 mt-4 justify-content-center align-items-center">
                <Col md={12} xl={8} className="mb-3">
                    <Form className="mb-4 d-flex gap-2">
                        <Form.Group controlId="statusFilter">
                            <Form.Label>Статус</Form.Label>
                            <Form.Select
                                name="status"
                                value={filters.status}
                                /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
                                // @ts-expect-error
                                onChange={handleFilterChange}
                            >
                                <option value="">Выберите статус</option>
                                {Object.entries(statuses).map(([key, value]) => (
                                    <option key={key} value={key}>
                                        {value}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="startDateFilter">
                            <Form.Label>Дата начала</Form.Label>
                            <Form.Control
                                type="date"
                                name="start_date"
                                value={filters.start_date}
                                onChange={handleFilterChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="endDateFilter">
                            <Form.Label>Дата окончания</Form.Label>
                            <Form.Control
                                type="date"
                                name="end_date"
                                value={filters.end_date}
                                onChange={handleFilterChange}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={() => dispatch(getPrintings(filters))}>Применить фильтры</Button>
                    </Form>
                    <Table striped bordered hover responsive className="mt-3 w-100 tableqr">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название</th>
                            <th>Статус</th>
                            <th>Автор</th>
                            <th>Модератор</th>
                            <th>Сформирована</th>
                            <th>QR</th>
                            {isStaff && <th>Действие</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {printings.map((printing) => (
                            <tr
                                key={printing.id}
                                onClick={() => navigate(`/printings/${printing.id}`)}
                                style={{cursor: 'pointer'}}
                            >
                                <td>{printing.id}</td>
                                <td>{printing.name || '-'}</td>
                                <td>{statuses[printing.status] || printing.status}</td>
                                <td>{printing.author}</td>
                                <td>{printing.moderator || '-'}</td>
                                <td>{(printing.formed_at) ? new Date(printing.formed_at).toLocaleString() : '-'}</td>
                                <td>{printing.status !== 'complete' ? (
                                    <img className="status-icon" src={timeImg} alt="Time Icon" />
                                ) : (
                                    <div className="qr-hover-wrapper">
                                        <img className="status-icon" src={openImg} alt="QR Icon" />
                                        <div className="qr-hover">
                                            {printing.qr && <img className="qr-code" src={`data:image/png;base64,${printing.qr}`} alt="QR Code" />}
                                            <p>Общая стоимость: {printing.total_price} ₽</p>
                                        </div>
                                    </div>
                                )}</td>
                                {isStaff && (
                                    <td>
                                        {printing.status !== 'deleted' && (
                                            <Button variant="danger"
                                                    onClick={(e) => handleActionClick(e, printing.id, 'delete')}>
                                                Удалить
                                            </Button>
                                        )
                                        }
                                        {printing.status === 'formed' && (
                                            <>
                                                <Button variant="success"
                                                        onClick={(e) => handleActionClick(e, printing.id, 'complete')}
                                                        className="ms-2">
                                                    Завершить
                                                </Button>
                                                <Button variant="warning"
                                                        onClick={(e) => handleActionClick(e, printing.id, 'reject')}
                                                        className="ms-2">
                                                    Отклонить
                                                </Button>
                                            </>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
};

export default PrintingList;
