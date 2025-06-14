import React, {useState} from "react";
import { useNavigate } from "react-router-dom"
import {useLocation} from "react-router-dom"; //state 받기)

//출석현황, 커뮤니티 활동 우측 탭
const TABS = {
    STATISTICS: 'statistics',
    COMMUNITY: 'community',
};

function ProfileSettings() {
    const [activeTab, setActiveTab] = useState(TABS.STATISTICS);
    //네비게이션함수(프로필수정 -> EditPage뜨게) 반드시 함수 안에서 호출되어야 하는구나...
    const navigate = useNavigate();
    const location = useLocation();
    const { profileData, previewUrl } = location.state || {};

    const handleEditClick = () => {
        console.log("프로필 수정 버튼 클릭됨"); // 여기에 콘솔 로그!
        navigate("/mypage?tab=editprofile");
    };

    const TabButton = ({ label, value }) => (
        <button
            className={`text-lg font-bold transition hover:text-[#3D4EFE] ${
                activeTab === value ? 'text-[#3D4EFE]' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab(value)}
        >
            {label}
        </button>
    );

    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold">프로필설정</h1>
            <main className="flex-grow overflow-hidden relative">
                <div className="p-6 max-w-[1000px] mx-auto flex gap-10">
                    {/* 왼쪽 영역 */}
                    <aside className="flex flex-col text-center gap-1 mt-10">
                        <img
                            src={previewUrl || "/img/Basic_Profile.png"}
                            alt="미리보기"
                            className="w-[220px] h-[220px] rounded-full bg-gray-200 object-cover"
                        />
                        <div className="text-xl font-bold mt-4 mb-4">
                            <p>{profileData?.name || "잇다"}</p>
                        </div>

                        {/*오늘의 다짐 부분*/}
                        <div className="w-[220px] h-[100px] pt-9 mb-4 pb-8 border border-[#3D4EFE] text-[#3D4EFE] font-bold rounded-md transition du ration-300 text-center">
                            <p>{profileData?.bio || "내용이 없습니다."}</p>
                        </div>

                        <button
                            onClick={handleEditClick}
                            className="w-[220px] h-[40px] border border-gray-800 text-gray-800 rounded-md font-bold hover:bg-gray-800 hover:text-white"
                        >
                            프로필 수정하기
                        </button>



                    </aside>

                    {/* 오른쪽 영역 */}
                    <section className="w-2/3 flex flex-col gap-6 mt-10 ml-10">
                        {/* 탭 메뉴 */}
                        <div className="flex gap-4 border-b pb-2">
                            <TabButton label="학습 통계" value={TABS.STATISTICS} />
                            <TabButton label="커뮤니티 활동" value={TABS.COMMUNITY} />
                        </div>

                        {/* 탭 내용 */}
                        {activeTab === TABS.STATISTICS ? (
                            <div className="flex gap-4">
                                <div className="w-[500px] h-[388px] border-2 border-gray-400 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-700">출석</h3>
                                    <p className="text-sm text-gray-600 mt-2">여기에 원하는 내용을 넣을 수 있어요.</p>
                                </div>
                                <div className="w-[400px] h-[388px] border-2 border-gray-400 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-700">누적 출석 현황</h3>
                                    <p className="text-sm text-gray-600 mt-2">또 다른 내용도 이곳에 넣을 수 있어요.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="w-[700px] h-[388px] border-2 border-gray-400 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-700">커뮤니티 활동 내역</h3>
                                <p className="text-sm text-gray-600 mt-2">게시글, 댓글, 좋아요 등을 보여줄 수 있어요.</p>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}



export default ProfileSettings;