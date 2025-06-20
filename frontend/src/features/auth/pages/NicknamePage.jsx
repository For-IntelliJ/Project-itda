// src/pages/NicknamePage.jsx
import React, { useState } from 'react';

const NicknamePage = () => {
    const [nickname, setNickname] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/auth/kakao/save-nickname', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nickname }),
                credentials: 'include'  // 세션 연동 시 필요
            });

            if (response.ok) {
                alert('별명 저장 성공!');
                window.location.href = '/'; // 메인 페이지로 이동
            } else {
                alert('별명 저장 실패');
            }
        } catch (error) {
            alert('오류가 발생했습니다');
            console.error(error);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-4 border rounded">
            <h1 className="text-xl font-bold mb-4">새로운 별명을 입력해주세요</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="별명 입력"
                    className="w-full p-2 border rounded mb-4"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded"
                >
                    저장
                </button>
            </form>
        </div>
    );
};

export default NicknamePage;
