// SocialLoginButtons.jsx
import React from 'react';

const SocialLoginButtons = () => {
    const REST_API_KEY = "a680d77f4256f7e8110b6bfb85250623";
    const REDIRECT_URI = "http://localhost:8080/auth/kakao/callback";

    const handleLogin = () => {
        const KAKAO_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
        console.log("📦 카카오 로그인 URL:", KAKAO_URL);
        console.log("카카오 버튼 클릭됨")
        window.location.href =
            `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    };

    return (
        <button
            onClick={handleLogin}
            className="mx-auto flex h-auto w-auto flex-col items-center border-none bg-transparent p-0"
        >
            <img
                src={process.env.PUBLIC_URL + '/img/kakao_login.png'}
                alt="카카오 로그인"
                className="block"
            />
        </button>
    );
};

export default SocialLoginButtons;
