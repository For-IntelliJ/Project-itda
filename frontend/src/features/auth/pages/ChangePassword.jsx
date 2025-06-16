import React from "react";

function ChangePassword() {
    return (
        <div className="w-full  py-10 px-4">
            <h1 className="text-2xl font-bold mb-8">비밀번호 변경</h1>

            <div className="w-full h-[400px] border-2 border-gray-400 rounded-lg p-8 flex flex-col gap-6 ">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-size">현재 비밀번호</label>
                    <input
                        type="password"
                        className="border rounded-lg border-gray-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="현재 비밀번호를 입력하세요"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">새 비밀번호</label>
                    <input
                        type="password"
                        className="border rounded-lg border-gray-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="새 비밀번호를 입력하세요"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">새 비밀번호 확인</label>
                    <input
                        type="password"
                        className="border rounded-lg border-gray-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="새 비밀번호를 다시 입력하세요"
                    />
                </div>
                <div className="flex justify-end gap-4 mt-4">
                    <button className="bg-gray-400 hover:bg-[#A5B4FC] text-white font-semibold py-2 px-4 rounded-lg w-[80px]">
                        취소
                    </button>
                    <button className="bg-[#3D4EFE] hover:bg-[#E0A800] text-white font-semibold py-2 px-4 rounded-lg w-[80px]">
                        변경
                    </button>
                </div>


            </div>
        </div>
    );
}

export default ChangePassword;
