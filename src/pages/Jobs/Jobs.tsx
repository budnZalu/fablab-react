import React, {useEffect, useState} from "react";
import Card from "../../components/Card/Card.tsx"; // Импортируем компонент карточки
import './Jobs.css';
import {fetchJobs} from "../../components/Api/Api.tsx";
import {Container, Row} from "react-bootstrap";
import searchIcon from '../../assets/images/search.svg'
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs.tsx";

interface Job {
    id: string;
    name: string;
    price: number;
    image: string;
}


const Jobs: React.FC = () => {
    const [searchValue, setSearchValue] = useState<string>("");
    const [jobs, setJobs] = useState<Job[]>([]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const getJobs = async () => {
        const jobsData = await fetchJobs(searchValue);
        console.log(jobsData);
        setJobs(jobsData);
    };

    useEffect(() => {
        getJobs();
    }, [])

    return (
        <div>
            <section className="subheader">
                <Breadcrumbs items={[{ label: 'Главная', path: '/' }, { label: 'Работы', path: '/jobs' }]} />
                <div className="flex-row">
                    <div className="stick"></div>
                    <h2 className="subtitle">Наши услуги</h2>
                    <div className="flexRow">
                        <input
                            className="search-field"
                            type="text"
                            name="job_name"
                            placeholder="Поиск..."
                            value={searchValue}
                            onChange={handleSearchChange}
                        />
                        <button type="submit" className="animated" onClick={() => getJobs()}>
                            <img
                                className="search-btn"
                                src={searchIcon}
                                alt="Поиск"
                            />
                        </button>
                    </div>
                </div>
            </section>

            <Container fluid className="cards-container">
                <Row className="justify-content-start">
                    {jobs.map((job) => (
                        <Card key={job.id} job={job}/>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default Jobs;
