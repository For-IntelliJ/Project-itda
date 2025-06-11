import React from "react";

function TagFilter({ selected, onSelect, tags }) {
    return (
        <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
                <button
                    key={tag}
                    onClick={() => onSelect(tag === selected ? null : tag)}
                    className={`px-3 py-1 rounded-full border text-sm font-medium transition ${
                        selected === tag
                            ? "bg-[#3D4EFE] text-white border-[#3D4EFE]"
                            : "bg-white text-gray-700 border-gray-300 hover:border-[#3D4EFE]"
                    }`}
                >
                    #{tag}
                </button>
            ))}
        </div>
    );
}

export default TagFilter;
