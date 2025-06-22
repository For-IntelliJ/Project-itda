import React, { createContext, useContext, useState, useEffect } from "react";
import { checkLogin, checkKakaoLogin } from "../features/auth/api"; // ✅ 카카오 로그인 확인도 import

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verify = async () => {
            try {
                // 일반 로그인 확인
                const userData = await checkLogin();
                setIsLoggedIn(true);
                setUser(userData);
            } catch (e1) {
                try {
                    // 일반 로그인 실패하면 카카오 로그인 확인
                    const kakaoData = await checkKakaoLogin();
                    setIsLoggedIn(true);
                    setUser(kakaoData);
                } catch (e2) {
                    // 둘 다 실패
                    setIsLoggedIn(false);
                    setUser(null);
                }
            } finally {
                setLoading(false);
            }
        };
        verify();
    }, []);

    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ 
            isLoggedIn, 
            setIsLoggedIn, 
            user, 
            setUser, 
            loading,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
