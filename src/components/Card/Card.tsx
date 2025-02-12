import React from "react";
import './Card.css';
import { Link } from "react-router-dom";
import { Job } from "../../api/api.ts";
import imgPlaceholder from '../../assets/images/img-placeholder.png';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store.ts";
import { Button } from "react-bootstrap";
import { addJobToPrinting } from "../../store/printingDraftSlice.ts";
import { getJobsList } from "../../store/jobSlice.ts";

interface CardProps {
    job: Job;
}

const Card: React.FC<CardProps> = ({ job }) => {
    const dispatch = useDispatch<AppDispatch>();
    const isAuthenticated = useSelector((state: RootState) => state.users.isAuthenticated);

    const handleAdd = async (e: React.MouseEvent) => {
        e.preventDefault(); // Предотвращаем переход по ссылке
        if (job.id) {
            await dispatch(addJobToPrinting(job.id));
            await dispatch(getJobsList()); // Для обновления отображения состояния иконки "корзины"
        }
    };



    return (
        <div className="card-container mb-4 p-0">
            <Link to={`/jobs/${job.id}`} className="card-link">
                <div className="card-content">
                    <img className="card-image" src={job.image ? job.image : imgPlaceholder} alt={job.name} />
                    <h2 className="card-title">{job.name}</h2>
                    <h3 className="card-price mb-3">Цена: {job.price} руб</h3>
                </div>
            </Link>
            {isAuthenticated && (
                <div className="card-btn-wrapper">
                    <Button className="card-btn" onClick={handleAdd}>
                        Добавить
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Card;