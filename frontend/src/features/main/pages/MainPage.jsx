import React, {useEffect, useState} from "react";
import ClassCard from "../../class/components/ClassCard"; // ClassCard 컴포넌트


const banners = [//배너 2장을 담아 둘 배열
    "/img/Benner1.svg", "/img/Benner2.svg"];


const classes = [{
    image: "/img/Class_image_1.jpg", title: "귀염뽀짝 헤.꾸  ☆*o(≧▽≦)o*☆", instructor: "강보은", people: 3  // 숫자로 변경
}, {
    image: "/img/Class_image_2.jpg", title: "가지각색 풍선 교실🎈", instructor: "최재현", people: 0
}, {
    image: "/img/Class_image_3.jpg", title: "캔버스와 유화의 이야기", instructor: "강다연", people: 5
}

];

const classes2 = [{
    image: "/img/Class_image_4.jpg", title: "컴퓨터적 사고하는 방법", instructor: "백승범", people: 5
}, {
    image: "/img/Class_image_5.jpg", title: "중등수학 같이 배워봐요φ(*￣0￣)", instructor: "정승제", people: 5
}, {
    image: "/img/Class_image_6.jpg", title: "스프링부트 파헤치기", instructor: "조동일", people: 15
}];


function MainPage() {

    const [currentIndex, setCurrentIndex] = useState(0);//현재 상태를 나타내는 상수

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    return (<div>
            {/* 메인콘텐츠 */}
            <main className="flex-grow overflow-hidden relative bg-neutral-50">
                <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{transform: `translateX(-${currentIndex * 100}%)`}}
                >
                    {banners.map((src, index) => (
                        <div key={index} className="w-full flex-shrink-0 flex justify-center items-center bg-neutral-50">
                            <img
                                src={src}
                                alt={`배너 ${index}`}
                                className="object-contain max-h-[500px] w-full bg-neutral-50"
                            />
                        </div>
                    ))}
                </div>


                {/* 배너 아래 네모 버튼 4개 */}
                <div className="flex justify-center items-center space-x-14 my-6 pt-10">
                    {/* 첫 번째 버튼 - 지역 */}
                    <div
                        className="active:scale-95 w-[220px] h-20 bg-white hover:bg-gray-300 rounded-md flex items-center px-4 space-x-4 shadow-md hover:shadow-lg hover:scale-105 transition duration-300">
                        {/* 아이콘 */}
                        <img src="/img/Local_icon.png" alt="지역 아이콘" className="w-14 h-14"/>

                        {/* 텍스트 묶음 */}
                        <div className="h-20 flex flex-col justify-center">
                            <span className="text-[16px] font-pretendard font-semibold leading-none ml-10">지역</span>
                            <h1 className="text-[10px] font-pretendard text-gray-600 mt-[10px] leading-none">지역별 클래스를
                                둘러보기</h1>
                        </div>
                    </div>


                    {/* 두 번째 버튼 예시 */}
                    <div
                        className="active:scale-95 w-[220px] h-20 bg-white hover:bg-gray-300 rounded-md flex items-center px-4 space-x-4 shadow-md hover:shadow-lg hover:scale-105 transition duration-300">

                        <img src="/img/Type_icon.png" alt="유형 아이콘" className="w-14 h-14"/>
                        {/* 텍스트 묶음 */}
                        <div className="h-20 flex flex-col justify-center">
                            <span className="text-[16px] font-pretendard font-semibold leading-none ml-10">유형</span>
                            <h1 className="text-[10px] font-pretendard text-gray-600 mt-[10px] leading-none">유형별 클래스를
                                둘러보기</h1>
                        </div>
                    </div>


                    {/* 세 번째 버튼 예시 */}
                    <div
                        className="active:scale-95 w-[220px] h-20 bg-white hover:bg-gray-300 rounded-md flex items-center px-4 space-x-4 shadow-md hover:shadow-lg hover:scale-105 transition duration-300">

                        <img src="/img/Category_icon.png" alt="카테고리 아이콘" className="w-14 h-14"/>
                        <div className="h-20 flex flex-col justify-center">
                            <span className="text-[16px] font-pretendard font-semibold leading-none ml-5">카테고리</span>
                            <h1 className="text-[10px] font-pretendard text-gray-600 mt-[10px] leading-none">카테고리별 다양한
                                클래스</h1>
                        </div>
                    </div>

                    {/* 네 번째 버튼 예시 */}
                    <div
                        className="active:scale-95 w-[220px] h-20 bg-white hover:bg-gray-300 rounded-md flex items-center px-4 space-x-4 shadow-md hover:shadow-lg hover:scale-105 transition duration-300">

                        <img src="/img/Level_icon.png" alt="난이도 아이콘" className="w-14 h-14"/>
                        <div className="h-20 flex flex-col justify-center">
                            <span className="text-[16px] font-pretendard font-semibold leading-none ml-8">난이도</span>
                            <h1 className="text-[10px] font-pretendard text-gray-600 mt-[10px] leading-none">난이도별 클래스를
                                둘러보기</h1>
                        </div>
                    </div>
                </div>

                {/*클래스 관련 섹션*/}
                <section className="py-10 flex justify-center">
                    <div className="w-full max-w-6xl px-4">
                        <h2 className="text-xl font-bold text-gray-700 mb-6">
                            💛 몽글몽글 ⌈감성충만⌋ 클래스들은 어때요? 💛
                        </h2>
                        <div className="flex flex-wrap gap-10">
                            {classes.map((classInfo, index) => (
                                <ClassCard
                                    key={index}
                                    image={classInfo.image}
                                    title={classInfo.title}
                                    instructor={classInfo.instructor}
                                    people={classInfo.people}
                                />
                            ))}
                        </div>
                    </div>
                </section>


                {/*클래스 관련 섹션*/}
                <section className="py-10 flex justify-center">
                    <div className="w-full max-w-6xl px-4">
                        <h2 className="text-xl font-bold text-gray-700 mb-6">
                            오늘은 왠지 머리 쓰고 싶은 날이네...🤔🤔
                        </h2>
                        <div className="flex flex-wrap gap-10">
                            {classes2.map((classInfo, index) => (<ClassCard
                                key={index}
                                image={classInfo.image}
                                title={classInfo.title}
                                instructor={classInfo.instructor}
                                people={classInfo.people}
                            />))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default MainPage;
