import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Card, Container, Form, Spinner, Alert, Row, Col, Image} from "react-bootstrap";
import {AppDispatch, RootState} from "../../store/store";
import {
    getPrinting,
    updatePrinting,
    setPrintingData,
    submitPrinting,
    deletePrinting, deleteJobInPrinting, setJobs, updateJobInPrinting
} from "../../store/printingDraftSlice";
import JobCard from "../../components/JobCard/JobCard.tsx";
import FavImage from "../../assets/images/cart.svg";
import NotFoundPage from "../ErrorPages/NotFoundPage.tsx";
import ForbiddenPage from "../ErrorPages/ForbiddenPage.tsx";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs.tsx";

const statuses = {
    'draft': 'Черновик',
    'deleted': 'Удалена',
    'complete': 'Завершена',
    'formed': 'Сформирована',
    'rejected': 'Отклонена'
}


const PrintingDetail: React.FC = () => {
    const {id} = useParams(); // Получаем ID заявки из URL
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const {printingData, printingjob_set, error, loading, isDraft} = useSelector(
        (state: RootState) => state.printingDraft
    );
    const {isStaff} = useSelector((state: RootState) => state.users);
    const [ready, setReady] = useState(false);
    const [isSaved, setIsSaved] = useState(false); // Новый флаг

    useEffect(() => {
        if (printingData.name && isSaved) {
            setReady(true);
        } else {
            setReady(false);
        }
    }, [printingData.name, isSaved]);

    useEffect(() => {
        if (id) {
            dispatch(getPrinting(id)).then(() => {
                    console.log(printingData);
                    setIsSaved(true);
                }
            ); // Загружаем данные заявки
        }
    }, [dispatch, id]);

    // Обработчик изменения полей формы
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setIsSaved(false);
        dispatch(
            setPrintingData({
                ...printingData,
                [name]: value,
            })
        );
    };

    // Обработчик сохранения изменений
    const handleSave = () => {
        if (id) {
            const printingDataToSend = {
                name: printingData.name ?? "",
                author: printingData.author ?? "",
                status: printingData.status ?? "draft",
                total_price: printingData.total_price ?? 0,
            };
            dispatch(updatePrinting({
                id, data: printingDataToSend
            }));
            setIsSaved(true);
        }
    };

    // Обработчик удаления заявки
    const handleDelete = async () => {
        if (id) {
            try {
                await dispatch(deletePrinting(id));
                navigate("/printings"); // Переход на страницу заявок после удаления
            } catch (error) {
                console.error("Ошибка при удалении заявки:", error);
            }
        }
    };

    const handleDeleteJob = async (jobId: number) => {
        if (jobId) {
            try {
                await dispatch(deleteJobInPrinting({id: jobId.toString()}));
                dispatch(
                    setJobs(printingjob_set.filter(job => job.job.id !== jobId))
                );
            } catch (error) {
                console.error("Ошибка при удалении работы:", error);
            }
        }
    };

    const handleUpdateJob = async (jobId: number, duration: number) => {
        if (jobId) {
            console.log(duration)
            try {
                dispatch(updateJobInPrinting({id: jobId.toString(), data: {duration: duration}}));
            } catch (error) {
                console.error("Ошибка при изменении длительности работы:", error);
            }
        }
    };

    // Обработчик отправки заявки
    const handleSubmitPrinting = async () => {
        if (id) {
            try {
                await dispatch(submitPrinting(id));
                navigate("/printings"); // Переход на страницу заявок после отправки
            } catch (error) {
                console.error("Ошибка при отправке заявки:", error);
            }
        }
    };


    if (loading) {
        return (
            <Container className="mt-5">
                <div className="mt-3 mb-3">
                </div>
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{minHeight: "200px"}}
                >
                    <Spinner animation="border" variant="primary"/>
                    <span className="ms-2">Загрузка...</span>
                </div>
            </Container>
        );
    }

    if (printingData.status === 'deleted' && !isStaff) {
        return (
            <NotFoundPage/>
        )
    }

    if (error) {
        if (error.includes('404')) {
            return (
                <NotFoundPage/>
            )
        }
        if (error.includes('403')) {
            return (
                <ForbiddenPage/>
            )
        }
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="mt-5">
            <Breadcrumbs items={[{label: 'Главная', path: '/'}, {label: 'Заявки', path: '/printings'}, {label: printingData.name ?? "Черновик", path: `/printings/${id}`}]}/>
            <Row className="mb-3 mt-4 justify-content-center align-items-center">
                <Col sm={12} md={8} className="mb-3">
                    <Card className="shadow-sm mb-3">
                        <Card.Body>
                            <Row>
                                <Col md={10} xs={10} className="align-items-center justify-content-center">
                                    <h1>Заявка на печать</h1>
                                </Col>
                                <Col md={2} xs={2}>
                                    <Image src={FavImage} rounded/>
                                </Col>
                            </Row>

                            {/* Форма для редактирования заявки */}
                            <Form>
                                <Form.Group className="mb-3" controlId="printingName">
                                    <Form.Label>Название заявки</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={printingData.name ?? ""}
                                        onChange={handleInputChange}
                                        disabled={!isDraft}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="printingAuthor">
                                    <Form.Label>Автор</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="author"
                                        value={printingData.author ?? ""}
                                        onChange={handleInputChange}
                                        disabled={true}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="printingStatus">
                                    <Form.Label>Статус</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="status"
                                        value={statuses[printingData.status] ?? ""}
                                        onChange={handleInputChange}
                                        disabled={true}
                                    />
                                </Form.Group>
                                {
                                    printingData.total_price === 0 && (
                                        <Form.Group className="mb-3" controlId="printingTotalPrice">
                                            <Form.Label>Общая стоимость</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="total_price"
                                                value={printingData.total_price ?? 0}
                                                onChange={handleInputChange}
                                                disabled={true}
                                            />
                                        </Form.Group>

                                    )
                                }

                                {isDraft && (
                                    <Button variant="success" className="me-2" onClick={handleSave}>
                                        Сохранить изменения
                                    </Button>
                                )}
                            </Form>
                        </Card.Body>
                    </Card>

                    {/* Карточка с выбранными услугами */}
                    <Card className="shadow-sm mb-3">
                        <Card.Body>
                            <h5 className="mb-3">Выбранные услуги</h5>
                            {printingjob_set && printingjob_set.length ? (
                                printingjob_set.map((item) => (
                                    <JobCard
                                        key={item.job.id}
                                        job_id={item.job.id}
                                        name={item.job.name}
                                        info={item.job.info}
                                        price={item.job.price}
                                        image={item.job.image}
                                        duration={item.duration}
                                        imageClickHandler={() => navigate(`/jobs/${item.job.id}`)}
                                        onUpdateDuration={handleUpdateJob}
                                        onRemove={handleDeleteJob}
                                        isDraft={isDraft}
                                    />
                                ))
                            ) : (
                                <section className="jobs-not-found">
                                    <h1>К сожалению, пока ничего не найдено :(</h1>
                                </section>
                            )}
                        </Card.Body>
                    </Card>

                    {/* Кнопки для удаления и отправки заявки */}
                    <div className="d-flex justify-content-between gap-2 mb-4">
                        {isDraft && (
                            <Button variant="danger" onClick={handleDelete}>
                                Удалить заявку
                            </Button>
                        )}
                        {isDraft && (
                            <Button variant="success" onClick={handleSubmitPrinting} disabled={!ready}>
                                Отправить заявку
                            </Button>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default PrintingDetail;