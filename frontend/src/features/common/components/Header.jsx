import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { checkLogin, logoutUser } from "../../auth/api";
import { useAuth } from "../../../context/AuthContext";

function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, user, setUser, logout } = useAuth();
  const [nickname, setNickname] = useState("");  // 닉네임 상태 추가

  // 1) 앱 최초 마운트 시 서버 세션 확인해서 로그인 상태 세팅
  useEffect(() => {
    const checkLoginStatus = async () => {
      console.log('🔍 로그인 상태 확인 시작...');
      try {
        // 먼저 일반 로그인 체크
        const response = await axios.get("http://localhost:8080/api/members/me", { withCredentials: true });
        console.log('✅ 일반 로그인 세션 확인:', response.data);
        console.log('🔍 일반 사용자 권한:', response.data.role, typeof response.data.role);
        
        setIsLoggedIn(true);
        setUser(response.data);
        setNickname(response.data.nickname || response.data.username);
        
        console.log('✅ 일반 로그인 처리 완료 - user:', response.data);
        console.log('✅ 일반 로그인 처리 완료 - nickname:', response.data.nickname || response.data.username);
      } catch (err1) {
        console.log('❌ 일반 로그인 실패, 카카오 로그인 시도...');
        try {
          // 일반 로그인 실패하면 카카오 로그인 체크
          const kakaoResponse = await axios.get("http://localhost:8080/auth/kakao/me", { withCredentials: true });
          console.log('✅ 카카오 로그인 세션 확인 - 원본 데이터:', kakaoResponse.data);
          console.log('✅ 카카오 로그인 세션 확인 - 데이터 타입:', typeof kakaoResponse.data);
          
          // 데이터가 문자열인지 객체인지 확인
          if (typeof kakaoResponse.data === 'string') {
            console.log('❌ 카카오 API가 문자열을 반환함 (닉네임만): ', kakaoResponse.data);
            // 문자열인 경우 별도로 Member 정보를 가져와야 함
            const sessionResponse = await axios.get("http://localhost:8080/api/members/me", { withCredentials: true });
            console.log('✅ 세션에서 Member 정보 가져온:', sessionResponse.data);
            
            setIsLoggedIn(true);
            setUser(sessionResponse.data);
            setNickname(kakaoResponse.data); // 닉네임은 카카오 API에서
          } else {
            console.log('✅ 카카오 API가 객체를 반환함:', kakaoResponse.data);
            setIsLoggedIn(true);
            setUser(kakaoResponse.data);
            setNickname(kakaoResponse.data.nickname || kakaoResponse.data.username);
          }
          
          console.log('✅ 카카오 로그인 처리 완료');
        } catch (err2) {
          console.log('❌ 모든 세션 없음: 비로그인 상태');
          setIsLoggedIn(false);
          setUser(null);
          setNickname("");
        }
      }
    };
    
    checkLoginStatus();
  }, [setIsLoggedIn, setUser]);

  // 2) 로그인 상태가 바뀔 때마다 닉네임 새로 요청 (중복 요청 줄이려면 이건 필요에 따라 조절)
  useEffect(() => {
    console.log('🔍 useEffect - isLoggedIn:', isLoggedIn, 'user:', user);
    if (isLoggedIn && user) {
      // 모든 사용자는 user 객체에서 닉네임 가져옴
      const newNickname = user.nickname || user.username;
      console.log('🔍 새로운 닉네임 설정:', newNickname);
      setNickname(newNickname);
    } else {
      console.log('🔍 닉네임 초기화');
      setNickname("");
    }
  }, [isLoggedIn, user]);

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/api/members/logout", null, { withCredentials: true });
      logout(); // AuthContext의 logout 사용
      setNickname("");
      alert("로그아웃 되었습니다.");
      navigate("/");
    } catch (err) {
      console.error("❌ 로그아웃 실패:", err);
      alert("로그아웃 중 오류 발생");
    }
  };



  // 클래스 등록 버튼 클릭 핸들러
  const handleAddClassClick = (e) => {
    e.preventDefault();
    
    console.log('🔍 클래스 등록 버튼 클릭');
    console.log('🔍 현재 로그인 상태:', isLoggedIn);
    console.log('🔍 현재 user 객체:', user);
    console.log('🔍 현재 nickname:', nickname);
    
    // 로그인 체크
    if (!user) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    
    // MENTOR 권한 체크 - 문자열로 비교
    console.log("🔍 클래스 등록 버튼 클릭 - 사용자 권한:", user.role, typeof user.role);
    if (user.role !== "MENTOR") {
      alert("해당 기능은 멘토만 이용하실 수 있습니다. 멘토 신청을 통해 역할을 변경하세요!");
      return;
    }
    
    // MENTOR인 경우 클래스 등록 페이지로 이동
    navigate("/addclass");
  };

  return (
      <div className="flex flex-col pt-4 mb-1">
        <header className="text-black p-4 shadow-md">
          <div className="mx-auto max-w-[1100px] space-y-4">

            {/* 상단 로고 + 잇다 텍스트 + 우측 메뉴들 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-5">
                <img src="/img/MainLogo.png" alt="Main Logo" className="h-10" />
                <Link to="/" className="text-3xl font-dnf text-font">
                  잇다
                </Link>
              </div>

              {/* 우측 메뉴 */}
              <nav>
                <ul className="flex space-x-6 items-center">
                  <li>
                    <a href="#more" className="font-pretendard hover:text-hover hover:font-bold">더보기</a>
                  </li>
                  <li>
                    <button onClick={handleAddClassClick} className="font-pretendard hover:text-hover hover:font-bold">
                      클래스등록
                    </button>
                  </li>
                  {isLoggedIn ? (
                      <>
                        <li>
                          <button onClick={handleLogout} className="font-pretendard hover:text-hover hover:font-bold">
                            로그아웃
                          </button>
                        </li>
                        {nickname && (
                            <li className="text-lg text-gray-600 font-pretendard">
                              👋 환영합니다, <span className="font-semibold">{nickname}</span>님!
                            </li>
                        )}
                        {/* 디버깅용 로그 */}
                        {console.log('🔍 환영 메시지 렌더링 - nickname:', nickname, 'isLoggedIn:', isLoggedIn)}
                      </>
                  ) : (
                      <li>
                        <Link to="/login" className="font-pretendard hover:text-hover hover:font-bold">
                          로그인
                        </Link>
                      </li>
                  )}
                </ul>
              </nav>
            </div>

            {/* 중간 네비게이션 */}
            <nav>
              <ul className="flex space-x-8">
                <li>
                  <a
                      href="#searchclass"
                      className="text-lg font-bold font-pretendard hover:text-hover hover:font-extrabold transition-colors duration-200"
                  >
                    클래스검색
                  </a>
                </li>
                <li>
                  <Link
                      to="/mypage?tab=profilesettings"
                      className="text-lg font-bold font-pretendard hover:text-hover hover:font-extrabold transition-colors duration-200"
                  >
                    마이페이지
                  </Link>
                </li>
                <li>
                  <Link
                      to="/community?tab=questions"
                      className="text-lg font-bold font-pretendard hover:text-hover hover:font-extrabold transition-colors duration-200"
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
