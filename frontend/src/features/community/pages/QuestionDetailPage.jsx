// pages/QuestionDetailPage.jsx

import React from "react";
import { useParams } from "react-router-dom";
import CommentInput from "../components/CommentInput";
import CommentItem from "../components/CommentItem";

const dummyQuestion = {
    id: 1,
    title: "React에서 상태 관리는 어떻게 하나요?",
    content:
        "상태 관리를 위한 useState, useReducer, 또는 외부 상태관리 라이브러리 등 여러 방법이 있다고 들었는데 각각 언제 쓰면 좋을까요?",
    writer: "코드잇",
    date: "2024.05.01",
    views: 128,
    tags: ["React", "상태관리"],
    comments: [
        { id: 1, writer: "프론트고수", content: "규모 작으면 useState로도 충분해요!" },
        { id: 2, writer: "초보개발자", content: "Redux는 너무 무겁던데 recoil 써보세요." }
    ]
};

function QuestionDetailPage() {
    const { id } = useParams(); // 추후 백엔드 연동용

    return (
        <div className="w-full max-w-3xl mx-auto py-10 px-4">
            {/* 제목 */}
            <h1 className="text-2xl font-bold text-[#3D4EFE] mb-2">{dummyQuestion.title}</h1>

            {/* 작성 정보 */}
            <div className="text-sm text-gray-500 mb-6">
                {dummyQuestion.writer} · {dummyQuestion.date} · 조회수 {dummyQuestion.views}
            </div>

            {/* 내용 */}
            <div className="text-gray-800 leading-relaxed mb-6">
                {dummyQuestion.content}
            </div>

            {/* 태그 */}
            <div className="flex flex-wrap gap-2 mb-8">
                {dummyQuestion.tags.map((tag) => (
                    <span
                        key={tag}
                        className="px-3 py-1 text-sm border border-[#3D4EFE] text-[#3D4EFE] rounded-full"
                    >
            #{tag}
          </span>
                ))}
            </div>

            {/* 댓글 */}
            <h2 className="text-lg font-semibold mb-4">댓글</h2>
            <CommentInput />
            <div className="space-y-3 mt-4">
                {dummyQuestion.comments.map((comment) => (
                    <CommentItem key={comment.id} {...comment} />
                ))}
            </div>
        </div>
    );
}

export default QuestionDetailPage;
