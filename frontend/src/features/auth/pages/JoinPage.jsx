import React from 'react';
import JoinForm from "../components/JoinForm";

const JoinPage = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-neutral-50">
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
