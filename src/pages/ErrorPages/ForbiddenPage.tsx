import { Link } from 'react-router-dom';
import './ErrorPage.css';

const ForbiddenPage = () => {
    return (
        <div className="error-container">
            <h1 className="error-code">403</h1>
            <p className="error-text">Сюда нельзя! <br /> Нет прав для доступа к странице.</p>
            <Link to="/" className="error-button">На главную</Link>
        </div>
    );
};

export default ForbiddenPage;
