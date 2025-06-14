import React, {useState} from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
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
        <div className="w-96 h-[720px] mt-5 flex flex-col justify-between px-5 py-4 gap-3 font-sans text-font tracking-tight">
            {/* 상단 환영 문구 */}
            <div className="flex flex-col gap-2 text-left">
                <p className="text-2xl font-bold leading-tight">환영합니다 👋</p>
                <p className="text-lg font-bold leading-snug">당신의 재능이 연결되는 순간.</p>
                <p className="text-base font-medium leading-snug text-gray-600">
                    일상에 쉼을, 재능에 가치를, 사람에 철학을 잇는 ITDA와 함께
                    지금 로그인하고 당신의 이야기를 시작하세요.
                </p>
            </div>

            {/* 로그인 필드 */}
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                {[
                    { label: "Email", name: "email", type: "text", placeholder: "example@itda.com" },
                    { label: "Password", name: "password", type: "password", placeholder: "비밀번호" },
                ].map(({ label, name, type, placeholder }) => (
                    <div key={name} className="flex flex-col gap-2">
                        <label className="text-base">{label}</label>
                        <input
                            type={type}
                            name={name}
                            value={formData[name]}
                            onChange={handleChange}
                            placeholder={placeholder}
                            className="w-full h-10 bg-slate-50 rounded-md outline outline-1 outline-gray-300 border hover:border-hover px-3 text-base"
                            required
                        />
                    </div>
                ))}

                {/* 비밀번호 찾기 */}
                <div className="text-right text-[0.8rem] text-blue-600 hover:underline cursor-pointer">
                    Forgot Password?
                </div>

                {/* 로그인 버튼 */}
                <button type="submit" className="w-full bg-slate-800 text-white py-4 rounded-md text-sm font-semibold">
                    로그인
                </button>
                {/* 다른 로그인 방법 */}
                <div className="flex flex-col items-center gap-4 w-full">
                    <div className="flex items-center w-full gap-4">
                        <hr className="flex-1 border-t border-slate-300" />
                        <span className="text-xs text-gray-500">Or</span>
                        <hr className="flex-1 border-t border-slate-300" />
                    </div>
                    <SocialLoginButtons />
                    <div className="text-center text-sm text-gray-600">
                        계정이 없으신가요?{" "}
                        <Link to="/join" className="text-blue-700 hover:underline">회원가입</Link>
                    </div>
                </div>
            </form>

            {/* 하단 링크 */}
            <div className="text-center text-xs text-slate-400">© 2025 ITDA</div>
        </div>
    );
};

export default LoginForm;