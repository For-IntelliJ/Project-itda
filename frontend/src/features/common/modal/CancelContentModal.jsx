import React from "react";
import EditProfileModal from "./EditProfileModal";
//EditProfile로부터 상수 받아오기
function CancelContentModal({ onClose,onConfirm }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-xl w-full max-w-lg h-[350px] flex flex-col ">
                <div className="flex justify-center mt-8 mb-6">
                    <img
                        src="/img/Warning_icon.png"
                        alt="경고 아이콘"
                        className="w-12 h-12 mr-2"
                    />
                </div>

                <div className="flex justify-center">
                    <h2 className="text-2xl font-bold mb-4">작성 내용을 취소하시겠습니까?</h2>
                </div>

                <div className="flex justify-center mt-6">
                    <h3>
                        기존에 작성했던 모든 내용을 삭제합니다.
                    </h3>

                </div>

                <form className="flex flex-col jus flex-grow">
                    <div className="flex justify-center space-x-2 mt-auto">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-200 rounded"
                            onClick={onClose}
                        >
                            아니오, 유지합니다.
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 bg-[#FF3D3D] text-white rounded"
                            onClick={() => {
                                // 여기에 저장 로직 넣고 닫기
                                onClose();
                                onConfirm();
                            }}
                        >
                            예, 취소합니다.
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CancelContentModal