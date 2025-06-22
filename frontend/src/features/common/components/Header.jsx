import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { checkLogin, logoutUser } from "../../auth/api";
import { useAuth } from "../../../context/AuthContext";

function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, user, setUser, logout } = useAuth();
  const [nickname, setNickname] = useState("");
  const [isServerConnected, setIsServerConnected] = useState(false);

  // 서버 연결 상태 확인
  useEffect(() => {
    const checkServerConnection = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/health", { 
          withCredentials: true,
          timeout: 5000
        });
        setIsServerConnected(true);
      } catch (error) {
        console.warn('⚠️ 백엔드 서버에 연결할 수 없습니다.');
        console.warn('확인사항: 1) MySQL 서버 실행 2) 백엔드 서버 실행 (localhost:8080)');
        setIsServerConnected(false);
      }
    };

    checkServerConnection();
  }, []);

  // 로그인 상태 확인 (서버 연결된 경우에만)
  useEffect(() => {
    if (!isServerConnected) {
      console.log('⚠️ 서버 미연결 상태: 로그인 체크 건너뜀');
      return;
    }

    const checkLoginStatus = async () => {
      console.log('🔍 로그인 상태 확인 시작...');
      try {
        const response = await axios.get("http://localhost:8080/api/members/me", { withCredentials: true });
        console.log('✅ 일반 로그인 세션 확인:', response.data);
        
        setIsLoggedIn(true);
        setUser(response.data);
        setNickname(response.data.nickname || response.data.username);
        
      } catch (err1) {
        console.log('❌ 일반 로그인 실패, 카카오 로그인 시도...');
        try {
          const kakaoResponse = await axios.get("http://localhost:8080/auth/kakao/me", { withCredentials: true });
          
          if (typeof kakaoResponse.data === 'string') {
            const sessionResponse = await axios.get("http://localhost:8080/api/members/me", { withCredentials: true });
            setIsLoggedIn(true);
            setUser(sessionResponse.data);
            setNickname(kakaoResponse.data);
          } else {
            setIsLoggedIn(true);
            setUser(kakaoResponse.data);
            setNickname(kakaoResponse.data.nickname || kakaoResponse.data.username);
          }
          
        } catch (err2) {
          console.log('❌ 모든 세션 없음: 비로그인 상태');
          setIsLoggedIn(false);
          setUser(null);
          setNickname("");
        }
      }
    };
    
    checkLoginStatus();
  }, [setIsLoggedIn, setUser, isServerConnected]);

  // 닉네임 업데이트
  useEffect(() => {
    if (isLoggedIn && user) {
      const newNickname = user.nickname || user.username;
      setNickname(newNickname);
    } else {
      setNickname("");
    }
  }, [isLoggedIn, user]);

  // 로그아웃 처리
  const handleLogout = async () => {
    if (!isServerConnected) {
      alert("서버에 연결되지 않았습니다. 백엔드 서버를 실행해주세요.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/members/logout", null, { withCredentials: true });
      logout();
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
    
    if (!isServerConnected) {
      alert("서버에 연결되지 않았습니다. 백엔드 서버(localhost:8080)를 먼저 실행해주세요.");
      return;
    }
    
    if (!user) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    
    if (user.role !== "MENTOR") {
      alert("해당 기능은 멘토만 이용하실 수 있습니다. 멘토 신청을 통해 역할을 변경하세요!");
      return;
    }
    
    navigate("/addclass");
  };

  return (
      <div className="flex flex-col pt-4 mb-1">
        {/* 서버 연결 상태 알림 */}
        {!isServerConnected && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 text-center text-sm">
            ⚠️ 백엔드 서버에 연결되지 않았습니다. localhost:8080에서 백엔드를 실행해주세요.
          </div>
        )}
        
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
                  {isLoggedIn && isServerConnected ? (
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