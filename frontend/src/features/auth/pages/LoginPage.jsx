import React from 'react';
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
    return (
        <div className="flex h-screen">
            {/* 왼쪽: 로그인 영역 */}
            <div className="w-1/2 flex flex-col justify-center items-center bg-neutral-50">
                <LoginForm/>
            </div>

            {/* 오른쪽: 일러스트 또는 배경 이미지 영역 */}
            <div className="w-1/2 bg-[#EEE9E5] flex items-center justify-center">
                <img src="/img/chain-illustration.png" alt="연결 일러스트" className="w-[80%]" />
            </div>
        </div>



    // <div className="flex h-screen w-screen items-center justify-center bg-[#EBEFFF]">
    //         <div className="absolute top-6 left-6 flex items-center space-x-2">
    //             <img src="/img/MainLogo.png" alt="Main Logo" className="h-10" />
    //             <span className="text-3xl font-dnf text-font">잇다</span>
    //         </div>
    //
    //
    //         <LoginForm/>
    //
    //         <div className=" relative flex h-full flex-[53%] justify-end">
    //             <div className="relative z-0 h-full w-[45rem] bg-indigo-300"/>
    //             <img
    //                 className="absolute left-[calc(100%-45vw)] top-1/2 z-10 w-[30vw] -translate-y-1/2"
    //                 src={process.env.PUBLIC_URL + '/img/logIn.png'}
    //                 alt="가입 일러스트"
    //             />
    //         </div>
    //     </div>
    )

};

export default LoginPage;
