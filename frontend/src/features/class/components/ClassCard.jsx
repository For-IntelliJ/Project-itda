// src/components/ClassCard.jsx - 이미지 에러 처리 개선 버전
import React, { useState } from "react";

const ClassCard = ({
    image,
    title,
    instructor,
    people,
    category,
    onoff,
    level
}) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    // 난이도에 따른 색상 설정
    const getDifficultyColor = (level) => {
        switch(level) {
            case '초급': return 'bg-green-100 text-green-800';
            case '중급': return 'bg-yellow-100 text-yellow-800';
            case '고급': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // 온/오프라인 형태에 따른 색상
    const getFormatColor = (type) => {
        switch(type) {
            case '온라인': return 'bg-blue-100 text-blue-800';
            case '오프라인': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // 이미지 로드 성공 처리
    const handleImageLoad = () => {
        setImageLoading(false);
        setImageError(false);
        console.log(">> [DEBUG] ClassCard 이미지 로드 성공:", image);
    };

    // 이미지 로드 실패 처리
    const handleImageError = (e) => {
        console.log(`>> [ERROR] ClassCard 이미지 로드 실패: ${image}`);
        setImageLoading(false);
        setImageError(true);
        
        // 이벤트 전파 중단하여 추가 에러 방지
        e.preventDefault();
        e.stopPropagation();
    };

    // 플레이스홀더 이미지 생성
    const renderPlaceholder = () => (
        <div className="w-full h-full bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center">
            <div className="text-center">
                <div className="text-gray-400 text-4xl mb-2">🖼️</div>
                <div className="text-gray-500 text-xs">이미지 준비중</div>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-96 flex flex-col hover:shadow-lg transition-shadow duration-300">
            {/* 이미지 섹션 */}
            <div className="w-full h-44 bg-gray-200 overflow-hidden flex-shrink-0 relative">
                {/* 로딩 상태 */}
                {imageLoading && !imageError && (
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                        <div className="animate-pulse">
                            <div className="text-gray-400 text-2xl">📷</div>
                            <div className="text-gray-500 text-xs mt-1">로딩중...</div>
                        </div>
                    </div>
                )}
                
                {/* 실제 이미지 */}
                {!imageError && (
                    <img 
                        src={image} 
                        alt={title || "클래스 이미지"}
                        className={`w-full h-full object-cover hover:scale-105 transition-all duration-300 ${
                            imageLoading ? 'opacity-0' : 'opacity-100'
                        }`}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        loading="lazy"
                    />
                )}
                
                {/* 에러 시 플레이스홀더 */}
                {imageError && renderPlaceholder()}
                
                {/* 이미지 오버레이 (호버 효과) */}
                <div className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
            </div>
            
            {/* 콘텐츠 섹션 */}
            <div className="p-4 flex-grow flex flex-col">
                {/* 제목 영역 */}
                <div className="h-12 mb-3 flex-shrink-0">
                    <h3 
                        className="text-lg font-bold text-gray-900 leading-tight cursor-pointer hover:text-blue-600 transition-colors"
                        style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                        title={title} // 호버 시 전체 제목 표시
                    >
                        {title || "제목 없음"}
                    </h3>
                </div>
                
                {/* 카테고리 */}
                <div className="mb-3 flex-shrink-0">
                    <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800 font-medium">
                        {category || "미분류"}
                    </span>
                </div>
                
                {/* 하단 정보들 */}
                <div className="flex-grow flex flex-col justify-end">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1 text-gray-600">
                                <span>👤</span>
                                <span>참여인원:</span>
                                <span className="font-medium text-gray-900">{people || 0}명</span>
                            </div>
                            
                            <div 
                                className="text-sm text-gray-500 truncate max-w-[120px]" 
                                title={instructor || "멘토 정보 없음"}
                            >
                                멘토: {instructor || "멘토 정보 없음"}
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <span>⚡</span>
                                <span className={`px-2 py-1 text-xs rounded-full font-medium ${getDifficultyColor(level)}`}>
                                    {level || "초급"}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                                <span>🌐</span>
                                <span className={`px-2 py-1 text-xs rounded-full font-medium ${getFormatColor(onoff)}`}>
                                    {onoff || "오프라인"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassCard;