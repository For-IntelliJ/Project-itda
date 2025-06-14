import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import ClassApplication from "../components/ClassApplication";

const ClassDetail = () => {
    const { id } = useParams();
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState("intro");
    const [selectedDate, setSelectedDate] = useState('');
    const [showApplicationModal, setShowApplicationModal] = useState(false);
    const accentColor = "#3d42fe"; // 퍼스널 컬러

    // 섹션별 ref
    const introRef = useRef(null);
    const curriculumRef = useRef(null);
    const hostRef = useRef(null);
    const locationRef = useRef(null);

    // 클릭 시 해당 섹션 스크롤 기능
    const scrollToSection = (ref) => {
        if (ref.current) {
            const topOffset = ref.current.getBoundingClientRect().top + window.pageYOffset - 120;
            window.scrollTo({ top: topOffset, behavior: "smooth" });
        }
    };

    // 스크롤 위치에 따라 activeSection 변경
    useEffect(() => {
        const handleScroll = () => {
            const introTop = introRef.current.getBoundingClientRect().top;
            const curriculumTop = curriculumRef.current.getBoundingClientRect().top;
            const hostTop = hostRef.current.getBoundingClientRect().top;
            const locationTop = locationRef.current.getBoundingClientRect().top;
            const offset = 150; // 헤더 여백

            if (locationTop - offset <= 0) {
                setActiveSection("location");
            } else if (hostTop - offset <= 0) {
                setActiveSection("host");
            } else if (curriculumTop - offset <= 0) {
                setActiveSection("curriculum");
            } else {
                setActiveSection("intro");
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // 서버 응답 처리
    useEffect(() => {
        async function fetchClass() {
            try {
                const res = await fetch(`http://localhost:8080/api/classes/${id}`);
                if (!res.ok) {
                    throw new Error(`클래스 정보를 불러오는 데 실패했습니다. (status ${res.status})`);
                }
                const data = await res.json();
                const enriched = {
                    ...data,
                    mentor_name: data.mento?.username ?? data.mento?.name ?? "알 수 없음",
                    category_name: data.category?.name ?? "미분류",
                    detailImages: data.detail_images ? [data.detail_images] : [],
                };
                setClassData(enriched);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError(err.message);
                setLoading(false);
            }
        }
        fetchClass();
    }, [id]);

    // 클래스 신청 화면 열기
    const handleApplicationClick = () => {
        if (!selectedDate) {
            alert('날짜를 먼저 선택해주세요.');
            return;
        }
        setShowApplicationModal(true);
    };

    // 클래스 신청 확인
    const handleApplicationConfirm = async () => {
        try {
            // 신청 데이터 준비
            const applyData = {
                classId: id,
                classname: classData?.classname,
                mentor: classData?.mentor_name,
                selectedDate,
                category: classData?.category_name
            };

            // 콘솔 로그로 데이터 확인
            console.log('=== 프론트엔드 신청 데이터 ===');
            console.log('신청 데이터:', applyData);
            console.log('Class ID:', id);
            console.log('선택된 날짜:', selectedDate);

            // API 호출 전 로그
            console.log('서버로 전송할 데이터:', { classId: id });

            // API 호출
            const response = await fetch('http://localhost:8080/api/applies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    classId: id
                })
            });

            console.log('HTTP Response Status:', response.status);
            console.log('HTTP Response OK:', response.ok);

            // 응답 텍스트 확인
            const responseText = await response.text();
            console.log('서버 응답 텍스트:', responseText);

            let result;
            try {
                result = JSON.parse(responseText);
            } catch (parseError) {
                console.error('JSON 파싱 오류:', parseError);
                console.error('응답 내용:', responseText);
                alert('서버 응답 형식 오류');
                return;
            }

            console.log('=== 서버 응답 ===');
            console.log('응답 데이터:', result);

            if (response.ok && result.success) {
                alert('클래스 신청이 완료되었습니다!');
                console.log('신청 성공:', result.data);
            } else {
                const errorMessage = result.message || '알 수 없는 오류가 발생했습니다.';
                alert('신청 실패: ' + errorMessage);
                console.error('신청 실패:', errorMessage);
                console.error('전체 응답:', result);
            }

        } catch (error) {
            console.error('=== 신청 중 오류 발생 ===');
            console.error('오류 상세:', error);
            console.error('오류 메시지:', error.message);
            console.error('오류 스택:', error.stack);
            alert('신청 중 오류가 발생했습니다: ' + error.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-xl text-gray-500">로딩 중...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen px-4">
                <p className="text-red-500 text-center text-lg">{error}</p>
            </div>
        );
    }

    // 메인 및 디테일 이미지 경로 처리
    const mainImgSrc = classData.mainImage
        ? classData.mainImage.startsWith("http")
            ? classData.mainImage
            : `http://localhost:8080/uploads/classes/${classData.mainImage}`
        : "/img/default_class.jpg";

    const detailImgSrc =
        classData.detailImages && classData.detailImages.length > 0
            ? classData.detailImages[0].startsWith("http")
                ? classData.detailImages[0]
                : `http://localhost:8080/uploads/classes/${classData.detailImages[0]}`
            : null;

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            {/* 그리드: 좌측 2/3, 우측 1/3 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 좌측 칼럼 */}
                <div className="lg:col-span-2 space-y-6">
                    {/* 메인 이미지 */}
                    <div className="w-full h-80 bg-gray-100 overflow-hidden rounded-lg shadow">
                        <img
                            src={mainImgSrc}
                            alt={classData.classname}
                            className="object-cover w-full h-full"
                        />
                    </div>

                    {/* 썸네일 (최대 4개) */}
                    {classData.detailImages && classData.detailImages.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto">
                            {[mainImgSrc, ...classData.detailImages]
                                .slice(0, 4)
                                .map((src, idx) => (
                                    <div
                                        key={idx}
                                        className="w-24 h-24 bg-gray-100 overflow-hidden rounded-lg flex-shrink-0"
                                    >
                                        <img
                                            src={src}
                                            alt={`detail-${idx}`}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                ))}
                        </div>
                    )}

                    {/* 제목 및 기본 정보 */}
                    <div className="space-y-4">
                        <h1 className="text-4xl font-extrabold text-gray-800">
                            {classData.classname}
                        </h1>
                        <p className="text-lg text-gray-700">멘토: {classData.mentor_name}</p>

                        <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                카테고리: {classData.category_name}
              </span>
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                형태: {classData.onoff}
              </span>
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                난이도: {classData.level}
              </span>
                            <span className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded-full">
                지역: {classData.region?.name ?? classData.addr}
              </span>
                        </div>
                    </div>

                    {/* 탭 메뉴 - 상단 고정 */}
                    <div className="sticky top-0 bg-white z-20 border-b shadow-sm">
                        <div className="flex justify-around">
                            <button
                                onClick={() => scrollToSection(introRef)}
                                className={`py-4 text-lg font-medium ${
                                    activeSection === "intro"
                                        ? "text-indigo-600 border-b-2 border-indigo-600"
                                        : "text-gray-600 hover:text-indigo-500"
                                }`}
                            >
                                클래스 소개
                            </button>
                            <button
                                onClick={() => scrollToSection(curriculumRef)}
                                className={`py-4 text-lg font-medium ${
                                    activeSection === "curriculum"
                                        ? "text-indigo-600 border-b-2 border-indigo-600"
                                        : "text-gray-600 hover:text-indigo-500"
                                }`}
                            >
                                커리큘럼
                            </button>
                            <button
                                onClick={() => scrollToSection(hostRef)}
                                className={`py-4 text-lg font-medium ${
                                    activeSection === "host"
                                        ? "text-indigo-600 border-b-2 border-indigo-600"
                                        : "text-gray-600 hover:text-indigo-500"
                                }`}
                            >
                                멘토 소개
                            </button>
                            <button
                                onClick={() => scrollToSection(locationRef)}
                                className={`py-4 text-lg font-medium ${
                                    activeSection === "location"
                                        ? "text-indigo-600 border-b-2 border-indigo-600"
                                        : "text-gray-600 hover:text-indigo-500"
                                }`}
                            >
                                위치
                            </button>
                        </div>
                    </div>

                    {/* 상세 섹션들 */}
                    <div className="space-y-12">
                        {/* 클래스 소개 */}
                        <section ref={introRef} className="space-y-4 pt-8">
                            <h2
                                className="text-2xl font-semibold"
                                style={{ color: accentColor }}
                            >
                                클래스 소개
                            </h2>
                            <p className="text-gray-800 leading-relaxed whitespace-pre-line text-lg">
                                {classData.detailContent || "클래스 소개 내용이 없습니다."}
                            </p>
                        </section>

                        {/* 커리큘럼 */}
                        <section ref={curriculumRef} className="space-y-4 pt-8">
                            <h2
                                className="text-2xl font-semibold"
                                style={{ color: accentColor }}
                            >
                                커리큘럼
                            </h2>
                            <p className="text-gray-800 leading-relaxed whitespace-pre-line text-lg">
                                {classData.curriculum || "커리큘럼 정보가 없습니다."}
                            </p>
                        </section>

                        {/* 멘토 소개 */}
                        <section ref={hostRef} className="space-y-4 pt-12">
                            <h2
                                className="text-2xl font-semibold"
                                style={{ color: accentColor }}
                            >
                                멘토 소개
                            </h2>
                            <p className="text-gray-800 leading-relaxed text-lg">
                                {classData.mentoInfo || "멘토 소개 정보가 없습니다."}
                            </p>
                        </section>

                        {/* 위치 */}
                        <section ref={locationRef} className="space-y-4 pt-12 pb-12">
                            <h2
                                className="text-2xl font-semibold"
                                style={{ color: accentColor }}
                            >
                                위치
                            </h2>
                            <p className="text-gray-800 leading-relaxed text-lg">
                                {classData.spaceInfo || "공간 정보가 없습니다."}
                            </p>
                            <p className="text-gray-800 leading-relaxed text-lg">
                                {classData.addr || "주소 정보가 없습니다."}
                            </p>
                        </section>
                    </div>
                </div>

                {/* 우측 칼럼: 클래스 신청 UI */}
                <div className="space-y-6">
                    <div className="border rounded-lg shadow-sm p-4 space-y-4">
                        {/* 클래스 일정만 표시 */}
                        <div className="bg-indigo-600 text-white text-center py-3 rounded-t-lg font-medium" style={{ backgroundColor: accentColor }}>
                            1. 클래스 일정
                        </div>

                        <div className="pt-4 space-y-4">
                            <label className="block text-sm text-gray-700">날짜 선택</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            />
                            <p className="flex items-center text-sm text-green-600">
                                <svg
                                    className="w-5 h-5 mr-1 text-green-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4"
                                    />
                                </svg>
                                당일 예약 가능 클래스입니다
                            </p>
                            <button className="w-full text-center bg-white border rounded py-2 text-gray-700 hover:bg-gray-50">
                                개설된 클래스
                                <br />
                                구매 후 문의를 통해 일정 조율이 필요해요
                            </button>
                            <div className="mt-4 flex items-center justify-between">
                                <button className="flex-1 border rounded-l py-2 text-gray-700">–</button>
                                <span className="px-4">1</span>
                                <button className="flex-1 border rounded-r py-2 text-gray-700">+</button>
                            </div>
                            <p className="text-right text-xl font-bold">14,900원 /1인</p>

                            {/* 찜하기 / 클래스 신청하기 버튼 */}
                            <div className="flex gap-2">
                                <button className="flex-1 flex items-center justify-center gap-2 border rounded py-2 text-gray-700 hover:bg-gray-50">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    찜하기
                                </button>
                                <button
                                    className="flex-1 bg-indigo-600 text-white rounded py-2 hover:bg-indigo-700"
                                    style={{ backgroundColor: accentColor }}
                                    onClick={handleApplicationClick}
                                >
                                    클래스 신청하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 클래스 신청 모달 */}
            {showApplicationModal && (
                <ClassApplication
                    classData={classData}
                    selectedDate={selectedDate}
                    onClose={() => setShowApplicationModal(false)}
                    onConfirm={handleApplicationConfirm}
                />
            )}
        </div>
    );
};

export default ClassDetail;