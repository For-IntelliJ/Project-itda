import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
// 공통 컴포넌트
import Header from "./features/common/components/Header";
import Footer from "./features/common/components/Footer";

import JoinPage from "./features/auth/pages/JoinPage";
import LoginPage from "./features/auth/pages/LoginPage";
import MainPage from "./features/main/pages/MainPage";

function App() {
    return (
        <div className="min-h-screen flex flex-col">
            <Router>
                <Header/>
                <main className="flex-grow ">
                    <Routes>
                        <Route path="/" element={<MainPage/>}/>
                        <Route path="/join" element={<JoinPage/>}/>
                        <Route path="/login" element={<LoginPage/>}/>

                    </Routes>
                </main>
                <Footer/>
            </Router>
        </div>
    );
}

export default App;