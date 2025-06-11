import React from "react";

function SearchBar({ keyword, onChange }) {
    return (
        <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={keyword}
            onChange={(e) => onChange(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D4EFE]"
        />
    );
}

export default SearchBar;
