import React, {useEffect} from "react";
import './JobDetail.css';
import {useParams} from "react-router";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs.tsx";
import {Col, Container, Row, Spinner} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store/store.ts";
import NotFoundPage from "../ErrorPages/NotFoundPage.tsx";
import {getJobById} from "../../store/jobSlice.ts";


const JobDetail: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { id } = useParams<{ id: string }>(); // Получаем id из URL
    const { jobs, loading } = useSelector((state: RootState) => state.jobs);

    useEffect(() => {
        if (id) {
            dispatch(getJobById(Number(id)));
        }
    }, [id, dispatch]);

    const job = jobs.find((job) => job.id === Number(id));

    if (loading) {
        return (
            <div className="containerLoading">
                <Spinner animation="border"/>
            </div>
        )
    }

    if (!job) {
        return <NotFoundPage/>;
    }

    return (
        <div>
            <section className="subheader">
                <Breadcrumbs items={[{label: 'Главная', path: '/'}, {label: 'Работы', path: '/jobs'}, {
                    label: job.name,
                    path: `/job/${job.id}`
                }]}/>
                <div className="flex-row">
                    <div className="stick"></div>
                    <h2 className="subtitle">{job.name}</h2>
                </div>
            </section>

            <section className="card-content">
                <Container className="content-box">
                    <Row className="align-items-center">
                        <Col sm={12} md={6} className={'p-0'}>
                            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                            {/* @ts-expect-error */ }
                            <img className="image" src={job.image} alt={job.name}/>
                        </Col>
                        <Col sm={12} md={6} className={'mt-4 mb-4'}>
                            <h3 className="card-text mb-4">{job.info}</h3>
                            <h2 className="price">Цена: {job.price} руб</h2>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default JobDetail;
