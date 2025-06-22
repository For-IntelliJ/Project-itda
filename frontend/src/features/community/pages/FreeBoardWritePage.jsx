import React from "react";
import { useNavigate } from "react-router-dom";
import PostForm from "../components/PostForm";
import axios from "axios";



function FreeBoardWritePage() {
    const navigate = useNavigate();

    const handleSubmit = async (data) => {
        try {
            await axios.post("/api/board/write", {
                type: "FREE",
                title: data.title,
                content: data.content,
            }, {
                withCredentials: true
            });

            alert("글이 등록되었습니다!");
            navigate("/community?tab=free");
        } catch (error) {
            console.error("글 등록 실패", error);
            alert("등록 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-6">자유게시판 글쓰기</h1>
            <PostForm onSubmit={handleSubmit} showTags={false} />
        </div>
    );
}
export default FreeBoardWritePage;
