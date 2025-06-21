import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { checkLogin, logoutUser } from "../../auth/api";
import { useAuth } from "../../../context/AuthContext";

function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [nickname, setNickname] = useState("");  // 닉네임 상태 추가

  // 1) 앱 최초 마운트 시 서버 세션 확인해서 로그인 상태 세팅
  useEffect(() => {
    axios.get("http://localhost:8080/auth/kakao/me", { withCredentials: true })
        .then(res => {
          setNickname(res.data);
          setIsLoggedIn(true);
          console.log("✅ 서버 세션 확인: 로그인 상태 유지");
        })
        .catch(err => {
          setIsLoggedIn(false);
          setNickname("");
          console.log("❌ 서버 세션 없음: 비로그인 상태");
        });
  }, [setIsLoggedIn]);

  // 2) 로그인 상태가 바뀔 때마다 닉네임 새로 요청 (중복 요청 줄이려면 이건 필요에 따라 조절)
  useEffect(() => {
    if (isLoggedIn) {
      axios.get("http://localhost:8080/auth/kakao/me", { withCredentials: true })
          .then(res => setNickname(res.data))
          .catch(() => setNickname(""));
    } else {
      setNickname("");
    }
  }, [isLoggedIn]);

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/api/members/logout", null, { withCredentials: true });
      setIsLoggedIn(false);
      setNickname("");
      alert("로그아웃 되었습니다.");
      navigate("/");
    } catch (err) {
      console.error("❌ 로그아웃 실패:", err);
      alert("로그아웃 중 오류 발생");
    }
  };



  // 클래스 등록 버튼 클릭 핸들러
  const handleAddClassClick = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("/api/members/me", { withCredentials: true });
      const user = response.data;

      if (user.role === "MENTOR") {
        navigate("/addclass");
      } else {
        alert("멘토만 선택이 가능합니다. 멘토 신청을 해주세요.");
      }
    } catch (error) {
      console.error("사용자 인증 실패:", error);
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
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
