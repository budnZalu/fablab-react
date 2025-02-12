import React, {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import Card from "../../components/Card/Card.tsx";
import "./Jobs.css";
import {Button, Col, Container, Row, Spinner} from "react-bootstrap";
import searchIcon from "../../assets/images/search.svg";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs.tsx";
import {getJobsList, setJobName} from "../../store/jobSlice";
import {AppDispatch, RootState} from "../../store/store.ts";
import cartImg from "../../assets/images/cart.svg"
import editImg from "../../assets/images/edit.svg"
import {getPrinting} from "../../store/printingDraftSlice.ts";
import {Link, useNavigate} from "react-router-dom";


const Jobs: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const {searchValue, jobs, loading} = useSelector((state: RootState) => state.jobs);
    const {isAuthenticated, isStaff} = useSelector((state: RootState) => state.users);

    const id = useSelector((state: RootState) => state.printingDraft.id);
    const count = useSelector((state: RootState) => state.printingDraft.job_count);

    const navigate = useNavigate()

    useEffect(() => {
        dispatch(getJobsList());
    }, [dispatch]);

    const handleClick = async (e: React.FormEvent) => {
        e.preventDefault();
        if (id) {
            dispatch(getPrinting(id.toString()));
            navigate(`/printings/${id}`);
        }
    };

    return (
        <div>
            <section className="subheader">
                <Breadcrumbs items={[{label: "Главная", path: "/"}, {label: "Работы", path: "/jobs"}]}/>
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
                                {
                                    isStaff && (
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-expect-error
                                        <Button as={Link} to="/jobs/manage" variant="Link" className="btn-favorites">
                                            <img src={editImg} alt="Избранное" />
                                        </Button>
                                    )
                                }
                                <input
                                    className="search-field"
                                    type="text"
                                    name="job_name"
                                    placeholder="Поиск..."
                                    value={searchValue}
                                    onChange={(event => dispatch(setJobName(event.target.value)))}
                                />
                                <button type="submit" className="animated" onClick={() => dispatch(getJobsList())}>
                                    <img
                                        className="search-btn"
                                        src={searchIcon}
                                        alt="Поиск"
                                    />
                                </button>
                                <Button variant="Link" className="btn-favorites" onClick={handleClick} disabled={(!isAuthenticated) || (!id)}>
                                    <img src={cartImg} alt="Избранное" />
                                    {(!isAuthenticated || !id) ? null : (
                                        <span className="badge rounded-pill position-absolute">{count}</span>
                                    )}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <Container fluid className="cards-container">
                {
                    loading ? (
                            <div className="containerLoading">
                                <Spinner animation="border"/>
                            </div>
                        ) :
                        jobs.length ? (
                            <Row className="justify-content-md-start justify-content-center card-row">
                                {jobs.map((job) => (
                                    <Card key={job.id} job={job}/>
                                ))}
                            </Row>
                        ) : (
                            <h1>К сожалению, пока ничего не найдено :(</h1>
                        )
                }
            </Container>
        </div>
    );
};

export default Jobs;
