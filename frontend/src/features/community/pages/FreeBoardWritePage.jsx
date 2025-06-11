import React from "react";
import { useNavigate } from "react-router-dom";
import PostForm from "../components/PostForm";

function FreeBoardWritePage() {
    const navigate = useNavigate();

    const handleSubmit = (data) => {
        console.log("자유게시판 글 등록됨:", data);
        alert("글이 등록되었습니다!");
        navigate("/community?tab=free");
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-6">자유게시판 글쓰기</h1>
            <PostForm onSubmit={handleSubmit} showTags={false} />
        </div>
    );
}
export default FreeBoardWritePage;
