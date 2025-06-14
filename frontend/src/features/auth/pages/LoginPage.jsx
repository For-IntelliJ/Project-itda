import React from 'react';
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-neutral-50">
            <div className="w-[1024px] h-[720px] flex rounded-2xl shadow-xl bg-neutral-50 overflow-hidden">
                {/* 왼쪽: 로그인 영역 */}
                <div className="w-1/2 flex flex-col justify-center items-center bg-white">
                    <LoginForm/>
                </div>
                {/* 오른쪽: 일러스트 또는 배경 이미지 영역 */}
                <div className="w-1/2 bg-[#EEE9E5] flex items-center justify-center">
                    <img src="/img/chain-illustration.png" alt="연결 일러스트" className="h-full object-cover" />
                </div>
            </div>
        </div>
    )
};

export default LoginPage;
