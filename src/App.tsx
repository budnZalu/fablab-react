import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Header from "./components/Header/Header.tsx";
import Jobs from "./pages/Jobs/Jobs.tsx";
import JobDetail from "./pages/JobDetail/JobDetail.tsx";
import Index from "./pages/Index/Index.tsx";
import Registration from "./pages/Registration/Registration.tsx";
import Login from "./pages/Login/Login.tsx";
import PrintingDetail from "./pages/PrintingDetail/PrintingDetail.tsx";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCurrentUserAsync } from './store/userSlice.ts';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import PrintingList from "./pages/Printings/Printings.tsx";


function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        dispatch(fetchCurrentUserAsync());
    }, [dispatch]);

    return (
        <>
            <Router basename="/fablab-react">
                <Header/>
                <Routes>
                    <Route path="/" element={<Index/>}/>
                    <Route path="/jobs" element={<Jobs/>}/>
                    <Route path="/jobs/:id" element={<JobDetail/>}/>
                    <Route path="/printings" element={<PrintingList />} />
                    <Route path="/printings/:id" element={<PrintingDetail/>}/>
                    <Route path="/registration" element={<Registration/>}/>
                    <Route path="/login" element={<Login/>}/>
                </Routes>
            </Router>
        </>
    )
}

export default App
