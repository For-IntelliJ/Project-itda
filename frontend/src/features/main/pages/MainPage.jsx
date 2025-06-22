// src/pages/Main.jsx - 이미지 처리 개선 버전
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClassCard from "../../class/components/ClassCard";

// 배너 이미지 정보
const banners = ["/img/Benner1.svg", "/img/Benner2.svg"];

// 카테고리 버튼 정보 (메인 화면 상단 메뉴)
const categoryButtons = [
    { icon: "/img/Local_icon.png", label: "지역", description: "내 주변의 지역별 클래스" },
    { icon: "/img/Type_icon.png", label: "유형", description: "유형별 클래스를 둘러보기" },
    { icon: "/img/Category_icon.png", label: "카테고리", description: "카테고리별 다양한 클래스" },
    { icon: "/img/Level_icon.png", label: "난이도", description: "난이도별 다양한 클래스" },
];

// 기본 placeholder 이미지들
const DEFAULT_IMAGES = [
    "/img/default_class.jpg",
    "/img/placeholder1.jpg", 
    "/img/placeholder2.jpg",
    "/img/no-image.png"
];

const Main = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    
    const navigate = useNavigate();

    // 이미지 URL 생성 함수
    const getImageUrl = (imageData, classId) => {
        console.log(">> [DEBUG] 이미지 처리:", { imageData, classId });
        
        // 1. imageData가 없거나 빈 문자열인 경우
        if (!imageData || imageData.trim() === '') {
            console.log(">> [DEBUG] 이미지 데이터 없음, 기본 이미지 사용");
            return DEFAULT_IMAGES[0];
        }
        
        // 2. via.placeholder.com 또는 placeholder URL 차단
        if (imageData.includes('via.placeholder') || imageData.includes('placeholder.com')) {
            console.log(">> [DEBUG] Placeholder URL 차단:", imageData);
            return DEFAULT_IMAGES[0];
        }
        
        // 3. 이미 완전한 URL인 경우 (단, placeholder 제외)
        if (imageData.startsWith('http://') || imageData.startsWith('https://')) {
            console.log(">> [DEBUG] 완전한 URL:", imageData);
            return imageData;
        }
        
        // 4. placeholder나 잘못된 형태 감지
        if (imageData.includes(':') || imageData.match(/^\d+x\d+/)) {
            console.log(">> [DEBUG] 잘못된 이미지 형태 감지:", imageData);
            return DEFAULT_IMAGES[0];
        }
        
        // 5. 상대 경로인 경우 - 프론트엔드 public 폴더에서 찾기
        if (imageData.startsWith('/img/')) {
            console.log(">> [DEBUG] 프론트엔드 정적 이미지:", imageData);
            return imageData;
        }
        
        // 6. 백엔드 uploads 경로 시도
        if (imageData.startsWith('/uploads/')) {
            const backendUrl = `http://localhost:8080${imageData}`;
            console.log(">> [DEBUG] 백엔드 업로드 이미지:", backendUrl);
            return backendUrl;
        }
        
        // 7. 단순 파일명인 경우 - 백엔드 업로드 경로 시도
        if (imageData && !imageData.includes('/')) {
            const backendImageUrl = `http://localhost:8080/uploads/classes/${imageData}`;
            console.log(">> [DEBUG] 백엔드 이미지 URL 생성:", backendImageUrl);
            return backendImageUrl;
        }
        
        // 8. 기타 경우 - 기본 이미지 반환
        console.log(">> [DEBUG] 처리할 수 없는 이미지 형태, 기본 이미지 사용:", imageData);
        return DEFAULT_IMAGES[0];
    };

    // 배너 자동 전환
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    // 데이터 fetch
    useEffect(() => {
        async function fetchAllData() {
            try {
                console.log(">> [DEBUG] 클래스 데이터 요청 시작");
                console.log(">> [DEBUG] 요청 URL: http://localhost:8080/api/classes");
                
                // 네트워크 연결 테스트
                try {
                    const testRes = await fetch("http://localhost:8080/api/classes/test");
                    console.log(">> [DEBUG] 테스트 API 응답:", testRes.status);
                } catch (testErr) {
                    console.error(">> [DEBUG] 테스트 API 실패:", testErr);
                }
                
                const classRes = await fetch("http://localhost:8080/api/classes");
                console.log(">> [DEBUG] API 응답 상태:", classRes.status, classRes.statusText);
                
                if (!classRes.ok) {
                    throw new Error(`클래스 목록 불러오기 실패 (status ${classRes.status}): ${classRes.statusText}`);
                }
                const classData = await classRes.json();
                console.log(">> [DEBUG] 받은 클래스 데이터:", classData);

                const enriched = classData.map((item, index) => {
                    const mentorName = item.mentorName || 
                                    item.mentorUsername || 
                                    item.mentor_name || 
                                    "멘토 정보 없음";
                    
                    const categoryName = item.categoryName || 
                                       item.category_name || 
                                       "미분류";
                    
                    const regionName = item.regionName || 
                                     item.region_name || 
                                     "지역 정보 없음";

                    // 이미지 URL 안전하게 생성
                    const imageUrl = getImageUrl(item.mainImage, item.id);

                    const processedItem = {
                        ...item,
                        mentor_name: mentorName,
                        category_name: categoryName,
                        region_name: regionName,
                        people: item.people || 0,
                        level: item.level || "초급",
                        onoff: item.onoff || "오프라인",
                        safeImageUrl: imageUrl // 안전한 이미지 URL
                    };
                    
                    console.log(`>> [DEBUG] 처리된 클래스 ${index + 1}:`, {
                        id: processedItem.id,
                        title: processedItem.title,
                        originalImage: item.mainImage,
                        safeImageUrl: processedItem.safeImageUrl,
                        mentor_name: processedItem.mentor_name,
                        category_name: processedItem.category_name
                    });
                    
                    return processedItem;
                });
                
                setClasses(enriched);
                setLoading(false);
                
            } catch (err) {
                console.error(">> [ERROR] fetchAllData 예외:", err);
                setError(err.message);
                setLoading(false);
            }
        }
        fetchAllData();
    }, []);

    // 로딩 화면
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-500 mt-4">클래스 정보를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    // 에러 화면
    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <p className="text-red-500 text-lg mb-2">데이터를 불러올 수 없습니다</p>
                    <p className="text-gray-500 text-sm">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    // 배열을 3개씩 묶는 헬퍼 함수
    const chunkArray = (arr, chunkSize = 3) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            chunks.push(arr.slice(i, i + chunkSize));
        }
        return chunks;
    };
    const classChunks = chunkArray(classes, 3);

    // 섹션별 제목 생성 함수
    const getSectionTitle = (chunkIndex) => {
        const titles = [
            "💛 몽글몽글 ⌈감성충만⌋ 클래스들은 어때요? 💛",
            "오늘은 왠지 머리 쓰고 싶은 날이네...🤔🤔",
            "✨ 특별한 경험을 선사하는 클래스들 ✨",
            "🎨 창의력을 키워주는 클래스는 어떠세요? 🎨"
        ];
        return titles[chunkIndex] || "이런 클래스들도 있어요! 😊";
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* 배너 슬라이더 영역 */}
            <div className="relative bg-white">
                <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentBannerIndex * 100}%)` }}
                >
                    {banners.map((src, idx) => (
                        <div
                            key={idx}
                            className="w-full flex-shrink-0 flex justify-center items-center bg-white"
                        >
                            <img
                                src={src}
                                alt={`배너 ${idx}`}
                                className="object-contain w-full max-h-[400px]"
                                onError={(e) => {
                                    console.log(">> [ERROR] 배너 이미지 로드 실패:", src);
                                    e.target.style.display = 'none';
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* 카테고리 버튼 4개 영역 */}
            <div className="py-6 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 flex justify-center space-x-8">
                    {categoryButtons.map((btn, idx) => (
                        <div
                            key={idx}
                            className="active:scale-95 w-[18rem] h-24 bg-white hover:bg-gray-100 rounded-lg flex items-center px-4 shadow-md hover:shadow-lg transition duration-300 cursor-pointer"
                        >
                            <img 
                                src={btn.icon} 
                                alt={btn.label} 
                                className="w-12 h-12"
                                onError={(e) => {
                                    console.log(">> [ERROR] 카테고리 아이콘 로드 실패:", btn.icon);
                                    e.target.style.display = 'none';
                                }}
                            />
                            <div className="ml-4 flex flex-col justify-center">
                                <span className="text-lg font-semibold text-gray-800">
                                    {btn.label}
                                </span>
                                <p className="text-sm text-gray-500 mt-1">
                                    {btn.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 클래스 목록 섹션 */}
            <main className="flex-grow">
                {classChunks.map((chunk, chunkIndex) => (
                    <section key={chunkIndex} className="py-10 bg-gray-50">
                        <div className="max-w-6xl mx-auto px-4">
                            <h2 className="text-xl font-bold text-gray-700 mb-6">
                                {getSectionTitle(chunkIndex)}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {chunk.map((item) => (
                                    <div
                                        key={item.id}
                                        className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
                                        onClick={() => navigate(`/class/${item.id}`)}
                                    >
                                        <ClassCard
                                            image={item.safeImageUrl}
                                            title={item.title || "제목 없음"}
                                            instructor={item.mentor_name || "멘토 정보 없음"}
                                            people={item.people || 0}
                                            category={item.category_name || "미분류"}
                                            onoff={item.onoff || "오프라인"}
                                            level={item.level || "초급"}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                ))}

                {/* 클래스가 없을 때 메시지 */}
                {classes.length === 0 && (
                    <section className="py-16 bg-gray-50">
                        <div className="max-w-6xl mx-auto px-4">
                            <div className="text-center">
                                <div className="text-gray-400 text-6xl mb-4">📚</div>
                                <p className="text-gray-500 text-lg">아직 등록된 클래스가 없어요 😊</p>
                                <p className="text-gray-400 text-sm mt-2">곧 멋진 클래스들이 업데이트될 예정입니다!</p>
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default Main;