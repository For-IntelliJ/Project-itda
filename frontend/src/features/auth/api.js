import axios from 'axios';

// 회원가입
export const registerUser = async (formData) => {
    return await axios.post('http://localhost:8080/api/members/join', formData, {
        withCredentials: true,
    });
};
// 로그인
export const loginUser = async (data) => {
    return await axios.post('http://localhost:8080/api/members/login', data, {
        withCredentials: true,
    });
};
// 로그아웃
export const logoutUser = async () => {
    return await axios.post("http://localhost:8080/api/members/logout", null, {
        withCredentials: true,
    });
};

// 로그인 상태 확인
export const checkLogin = async () => {
    const res = await axios.get('http://localhost:8080/api/members/me', {
        withCredentials: true,
    });
    return res.data; // 로그인된 사용자 객체 반환 (없으면 401 에러 발생)
};

//카카오로그인 상태확인
export const checkKakaoLogin = async () => {
    const res = await axios.get('http://localhost:8080/auth/kakao/me', {
        withCredentials: true,
    });
    return res.data;  // 닉네임 정보
};