import React, { useState } from 'react';
import { registerUser } from '../api';
import PasswordInput from '../components/PasswordInput';

const JoinPage = () => {
    const [formData, setFormData] = useState({
        username: '',   // 실명
        nickname: '',   // 별명
        email: '',
        password: '',
        phone: '',
        gender: '',
        role: 'MENTEE',
        loginType: 'LOCAL',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (value) => {
        setFormData((prev) => ({ ...prev, password: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser(formData);
            console.log('회원가입 성공');
            alert('회원가입 성공');
            window.location.href = '/login'
        } catch (error) {
            console.error('회원가입 실패:', error);
            alert('회원가입 실패');
        }
    };

    const handlePhoneChange = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 남김
        if (value.length > 3 && value.length <= 7) {
            value = value.replace(/(\d{3})(\d+)/, '$1-$2');
        } else if (value.length > 7) {
            value = value.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3');
            value = value.slice(0, 13); // 최대 길이 제한 (010-1234-5678)
        }
        setFormData(prev => ({ ...prev, phone: value }));
    };


    return (
        <div className="flex h-screen w-screen items-center justify-center bg-[#EBEFFF]">
            <div className="flex h-full w-full max-w-[1200px] overflow-hidden rounded-xl bg-white">
                {/* 왼쪽 일러스트 영역 */}
                <div className="relative flex-[0.47] bg-[#EBEFFF]">
                    <div className="absolute left-[20%] top-[55%] h-96 w-[130%] origin-top-left rotate-[-97deg] rounded-[6rem] bg-indigo-500" />
                    <div className="absolute left-[18%] top-[58%] h-96 w-[130%] origin-top-left -rotate-90 rounded-[6rem] bg-indigo-300" />
                    <img
                        className="absolute left-[21%] top-[35%]"
                        src={process.env.PUBLIC_URL + '/img/joinImg.png'}
                        alt="가입 일러스트"
                    />
                </div>

                {/* 오른쪽 입력 폼 영역 */}
                <div className="flex flex-[0.53] flex-col items-center justify-center bg-[#EBEFFF] text-xl">
                    <div className="flex w-full flex-col items-center justify-center">
                        <h2 className="mb-6 text-center text-2xl font-bold">회원가입</h2>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {/* 이메일 */}
                            <p className="mb-1 text-font">이메일</p>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@domain.com"
                                className="w-full rounded border border-hover p-2 transition duration-200 hover:border-2 focus:border-2 focus:outline-none"
                                required
                            />

                            {/* 비밀번호 */}
                            <PasswordInput onChange={handlePasswordChange} />

                            {/* 실명 */}
                            <p className="mb-1 text-font">이름</p>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="홍길동"
                                className="w-full rounded border border-hover p-2 transition duration-200 hover:border-2 focus:border-2 focus:outline-none"
                                required
                            />

                            {/* 닉네임(별명) */}
                            <p className="mb-1 text-font">닉네임</p>
                            <input
                                type="text"
                                name="nickname"
                                value={formData.nickname}
                                onChange={handleChange}
                                placeholder="화면에 표시될 이름"
                                className="w-full rounded border border-hover p-2 transition duration-200 hover:border-2 focus:border-2 focus:outline-none"
                                required
                            />

                            {/* 성별 + 전화번호 */}
                            <div className="flex w-full items-center justify-between gap-4">
                                {/* 성별 */}
                                <div className="flex w-1/2 flex-col">
                                    <p className="mb-1 text-font">성별</p>
                                    <div className="flex items-center justify-center gap-6">
                                        <label className="flex items-center gap-1">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="남자"
                                                checked={formData.gender === '남자'}
                                                onChange={handleChange}
                                                className="accent-indigo-500"
                                                required
                                            />
                                            남자
                                        </label>
                                        <label className="flex items-center gap-1">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="여자"
                                                checked={formData.gender === '여자'}
                                                onChange={handleChange}
                                                className="accent-pink-500"
                                            />
                                            여자
                                        </label>
                                    </div>
                                </div>

                                {/* 전화번호 */}
                                <div className="flex w-1/2 flex-col">
                                    <p className="mb-1 text-font">전화번호</p>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handlePhoneChange}
                                        placeholder="010-1234-5678"
                                        inputMode="numeric"
                                        maxLength={13}
                                        className="w-full rounded border border-hover p-2 transition duration-200 hover:border-2 focus:border-2 focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full rounded bg-[#405DF9] py-2 text-white">
                                회원가입
                            </button>
                        </form>

                        {/* 로그인 유도 */}
                        <p className="mt-4 text-center text-sm">
                            이미 계정이 있으신가요?{' '}
                            <a href="/login" className="text-blue-500 hover:underline">
                                로그인
                            </a>
                        </p>

                        {/* 카카오 로그인 버튼 */}
                        <button className="mt-4 h-auto w-auto flex-col justify-center border-none bg-transparent p-0">
                            <img
                                src={process.env.PUBLIC_URL + '/img/kakao_login.png'}
                                alt="카카오로그인"
                                className="block"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JoinPage;
