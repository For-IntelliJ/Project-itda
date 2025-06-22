import React from "react";
import { deleteAccount } from "../../auth/api"; // 경로는 실제 위치에 따라 조정
import { useNavigate } from "react-router-dom";



function DeleteAccount() {
    const navigate = useNavigate();

    const handleDelete = async () => {
        if (!window.confirm("정말 탈퇴하시겠습니까?")) return;

        try {
            await deleteAccount();
            alert("탈퇴가 완료되었습니다.");

            localStorage.removeItem("loginUser");
            sessionStorage.clear();

            window.location.href = "/"; // 또는 navigate("/") + reload

        } catch (error) {
            console.error("❌ 탈퇴 실패:", error);
            alert("탈퇴 중 오류가 발생했습니다.");
        }
    };


    return (
        <div className="w-full  py-10 px-4">
            <h1 className="text-2xl font-bold mb-8">😭 회원탈퇴 😭</h1>

            <div className="w-full border-2 border-gray-400 rounded-lg p-8 flex flex-col gap-6 ">
                <div className="mb-6 leading-relaxed">
                    정말 <span className="text-[#3D4EFE] font-bold text-xl">"잇다"</span>를 탈퇴하시겠습니까? <br />
                    탈퇴 시 아래 데이터를 포함한 모든 정보가 삭제되며, <strong className="text-red-600">복구가 불가능</strong>합니다.
                </div>

                <ul className="list-disc pl-5 text-sm space-y-2 text-gray-700">
                    <li>아이디 및 회원 정보는 즉시 삭제되며 재사용할 수 없습니다.</li>
                    <li>작성한 글, 댓글, 좋아요 등의 기록은 모두 삭제됩니다.</li>
                    <li>삭제된 데이터는 복구되지 않으므로 꼭 필요한 내용은 백업해 주세요.</li>
                </ul>

                <p className="text-sm text-gray-600 mt-4">
                    탈퇴 후 서비스를 다시 이용하시려면 새 계정을 만들어야 합니다.
                </p>

                <div className="flex justify-end ">
                    <button
                        onClick={handleDelete}
                        className="bg-[#FF3D3D] hover:bg-[#B22222] text-white font-semibold py-2 px-4 rounded-lg w-[100px]">
                        탈퇴하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteAccount;