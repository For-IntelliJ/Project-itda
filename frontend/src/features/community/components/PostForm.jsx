import React, { useState } from "react";

console.log("🟢 PostForm 렌더링됨");


function PostForm({ onSubmit, showTags = false }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState([]);

    const availableTags = ["HTML", "CSS", "JavaScript", "React", "기타"];

    const toggleTag = (tag) => {
        setTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !content) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }
        onSubmit({ title, content, tags });
        setTitle("");
        setContent("");
        setTags([]);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* 제목 */}
            <div>
                <label className="block text-gray-700 font-medium mb-1">제목</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D4EFE]"
                />
            </div>

            {/* 내용 */}
            <div>
                <label className="block text-gray-700 font-medium mb-1">내용</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="내용을 입력하세요"
                    rows="8"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#3D4EFE]"
                />
            </div>

            {/* 태그 (선택) */}
            {showTags && (
                <div>
                    <label className="block text-gray-700 font-medium mb-2">태그</label>
                    <div className="flex flex-wrap gap-2">
                        {availableTags.map((tag) => (
                            <button
                                type="button"
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`px-3 py-1 rounded-full border text-sm font-medium transition ${
                                    tags.includes(tag)
                                        ? "bg-[#3D4EFE] text-white border-[#3D4EFE]"
                                        : "bg-white text-gray-700 border-gray-300 hover:border-[#3D4EFE]"
                                }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 제출 */}
            <div className="text-right">
                <button
                    type="submit"
                    className="bg-[#3D4EFE] text-white px-6 py-2 rounded-md font-semibold hover:bg-[#2c3ed9]"
                >
                    등록
                </button>
            </div>
        </form>
    );
}

export default PostForm;
