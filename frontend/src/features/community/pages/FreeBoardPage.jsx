import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import FreeBoardCard from "../components/FreeBoardCard";

const dummyFreePosts =[
    {
        "id": 1,
        "title": "자유게시판 글 제목 1",
        "content": "이것은 자유게시판 글 내용 1입니다.",
        "writer": "작성자1",
        "date": "2024.05.01",
        "views": 104
    },
    {
        "id": 2,
        "title": "자유게시판 글 제목 2",
        "content": "이것은 자유게시판 글 내용 2입니다.",
        "writer": "작성자2",
        "date": "2024.05.02",
        "views": 8
    },
    {
        "id": 3,
        "title": "자유게시판 글 제목 3",
        "content": "이것은 자유게시판 글 내용 3입니다.",
        "writer": "작성자3",
        "date": "2024.05.03",
        "views": 168
    },
    {
        "id": 4,
        "title": "자유게시판 글 제목 4",
        "content": "이것은 자유게시판 글 내용 4입니다.",
        "writer": "작성자4",
        "date": "2024.05.04",
        "views": 129
    },
    {
        "id": 5,
        "title": "자유게시판 글 제목 5",
        "content": "이것은 자유게시판 글 내용 5입니다.",
        "writer": "작성자5",
        "date": "2024.05.05",
        "views": 17
    },
    {
        "id": 6,
        "title": "자유게시판 글 제목 6",
        "content": "이것은 자유게시판 글 내용 6입니다.",
        "writer": "작성자6",
        "date": "2024.05.06",
        "views": 89
    },
    {
        "id": 7,
        "title": "자유게시판 글 제목 7",
        "content": "이것은 자유게시판 글 내용 7입니다.",
        "writer": "작성자7",
        "date": "2024.05.07",
        "views": 153
    },
    {
        "id": 8,
        "title": "자유게시판 글 제목 8",
        "content": "이것은 자유게시판 글 내용 8입니다.",
        "writer": "작성자8",
        "date": "2024.05.08",
        "views": 162
    },
    {
        "id": 9,
        "title": "자유게시판 글 제목 9",
        "content": "이것은 자유게시판 글 내용 9입니다.",
        "writer": "작성자9",
        "date": "2024.05.09",
        "views": 37
    },
    {
        "id": 10,
        "title": "자유게시판 글 제목 10",
        "content": "이것은 자유게시판 글 내용 10입니다.",
        "writer": "작성자10",
        "date": "2024.05.10",
        "views": 116
    },
    {
        "id": 11,
        "title": "자유게시판 글 제목 11",
        "content": "이것은 자유게시판 글 내용 11입니다.",
        "writer": "작성자11",
        "date": "2024.05.11",
        "views": 58
    },
    {
        "id": 12,
        "title": "자유게시판 글 제목 12",
        "content": "이것은 자유게시판 글 내용 12입니다.",
        "writer": "작성자12",
        "date": "2024.05.12",
        "views": 110
    },
    {
        "id": 13,
        "title": "자유게시판 글 제목 13",
        "content": "이것은 자유게시판 글 내용 13입니다.",
        "writer": "작성자13",
        "date": "2024.05.13",
        "views": 100
    },
    {
        "id": 14,
        "title": "자유게시판 글 제목 14",
        "content": "이것은 자유게시판 글 내용 14입니다.",
        "writer": "작성자14",
        "date": "2024.05.14",
        "views": 55
    },
    {
        "id": 15,
        "title": "자유게시판 글 제목 15",
        "content": "이것은 자유게시판 글 내용 15입니다.",
        "writer": "작성자15",
        "date": "2024.05.15",
        "views": 126
    },
    {
        "id": 16,
        "title": "자유게시판 글 제목 16",
        "content": "이것은 자유게시판 글 내용 16입니다.",
        "writer": "작성자16",
        "date": "2024.05.16",
        "views": 60
    },
    {
        "id": 17,
        "title": "자유게시판 글 제목 17",
        "content": "이것은 자유게시판 글 내용 17입니다.",
        "writer": "작성자17",
        "date": "2024.05.17",
        "views": 10
    },
    {
        "id": 18,
        "title": "자유게시판 글 제목 18",
        "content": "이것은 자유게시판 글 내용 18입니다.",
        "writer": "작성자18",
        "date": "2024.05.18",
        "views": 142
    },
    {
        "id": 19,
        "title": "자유게시판 글 제목 19",
        "content": "이것은 자유게시판 글 내용 19입니다.",
        "writer": "작성자19",
        "date": "2024.05.19",
        "views": 196
    },
    {
        "id": 20,
        "title": "자유게시판 글 제목 20",
        "content": "이것은 자유게시판 글 내용 20입니다.",
        "writer": "작성자20",
        "date": "2024.05.20",
        "views": 104
    },
    {
        "id": 21,
        "title": "자유게시판 글 제목 21",
        "content": "이것은 자유게시판 글 내용 21입니다.",
        "writer": "작성자21",
        "date": "2024.05.21",
        "views": 55
    },
    {
        "id": 22,
        "title": "자유게시판 글 제목 22",
        "content": "이것은 자유게시판 글 내용 22입니다.",
        "writer": "작성자22",
        "date": "2024.05.22",
        "views": 176
    },
    {
        "id": 23,
        "title": "자유게시판 글 제목 23",
        "content": "이것은 자유게시판 글 내용 23입니다.",
        "writer": "작성자23",
        "date": "2024.05.23",
        "views": 128
    },
    {
        "id": 24,
        "title": "자유게시판 글 제목 24",
        "content": "이것은 자유게시판 글 내용 24입니다.",
        "writer": "작성자24",
        "date": "2024.05.24",
        "views": 120
    },
    {
        "id": 25,
        "title": "자유게시판 글 제목 25",
        "content": "이것은 자유게시판 글 내용 25입니다.",
        "writer": "작성자25",
        "date": "2024.05.25",
        "views": 196
    }
];

function FreeBoardPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = parseInt(searchParams.get("page")) || 1;
    const tab = searchParams.get("tab") || "free"; // tab 정보 유지
    const [currentPage, setCurrentPage] = useState(pageParam);
    const pageSize = 3;

    const totalPages = Math.ceil(dummyFreePosts.length / pageSize);
    const paginatedData = dummyFreePosts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            setSearchParams({ tab, page }); // tab 유지한 채 page만 변경
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto py-10 px-4">
            <h2 className="text-xl font-bold mb-6">자유게시판</h2>

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
