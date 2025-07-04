import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from "axios";

const root = ReactDOM.createRoot(document.getElementById('root'));
axios.defaults.withCredentials = true;
root.render(
    // 배경 강제 지정
    <div className="bg-neutral-50">
        <React.StrictMode>
            <App/>
        </React.StrictMode>
    </div>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
