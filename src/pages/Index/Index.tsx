import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Index.css';
import fablabImage from '../../assets/images/fablab.jpg'

const Index: React.FC = () => {
    return (
        <div className="index-page">
            {/* Заголовок секции */}
            <header className="hero-section">
                <Container>
                    <Row>
                        <Col className="hero-text">
                            <h1>Добро пожаловать в FabLab Москва</h1>
                            <p>
                                Мы — творческое сообщество, предоставляющее доступ к современным
                                технологиям и оборудованию для создания прототипов и инновационных
                                решений.-
                            </p>
                        </Col>
                    </Row>
                </Container>
            </header>

            {/* Описание секции */}
            <section id="about" className="about-section">
                <Container>
                    <Row >
                        <Col md={6} className="about-text mt-auto">
                            <h2 className={'text-center mb-4'}>Что такое FabLab?</h2>
                            <p className={'text-center'}>
                                FabLab — это лаборатория для разработки прототипов, где каждый может
                                научиться создавать и собирать различные устройства. Мы предоставляем
                                доступ к 3D-принтерам, лазерным станкам, электронике и многому другому.
                            </p>
                        </Col>
                        <Col md={6} className="about-image">
                            <img
                                src={fablabImage}
                                alt="Lab image"
                                className="img-fluid mt-4 mb-4"
                            />
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default Index;
