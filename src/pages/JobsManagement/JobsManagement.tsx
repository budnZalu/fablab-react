/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Container, Row, Col, Modal, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { getJobsList, addJobAsync, updateJobAsync, deleteJobAsync, uploadJobImageAsync } from '../../store/jobSlice';
import './JobsManagement.css'
import ForbiddenPage from "../ErrorPages/ForbiddenPage.tsx";
import NotFoundPage from "../ErrorPages/NotFoundPage.tsx";

const JobsManagement: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { jobs, loading, error } = useSelector((state: RootState) => state.jobs);
    const { isStaff } = useSelector((state: RootState) => state.users);

    const [showModal, setShowModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState({ id: undefined, name: '', info: '', price: 0, status: 'visible' });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [jobIdForImage, setJobIdForImage] = useState<number | null>(null);

    useEffect(() => {
        dispatch(getJobsList());
    }, [dispatch]);

    const handleClose = () => {
        setShowModal(false);
        setSelectedJob({ id: undefined, name: '', info: '', price: 0, status: 'visible' });
    };

    const handleShow = (job = { id: undefined, name: '', info: '', price: 0, status: 'visible' }) => {
        setSelectedJob(job);
        setShowModal(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setSelectedJob({ ...selectedJob, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedJob.id) {
            await dispatch(updateJobAsync(selectedJob));
        } else {
            await dispatch(addJobAsync(selectedJob));
        }
        handleClose();
    };

    const handleDelete = async (id: number) => {
        await dispatch(deleteJobAsync(id));
    };

    const handleImageUpload = async () => {
        if (imageFile && jobIdForImage) {
            await dispatch(uploadJobImageAsync({ id: jobIdForImage, file: imageFile }));
            setShowImageModal(false);
            setImageFile(null);
            setJobIdForImage(null);
            dispatch(getJobsList());
        }
    };



    return isStaff ? (
        <Container className="mt-5">
            <Row className="mb-3">
                <Col>
                    <h2>Управление услугами</h2>
                    <Button variant="success" onClick={() => handleShow()}>Добавить услугу</Button>
                </Col>
            </Row>
            {error && <Alert variant="danger">{error}</Alert>}
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Описание</th>
                    <th>Цена</th>
                    <th>Изображение</th>
                    <th>Статус</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {loading ? (
                    <tr><td colSpan={7}>Загрузка...</td></tr>
                ) : (
                    jobs.map((job) => (
                        <tr key={job.id}>
                            <td>{job.id}</td>
                            <td>{job.name}</td>
                            <td>{job.info}</td>
                            <td>{job.price}</td>
                            <td>
                                {job.image ? (
                                    <img src={job.image} alt="Job" width="50" />
                                ) : 'Нет'}
                            </td>
                            <td>{job.status}</td>
                            <td>
                                <Button variant="warning" size="sm" onClick={() => handleShow(job)}>Редактировать</Button>{' '}
                                <Button variant="info" size="sm" onClick={() => { setJobIdForImage(job.id!); setShowImageModal(true); }}>
                                    Изменить изображение
                                </Button>{' '}
                                <Button variant="danger" size="sm" onClick={() => handleDelete(job.id!)}>Удалить</Button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedJob.id ? 'Редактирование услуги' : 'Добавление услуги'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Название</Form.Label>
                            <Form.Control type="text" name="name" value={selectedJob.name} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Описание</Form.Label>
                            <Form.Control type="text" name="info" value={selectedJob.info} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Цена</Form.Label>
                            <Form.Control type="number" name="price" value={selectedJob.price} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Статус</Form.Label>
                            <Form.Select name="status" value={selectedJob.status} onChange={handleChange}>
                                <option value="visible">Видимый</option>
                                <option value="deleted">Удалён</option>
                            </Form.Select>
                        </Form.Group>
                        <Button variant="primary" type="submit">{selectedJob.id ? 'Сохранить' : 'Добавить'}</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showImageModal} onHide={() => setShowImageModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Загрузка изображения</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Выберите файл</Form.Label>
                        <Form.Control type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowImageModal(false)}>Закрыть</Button>
                    <Button variant="primary" onClick={handleImageUpload} disabled={!imageFile}>Загрузить</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    ) : (
        <ForbiddenPage/>
    )
};

export default JobsManagement;
