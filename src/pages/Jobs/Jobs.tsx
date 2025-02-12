import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Card from "../../components/Card/Card.tsx"; // Импортируем компонент карточки
import "./Jobs.css";
import { fetchJobs } from "../../components/Api/Api.tsx";
import { Col, Container, Row } from "react-bootstrap";
import searchIcon from "../../assets/images/search.svg";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs.tsx";
import { setJobName } from "../../store/jobSlice";

interface Job {
    id: string;
    name: string;
    price: number;
    image: string;
}

const Jobs: React.FC = () => {
    const dispatch = useDispatch();
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const jobName = useSelector((state: unknown) => state.jobs.job_name); // Достаем значение из стейта
    const [jobs, setJobs] = React.useState<Job[]>([]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setJobName(e.target.value)); // Обновляем значение в редаксе
    };

    const getJobs = async () => {
        const jobsData = await fetchJobs(jobName);
        console.log(jobsData);
        setJobs(jobsData);
    };

    useEffect(() => {
        getJobs();
    }, [jobName]); // Обновляем список работ при изменении jobName

    return (
        <div>
            <section className="subheader">
                <Breadcrumbs items={[{ label: "Главная", path: "/" }, { label: "Работы", path: "/jobs" }]} />
                <Container fluid className="justify-content-center">
                    <Row className="mx-auto justify-content-between w-80">
                        <Col sm={12} md={6} className={"justify-content-center p-0"}>
                            <div className="flex-row w-100 justify-content-center justify-content-md-start">
                                <div className="stick"></div>
                                <h2 className="subtitle">Наши услуги</h2>
                            </div>
                        </Col>
                        <Col sm={12} md={6} className={"justify-content-center p-0"}>
                            <div className="flex-row w-100 justify-content-center justify-content-md-end">
                                <input
                                    className="search-field"
                                    type="text"
                                    name="job_name"
                                    placeholder="Поиск..."
                                    value={jobName}
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
                        </Col>
                    </Row>
                </Container>
            </section>

            <Container fluid className="cards-container">
                <Row className="justify-content-md-start justify-content-center card-row">
                    {jobs.map((job) => (
                        <Card key={job.id} job={job} />
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default Jobs;
