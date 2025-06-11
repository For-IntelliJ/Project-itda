import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
// 공통 컴포넌트
import Header from "./features/common/components/Header";
import Footer from "./features/common/components/Footer";
// 페이지 컴포넌트
import JoinPage from "./features/auth/pages/JoinPage";
import LoginPage from "./features/auth/pages/LoginPage";
import MainPage from "./features/main/pages/MainPage";
import FAQPage from "./features/faq/pages/FAQPage";
import AddClassPage from "./features/class/pages/AddClassPage";
// 마이페이지
import MyPageLayout from "./features/user/pages/MyPageLayout";
import EditProfile from "./features/user/pages/EditProfile";
//커뮤니티
import CommunityLayout from "./features/community/pages/CommunityLayout";
import AskQuestionPage from "./features/community/pages/AskQuestionPage";
import FreeBoardWritePage from "./features/community/pages/FreeBoardWritePage";
import QuestionDetailPage from "./features/community/pages/QuestionDetailPage";

function App() {
    return (
        <div className="min-h-screen flex flex-col">
            <Router>
                <Header/>
                <main className="flex-grow ">
                    <Routes>
                        <Route path="/" element={<MainPage/>}/>
                        <Route path="/join" element={<JoinPage/>}/>
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/faq" element={<FAQPage />} />
                        <Route path="/addclass" element={<AddClassPage />} />

                        {/*마이페이지 메인*/}
                        <Route path="/mypage" element={<MyPageLayout />} />
                        {/*마이페이지: 프로필설정/프로필수정*/}
                        <Route path="/editprofile" element={<EditProfile />} />

                        {/* 커뮤니티 메인 (탭 포함) */}
                        <Route path="/community" element={<CommunityLayout />} />
                        {/* 커뮤니티: 글쓰기 */}
                        <Route path="/coummunity/ask/write" element={<AskQuestionPage />} />
                        <Route path="/coummunity/freeboard/write" element={<FreeBoardWritePage />} />

                        {/* 질문 상세 페이지 */}
                        <Route path="/coummunity/ask/questions/:id" element={<QuestionDetailPage />} />

                    </Routes>
                </main>
                <Footer/>
            </Router>
        </div>
    );
}

export default App;