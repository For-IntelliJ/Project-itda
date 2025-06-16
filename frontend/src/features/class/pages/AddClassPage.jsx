import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AddClassPage = () => {
    // --- Auth check ---
    const [userRole, setUserRole] = useState(null); // 'MENTOR', 'MENTEE', null
    const [isLoading, setIsLoading] = useState(true);

    // --- Step state ---
    const [mainStep, setMainStep] = useState(0);            // 0: Step1, 1: Step2
    const [step2SubStep, setStep2SubStep] = useState(0);    // Step2의 세부 스텝들

    // --- Data state ---
    const [categories, setCategories] = useState([]);
    const [regions, setRegions] = useState([]);
    const [mentorInfo, setMentorInfo] = useState({ name: '', intro: '' });

    // --- Form fields ---
    const [formData, setFormData] = useState({
        // Step 1
        onlineOffline: '',
        title: '',
        categoryId: '',
        
        // Step 2
        mainImage: null,
        detailContent: '',
        curriculumDifficulty: '',
        curriculum: '',
        spaceRegionId: ''
    });

    // --- Default image URL ---
    const DEFAULT_IMAGE_URL =
        'https://lh5.googleusercontent.com/proxy/1tcpSHHwVM4X5lkcebeX9xZVZuvq7whm5tb1Utabaw7DDS9CmVoHEavN9g0_VPJk2q2f7LxXpYeYWC4gvRlTdR3AgGhtQ-frxnodK2ChyBBLRVM5WMCLWsiqp5TIWqWA';

    // --- Refs for scroll targets ---
    const stepRefs = {
        '0': useRef(null),
        '1-0': useRef(null),
        '1-1': useRef(null),
        '1-2': useRef(null)
    };

    // --- Check user authentication and role ---
    useEffect(() => {
        const checkUserRole = async () => {
            try {
                // TODO: 실제 로그인 사용자 정보를 가져오는 API로 변경
                const response = await axios.get('/api/members/me');
                const user = response.data;
                
                if (user.role !== 'MENTOR') {
                    alert('멘토만 선택이 가능합니다. 이 기능을 이용하시려면 멘토 신청을 해주세요.');
                    window.history.back(); // 이전 페이지로 돌아가기
                    return;
                }
                
                setUserRole(user.role);
                setIsLoading(false);
                
                // 멘토 정보 가져오기
                await fetchMentorInfo(user.id);
                
            } catch (error) {
                console.error('사용자 인증 실패:', error);
                alert('멘토만 선택이 가능합니다. 이 기능을 이용하시려면 멘토 신청을 해주세요.');
                window.history.back();
            }
        };

        checkUserRole();
    }, []);

    // --- Fetch mentor profile info ---
    const fetchMentorInfo = async (userId) => {
        try {
            const response = await axios.get(`/api/mentor-profiles/user/${userId}`);
            const mentorProfile = response.data;
            setMentorInfo({
                name: mentorProfile.user.username,
                intro: mentorProfile.intro || ''
            });
        } catch (error) {
            console.error('멘토 정보 로드 실패:', error);
            // 기본값 설정
            setMentorInfo({ name: '멘토', intro: '' });
        }
    };

    // --- Fetch initial data ---
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const resCat = await axios.get('/api/categories');
                setCategories(resCat.data);
            } catch (e) {
                console.error('카테고리 로드 실패:', e);
            }
            try {
                const resReg = await axios.get('/api/regions');
                setRegions(resReg.data);
            } catch (e) {
                console.error('지역 로드 실패:', e);
            }
        };
        
        if (userRole === 'MENTOR') {
            fetchInitialData();
        }
    }, [userRole]);

    // --- Handlers ---
    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) setFormData(prev => ({ ...prev, [field]: file }));
    };

    const scrollToSection = key => {
        stepRefs[key]?.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleNext = e => {
        e.preventDefault();
        if (mainStep === 0) {
            setMainStep(1);
            setStep2SubStep(0);
            scrollToSection('1-0');
        } else if (step2SubStep < 2) {
            const next = step2SubStep + 1;
            setStep2SubStep(next);
            scrollToSection(`1-${next}`);
        }
    };

    const handlePrev = e => {
        e.preventDefault();
        if (step2SubStep > 0) {
            const prev = step2SubStep - 1;
            setStep2SubStep(prev);
            scrollToSection(`1-${prev}`);
        } else {
            setMainStep(0);
            scrollToSection('0');
        }
    };

    const handleStepClick = (m, s = 0) => {
        setMainStep(m);
        setStep2SubStep(s);
        const key = m === 0 ? '0' : `1-${s}`;
        setTimeout(() => scrollToSection(key), 50);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        
        // 필수 필드 검증
        if (!formData.title || !formData.categoryId || !formData.onlineOffline || !formData.curriculum || !formData.curriculumDifficulty || !formData.spaceRegionId) {
            alert('모든 필수 항목을 입력해주세요.');
            return;
        }
        
        const classData = {
            title: formData.title,
            categoryId: +formData.categoryId,
            curriculum: formData.curriculum,
            onoff: formData.onlineOffline === 'online' ? '온라인' : '오프라인',
            level: formData.curriculumDifficulty,
            detailContent: formData.detailContent,
            regionId: +formData.spaceRegionId,
            mainImage: formData.mainImage ? null : DEFAULT_IMAGE_URL
        };

        try {
            let response;
            if (formData.mainImage) {
                const fd = new FormData();
                fd.append('classData', new Blob([JSON.stringify(classData)], { type: 'application/json' }));
                fd.append('mainImage', formData.mainImage);
                response = await axios.post('/api/classes/with-files', fd, { 
                    headers: { 'Content-Type': 'multipart/form-data' } 
                });
            } else {
                response = await axios.post('/api/classes', classData);
            }
            console.log('서버 응답:', response.data);
            alert('클래스 생성 성공!');
            // 성공 시 메인 페이지로 이동
            window.location.href = '/';
        } catch (err) {
            console.error('에러:', err);
            alert(`클래스 생성 실패: ${err.response?.data || err.message}`);
        }
    };

    // --- Loading state ---
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500">로딩 중...</p>
            </div>
        );
    }

    // --- Render content by step ---
    const renderContent = () => {
        if (mainStep === 0) {
            return (
                <section ref={stepRefs['0']} className="mb-6">
                    <h2 className="text-2xl font-bold mb-4">Step 1: 기본 정보</h2>
                    <p className="mb-6 text-gray-600">온/오프라인, 클래스 제목, 카테고리를 선택하세요.</p>
                    
                    {/* 온/오프라인 선택 */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">온/오프라인 *</label>
                        <div className="space-y-3">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="onlineOffline"
                                    value="online"
                                    checked={formData.onlineOffline === 'online'}
                                    onChange={handleChange}
                                    className="mr-3 text-[#3D4EFE]"
                                />
                                <span className="text-lg">온라인</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="onlineOffline"
                                    value="offline"
                                    checked={formData.onlineOffline === 'offline'}
                                    onChange={handleChange}
                                    className="mr-3 text-[#3D4EFE]"
                                />
                                <span className="text-lg">오프라인</span>
                            </label>
                        </div>
                    </div>

                    {/* 클래스 제목 */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">클래스 제목 *</label>
                        <input
                            name="title"
                            placeholder="클래스 제목을 입력하세요"
                            value={formData.title}
                            onChange={handleChange}
                            className="border border-gray-300 w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D4EFE] focus:border-transparent"
                        />
                    </div>

                    {/* 카테고리 선택 */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">카테고리 *</label>
                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            className="border border-gray-300 w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D4EFE] focus:border-transparent"
                        >
                            <option value="">카테고리를 선택하세요</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </section>
            );
        }
        
        switch (step2SubStep) {
            case 0:
                return (
                    <section ref={stepRefs['1-0']} className="mb-6">
                        <h2 className="text-2xl font-bold mb-4">Step 2-1: 이미지 및 상세 설명</h2>
                        <p className="mb-6 text-gray-600">메인 이미지와 상세 설명을 등록합니다.</p>
                        
                        <div className="space-y-6">
                            {/* 메인 이미지 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">메인 이미지</label>
                                <label className="bg-[#3D4EFE] text-white py-3 px-4 rounded-md text-center cursor-pointer hover:bg-[#2c3ed9] font-medium inline-block">
                                    메인 이미지 등록
                                    <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'mainImage')} className="hidden" />
                                </label>
                                {formData.mainImage && (
                                    <p className="text-sm text-gray-600 mt-2">선택된 파일: {formData.mainImage.name}</p>
                                )}
                            </div>
                            
                            {/* 상세 설명 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">상세 설명</label>
                                <textarea
                                    name="detailContent"
                                    rows={6}
                                    placeholder="클래스에 대한 상세 설명을 입력하세요"
                                    value={formData.detailContent}
                                    onChange={handleChange}
                                    className="border border-gray-300 w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D4EFE] focus:border-transparent resize-none"
                                />
                            </div>
                        </div>
                    </section>
                );
            case 1:
                return (
                    <section ref={stepRefs['1-1']} className="mb-6">
                        <h2 className="text-2xl font-bold mb-4">Step 2-2: 커리큘럼</h2>
                        <p className="mb-6 text-gray-600">난이도와 커리큘럼 내용을 작성하세요.</p>
                        
                        <div className="space-y-6">
                            {/* 난이도 선택 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">난이도 *</label>
                                <select
                                    name="curriculumDifficulty"
                                    value={formData.curriculumDifficulty}
                                    onChange={handleChange}
                                    className="border border-gray-300 w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D4EFE] focus:border-transparent"
                                >
                                    <option value="">난이도를 선택하세요</option>
                                    <option value="초급">초급</option>
                                    <option value="중급">중급</option>
                                    <option value="고급">고급</option>
                                </select>
                            </div>
                            
                            {/* 커리큘럼 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">커리큘럼 *</label>
                                <textarea
                                    name="curriculum"
                                    rows={8}
                                    placeholder="커리큘럼 내용을 상세히 입력하세요&#10;예)&#10;STEP 1: 기초 이론 학습&#10;STEP 2: 실습 진행&#10;STEP 3: 결과물 완성"
                                    value={formData.curriculum}
                                    onChange={handleChange}
                                    className="border border-gray-300 w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D4EFE] focus:border-transparent resize-none"
                                />
                            </div>
                        </div>
                    </section>
                );
            case 2:
                return (
                    <section ref={stepRefs['1-2']} className="mb-6">
                        <h2 className="text-2xl font-bold mb-4">Step 2-3: 공간 정보</h2>
                        <p className="mb-6 text-gray-600">클래스가 진행될 지역을 선택하세요.</p>
                        
                        <div className="space-y-6">
                            {/* 멘토 정보 (읽기 전용) */}
                            <div className="bg-gray-50 p-4 rounded-md border">
                                <h3 className="text-lg font-semibold mb-3 text-gray-700">멘토 정보</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">멘토 이름</label>
                                        <input
                                            type="text"
                                            value={mentorInfo.name}
                                            disabled
                                            className="border border-gray-300 w-full p-3 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">멘토 소개</label>
                                        <textarea
                                            value={mentorInfo.intro}
                                            disabled
                                            rows={3}
                                            className="border border-gray-300 w-full p-3 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 지역 선택 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">지역 선택 *</label>
                                <select
                                    name="spaceRegionId"
                                    value={formData.spaceRegionId}
                                    onChange={handleChange}
                                    className="border border-gray-300 w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D4EFE] focus:border-transparent"
                                >
                                    <option value="">지역을 선택하세요</option>
                                    {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </section>
                );
            default:
                return null;
        }
    };

    // --- Sidebar open state ---
    const step1Open = mainStep === 0;
    const step2Open = mainStep === 1;

    return (
        <div className="flex max-w-6xl mx-auto mt-10 px-4">
            {/* 좌측 Step 메뉴 */}
            <div className="w-48 pr-6 border-r border-gray-200">
                <h2 className="text-xl font-bold mb-6">클래스 생성</h2>
                <ul className="space-y-3">
                    {/* Step 1 Header */}
                    <li
                        className={`cursor-pointer px-3 py-2 rounded font-semibold flex justify-between items-center ${
                            step1Open ? 'bg-gray-100 text-[#3D4EFE]' : 'text-gray-600 hover:text-[#3D4EFE]'
                        }`}
                        onClick={() => handleStepClick(0)}
                    >
                        Step 1
                        <span className={`transform transition-transform ${step1Open ? 'rotate-90' : 'rotate-0'}`}>▶</span>
                    </li>
                    {/* Step 1 Submenu */}
                    <ul
                        className={`pl-4 transition-all duration-300 overflow-hidden ${step1Open ? 'max-h-20 space-y-1' : 'max-h-0'}`}
                    >
                        <li
                            className="cursor-pointer text-sm text-gray-600 hover:text-[#3D4EFE] py-1"
                            onClick={() => handleStepClick(0)}
                        >
                            기본 정보
                        </li>
                    </ul>

                    {/* Step 2 Header */}
                    <li
                        className={`cursor-pointer px-3 py-2 rounded font-semibold flex justify-between items-center ${
                            step2Open ? 'bg-gray-100 text-[#3D4EFE]' : 'text-gray-600 hover:text-[#3D4EFE]'
                        }`}
                        onClick={() => handleStepClick(1, 0)}
                    >
                        Step 2
                        <span className={`transform transition-transform ${step2Open ? 'rotate-90' : 'rotate-0'}`}>▶</span>
                    </li>
                    {/* Step 2 Submenu */}
                    <ul
                        className={`pl-4 transition-all duration-300 overflow-hidden ${step2Open ? 'max-h-52 space-y-1' : 'max-h-0'}`}
                    >
                        <li
                            className={`cursor-pointer text-sm py-1 ${
                                mainStep === 1 && step2SubStep === 0 ? 'text-[#3D4EFE] font-medium' : 'text-gray-600 hover:text-[#3D4EFE]'
                            }`}
                            onClick={() => handleStepClick(1, 0)}
                        >
                            이미지/설명
                        </li>
                        <li
                            className={`cursor-pointer text-sm py-1 ${
                                mainStep === 1 && step2SubStep === 1 ? 'text-[#3D4EFE] font-medium' : 'text-gray-600 hover:text-[#3D4EFE]'
                            }`}
                            onClick={() => handleStepClick(1, 1)}
                        >
                            커리큘럼
                        </li>
                        <li
                            className={`cursor-pointer text-sm py-1 ${
                                mainStep === 1 && step2SubStep === 2 ? 'text-[#3D4EFE] font-medium' : 'text-gray-600 hover:text-[#3D4EFE]'
                            }`}
                            onClick={() => handleStepClick(1, 2)}
                        >
                            공간 정보
                        </li>
                    </ul>
                </ul>
            </div>

            {/* 우측 콘텐츠 영역 */}
            <div className="flex-1 pl-6">
                <form onSubmit={handleSubmit}>
                    {renderContent()}
                    <div className="flex justify-between mt-8">
                        <button
                            type="button"
                            onClick={handlePrev}
                            disabled={mainStep === 0}
                            className={`py-2 px-6 rounded-md font-semibold ${
                                mainStep === 0 
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                    : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                            }`}
                        >
                            이전
                        </button>
                        {(mainStep === 0 || step2SubStep < 2) ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="bg-[#3D4EFE] hover:bg-[#2c3ed9] text-white py-2 px-6 rounded-md font-semibold"
                            >
                                다음
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="bg-[#FBC333] hover:bg-[#e1ae2d] text-gray-800 py-2 px-6 rounded-md font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                            >
                                클래스 생성
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddClassPage;
