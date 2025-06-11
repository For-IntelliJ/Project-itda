import React from 'react';

function ClassCard({ image, title, instructor, people }) {
    console.log(people);
    return (
        <div className="transform transition duration-300 hover:scale-105 active:scale-95 rounded-xl overflow-hidden shadow-lg bg-white">
            {/* 이미지 */}
            <div className="relative w-80 h-60">
                <img
                    className="w-full h-full object-cover transition duration-300 brightness-100 hover:brightness-75"
                    src={image}
                    alt={title}
                />
            </div>

            {/* 텍스트 정보 */}
            <div className="px-4 py-3">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-sm text-gray-500">멘토: {instructor}</p>
                <p className="text-lg font-bold text-gray-800">👤 {people}명</p>
            </div>
        </div>
    );
}

export default ClassCard;
