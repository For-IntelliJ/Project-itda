import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function ClassApplication({ classData, selectedDate, onClose, onConfirm }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const handleConfirm = () => {
        // 로그인 체크
        if (!user) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }
        
        // MENTEE 권한 체크
        if (user.role !== 'MENTEE') {
            alert('클래스 수강은 멘티만 이용이 가능합니다.');
            return;
        }
        
        // 권한이 있으면 신청 실행
        onConfirm();
        onClose();
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-center mb-6">
                    <span className="text-6xl">🐣</span>
                </div>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-4">클래스 신청 확인</h2>
                    <p className="text-gray-600 mb-4">해당 클래스를 신청하시겠습니까?</p>
                </div>

                {/* 클래스 정보 표시 */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6 space-y-2">
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-700">강의명:</span>
                        <span className="text-gray-800">{classData?.classname || '클래스명 없음'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-700">멘토명:</span>
                        <span className="text-gray-800">{classData?.mentor_name || '멘토명 없음'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-700">선택한 날짜:</span>
                        <span className="text-gray-800">{selectedDate || '날짜 미선택'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-medium text-gray-700">카테고리:</span>
                        <span className="text-gray-800">{classData?.category_name || '카테고리 없음'}</span>
                    </div>
                </div>

                {/* 버튼 영역 */}
                <div className="flex justify-center space-x-4">
                    <button
                        type="button"
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
                        onClick={onClose}
                    >
                        닫기
                    </button>
                    <button
                        type="button"
                        className="px-6 py-2 bg-[#3D4EFE] text-white rounded-md hover:bg-[#2c3ed9] font-medium"
                        onClick={handleConfirm}
                    >
                        신청
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ClassApplication;