import React from "react";
import { useNavigate } from "react-router-dom";

function FreeBoardCard({ id, title, writer, date, content, likeCount = 0, commentCount = 0 }) {
    const navigate = useNavigate();

    return (
        <div
            className="border rounded-md px-4 py-3 hover:shadow transition cursor-pointer bg-white"
            onClick={() => navigate(`/free/${id}`)}
        >
            <h3 className="text-lg font-semibold text-[#3D4EFE] mb-1">
                {title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
                {writer} · {date}
            </p>
            <p className="text-gray-800 line-clamp-2">{content}</p>
            <div className="text-sm text-gray-500 mt-2">
                ❤️ {likeCount} · 💬 {commentCount}
            </div>
        </div>
    );
}

export default FreeBoardCard;
