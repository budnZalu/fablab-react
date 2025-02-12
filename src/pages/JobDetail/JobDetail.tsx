import React, {useEffect, useState} from "react";
import './JobDetail.css';
import {useParams} from "react-router";
import {fetchJobById} from "../../components/Api/Api.tsx";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs.tsx";

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
                <div className="content-box">
                    <div className="flex-row1">
                        <img className="image" src={job.image} alt={job.name} />
                        <div className="flex_col">
                            <h3 className="card-text">{job.info}</h3>
                            <h2 className="price">Цена: {job.price} руб</h2>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default JobDetail;
