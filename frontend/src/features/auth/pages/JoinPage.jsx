import React from 'react';
import { Link } from 'react-router-dom';
import JoinForm from "../components/JoinForm";

const JoinPage = () => {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-neutral-50">
            {/*로고*/}
            <div className="w-full max-w-[1024px] py-6 px-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img src="/img/MainLogo.png" alt="Main Logo" className="h-10" />
                    <Link to="/" className="text-3xl font-dnf text-font">잇다</Link>
                </div>
            </div>
            {/* 회원가입 페이지 전체 레이아웃*/}
            <div className="w-[1024px] h-[720px] flex rounded-2xl shadow-xl bg-neutral-50 overflow-hidden">
                {/* 일러스트 영역 */}
                <div className="w-1/2 bg-[#EEE9E5] flex items-center justify-center">
                    <img src="/img/join-illustration.png" alt="회원가입 일러스트" className="h-full object-cover"/>
                </div>

                {/* 회원가입 폼 */}
                <div className="w-1/2 flex flex-col justify-center items-center bg-white">
                    <JoinForm/>
                </div>
            </div>
        </div>
    );
};

export default JoinPage;
