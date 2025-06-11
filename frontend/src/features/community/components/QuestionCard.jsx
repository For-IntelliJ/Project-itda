import React from "react";
import { useNavigate } from "react-router-dom";

function QuestionCard({ title, writer, date, views, commentCount, id }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/questions/${id}`)}
            className="w-full p-4 border border-gray-200 rounded-lg hover:shadow-sm transition cursor-pointer bg-white"
        >
            <h3 className="text-lg font-semibold text-[#3D4EFE] truncate">{title}</h3>
            <div className="text-sm text-gray-500 mt-2 flex justify-between items-center">
                <span>{writer} · {date}</span>
                <span>조회수 {views} · 댓글 {commentCount}</span>
            </div>
        </div>
    );
}

export default QuestionCard;
