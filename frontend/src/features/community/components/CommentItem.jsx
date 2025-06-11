import React from "react";

function CommentItem({ writer, content }) {
    return (
        <div className="border border-gray-200 rounded-md px-4 py-3">
            <div className="text-sm text-gray-600 mb-1">{writer}</div>
            <div className="text-gray-800">{content}</div>
        </div>
    );
}

export default CommentItem;
