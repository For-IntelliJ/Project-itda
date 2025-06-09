//카카오 로그인 컴포넌트~ 회원가입/ 로그인에 쓰기
import React from 'react';

const SocialLoginButtons = () => (
    <button className="mx-auto flex h-auto w-auto flex-col items-center border-none bg-transparent p-0">
        <img
            src={process.env.PUBLIC_URL + '/img/kakao_login.png'}
            alt="카카오 로그인"
            className="block"
        />
    </button>
);

export default SocialLoginButtons;