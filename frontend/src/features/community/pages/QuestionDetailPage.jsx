import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CommentInput from "../components/CommentInput";
import CommentItem from "../components/CommentItem";

function QuestionDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [question, setQuestion] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`/api/boards/${id}`)
            .then(res => {
                setQuestion(res.data);
            })
            .catch(err => {
                console.error("❌ 게시글 불러오기 실패:", err);
                setError("게시글을 불러오지 못했습니다.");
            });
    }, [id]);

    if (error) return <div className="text-red-500 text-center py-20">{error}</div>;
    if (!question) return <div className="text-center py-20">로딩 중...</div>;

    // ✅ 목록으로 돌아가기
    const handleBackToList = () => {
        navigate("/community?tab=questions"); // ← 목록 경로에 맞게 수정
    };

    return (
        <div className="w-full max-w-3xl mx-auto py-10 px-4">
            <button
                onClick={handleBackToList}
                className="mb-4 px-4 py-2 bg-gray-200 text-sm rounded hover:bg-gray-300"
            >목록으로
            </button>

            {/* 제목 */}
            <h1 className="text-2xl font-bold text-[#3D4EFE] mb-2">{question.title}</h1>

            {/* 작성 정보 */}
            <div className="text-sm text-gray-500 mb-6">
                {question.writer} · {question.date} · 조회수 {question.views}
            </div>

            {/* 내용 */}
            <div className="text-gray-800 leading-relaxed mb-6">
                {question.content}
            </div>

            {/* 태그 */}
            <div className="flex flex-wrap gap-2 mb-8">
                {question.tags.map((tag) => (
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
                {(question.comments || []).map((comment) => (
                    <CommentItem key={comment.id} {...comment} />
                ))}
            </div>
        </div>
    );
}

export default QuestionDetailPage;
