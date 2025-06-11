import React from "react";

function SortSelect({ value, onChange }) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D4EFE]"
        >
            <option value="recent">최신순</option>
            <option value="views">조회수순</option>
            <option value="comments">댓글순</option>
        </select>
    );
}

export default SortSelect;
