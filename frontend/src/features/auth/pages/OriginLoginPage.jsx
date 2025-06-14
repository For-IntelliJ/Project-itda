import React from 'react';
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
    return (
        <div className="flex h-screen w-screen items-center justify-center bg-[#EBEFFF]">
            <div className="absolute top-6 left-6 flex items-center space-x-2">
                <img src="/img/MainLogo.png" alt="Main Logo" className="h-10" />
                <span className="text-3xl font-dnf text-font">잇다</span>
            </div>


            <LoginForm/>

            <div className=" relative flex h-full flex-[53%] justify-end">
                <div className="relative z-0 h-full w-[45rem] bg-indigo-300"/>
                <img
                    className="absolute left-[calc(100%-45vw)] top-1/2 z-10 w-[30vw] -translate-y-1/2"
                    src={process.env.PUBLIC_URL + '/img/logIn.png'}
                    alt="가입 일러스트"
                />
            </div>
        </div>
    )

};

export default LoginPage;
