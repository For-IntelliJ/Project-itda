import React, { createContext, useContext, useState, useEffect } from "react";
import { checkLogin, checkKakaoLogin } from "../features/auth/api"; // ✅ 카카오 로그인 확인도 import

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const verify = async () => {
            try {
                // 일반 로그인 확인
                await checkLogin();
                setIsLoggedIn(true);
            } catch (e1) {
                try {
                    // 일반 로그인 실패하면 카카오 로그인 확인
                    await checkKakaoLogin();
                    setIsLoggedIn(true);
                } catch (e2) {
                    // 둘 다 실패
                    setIsLoggedIn(false);
                }
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
