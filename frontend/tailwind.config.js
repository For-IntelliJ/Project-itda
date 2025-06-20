/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // ✅ React 프로젝트용
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ffffff',
        hover: '#3D4EFE',
        hoverDark: '#2c3ed9',
        font: '#37474F',
        line: '#777777',
        warning: '#E44B4B',
        kakao: '#FEE500',
        naver: '#03C75A',
        errorRed: '#FF3333',
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'sans-serif'],
        pretendard: ['Pretendard', 'sans-serif'],
        dnf: ['DNFBitBitv2', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
