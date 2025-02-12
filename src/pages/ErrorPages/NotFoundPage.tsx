import { Link } from 'react-router-dom';
import './ErrorPage.css';

const NotFoundPage = () => {
    return (
        <div className="error-container">
            <h1 className="error-code">404</h1>
            <p className="error-text">Тут ничего нет...<br /> Этой страницы не существует!</p>
            <Link to="/" className="error-button">На главную</Link>
        </div>
    );
};

export default NotFoundPage;
