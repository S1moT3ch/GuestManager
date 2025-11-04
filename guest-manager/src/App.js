import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import NotFoundPage from "./components/NotFoundPage";


function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />7
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;