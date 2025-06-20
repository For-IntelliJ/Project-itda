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
                const errorText = await response.text();
                console.log(errorText)
                alert('별명 저장 실패');
            }
        } catch (error) {
            alert('오류가 발생했습니다');
            console.error(error);
        }
    };

    return (
        <div className="max-w-md mx-auto h-auto mt-32 p-6 border border-gray-200 rounded-xl shadow-md bg-white">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-10">
                ✏️ 새로운 별명을 입력해주세요 ✏️
            </h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                        나의 별명
                    </label>
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="ex) 오늘부터갓생러, 수악중독, 코딩천재"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D4EFE] transition"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-[#3D4EFE] hover:bg-[#5C6BF5] text-white font-semibold py-2 rounded-lg transition"
                >
                    저장하기
                </button>
            </form>
        </div>
    );

};

export default NicknamePage;
