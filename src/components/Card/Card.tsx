import React from "react";
import './Card.css';
import {Link} from "react-router-dom";
import {Col} from "react-bootstrap";

interface Job {
    id: string;
    name: string;
    price: number;
    image: string;
}

interface CardProps {
    job: Job;
}

const Card: React.FC<CardProps> = ({ job }) => {
    return (
        <Col xs={12} sm={6} md={4} lg={3} className={'d-flex justify-content-center mb-4'}> {/* Настроим разные размеры для разных экранов */}
            <div className="card-container">
                <Link to={`/jobs/${job.id}`}>
                    <div className="flex-col">
                        <img className="card-image" src={job.image} alt={job.name} />
                        <h2 className="card-title">{job.name}</h2>
                        <h3 className="card-price">Цена: {job.price} руб</h3>
                    </div>
                </Link>
            </div>
        </Col>
    );
};

export default Card;
