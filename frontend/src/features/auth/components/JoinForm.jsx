import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import SocialLoginButtons from "./SocialLoginButtons";

const JoinForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',   // 실명
        nickname: '',   // 별명
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        gender: '',
        role: 'MENTEE',
        loginType: 'LOCAL',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            await axios.post('http://localhost:8080/api/member/join', formData);
            alert('회원가입 성공!');
            navigate('/login');
        } catch (error) {
            alert('회원가입 실패!');
            console.error(error);
        }
    };

    return (
        <div className="w-96 h-[720px] mt-5 flex flex-col justify-between px-5 py-4 font-sans text-font tracking-tight">
            {/* 상단 문구 */}
            <div className="flex flex-col gap-1 text-left">
                <p className="text-2xl font-bold leading-snug">시작해 볼까요? 🚀</p>
                <p className="text-lg font-semibold leading-snug">당신의 재능이 연결되는 시작점.</p>
                <p className="text-base font-normal leading-snug text-gray-600">
                    지금 가입하고 ITDA와 함께 새로운 여정을 시작하세요.
                </p>
            </div>

            {/* 회원가입 폼 */}
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                {[
                    { label: "이름", name: "username", type: "text", placeholder: "이름을 입력해주세요" },
                    { label: "닉네임", name: "nickname", type: "text", placeholder: "별명을 입력해주세요" },
                    { label: "Email", name: "email", type: "email", placeholder: "example@itda.com" },
                    { label: "비밀번호", name: "password", type: "password", placeholder: "비밀번호" },
                    { label: "비밀번호 확인", name: "confirmPassword", type: "password", placeholder: "비밀번호 확인" },
                ].map(({ label, name, type, placeholder }) => (
                    <div key={name} className="flex flex-col gap-1">
                        <label className="text-sm font-medium">{label}</label>
                        <input
                            type={type}
                            name={name}
                            value={formData[name]}
                            onChange={handleChange}
                            placeholder={placeholder}
                            className="h-9 rounded-md px-3 bg-slate-50 border outline outline-1 outline-gray-300 hover:border-hover text-sm"
                            required
                        />
                    </div>
                ))}

                <button type="submit" className="w-full mt-1 bg-slate-800 text-white py-3 rounded-md text-sm font-semibold">
                    회원가입
                </button>
            </form>

            {/* 소셜 로그인 */}
            <div className="flex flex-col items-center gap-3">
                <div className="w-full flex items-center gap-2">
                    <hr className="flex-1 border-t border-slate-300" />
                    <span className="text-xs text-gray-500">Or</span>
                    <hr className="flex-1 border-t border-slate-300" />
                </div>
                <SocialLoginButtons />
            </div>

            {/* 하단 링크 */}
            <div className="text-center text-sm text-gray-600 leading-tight">
                이미 계정이 있으신가요?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">로그인</Link>
            </div>
            <div className="text-center text-xs text-slate-400">© 2025 ITDA</div>
        </div>
    );
};

export default JoinForm;
