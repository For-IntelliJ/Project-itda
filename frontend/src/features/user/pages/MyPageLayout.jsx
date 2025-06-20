import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ChangePassword from "./ChangePassword";
import DeleteAccount from "./DeleteAccount";
import ProfileSettings from "./ProfileSettings";
import EditProfile from "./EditProfile";
import axios from "axios";
import { checkLogin } from "../../auth/api";

const tabs = [
    { key: "profilesettings", label: "프로필 설정" },
    { key: "changepassword", label: "비밀번호 변경" },
    { key: "deleteaccount", label: "회원탈퇴" }
];

function MyPageLayout() {
    const [searchParams] = useSearchParams();
    const [selectedTab, setSelectedTab] = useState("profilesettings");
    const navigate = useNavigate();

    // 로그인 여부 확인
    useEffect(() => {
        const verifyLogin = async () => {
            try {
                await checkLogin();
            } catch (err) {
                if (err.response?.status === 401) {
                    alert("로그인이 필요합니다.");
                    navigate("/login");
                }
            }
        };
        verifyLogin();
    }, [navigate]);

    // 탭 선택 감지
    useEffect(() => {
        const currentTab = searchParams.get("tab") || "profilesettings";
        setSelectedTab(currentTab);
    }, [searchParams]);

    return (
        <div className="flex max-w-6xl mx-auto mt-10 px-4">
            {/* 좌측 탭 메뉴 */}
            <div className="w-48 pr-6 border-r border-gray-200">
                <h2 className="text-xl font-bold mb-6">계정설정</h2>
                <ul className="space-y-3">
                    {tabs.map((tab) => (
                        <li
                            key={tab.key}
                            onClick={() => navigate(`/mypage?tab=${tab.key}`)}
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
            <div className="flex-1 pl-6 ">
                {selectedTab === "profilesettings" && <ProfileSettings />}
                {selectedTab === "changepassword" && <ChangePassword />}
                {selectedTab === "deleteaccount" && <DeleteAccount />}
                {selectedTab === "editprofile" && <EditProfile />}
            </div>
        </div>
    );
}

export default MyPageLayout;
