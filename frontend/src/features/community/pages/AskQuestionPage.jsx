import React from "react";
import { useNavigate } from "react-router-dom";
import PostForm from "../components/PostForm";
import axios from "axios";



function AskQuestionPage() {
    const navigate = useNavigate(); //페이지 이동 훅


    const handleSubmit = async (data) => {
        try {
            await axios.post("/api/board/write", {
                type: "QUESTION",
                title: data.title,
                content: data.content,
            });

            alert("질문이 등록되었습니다!");
            navigate("/community?tab=questions");
        } catch (error) {
            console.error("질문 등록 실패", error);
            alert("등록 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-6">질문 등록</h1>
            <PostForm onSubmit={handleSubmit} showTags={true} />
        </div>
    );
}

export default AskQuestionPage;
