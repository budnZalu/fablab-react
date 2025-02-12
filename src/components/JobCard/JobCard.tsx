import {FC} from "react";
import {Card, Row, Col, Image, Button} from "react-bootstrap";
import "./JobCard.css"; // Стили для карточки

interface JobCardProps {
    job_id: number;
    name: string;
    info: string;
    price: number;
    image: string | null;
    duration: number;
    onRemove?: (jobId: number) => Promise<void>; // Функция для удаления услуги из корзины
    onUpdateDuration?: (jobId: number, duration: number) => void; // Функция для обновления длительности
    imageClickHandler?: () => void; // Обработчик клика по изображению
    isDraft: boolean;
}

const JobCard: FC<JobCardProps> = ({
                                       job_id,
                                       name,
                                       info,
                                       price,
                                       image,
                                       duration,
                                       onRemove,
                                       onUpdateDuration,
                                       imageClickHandler,
                                       isDraft
                                   }) => {
    function handleRemove() {
        if (onRemove) {
            onRemove(job_id)
        }
    }

    return (
        <Card className="job-card">
            <Row className="g-0">
                {/* Изображение услуги */}
                <Col md={3} className="d-flex align-items-center justify-content-center">
                    {image && (
                        <Image
                            src={image}
                            alt={name}
                            className="job-card-image"
                            fluid
                            onClick={imageClickHandler} // Обработчик клика по изображению
                            style={{cursor: imageClickHandler ? "pointer" : "default"}} // Меняем курсор, если есть обработчик
                        />
                    )}
                </Col>

                {/* Основная информация об услуге */}
                <Col md={6} className="job-card-info">
                    <Card.Body>
                        <Card.Title>{name}</Card.Title>
                        <Card.Text>{info}</Card.Text>
                        <Card.Text>
                            <strong>Цена:</strong> {price} руб.
                        </Card.Text>
                    </Card.Body>
                </Col>

                {/* Управление длительностью и удалением */}
                <Col md={3} className="job-card-controls">
                    <div className="duration-control">
                        <label htmlFor={`duration-${job_id}`}>Длительность (ч):</label>
                        <input
                            type="number"
                            id={`duration-${job_id}`}
                            defaultValue={duration}
                            min={1}
                            onChange={(e) => {
                                if (onUpdateDuration) {
                                    onUpdateDuration(job_id, Number(e.target.value))
                                }
                            }
                            }
                            disabled={!isDraft}
                        />
                    </div>
                    {(onRemove && isDraft) && (
                        <Button
                            variant="danger"
                            onClick={handleRemove}
                            className="remove-button"
                        >
                            Удалить
                        </Button>
                    )}
                </Col>
            </Row>
        </Card>
    );
};

export default JobCard;