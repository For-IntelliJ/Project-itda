import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CommunityQuestionPage from "./CommunityQuestionPage";
import FreeBoardPage from "./FreeBoardPage";

const tabs = [
    { key: "questions", label: "질문/답변" },
    { key: "free", label: "자유게시판" }
];

function CommunityLayout() {
    const [searchParams] = useSearchParams();
    const [selectedTab, setSelectedTab] = useState("questions");
    const navigate = useNavigate();

    useEffect(() => {
        const currentTab = searchParams.get("tab") || "questions";
        setSelectedTab(currentTab);
    }, [searchParams]);

    return (
        <div className="flex max-w-6xl mx-auto mt-10 px-4">
            {/* 좌측 탭 메뉴 */}
            <div className="w-48 pr-6 border-r border-gray-200">
                <h2 className="text-xl font-bold mb-6">커뮤니티</h2>
                <ul className="space-y-3">
                    {tabs.map((tab) => (
                        <li
                            key={tab.key}
                            onClick={() => navigate(`/community?tab=${tab.key}`)}
                            className={`cursor-pointer px-3 py-2 rounded ${
                                selectedTab === tab.key
                                    ? "bg-gray-100 font-semibold text-[#3D4EFE]"
                                    : "text-gray-600 hover:text-[#3D4EFE]"
                            }`}
                        >
                            {tab.label}
                        </li>
                    ))}
                </ul>
            </div>

            {/* 우측 콘텐츠 영역 */}
            <div className="flex-1 pl-6">
                {/* 콘텐츠 영역 */}
                {selectedTab === "questions" && <CommunityQuestionPage />}
                {selectedTab === "free" && <FreeBoardPage />}
            </div>
        </div>
    );
}

export default CommunityLayout;
