import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ChagePassword from "./ChagePassword";
import DeleteAccount from "./DeleteAccount";
import ProfileSettings from "./ProfileSettings";
import EditProfile from "./EditProfile";

//탭 기본구성
const tabs = [
    { key: "profileset", label: "프로필 설정" },
    { key: "changepassword", label: "비밀번호 변경" },
    { key: "accountquit", label: "회원탈퇴"}
];

function MyPageLayout() {
    const [searchParams] = useSearchParams(); //검색
    const [selectedTab, setSelectedTab] = useState("profileset"); //프로필설정
    const navigate = useNavigate();

    useEffect(() => {
        const currentTab = searchParams.get("tab") || "profileset";
        setSelectedTab(currentTab);
    }, [searchParams]);

    return (
        <div className="flex max-w-6xl mx-auto mt-10 px-4">
            {/* 좌측 탭 메  뉴 */}
            <div className="w-48 pr-6 border-r border-gray-200">
                <h2 className="text-xl font-bold mb-6">계정설정</h2>
                <ul className="space-y-3">
                    {tabs.map((tab) => (
                        <li
                            key={tab.key}
                            onClick={() => navigate(`/mypagelayout?tab=${tab.key}`)}
                            className={`cursor-pointer px-3 py-2 rounded ${
                                selectedTab === tab.key || (tab.key === "profileset" && selectedTab === "editpage")
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
            <div className="flex-1 pl-6 min-w-[600px]">
                {selectedTab === "profileset" && <ProfileSettings />}
                {selectedTab === "changepassword" && <ChagePassword />}
                {selectedTab === "accountquit" && <DeleteAccount />}
                {selectedTab === "editpage" && <EditProfile/>}
            </div>
        </div>
    );
}

export default MyPageLayout;

