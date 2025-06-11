import React, { useState } from "react";

const FAQCard = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full flex justify-center">
            <div
                className={`w-full max-w-[768px] bg-white rounded-xl ring-1 ring-gray-200 hover:ring-[#3D4EFE] shadow-sm hover:shadow-lg transition-all duration-300 mb-4`}
            >
                {/* 질문 영역 */}
                <div
                    className="flex items-start gap-4 px-6 py-4 cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="text-[#3D4EFE] text-xl font-extrabold">Q</div>
                    <div className="flex-1 text-gray-800 text-lg font-semibold">
                        {question}
                    </div>
                    <div className="text-[#3D4EFE] text-xl font-bold">
                        {isOpen ? "−" : "+"}
                    </div>
                </div>

                {/* 답변 영역 */}
                <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isOpen
                            ? "max-h-[500px] opacity-100 scale-y-100 px-6 pb-5"
                            : "max-h-0 opacity-0 scale-y-95 px-6 pb-0"
                    }`}
                >
                    <div className="border-t border-gray-200 pt-4 pl-1 flex items-start gap-4">
                        <div className="text-[#3D4EFE] text-xl font-extrabold">A</div>
                        <div className="text-gray-700 text-base leading-relaxed">
                            {answer}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQCard;
