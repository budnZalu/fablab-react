import React from "react";
import './Card.css';
import {Link} from "react-router-dom";


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
            <div className="card-container mb-4 p-0">
                <Link to={`/jobs/${job.id}`}>
                    <div className="d-flex flex-col align-items-center">
                        <img className="card-image" src={job.image} alt={job.name} />
                        <h2 className="card-title">{job.name}</h2>
                        <h3 className="card-price">Цена: {job.price} руб</h3>
                    </div>
                </Link>
            </div>
    );
};

export default Card;
