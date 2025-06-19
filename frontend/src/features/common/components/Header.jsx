import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Header() {
  const navigate = useNavigate();

  // 클래스 등록 버튼 클릭 핸들러
  const handleAddClassClick = async (e) => {
    e.preventDefault();
    
    try {
      // 로그인 상태 및 사용자 역할 확인
      const response = await axios.get('/api/members/me');
      const user = response.data;
      
      if (user.role === 'MENTOR') {
        // 멘토라면 클래스 등록 페이지로 이동
        navigate('/addclass');
      } else {
        // 멘토가 아니면 알림 표시
        alert('멘토만 선택이 가능합니다. 이 기능을 이용하시려면 멘토 신청을 해주세요.');
      }
    } catch (error) {
      // 로그인되지 않았거나 오류 발생 시 - 테스트를 위해 임시로 허용
      console.error('사용자 인증 실패:', error);
      console.log('테스트 모드: 클래스 등록 페이지로 이동');
      navigate('/addclass'); // 테스트를 위해 바로 이동
    }
  };
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
                <Link to="/" className="text-3xl  font-dnf text-font">
                  잇다
                </Link>
              </div>

              {/* 우측: 메뉴들 */}
              <nav>
                <ul className="flex space-x-6">
                  <li>
                    <a href="#more" className="font-pretendard hover:text-hover hover:font-bold">더보기</a>
                  </li>
                  <li>
                    <Link to="/addclass" className="font-pretendard hover:text-hover hover:font-bold">클래스등록</Link>
                  </li>
                  <li>
                    <Link to="/login" className="font-pretendard hover:text-hover hover:font-bold">로그인</Link>
                  </li>
                </ul>
              </nav>
            </div>

            {/* 중간 네비게이션: 클래스검색 / 마이페이지 */}
            <nav>
              <ul className="flex space-x-8">
                <li>
                  <a
                      href="#searchclass"
                      className="text-lg font-bold font-pretendard  hover:text-hover hover:font-extrabold transition-colors duration-200">클래스검색
                  </a>
                </li>
                <li>
                  <Link //마이페이지 첫화면을 프로필설정으로 경로설정
                      to="/mypage?tab=profilesettings"
                      className="text-lg font-bold font-pretendard hover:text-hover hover:font-extrabold transition-colors duration-200">마이페이지
                  </Link>
                </li>
                <li>
                  <Link
                      to="/community?tab=questions"
                      className="text-lg font-bold font-pretendard hover:text-hover hover:font-extrabold transition-colors duration-200">커뮤니티
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
