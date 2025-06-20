import React, { useState, useEffect } from "react";
import {Link, useSearchParams} from "react-router-dom";
import axios from "axios";
import FreeBoardCard from "../components/FreeBoardCard";

function FreeBoardPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = parseInt(searchParams.get("page")) || 1;
    const tab = searchParams.get("tab") || "free";
    const [currentPage, setCurrentPage] = useState(pageParam);
    const [posts, setPosts] = useState([]);
    const pageSize = 5; // 원하는 페이지 크기

    useEffect(() => {
        axios.get("/api/boards/list?type=FREE")
            .then(res => {
                console.log("✅ 불러온 게시글 목록:", res.data);
                setPosts(res.data);
            })
            .catch(err => {
                console.error("❌ 게시글 로딩 실패:", err);
            });
    }, []);


    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    const totalPages = Math.ceil(posts.length / pageSize);
    const paginatedData = posts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            setSearchParams({ tab, page });
        }
    };
    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">자유게시판</h1>
                <Link to="/community/freeboard/write">
                    <button className="bg-[#3D4EFE] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#2c3ed9]">글쓰기</button>
                </Link>
            </div>

            <div className="space-y-4">
                {paginatedData.map((post) => (
                    <FreeBoardCard key={post.id} {...post} />
                ))}
            </div>

            <div className="flex justify-center items-center gap-2 mt-10">
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    &laquo;
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => goToPage(i + 1)}
                        className={`px-3 py-1 rounded border ${
                            currentPage === i + 1
                                ? "bg-[#3D4EFE] text-white border-[#3D4EFE]"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    &raquo;
                </button>
            </div>
        </div>
    );
}

export default FreeBoardPage;
