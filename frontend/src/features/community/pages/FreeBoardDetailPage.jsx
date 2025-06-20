import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CommentInput from "../components/CommentInput";
import CommentItem from "../components/CommentItem";

function FreeBoardDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);

    useEffect(() => {
        axios.get(`/api/boards/${id}`)  // ✅ 수정됨
            .then(res => setPost(res.data))
            .catch(err => console.error("❌ 게시글 불러오기 실패:", err));
    }, [id]);

    if (!post) return <div className="text-center py-10">로딩 중...</div>;

    // ✅ 목록으로 돌아가기
    const handleBackToList = () => {
        navigate("/community?tab=free"); // ← 목록 경로에 맞게 수정
    };

    return (
        <div className="w-full max-w-3xl mx-auto py-10 px-4">
            <button
                onClick={handleBackToList}
                className="mb-4 px-4 py-2 bg-gray-200 text-sm rounded hover:bg-gray-300"
            >목록으로
            </button>

            <h1 className="text-2xl font-bold text-[#3D4EFE] mb-2">
                {post.title}
            </h1>

            <div className="text-sm text-gray-500 mb-6">
                {post.writer} · {post.date} · 조회수 {post.views}
            </div>

            <div className="text-gray-800 leading-relaxed mb-8">
                {post.content}
            </div>

            {/* 댓글 기능은 추후 연결 */}
            <h2 className="text-lg font-semibold mb-4">댓글</h2>
            <CommentInput />
            <div className="space-y-3 mt-4">
                {/* 댓글은 아직 미구현 */}
                {/* post.comments.map(...) 향후 연결 */}
            </div>
        </div>
    );
}

export default FreeBoardDetailPage;
