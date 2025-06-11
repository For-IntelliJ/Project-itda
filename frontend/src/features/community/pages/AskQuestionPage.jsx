import React from "react";
import { useNavigate } from "react-router-dom";
import PostForm from "../components/PostForm";

function AskQuestionPage() {
    const navigate = useNavigate(); //페이지 이동 훅

    const handleSubmit = (data) => {
        console.log("질문 등록됨:", data);
        alert("질문이 등록되었습니다!");
        navigate("/community?tab=questions");
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-6">질문 등록</h1>
            <PostForm onSubmit={handleSubmit} showTags={true} />
        </div>
    );
}

export default AskQuestionPage;
