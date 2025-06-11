import React, {useEffect} from "react";

function EditProfileModal({ onClose, previewUrl }) {

     useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose(); // esc 누르면 모달 닫기
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // 언마운트 시 이벤트 제거
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded shadow-xl w-full max-w-lg h-[450px] flex flex-col">
                    <h2 className="text-xl font-bold mb-4">프로필 이미지 수정</h2>

                    {/* 수정 폼 */}
                    <form className="flex flex-col flex-grow">

                        {/* 미리보기 이미지 공간 */}
                        <div className="flex-grow bg-gray-100 rounded mb-4 flex items-center justify-center h-60 overflow-hidden">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="미리보기"
                                    className="object-contain max-w-full max-h-full"
                                />
                            ) : (
                                <span className="text-gray-400">미리보기 이미지 영역</span>
                            )}
                        </div>

                        {/* 하단 버튼 */}
                        <div className="flex justify-end space-x-2 mt-auto">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-200 rounded"
                            >
                                취소
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-[#3D4EFE] text-white rounded"
                            >
                                저장
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    );
}

export default EditProfileModal;
