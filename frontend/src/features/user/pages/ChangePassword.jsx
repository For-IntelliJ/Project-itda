import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = () => {
        setError("");
        setSuccess("");

        // 1. 유효성 검사
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("모든 필드를 입력하세요.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("새 비밀번호가 일치하지 않습니다.");
            return;
        }

        // 2. 서버에 요청 보내기
        axios.post("/api/members/change-password", {
            currentPassword,
            newPassword
        })
            .then(() => {
                setSuccess("비밀번호가 성공적으로 변경되었습니다.");
                setTimeout(() => navigate("/mypage?tab=profilesettings"), 1500); // 마이페이지 등으로 이동
            })
            .catch(err => {
                const message = err.response?.data?.error
                    || err.response?.data?.message
                    || "비밀번호 변경에 실패했습니다.";
                setError(message);
            });
    };

    return (
        <div className="w-full py-10 px-4">
            <h1 className="text-2xl font-bold mb-8">비밀번호 변경</h1>

            <div className="w-full border-2 border-gray-400 rounded-lg p-8 flex flex-col gap-6 ">
                {error && <div className="text-red-500 text-sm">{error}</div>}
                {success && <div className="text-green-500 text-sm">{success}</div>}

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">현재 비밀번호</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="border rounded-lg border-gray-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="현재 비밀번호를 입력하세요"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">새 비밀번호</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="border rounded-lg border-gray-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="새 비밀번호를 입력하세요"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">새 비밀번호 확인</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="border rounded-lg border-gray-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="새 비밀번호를 다시 입력하세요"
                    />
                </div>

                <div className="flex justify-end gap-4 mt-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-gray-400 hover:bg-[#A5B4FC] text-white font-semibold py-2 px-4 rounded-lg w-[80px]"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleChange}
                        className="bg-[#3D4EFE] hover:bg-[#E0A800] text-white font-semibold py-2 px-4 rounded-lg w-[80px]"
                    >
                        변경
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;
