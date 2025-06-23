import React from 'react';
import LoginForm from "../components/LoginForm";
import {Link} from "react-router-dom";

const LoginPage = () => {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-neutral-50">
            {/*로고*/}
            <div className="w-full max-w-[1024px] py-6 px-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img src="/img/MainLogo.png" alt="Main Logo" className="h-10" />
                    <Link to="/" className="text-3xl font-dnf text-font">잇다</Link>
                </div>
            </div>
            {/* 로그인 페이지 전체 레이아웃 */}
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
