import React, { useState } from "react";

function CommentInput() {
    const [comment, setComment] = useState("");

    const handleSubmit = () => {
        if (!comment) return alert("댓글을 입력하세요!");
        alert("댓글 등록됨: " + comment);
        setComment("");
    };

    return (
        <div className="flex flex-col gap-2">
      <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="댓글을 입력하세요"
          rows={3}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D4EFE]"
      />
            <div className="text-right">
                <button
                    onClick={handleSubmit}
                    className="bg-[#3D4EFE] text-white px-4 py-1.5 rounded-md hover:bg-[#2c3ed9]"
                >
                    등록
                </button>
            </div>
        </div>
    );
}

export default CommentInput;
