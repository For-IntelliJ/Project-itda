import React from "react";
import {BrowserRouter as Router, Route, Routes, useLocation} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// 공통 컴포넌트
import Header from "./features/common/components/Header";
import Footer from "./features/common/components/Footer";
// 페이지 컴포넌트
import JoinPage from "./features/auth/pages/JoinPage";
import NicknamePage from "./features/auth/pages/NicknamePage";
import LoginPage from "./features/auth/pages/LoginPage";
import MainPage from "./features/main/pages/MainPage";
import FAQPage from "./features/faq/pages/FAQPage";
import AddClassPage from "./features/class/pages/AddClassPage";
// 마이페이지
import MyPageLayout from "./features/user/pages/MyPageLayout";

//커뮤니티
import CommunityLayout from "./features/community/pages/CommunityLayout";
import AskQuestionPage from "./features/community/pages/AskQuestionPage";
import FreeBoardWritePage from "./features/community/pages/FreeBoardWritePage";
import QuestionDetailPage from "./features/community/pages/QuestionDetailPage";
import ClassDetailPage from "./features/class/pages/ClassDetailPage";
import FreeBoardDetailPage from "./features/community/pages/FreeBoardDetailPage";

function LayoutWrapper() {
    const location = useLocation();
    const noLayoutPaths = ["/login", "/join"]; // ❗ 헤더/푸터를 숨기고 싶은 경로 추가
    const shouldHideLayout = noLayoutPaths.includes(location.pathname);

    return (
        <div className="min-h-screen flex flex-col">
            {!shouldHideLayout && <Header/>}
            <main className="flex-grow ">
                <Routes>
                    <Route path="/" element={<MainPage/>}/>
                    <Route path="/join" element={<JoinPage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/faq" element={<FAQPage/>}/>
                    <Route path="/addclass" element={<AddClassPage/>}/>

                    {/*마이페이지 메인*/}
                    <Route path="/mypage" element={<MyPageLayout/>}/>

                    {/* 커뮤니티 메인 (탭 포함) */}
                    <Route path="/community" element={<CommunityLayout/>}/>
                    {/* 자유게시판 글 상세 */}
                    <Route path="/free/:id" element={<FreeBoardDetailPage />} />
                    {/* 질문 상세 페이지 */}
                    <Route path="/questions/:id" element={<QuestionDetailPage />} />

                    {/* 커뮤니티: 글쓰기 */}
                    <Route path="/community/ask/write" element={<AskQuestionPage />} />
                    <Route path="/community/freeboard/write" element={<FreeBoardWritePage />} />

                    {/* 클래스 상세 페이지 */}
                    <Route path="/class/:id" element={<ClassDetailPage />} />

                    {/* 카카오 로그인 새로운 닉네임입력 페이지*/}
                    <Route path="/nickname" element={<NicknamePage />} />

                </Routes>
            </main>
            {!shouldHideLayout && <Footer/>}
        </div>
    );

}


function App() {
    return (
        <Router>
            <AuthProvider>
                <LayoutWrapper />
            </AuthProvider>
        </Router>
    );
}

export default App;