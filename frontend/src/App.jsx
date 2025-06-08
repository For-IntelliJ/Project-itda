// import logo from './logo.svg';
// import './App.css';
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("/api/hello")
            .then((res) => res.text())
            .then((data) => setMessage(data))
            .catch((err) => console.error("API 호출 실패:", err));
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-xl">
            <Router>
                <div>
                    <p className="text-gray-800 font-bold mb-4">백엔드 연결 결과:</p>
                    <p className="text-blue-600">{message}</p>
                </div>
            </Router>
        </div>
    );
}

export default App;
