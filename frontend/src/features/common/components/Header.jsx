import React from "react";
import { Link } from 'react-router-dom';

function Header() {
  return (
      <div className="flex flex-col pt-4 mb-1">
        {/* 헤더 */}
        <header className="text-black p-4 shadow-md">
          <div className="mx-auto max-w-[1100px] space-y-4">

            {/* 상단 로고 + 잇다 텍스트 + 우측 메뉴들 */}
            <div className="flex items-center justify-between mb-6">
              {/* 좌측: 로고 + 텍스트 */}
              <div className="flex items-center space-x-5">
                <img src="/img/MainLogo.png" alt="Main Logo" className="h-10"/>
                <Link to="/" className="text-3xl  font-dnf">
                  잇다
                </Link>
              </div>

              {/* 우측: 메뉴들 */}
              <nav>
                <ul className="flex space-x-6">
                  <li>
                    <a href="#more" className="font-pretendard hover:underline">더보기</a>
                  </li>
                  <li>
                    <Link to="/classmaker" className="font-pretendard hover:underline">클래스등록</Link>
                  </li>
                  <li>
                    <Link to="/login" className="font-pretendard hover:underline">로그인</Link>
                  </li>
                </ul>
              </nav>
            </div>

            {/* 중간 네비게이션: 클래스검색 / 마이페이지 */}
            <nav>
              <ul className="flex space-x-8">
                <li>
                  <a
                      href="#search"
                      className="text-lg font-bold font-pretendard  hover:text-[#3D4EFE] transition-colors duration-200"
                  >
                    클래스검색
                  </a>
                </li>
                <li>
                  <Link //마이페이지 첫화면을 프로필설정으로 경로설정
                      to="/mypagelayout?tab=profileset"
                      className="text-lg font-bold font-pretendard hover:text-[#3D4EFE] transition-colors duration-200"
                  >
                    마이페이지
                  </Link>
                </li>
                <li>
                  <Link
                      to="/community?tab=questions"
                      className="text-lg font-bold font-pretendard hover:text-[#3D4EFE]"
                  >
                    커뮤니티
                  </Link>

                </li>
              </ul>
            </nav>

          </div>
        </header>
      </div>
  );
}

export default Header;
