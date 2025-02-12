import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header.tsx";
import Jobs from "./pages/Jobs/Jobs.tsx";
import JobDetail from "./pages/JobDetail/JobDetail.tsx";
import Index from "./pages/Index/Index.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

function App() {
  return (
    <>
        <Router basename="/fablab-react">
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
