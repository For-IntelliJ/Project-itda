//카카오 로그인 컴포넌트~ 회원가입/ 로그인에 쓰기
import React, { useEffect } from 'react';

const SocialLoginButtons = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
        script.async = true;
        script.onload = () => {
            if (window.Kakao && !window.Kakao.isInitialized()) {
                window.Kakao.init('4aec8425354839a5f868a544e14b26c7'); // ✅ JS 키에 줄바꿈 없음
                console.log('✅ Kakao SDK initialized');
            }
        };
        document.body.appendChild(script);
    }, []);

    const handleKakaoLogin = () => {
        if (!window.Kakao) {
            alert('Kakao SDK 로딩 실패');
            return;
        }

        window.Kakao.Auth.login({
            success: function (authObj) {
                console.log('✅ 카카오 로그인 성공:', authObj);

                fetch('http://localhost:8080/api/auth/kakao', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ accessToken: authObj.access_token }),
                })
                    .then((res) => res.text())
                    .then((data) => {
                        alert(`로그인 성공: ${data}`);
                    });
            },
            fail: function (err) {
                console.error('❌ 로그인 실패:', err);
            },
        });
    };

    return (
        <button
            onClick={handleKakaoLogin} // ✅ 클릭 시 실행
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
