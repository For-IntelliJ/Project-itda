import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import SearchBar from "../components/SearchBar";
import SortSelect from "../components/SortSelect";
import TagFilter from "../components/TagFilter";

const allTags = ["React", "JavaScript", "HTML", "CSS", "기타"];

const dummyData = [
    {
        "title": "HTML 시멘틱 태그가 중요한 이유는?",
        "writer": "웹입문자",
        "date": "2025.05.09",
        "views": 63,
        "commentCount": 4,
        "tags": [
            "기타"
        ]
    },
    {
        "title": "자바스크립트 클로저 개념 쉽게 설명해줄 수 있나요?",
        "writer": "디자코더",
        "date": "2025.05.06",
        "views": 106,
        "commentCount": 8,
        "tags": [
            "React"
        ]
    },
    {
        "title": "React 프로젝트 구조 어떻게 잡는 게 좋을까요?",
        "writer": "웹입문자",
        "date": "2025.05.22",
        "views": 195,
        "commentCount": 7,
        "tags": [
            "JavaScript"
        ]
    },
    {
        "title": "JavaScript에서 map과 forEach의 차이는?",
        "writer": "react왕",
        "date": "2025.05.16",
        "views": 266,
        "commentCount": 7,
        "tags": [
            "CSS"
        ]
    },
    {
        "title": "CSS position 속성 정리 부탁드립니다",
        "writer": "코딩초보",
        "date": "2025.04.30",
        "views": 202,
        "commentCount": 0,
        "tags": [
            "HTML"
        ]
    },
    {
        "title": "HTML에서 meta 태그는 왜 쓰나요?",
        "writer": "JS마스터",
        "date": "2025.05.15",
        "views": 30,
        "commentCount": 7,
        "tags": [
            "React",
            "JavaScript"
        ]
    },
    {
        "title": "JavaScript에서 == 와 === 의 차이는?",
        "writer": "리액트러",
        "date": "2025.05.18",
        "views": 221,
        "commentCount": 4,
        "tags": [
            "CSS"
        ]
    },
    {
        "title": "JavaScript 비동기 처리 방식은 어떤 게 있나요?",
        "writer": "웹입문자",
        "date": "2025.05.02",
        "views": 262,
        "commentCount": 0,
        "tags": [
            "기타"
        ]
    },
    {
        "title": "React 프로젝트 구조 어떻게 잡는 게 좋을까요?",
        "writer": "디자코더",
        "date": "2025.05.25",
        "views": 154,
        "commentCount": 2,
        "tags": [
            "CSS"
        ]
    },
    {
        "title": "HTML 시멘틱 태그가 중요한 이유는?",
        "writer": "갓다",
        "date": "2025.05.07",
        "views": 166,
        "commentCount": 4,
        "tags": [
            "React",
            "JavaScript"
        ]
    },
    {
        "title": "HTML 시멘틱 태그가 중요한 이유는?",
        "writer": "JS마스터",
        "date": "2025.05.09",
        "views": 103,
        "commentCount": 5,
        "tags": [
            "CSS"
        ]
    },
    {
        "title": "JavaScript 비동기 처리 방식은 어떤 게 있나요?",
        "writer": "갓다",
        "date": "2025.05.22",
        "views": 118,
        "commentCount": 4,
        "tags": [
            "기타"
        ]
    },
    {
        "title": "useEffect에서 의존성 배열이 뭔가요?",
        "writer": "웹입문자",
        "date": "2025.05.03",
        "views": 215,
        "commentCount": 7,
        "tags": [
            "CSS"
        ]
    },
    {
        "title": "CSS position 속성 정리 부탁드립니다",
        "writer": "디자코더",
        "date": "2025.05.02",
        "views": 173,
        "commentCount": 8,
        "tags": [
            "JavaScript"
        ]
    },
    {
        "title": "useEffect에서 의존성 배열이 뭔가요?",
        "writer": "비교장인",
        "date": "2025.04.28",
        "views": 173,
        "commentCount": 8,
        "tags": [
            "HTML"
        ]
    },
    {
        "title": "HTML 시멘틱 태그가 중요한 이유는?",
        "writer": "JS마스터",
        "date": "2025.04.25",
        "views": 156,
        "commentCount": 4,
        "tags": [
            "React",
            "JavaScript"
        ]
    },
    {
        "title": "JavaScript 비동기 처리 방식은 어떤 게 있나요?",
        "writer": "react왕",
        "date": "2025.05.24",
        "views": 192,
        "commentCount": 0,
        "tags": [
            "HTML"
        ]
    },
    {
        "title": "JavaScript에서 map과 forEach의 차이는?",
        "writer": "html소녀",
        "date": "2025.04.27",
        "views": 279,
        "commentCount": 10,
        "tags": [
            "JavaScript",
            "기타"
        ]
    },
    {
        "title": "HTML에서 meta 태그는 왜 쓰나요?",
        "writer": "JS마스터",
        "date": "2025.05.01",
        "views": 24,
        "commentCount": 10,
        "tags": [
            "JavaScript"
        ]
    },
    {
        "title": "HTML form 태그와 input 속성 설명해주세요",
        "writer": "html소녀",
        "date": "2025.05.12",
        "views": 277,
        "commentCount": 10,
        "tags": [
            "CSS"
        ]
    },
    {
        "title": "React에서 props와 state의 차이는?",
        "writer": "react왕",
        "date": "2025.05.10",
        "views": 61,
        "commentCount": 4,
        "tags": [
            "CSS"
        ]
    },
    {
        "title": "CSS position 속성 정리 부탁드립니다",
        "writer": "html소녀",
        "date": "2025.05.13",
        "views": 249,
        "commentCount": 0,
        "tags": [
            "기타"
        ]
    },
    {
        "title": "React 프로젝트 구조 어떻게 잡는 게 좋을까요?",
        "writer": "웹입문자",
        "date": "2025.05.05",
        "views": 268,
        "commentCount": 2,
        "tags": [
            "CSS"
        ]
    },
    {
        "title": "JavaScript에서 == 와 === 의 차이는?",
        "writer": "JS마스터",
        "date": "2025.05.03",
        "views": 276,
        "commentCount": 0,
        "tags": [
            "CSS"
        ]
    },
    {
        "title": "CSS Flex와 Grid의 차이점이 궁금해요",
        "writer": "JS마스터",
        "date": "2025.05.18",
        "views": 218,
        "commentCount": 1,
        "tags": [
            "React",
            "JavaScript"
        ]
    },
    {
        "title": "CSS position 속성 정리 부탁드립니다",
        "writer": "리액트러",
        "date": "2025.05.05",
        "views": 171,
        "commentCount": 9,
        "tags": [
            "React"
        ]
    },
    {
        "title": "CSS Flex와 Grid의 차이점이 궁금해요",
        "writer": "디자코더",
        "date": "2025.05.04",
        "views": 85,
        "commentCount": 0,
        "tags": [
            "기타"
        ]
    },
    {
        "title": "HTML form 태그와 input 속성 설명해주세요",
        "writer": "비교장인",
        "date": "2025.05.02",
        "views": 219,
        "commentCount": 5,
        "tags": [
            "JavaScript",
            "기타"
        ]
    },
    {
        "title": "React에서 props와 state의 차이는?",
        "writer": "코딩초보",
        "date": "2025.05.05",
        "views": 227,
        "commentCount": 10,
        "tags": [
            "HTML",
            "CSS"
        ]
    },
    {
        "title": "HTML form 태그와 input 속성 설명해주세요",
        "writer": "html소녀",
        "date": "2025.04.29",
        "views": 33,
        "commentCount": 7,
        "tags": [
            "CSS"
        ]
    },
    {
        "title": "React에서 상태 관리는 어떻게 하나요?",
        "writer": "html소녀",
        "date": "2025.04.26",
        "views": 207,
        "commentCount": 2,
        "tags": [
            "CSS"
        ]
    },
    {
        "title": "CSS position 속성 정리 부탁드립니다",
        "writer": "갓다",
        "date": "2025.04.30",
        "views": 218,
        "commentCount": 1,
        "tags": [
            "JavaScript"
        ]
    },
    {
        "title": "HTML 시멘틱 태그가 중요한 이유는?",
        "writer": "디자코더",
        "date": "2025.05.01",
        "views": 97,
        "commentCount": 6,
        "tags": [
            "기타"
        ]
    },
    {
        "title": "JavaScript에서 == 와 === 의 차이는?",
        "writer": "웹입문자",
        "date": "2025.05.07",
        "views": 211,
        "commentCount": 2,
        "tags": [
            "JavaScript",
            "기타"
        ]
    },
    {
        "title": "React 프로젝트 구조 어떻게 잡는 게 좋을까요?",
        "writer": "비교장인",
        "date": "2025.05.13",
        "views": 185,
        "commentCount": 7,
        "tags": [
            "JavaScript"
        ]
    },
    {
        "title": "React에서 상태 관리는 어떻게 하나요?",
        "writer": "웹입문자",
        "date": "2025.05.21",
        "views": 251,
        "commentCount": 5,
        "tags": [
            "JavaScript",
            "기타"
        ]
    },
    {
        "title": "CSS position 속성 정리 부탁드립니다",
        "writer": "리액트러",
        "date": "2025.05.11",
        "views": 235,
        "commentCount": 8,
        "tags": [
            "React",
            "JavaScript"
        ]
    },
    {
        "title": "React에서 props와 state의 차이는?",
        "writer": "코딩초보",
        "date": "2025.05.25",
        "views": 274,
        "commentCount": 10,
        "tags": [
            "CSS"
        ]
    },
    {
        "title": "HTML 시멘틱 태그가 중요한 이유는?",
        "writer": "react왕",
        "date": "2025.05.24",
        "views": 188,
        "commentCount": 9,
        "tags": [
            "JavaScript"
        ]
    },
    {
        "title": "HTML에서 meta 태그는 왜 쓰나요?",
        "writer": "코딩초보",
        "date": "2025.05.25",
        "views": 279,
        "commentCount": 5,
        "tags": [
            "JavaScript"
        ]
    },
    {
        "title": "CSS position 속성 정리 부탁드립니다",
        "writer": "디자코더",
        "date": "2025.05.11",
        "views": 243,
        "commentCount": 4,
        "tags": [
            "CSS"
        ]
    },
    {
        "title": "JavaScript에서 == 와 === 의 차이는?",
        "writer": "JS마스터",
        "date": "2025.04.27",
        "views": 209,
        "commentCount": 7,
        "tags": [
            "JavaScript"
        ]
    },
    {
        "title": "CSS에서 반응형 웹을 만들려면 어떻게 해야 하나요?",
        "writer": "비교장인",
        "date": "2025.05.24",
        "views": 31,
        "commentCount": 4,
        "tags": [
            "JavaScript",
            "기타"
        ]
    },
    {
        "title": "JavaScript에서 == 와 === 의 차이는?",
        "writer": "갓다",
        "date": "2025.04.28",
        "views": 117,
        "commentCount": 0,
        "tags": [
            "JavaScript"
        ]
    },
    {
        "title": "React에서 props와 state의 차이는?",
        "writer": "갓다",
        "date": "2025.04.28",
        "views": 85,
        "commentCount": 7,
        "tags": [
            "React",
            "JavaScript"
        ]
    },
    {
        "title": "HTML 시멘틱 태그가 중요한 이유는?",
        "writer": "코딩초보",
        "date": "2025.05.11",
        "views": 173,
        "commentCount": 0,
        "tags": [
            "JavaScript",
            "기타"
        ]
    },
    {
        "title": "JavaScript에서 map과 forEach의 차이는?",
        "writer": "코딩초보",
        "date": "2025.05.12",
        "views": 118,
        "commentCount": 5,
        "tags": [
            "기타"
        ]
    },
    {
        "title": "React에서 props와 state의 차이는?",
        "writer": "JS마스터",
        "date": "2025.05.02",
        "views": 50,
        "commentCount": 3,
        "tags": [
            "JavaScript"
        ]
    },
    {
        "title": "CSS에서 반응형 웹을 만들려면 어떻게 해야 하나요?",
        "writer": "코딩초보",
        "date": "2025.05.08",
        "views": 27,
        "commentCount": 5,
        "tags": [
            "기타"
        ]
    },
    {
        "title": "useEffect에서 의존성 배열이 뭔가요?",
        "writer": "비교장인",
        "date": "2025.05.09",
        "views": 240,
        "commentCount": 5,
        "tags": [
            "React"
        ]
    }
]
function CommunityQuestionPage() {
    const [keyword, setKeyword] = useState("");
    const [sort, setSort] = useState("recent");
    const [selectedTag, setSelectedTag] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = parseInt(searchParams.get("page")) || 1;
    const [currentPage, setCurrentPage] = useState(pageParam);

    const pageSize = 10;
    const navigate = useNavigate();

    // ✅ 검색 + 태그 필터링 + 정렬
    const filtered = dummyData
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
                            key={item.id || idx}
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

