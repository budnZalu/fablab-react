import { Provider } from 'react-redux';
import { store } from './store/store'; // Убедись, что путь к файлу с хранилищем правильный
import App from './App';
import {createRoot} from "react-dom/client";

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <App />
    </Provider>,
);

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/serviceWorker.js')
        .then((reg) => console.log('Service Worker Registered:', reg))
        .catch((err) => console.log('Service Worker Registration Failed:', err));
}