// src/features/community/pages/FreeBoardDetailPage.jsx

import React from "react";
import { useParams } from "react-router-dom";
import CommentInput from "../components/CommentInput";
import CommentItem from "../components/CommentItem";

const dummyFreePost = {
    id: 1,
    title: "자유게시판 첫 번째 글입니다!",
    content: "이건 자유롭게 쓰는 게시글이에요. 규칙 없이 편하게 작성해보세요.",
    writer: "사용자1",
    date: "2024.06.01",
    views: 56,
    comments: [
        { id: 1, writer: "댓글러1", content: "좋은 글이에요!" },
        { id: 2, writer: "댓글러2", content: "자유게시판 좋아요~" }
    ]
};

function FreeBoardDetailPage() {
    const { id } = useParams(); // URL 파라미터 추출

    return (
        <div className="w-full max-w-3xl mx-auto py-10 px-4">
            {/* 제목 */}
            <h1 className="text-2xl font-bold text-[#3D4EFE] mb-2">
                {dummyFreePost.title}
            </h1>

            {/* 작성 정보 */}
            <div className="text-sm text-gray-500 mb-6">
                {dummyFreePost.writer} · {dummyFreePost.date} · 조회수 {dummyFreePost.views}
            </div>

            {/* 본문 */}
            <div className="text-gray-800 leading-relaxed mb-8">
                {dummyFreePost.content}
            </div>

            {/* 댓글 */}
            <h2 className="text-lg font-semibold mb-4">댓글</h2>
            <CommentInput />
            <div className="space-y-3 mt-4">
                {dummyFreePost.comments.map((comment) => (
                    <CommentItem key={comment.id} {...comment} />
                ))}
            </div>
        </div>
    );
}

export default FreeBoardDetailPage;
