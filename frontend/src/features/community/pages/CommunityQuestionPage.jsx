import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

import QuestionCard from "../components/QuestionCard";
import SearchBar from "../components/SearchBar";
import SortSelect from "../components/SortSelect";
import TagFilter from "../components/TagFilter";

function CommunityQuestionPage() {
    const [questionList, setQuestionList] = useState([]);
    const [allTags, setAllTags] = useState([]);

    const [keyword, setKeyword] = useState("");
    const [sort, setSort] = useState("recent");
    const [selectedTag, setSelectedTag] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = parseInt(searchParams.get("page")) || 1;
    const [currentPage, setCurrentPage] = useState(pageParam);

    const pageSize = 10;
    const navigate = useNavigate();

    // ✅ 질문 목록 불러오기
    useEffect(() => {
        axios.get("/api/boards/list?type=QUESTION")
            .then(res => {
                console.log("✅ 불러온 게시글 목록:", res.data);
                setQuestionList(res.data);
            })
            .catch(err => {
                console.error("❌ 게시글 로딩 실패:", err);
            });
    }, []);


    // ✅ 전체 태그 목록 불러오기
    useEffect(() => {
        axios.get("/api/tags")
            .then((res) => setAllTags(res.data)) // 예: ["React", "JavaScript", "HTML", ...]
            .catch((err) => console.error("❌ 태그 목록 로딩 실패:", err));
    }, []);

    // ✅ 검색 + 태그 필터링 + 정렬
    const filtered = questionList
        .filter((item) => item.title.toLowerCase().includes(keyword.toLowerCase()))
        .filter((item) => (selectedTag ? item.tags.includes(selectedTag) : true))
        .sort((a, b) => {
            if (sort === "views") return b.views - a.views;
            if (sort === "comments") return b.commentCount - a.commentCount;
            return 0;
        });

    const totalPages = Math.ceil(filtered.length / pageSize);
    const paginatedData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // 페이지 변경 시 스크롤 맨 위로 이동
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            setSearchParams({ page });
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-6">질문/답변</h1>

            {/* 검색/정렬 */}
            <div className="flex flex-wrap gap-4 items-center mb-6">
                <SearchBar keyword={keyword} onChange={setKeyword} />
                <SortSelect value={sort} onChange={setSort} />
            </div>

            {/* 태그 필터 */}
            <TagFilter tags={allTags} selected={selectedTag} onSelect={setSelectedTag} />

            {/* 질문 리스트 */}
            <div className="space-y-4 mt-6">
                {paginatedData.length > 0 ? (
                    paginatedData.map((item, idx) => (
                        <QuestionCard
                            key={idx}
                            id={item.id || idx + 1}  // id가 없으면 인덱스 + 1을 대체용으로 사용
                            {...item}
                        />
                    ))
                ) : (
                    <p className="text-gray-500">검색 결과가 없습니다.</p>
                )}
            </div>

            {/* 페이지네이션 */}
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

export default CommunityQuestionPage;

