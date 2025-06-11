import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="w-full bg-neutral-50 flex flex-col items-center mt-20">
            <div className="w-full max-w-[1920px] min-h-[13rem] flex justify-center px-10 mx-auto">

                {/* 좌측 영역 */}
                <div className="relative w-[285px]">
                    <div className="w-48 absolute top-[48px] text-slate-600 text-3xl font-normal font-dnf">
                        ITDA 잇다
                    </div>
                    <div className="w-72 absolute top-[113px] font-pretender text-xs font-normal font-['Noto_Sans']">
                        일상에 쉼을, 재능에 가치를, 사람에 철학을 잇다
                    </div>
                    <div className="w-56 absolute top-[147px] font-pretender text-xs font-normal font-['Noto_Sans']">
                        Let’s make more chance with ITDA
                    </div>
                </div>

                {/* 중앙 영역 */}
                <div className="relative w-[580px]">
                    <div className="absolute top-[48px] flex flex-col items-center space-y-3">
                        {/* 하단 링크들 */}
                        <div className="flex flex-nowrap space-x-10 text-gray-600 text-xs font-normal font-['Noto_Sans']">
                            <div className="whitespace-nowrap">이용약관</div>
                            <div className="whitespace-nowrap">개인정보처리방침</div>
                            <div className="whitespace-nowrap">사업자정보확인</div>
                            <div className="whitespace-nowrap">서비스소개</div>
                            <img
                                src="/img/SNS.svg"
                                alt="SNS Icon"
                                className="w-20 h-5"
                            />
                        </div>

                        {/* 회사 정보 + 구분선 */}
                        <div className="flex flex-col items-center text-gray-600 text-xs font-normal font-['Noto_Sans'] leading-relaxed text-left">
                            <div className="h-px bg-gray-600 w-full mb-2" />
                            <div className="max-w-fit">
                                © 주식회사 잇다 | 대표 itswc | 사업자등록번호 : 136-23-01234 |
                                통신판매번호 : 2023-성남금광-0136
                                <br />
                                주소 : 경기도 성남시 중원구 광명로 377 남관 정보미디어학부 111호
                                <br />
                                Tel : 031-740-1114 (평일 10:00 ~ 20:00) | E-mail : hello-admin@itda.com
                            </div>
                        </div>
                    </div>
                </div>

                {/* 우측 영역 */}
                <div className="relative w-[200px]">
                    <Link
                        to="/faq"
                        className="absolute top-[48px] font-pretender text-xl font-bold font-['Noto_Sans'] hover:text-[#3D4EFE] transition-colors duration-200"
                    >
                        고객센터 &gt;
                    </Link>
                    <div className="absolute top-[88px] w-44 h-9 rounded-[5px] border border-gray-700" />
                    <div className="absolute top-[96px] w-44 font-pretender text-sm font-normal font-['Noto_Sans'] text-center">
                        1:1 문의하기
                    </div>
                    <div className="absolute top-[133px] w-44 h-7 font-pretender text-[10px] font-normal font-['Noto_Sans'] leading-snug">
                        평일 : 10:00 ~ 20:00 (주말, 공휴일 제외)
                        <br />
                        점심 시간 : 12:00 ~ 13:30
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
