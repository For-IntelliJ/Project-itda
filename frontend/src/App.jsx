import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import JoinPage from "./features/auth/pages/JoinPage";
import LoginPage from "./features/auth/pages/LoginPage";

function App() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-xl">
            <Router>
                <main className="flex-grow">
                    <Routes>
                        <Route path="/join" element={<JoinPage/>}/>
                        <Route path="/login" element={<LoginPage />} />
                    </Routes>
                </main>
            </Router>
        </div>
    );
}

export default App;