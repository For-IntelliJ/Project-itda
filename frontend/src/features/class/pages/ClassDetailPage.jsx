import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import GoogleCalendarService from '../../../services/GoogleCalendarService';

const ClassDetailPage = () => {
    const { id } = useParams();
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('클래스 소개');
    const [selectedDate, setSelectedDate] = useState(null);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedYear, setSelectedYear] = useState(2025);
    const [selectedMonth, setSelectedMonth] = useState(6);
    const [selectedDay, setSelectedDay] = useState(18);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showCalendarDialog, setShowCalendarDialog] = useState(false);
    const [calendarInitialized, setCalendarInitialized] = useState(false);

    // 섹션 참조
    const introRef = useRef(null);
    const curriculumRef = useRef(null);
    const mentorRef = useRef(null);
    const locationRef = useRef(null);

    useEffect(() => {
        const fetchClassDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/classes/${id}`);
                console.log('>> [FRONTEND DEBUG] API 응답 수신');
                console.log('응답 상태:', response.status);
                console.log('응답 데이터:', response.data);
                console.log('사용 가능한 필드들:', Object.keys(response.data));
                
                // 주요 필드들 개별 확인
                console.log('=== 주요 데이터 확인 ===');
                console.log('제목:', response.data.title);
                console.log('멘토 정보:', {
                    mentor: response.data.mentor,
                    mentorName: response.data.mentorName,
                    mentorUsername: response.data.mentorUsername
                });
                console.log('카테고리 정보:', {
                    category: response.data.category,
                    categoryName: response.data.categoryName
                });
                console.log('지역 정보:', {
                    region: response.data.region,
                    regionName: response.data.regionName
                });
                console.log('텍스트 필드들:', {
                    curriculum: response.data.curriculum ? `있음 (${response.data.curriculum.length}글자)` : '없음',
                    detailContent: response.data.detailContent ? `있음 (${response.data.detailContent.length}글자)` : '없음',
                    mentoInfo: response.data.mentoInfo ? `있음 (${response.data.mentoInfo.length}글자)` : '없음',
                    spaceInfo: response.data.spaceInfo ? `있음 (${response.data.spaceInfo.length}글자)` : '없음'
                });
                console.log('========================');
                
                let enrichedData = { ...response.data };
                
                // 멘토 정보는 이미 메인 데이터에 포함되어 있음
                // 일단 mentoInfo 필드를 직접 사용 (API 호출 제거)
                enrichedData.mentorProfile = {
                    name: response.data.mentor?.username || '멘토명 없음',
                    bio: response.data.mentoInfo || '멘토 소개 정보가 준비 중입니다.',
                    career: null // 일단 career는 제외
                };
                
                // 지역 정보도 이미 메인 데이터에 포함되어 있음
                // spaceInfo 필드를 직접 사용하되, 더 상세한 지역 정보가 필요하면 별도 조회
                if (response.data.region?.id) {
                    try {
                        // 정확한 API 엔드포인트 사용
                        const regionResponse = await axios.get(`http://localhost:8080/api/regions/${response.data.region.id}`);
                        console.log('>> [DEBUG] 지역 데이터:', regionResponse.data);
                        enrichedData.regionInfo = {
                            name: response.data.region?.name || '지역명 없음',
                            description: response.data.spaceInfo,
                            fullData: regionResponse.data
                        };
                    } catch (regionError) {
                        console.warn('지역 정보 조회 실패, 기본 정보 사용:', regionError);
                        // 지역 정보 조회 실패 시 기본 정보 사용
                        enrichedData.regionInfo = {
                            name: response.data.region?.name || '지역명 없음',
                            description: response.data.spaceInfo
                        };
                    }
                } else {
                    // region 객체가 없으면 기본 지역 정보 사용
                    enrichedData.regionInfo = {
                        name: '지역명 없음',
                        description: response.data.spaceInfo
                    };
                }
                
                console.log('>> [DEBUG] 최종 데이터:', {
                    mentorProfile: enrichedData.mentorProfile,
                    regionInfo: enrichedData.regionInfo,
                    mentoInfo: response.data.mentoInfo,
                    spaceInfo: response.data.spaceInfo
                });
                
                setClassData(enrichedData);
                setLoading(false);
            } catch (error) {
                console.error('클래스 상세 정보 로드 실패:', error);
                setLoading(false);
            }
        };

        if (id) {
            fetchClassDetail();
        }
    }, [id]);

    // 탭 클릭 시 해당 섹션으로 스크롤
    const scrollToSection = (tabName) => {
        setActiveTab(tabName);
        let targetRef;
        
        switch(tabName) {
            case '클래스 소개':
                targetRef = introRef;
                break;
            case '커리큘럼':
                targetRef = curriculumRef;
                break;
            case '멘토 소개':
                targetRef = mentorRef;
                break;
            case '위치':
                targetRef = locationRef;
                break;
            default:
                targetRef = introRef;
        }

        if (targetRef?.current) {
            targetRef.current.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    // 위시리스트 토글
    const toggleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        // TODO: 실제 위시리스트 API 호출
    };

    // 달력 생성 함수
    const generateCalendar = () => {
        const today = new Date();
        const year = selectedYear;
        const month = selectedMonth - 1; // JavaScript에서 월은 0부터 시작
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        
        const days = [];
        
        // 빈 칸 추가 (월의 첫 주)
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }
        
        // 실제 날짜 추가
        for (let day = 1; day <= daysInMonth; day++) {
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const isPast = new Date(year, month, day) < today;
            
            // 예약 가능 날짜: 오늘 이후
            const isAvailable = !isPast;
            
            days.push({
                day,
                dateString,
                isAvailable,
                isToday,
                isPast
            });
        }
        
        return days;
    };

    // 날짜 클릭 처리
    const handleDateClick = (dateString) => {
        setSelectedDate(dateString);
        setShowDatePicker(false);
    };

    // 월 변경
    const changeMonth = (direction) => {
        if (direction === 'prev') {
            if (selectedMonth === 1) {
                setSelectedMonth(12);
                setSelectedYear(selectedYear - 1);
            } else {
                setSelectedMonth(selectedMonth - 1);
            }
        } else {
            if (selectedMonth === 12) {
                setSelectedMonth(1);
                setSelectedYear(selectedYear + 1);
            } else {
                setSelectedMonth(selectedMonth + 1);
            }
        }
    };

    // 달력 아이콘 클릭
    const handleCalendarClick = () => {
        setShowDatePicker(!showDatePicker);
    };

    // 클래스 신청
    const handleApply = async () => {
        if (!selectedDate) {
            alert('날짜를 선택해주세요.');
            return;
        }
        
        try {
            console.log('>> [APPLY] 클래스 신청 요청:', {
                classId: id,
                selectedDate: selectedDate,
                menteeId: 10 // 임시 멘티 ID
            });
            
            const response = await axios.post('http://localhost:8080/api/applies', {
                classId: parseInt(id),
                selectedDate: selectedDate,
                menteeId: 10 // 임시로 ID 10 사용
            });
            
            console.log('>> [APPLY] 신청 응답:', response.data);
            
            if (response.data.success) {
                // 신청 성공 후 구글 캘린더 추가 옵션 표시
                setShowCalendarDialog(true);
                
                // 신청 후 선택된 날짜 초기화는 캘린더 다이얼로그 처리 후에
                // setSelectedDate(null);
            } else {
                alert(`❌ 신청 실패: ${response.data.message}`);
            }
        } catch (error) {
            console.error('클래스 신청 실패:', error);
            
            if (error.response?.data?.message) {
                alert(`❌ 신청 실패: ${error.response.data.message}`);
            } else {
                alert('❌ 클래스 신청 중 오류가 발생했습니다.');
            }
        }
    };

    // 구글 캘린더 초기화
    const initializeGoogleCalendar = async () => {
        try {
            await GoogleCalendarService.init();
            setCalendarInitialized(true);
            console.log('구글 캘린더 API 초기화 완료');
        } catch (error) {
            console.error('구글 캘린더 초기화 실패:', error);
        }
    };

    // 구글 캘린더에 일정 추가
    const addToGoogleCalendar = async () => {
        try {
            // 구글 로그인 확인
            if (!GoogleCalendarService.checkSignInStatus()) {
                await GoogleCalendarService.signIn();
            }

            // 캘린더에 이벤트 추가
            await GoogleCalendarService.addClassEvent(
                classData.title,
                selectedDate,
                classData
            );

            alert('✅ 구글 캘린더에 일정이 추가되었습니다!\n\n\ud83d\udcc5 "잇다" 캘린더에서 확인하실 수 있습니다.');
            
        } catch (error) {
            console.error('구글 캘린더 추가 실패:', error);
            alert('❌ 구글 캘린더 추가에 실패했습니다.\n\n다시 시도해주세요.');
        } finally {
            handleCalendarDialogClose();
        }
    };

    // 캘린더 다이얼로그 닫기
    const handleCalendarDialogClose = () => {
        setShowCalendarDialog(false);
        setSelectedDate(null); // 이제 날짜 초기화
        
        // 신청 완료 메시지를 예쁜 모달로 표시
        setSuccessMessage(
            `클래스 신청이 완료되었습니다!\n\n` +
            `신청 클래스: ${classData.title}\n` +
            `선택 날짜: ${selectedDate}\n` +
            `상태: 대기 중\n\n` +
            `멘토의 승인을 기다려주세요.`
        );
        setShowSuccessModal(true);
    };

    // 컴포넌트 마운트 시 구글 API 초기화
    useEffect(() => {
        if (window.gapi) {
            initializeGoogleCalendar();
        }
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500">로딩 중...</p>
            </div>
        );
    }

    if (!classData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">클래스 정보를 찾을 수 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-8 px-4">
                
                {/* 메인 이미지와 신청 영역을 나란히 배치 */}
                <div className="flex gap-6 mb-8">
                    {/* 이미지 - 여백 조정 */}
                    <div className="flex-[3]">
                        <img
                            src={
                                classData.mainImage
                                    ? classData.mainImage.startsWith("http")
                                        ? classData.mainImage
                                        : `http://localhost:8080/uploads/classes/${classData.mainImage}`
                                    : "/img/default_class.jpg"
                            }
                            alt={classData.title}
                            className="w-full h-80 object-cover rounded-lg shadow-lg"
                        />
                    </div>
                    
                    {/* 오른쪽: 신청 영역 - 더 많은 공간 할당 */}
                    <div className="flex-[2] min-w-0">
                        <div className="bg-white p-6 rounded-lg shadow-lg border">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">1. 클래스 일정</h3>
                                
                                {/* 날짜 선택 영역 */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">날짜 선택</label>
                                    <div className="relative">
                                        <div className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg bg-gray-50 cursor-pointer" onClick={handleCalendarClick}>
                                            <span className="text-blue-600">📅</span>
                                            <span className="text-sm font-medium text-gray-800">
                                                선택된 날짜: {selectedDate || '날짜를 선택해주세요'}
                                            </span>
                                        </div>
                                        
                                        {/* 달력 모달 */}
                                        {showDatePicker && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-4">
                                                {/* 달력 헤더 */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <button 
                                                        onClick={() => changeMonth('prev')}
                                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                                    >
                                                        ←
                                                    </button>
                                                    <span className="font-semibold text-gray-800">
                                                        {selectedYear}년 {selectedMonth}월
                                                    </span>
                                                    <button 
                                                        onClick={() => changeMonth('next')}
                                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                                    >
                                                        →
                                                    </button>
                                                </div>
                                                
                                                {/* 요일 헤더 */}
                                                <div className="grid grid-cols-7 gap-1 mb-2">
                                                    {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                                                        <div key={day} className="p-2 text-center text-xs font-medium text-gray-500">
                                                            {day}
                                                        </div>
                                                    ))}
                                                </div>
                                                
                                                {/* 달력 날짜들 */}
                                                <div className="grid grid-cols-7 gap-1">
                                                    {generateCalendar().map((day, index) => (
                                                        <div key={index} className="aspect-square">
                                                            {day ? (
                                                                <button
                                                                    onClick={() => day.isAvailable && handleDateClick(day.dateString)}
                                                                    disabled={!day.isAvailable}
                                                                    className={`w-full h-full text-sm rounded transition-colors ${
                                                                        selectedDate === day.dateString
                                                                            ? 'bg-blue-500 text-white'
                                                                            : day.isToday
                                                                            ? 'bg-blue-100 text-blue-600 font-bold'
                                                                            : day.isAvailable
                                                                            ? 'hover:bg-blue-50 text-gray-700'
                                                                            : 'text-gray-300 cursor-not-allowed'
                                                                    }`}
                                                                >
                                                                    {day.day}
                                                                </button>
                                                            ) : (
                                                                <div></div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                
                                                {/* 닫기 버튼 */}
                                                <div className="mt-4 flex justify-end">
                                                    <button
                                                        onClick={() => setShowDatePicker(false)}
                                                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md text-sm font-medium transition-colors"
                                                    >
                                                        닫기
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* 당일 예약 가능 안내 */}
                                <div className="bg-teal-50 p-3 rounded text-center mb-4">
                                    <span className="text-teal-600 text-sm font-medium">📢 당일 예약 가능 클래스입니다</span>
                                </div>
                            </div>

                            {/* 신청 버튼들 */}
                            <div className="space-y-3">
                                <button
                                    onClick={toggleWishlist}
                                    className={`w-full py-3 px-4 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                                        isWishlisted
                                            ? 'bg-red-50 border-red-200 text-red-600'
                                            : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <span>{isWishlisted ? '❤️' : '🤍'}</span>
                                    <span>{isWishlisted ? '위시리스트에서 제거' : '위시리스트'}</span>
                                </button>
                                
                                <button
                                    onClick={handleApply}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                                >
                                    클래스 신청하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* 클래스 제목 */}
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    {classData.title}
                </h1>
                
                {/* 카테고리와 별점 */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium">
                            핸드메이드
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                            체험활동
                        </span>
                        <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                            키링 공예
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                            {classData.categoryName || '디자인 · 공예'}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="font-bold">5.0</span>
                        <span className="text-gray-500 text-sm">(1)</span>
                    </div>
                </div>

                {/* 클래스 정보 박스 */}
                <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <span>👥</span>
                            <span>참여인원: {classData.people || '0'}명</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span>📍</span>
                            <span>{classData.regionInfo?.name || classData.regionName || '지역 정보 없음'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span>⚡</span>
                            <span>난이도: {classData.level || '초급'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span>🌐</span>
                            <span>{classData.onoff || '오프라인'}</span>
                        </div>
                    </div>
                </div>

                {/* 메인 컨텐츠 영역 */}
                <div className="flex gap-8">
                    {/* 왼쪽: 컨텐츠 */}
                    <div className="flex-1">
                        {/* 탭 메뉴 - sticky로 상단 고정 */}
                        <div className="sticky top-0 bg-white z-10 mb-8 border-b border-gray-200 shadow-sm">
                            <div className="flex space-x-8 px-4">
                                {['클래스 소개', '커리큘럼', '멘토 소개', '위치'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => scrollToSection(tab)}
                                        className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                                            activeTab === tab
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 컨텐츠 섹션들 */}
                        <div className="space-y-12">
                            {/* 클래스 소개 */}
                            <section ref={introRef} className="bg-white p-8 rounded-lg shadow-sm border">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">클래스 소개</h2>
                                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                                    {classData.detailContent || '클래스 소개 정보가 준비 중입니다.'}
                                </div>
                            </section>

                            {/* 커리큘럼 */}
                            <section ref={curriculumRef} className="bg-white p-8 rounded-lg shadow-sm border">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">커리큘럼</h2>
                                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                                    {classData.curriculum || '커리큘럼 정보가 준비 중입니다.'}
                                </div>
                            </section>

                            {/* 멘토 소개 */}
                            <section ref={mentorRef} className="bg-white p-8 rounded-lg shadow-sm border">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">멘토 소개</h2>
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                                        {classData.mentorProfile?.profileImage ? (
                                            <img 
                                                src={classData.mentorProfile.profileImage} 
                                                alt="멘토 프로필" 
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        ) : (
                                            <span className="text-gray-500 text-2xl">👤</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                                            {classData.mentorProfile?.name || 
                                             classData.mentor?.username || 
                                             classData.mentorName || 
                                             classData.mentorUsername || 
                                             '멘토명 없음'}
                                        </h3>
                                        <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                            {classData.mentorProfile?.bio || 
                                             classData.mentoInfo || 
                                             '멘토 소개 정보가 준비 중입니다.'}
                                        </div>
                                        
                                        {/* 멘토 추가 정보 표시 */}
                                        {classData.mentor && (
                                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                                <p className="text-sm text-blue-700">
                                                    <span className="font-medium">멘토:</span> {classData.mentor.username || classData.mentor.nickname}
                                                </p>
                                                {classData.mentor.email && (
                                                    <p className="text-sm text-blue-600 mt-1">
                                                        <span className="font-medium">연락처:</span> {classData.mentor.email}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* 위치 */}
                            <section ref={locationRef} className="bg-white p-8 rounded-lg shadow-sm border">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">위치</h2>
                                <div className="bg-gray-100 p-4 rounded-lg">
                                    <p className="font-semibold text-gray-800 mb-2">
                                        📍 {classData.regionInfo?.name || 
                                             classData.region?.name || 
                                             classData.regionName || 
                                             '지역명 없음'}
                                    </p>
                                    
                                    {/* 공간 정보 표시 */}
                                    <div className="text-gray-700 mt-3">
                                        {classData.regionInfo?.description || 
                                         classData.spaceInfo ? (
                                            <div className="whitespace-pre-line">
                                                <p className="font-medium mb-2">🏢 공간 정보:</p>
                                                <p>{classData.regionInfo?.description || classData.spaceInfo}</p>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 italic">상세 위치 정보가 준비 중입니다.</p>
                                        )}
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* 성공 모달 */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-4xl">✅</span>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                신청 완료!
                            </h3>
                            
                            <div className="text-gray-600 mb-6 whitespace-pre-line leading-relaxed">
                                {successMessage}
                            </div>
                            
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="w-full py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* 구글 캘린더 추가 다이얼로그 */}
            {showCalendarDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">✅</span>
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                클래스 신청 완료!
                            </h3>
                            
                            <p className="text-gray-600 mb-6">
                                구글 캘린더에 일정을 추가하시겠습니까?<br/>
                                <span className="text-sm text-gray-500">
                                    "잇다" 캘린더에 <strong>{classData.title}</strong> 일정이 추가됩니다.
                                </span>
                            </p>
                            
                            <div className="flex gap-3">
                                <button
                                    onClick={handleCalendarDialogClose}
                                    className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    나중에
                                </button>
                                
                                <button
                                    onClick={addToGoogleCalendar}
                                    className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <span>📅</span>
                                    캘린더 추가
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassDetailPage;