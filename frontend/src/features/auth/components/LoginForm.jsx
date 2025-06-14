import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import SocialLoginButtons from "./SocialLoginButtons";

const LoginForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({email: '', password: ''});

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
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
        <div className="w-96 relative inline-flex flex-col justify-start items-start gap-12 font-sans text-font tracking-tight">
            {/*상단 환영 문구*/}
            <div className="flex flex-col justify-start items-start gap-3 text-left">
                <p className="text-4xl font-bold  leading-tight">환영합니다 👋</p>
                <p className="text-xl font-bold  leading-snug"> 오늘, 당신의 재능이 연결되는 순간.</p>
                <p className="text-base font-medium  leading-snug">
                    일상에 쉼을, 재능에 가치를, 사람에 철학을 잇는 ITDA와 함께
                    지금 로그인하고 당신의 이야기를 시작하세요.
                </p>
            </div>
            {/*로그인필드*/}
            <form className="self-stretch flex flex-col justify-center items-end gap-6" onSubmit={handleSubmit}>
                <div data-type="Desktop" className="self-stretch flex flex-col justify-start items-start gap-2">
                    <p>Email</p>
                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@itda.com"
                        className="w-96 h-12 bg-slate-50 rounded-xl outline outline-1 outline-gray-300 border hover:border-hover p-2"
                        required
                    />
                </div>
                <div data-type="Desktop" className="self-stretch flex flex-col justify-start items-start gap-2">
                    <p>password</p>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="비밀번호"
                        className="w-96 h-12 bg-slate-50 rounded-xl outline outline-1 outline-gray-300 border hover:border-hover p-2"
                        required
                    />
                </div>
                {/*비밀번호 찾기*/}
                <div
                    className="text-center justify-center text-blue-700 text-[0.8rem] font-normal leading-none ">
                    Forgot Password?
                </div>
                {/*로그인버튼*/}
                <button type="submit" className="self-stretch flex justify-center bg-slate-800 rounded-xl py-3 text-white text-lg">
                    Sign in
                </button>
            </form>

            {/*다른방법으로 로그인*/}
            <div className="flex flex-col justify-start items-start gap-6">
                <div className="w-96 flex items-center gap-4">
                    <hr className="flex-1 border-t border-slate-300" />
                    <span className="text-base text-gray-500">Or</span>
                    <hr className="flex-1 border-t border-slate-300" />
                </div>
                <SocialLoginButtons />
            </div>
            <div className="w-full text-center justify-center text-base font-normal leading-7 ">
                계정이 없으신가요? <span className="text-blue-700">회원가입</span>
            </div>
            <div className="w-full text-center text-slate-400">© 2025 ITDA</div>
        </div>
    );
};

export default LoginForm;