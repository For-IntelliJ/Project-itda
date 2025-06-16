// src/components/ClassCard.jsx
import React from "react";

const ClassCard = ({
                       image,
                       title,
                       instructor,
                       people,
                       category, // 이제 "문자열(예: '디자인')" 항목을 받습니다.
                       onoff,
                       level,
                   }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-96 flex flex-col">
            {/* 카드 상단 이미지 */}
            <div className="w-full h-44 bg-gray-200 overflow-hidden flex-shrink-0">
                <img
                    src={image}
                    alt={title}
                    className="object-cover w-full h-full"
                />
            </div>
            {/* 카드 하단 정보 */}
            <div className="p-4 flex-grow flex flex-col">
                {/* 카테고리, 온/오프라인, 난이도 배지 배치 */}
                <div className="flex flex-wrap gap-2 mb-2 flex-shrink-0">
          <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
            카테고리: {category}
          </span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
            형태: {onoff}
          </span>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
            난이도: {level}
          </span>
                </div>

                {/* 제목 영역 - 3줄 기준으로 높이 설정 */}
                <div className="h-20 mb-3 flex-shrink-0">
                    <h3 
                        className="text-lg font-semibold leading-tight"
                        style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        {title}
                    </h3>
                </div>
                
                {/* 나머지 정보들 - 더 많은 공간 확보 */}
                <div className="flex-grow flex flex-col justify-end min-h-[60px]">
                    <p className="text-sm text-gray-500 mb-2 truncate">멘토: {instructor}</p>
                    <p className="text-lg font-bold text-gray-800">👤 {people}명</p>
                </div>
            </div>
        </div>
    );
};

export default ClassCard;
