import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import SocialLoginButtons from './SocialLoginButtons';

const LoginForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/member/login', formData, {
                withCredentials: true,
            });
            alert('로그인 성공!');
            navigate('/');
        } catch (error) {
            alert('로그인 실패!');
            console.error(error);
        }
    };

    return (
        <div className="mb-[2rem] flex h-full flex-[47%] flex-col items-center justify-center px-12">
            <h2 className="mb-6 text-center text-2xl font-bold">환영합니다</h2>
            <form className="flex w-[80%] flex-col space-y-4" onSubmit={handleSubmit}>
                <div>
                    <p className="mb-1 text-font">이메일</p>
                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@itda.com"
                        className="w-full rounded border border-hover p-2"
                        required
                    />
                </div>
                <div>
                    <p className="mb-1 text-font">비밀번호</p>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="비밀번호"
                        className="mb-[2rem] w-full rounded border border-hover p-2"
                        required
                    />
                </div>
                <div className="mt-[2rem] space-y-8">
                    <button type="submit" className="w-full rounded bg-[#405DF9] py-3 text-white">
                        로그인
                    </button>
                    <SocialLoginButtons />
                    <p className="text-center text-sm">
                        계정이 없으신가요?{' '}
                        <Link to="/join" className="text-blue-500">회원가입</Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;