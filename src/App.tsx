import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Header from "./components/Header/Header.tsx";
import Jobs from "./pages/Jobs/Jobs.tsx";
import JobDetail from "./pages/JobDetail/JobDetail.tsx";
import Index from "./pages/Index/Index.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import {invoke} from "@tauri-apps/api/core";
import {useEffect} from "react";
import {dest_root} from "./target_config.ts";

function App() {
    useEffect(() => {
        invoke('tauri', {cmd: 'create'})
            .then(() => {
                console.log("Tauri launched")
            })
            .catch(() => {
                console.log("Tauri not launched")
            })
        return () => {
            invoke('tauri', {cmd: 'close'})
                .then(() => {
                    console.log("Tauri launched")
                })
                .catch(() => {
                    console.log("Tauri not launched")
                })
        }
    }, [])

    return (
        <>
            <Router basename={dest_root}>
                <Header/>
                <Routes>
                    <Route path="/" element={<Index/>}/>

                    <Route path="/jobs" element={<Jobs/>}/>

                    <Route path="/jobs/:id" element={<JobDetail/>}/>
                </Routes>
            </Router>
        </>
    )
}

export default App
