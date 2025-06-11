// CRA에서는 이렇게 환경 구분함!
const isProduction = process.env.NODE_ENV === "production";

// S3 주소는 나중에 쓰니까 지금은 빈 문자열로!
const S3_BASE_URL = process.env.REACT_APP_S3_BASE_URL || "";

// 경로 객체 정의
export const IMAGES = {
  KAKAO_LOGIN: isProduction
    ? `${S3_BASE_URL}/kakao_login.png`
    : "/img/kakao_login.png",
};
