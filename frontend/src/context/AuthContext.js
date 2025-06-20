import React, { createContext, useContext, useState, useEffect } from "react";
import { checkLogin } from "../features/auth/api"; // 로그인 확인 API

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const verify = async () => {
            try {
                await checkLogin();
                setIsLoggedIn(true);
            } catch (e) {
                setIsLoggedIn(false);
            }
        };
        verify();
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
