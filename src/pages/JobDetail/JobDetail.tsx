import React, {useEffect, useState} from "react";
import './JobDetail.css';
import {useParams} from "react-router";
import {fetchJobById} from "../../components/Api/Api.tsx";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs.tsx";
import {Col, Container, Row} from "react-bootstrap";

interface Job {
    id: string;
    name: string;
    price: number;
    image: string;
    info: string;
}

const JobDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();  // Получаем параметр id из URL
    const [job, setJob] = useState<Job | null>(null);  // Храним данные о работе

    useEffect(() => {
        const getJobDetails = async () => {
            const jobData = await fetchJobById(id);  // Получаем подробности работы по id
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            setJob(jobData);
        };

        if (id) {
            getJobDetails();
        }
    }, [id]);

    if (!job) {
        return <div>Загрузка...</div>;
    }

    return (
        <div>
            <section className="subheader">
                <Breadcrumbs items={[{ label: 'Главная', path: '/' }, { label: 'Работы', path: '/jobs' }, { label: job.name, path: `/job/${job.id}` }]} />
                <div className="flex-row">
                    <div className="stick"></div>
                    <h2 className="subtitle">{job.name}</h2>
                </div>
            </section>

            <section className="card-content">
                <Container className="content-box">
                    <Row className="align-items-center">
                        <Col sm={12} md={6} className={'p-0'}>
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
