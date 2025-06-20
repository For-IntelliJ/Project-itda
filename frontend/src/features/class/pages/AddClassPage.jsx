import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AddClassPage = () => {
    // --- Step state ---
    const [currentStep, setCurrentStep] = useState(0); // 0~5까지의 단계
    
    // --- Data state ---
    const [categories, setCategories] = useState([]);
    const [regions, setRegions] = useState([]);
    const [mentorInfo, setMentorInfo] = useState({ name: '테스트 멘토', intro: '테스트용 멘토 소개입니다.' });

    // --- Form fields ---
    const [formData, setFormData] = useState({
        onlineOffline: '',
        title: '',
        categoryId: '',
        mainImage: null,
        detailContent: '',
        curriculumDifficulty: '',
        curriculum: '',
        spaceRegionId: ''
    });

    // --- Step completion tracking ---
    const [completedSteps, setCompletedSteps] = useState({
        0: false, // 온오프 선택
        1: false, // 클래스 유형 (카테고리)
        2: false, // 제목 및 카테고리
        3: false, // 이미지
        4: false, // 상세 내용
        5: false, // 커리큘럼
        6: false  // 호스트 소개 & 지역
    });

    // --- Default image URL ---
    const DEFAULT_IMAGE_URL = 'https://via.placeholder.com/300x200?text=기본+이미지';

    // --- Fetch initial data ---
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const resCategories = await axios.get('/api/categories');
                setCategories(resCategories.data);
            } catch (e) {
                console.error('카테고리 로드 실패:', e);
                setCategories([
                    { id: 1, name: '디자인' },
                    { id: 2, name: '프로그래밍' },
                    { id: 3, name: '요리' }
                ]);
            }
            try {
                const resRegions = await axios.get('/api/regions');
                setRegions(resRegions.data);
            } catch (e) {
                console.error('지역 로드 실패:', e);
                setRegions([
                    { id: 1, name: '서울' },
                    { id: 2, name: '경기' },
                    { id: 3, name: '부산' }
                ]);
            }
        };
        
        fetchInitialData();
    }, []);

    // --- Auto-check completion ---
    useEffect(() => {
        setCompletedSteps(prev => ({
            ...prev,
            0: !!formData.onlineOffline,
            1: !!formData.categoryId,
            2: !!formData.title,
            3: !!formData.mainImage,
            4: !!formData.detailContent,
            5: !!formData.curriculum && !!formData.curriculumDifficulty,
            6: !!formData.spaceRegionId
        }));
    }, [formData]);

    // --- Handlers ---
    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, fieldName) => {
        const file = e.target.files[0];
        setFormData(prev => ({ ...prev, [fieldName]: file }));
    };

    const handleNext = (e) => {
        e.preventDefault(); // form submit 방지
        if (currentStep < 6) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = (e) => {
        e.preventDefault(); // form submit 방지
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleStepClick = (stepId) => {
        setCurrentStep(stepId);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        
        // 최종 제출 시에만 모든 필수 필드 검증
        if (!formData.title || !formData.categoryId || !formData.onlineOffline || 
            !formData.curriculum || !formData.curriculumDifficulty || !formData.spaceRegionId) {
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
            mainImage: formData.mainImage ? null : DEFAULT_IMAGE_URL,
            mentorId: 1
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
            window.location.href = '/';
        } catch (err) {
            console.error('에러:', err);
            alert(`클래스 생성 실패: ${err.response?.data || err.message}`);
        }
    };

    // --- Render step content ---
    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // 온오프 선택
                return (
                    <div className="bg-white p-8 rounded-lg">
                        <h2 className="text-xl font-bold mb-6 text-center">STEP.0 온오프 선택</h2>
                        <div className="flex justify-center space-x-4">
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, onlineOffline: 'online' }))}
                                className={`px-8 py-4 rounded-lg border-2 font-medium ${
                                    formData.onlineOffline === 'online' 
                                        ? 'border-blue-500 bg-blue-50 text-blue-600' 
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                            >
                                온라인
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, onlineOffline: 'offline' }))}
                                className={`px-8 py-4 rounded-lg border-2 font-medium ${
                                    formData.onlineOffline === 'offline' 
                                        ? 'border-blue-500 bg-blue-50 text-blue-600' 
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                            >
                                오프라인
                            </button>
                        </div>
                    </div>
                );

            case 1: // 클래스 유형 (카테고리)
                return (
                    <div className="bg-white p-8 rounded-lg">
                        <h2 className="text-xl font-bold mb-6 text-center">STEP.1 클래스 유형</h2>
                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">카테고리를 선택하세요</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                );

            case 2: // 제목
                return (
                    <div className="bg-white p-8 rounded-lg">
                        <h2 className="text-xl font-bold mb-6 text-center">STEP.2 클래스 소개</h2>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">클래스 제목</label>
                            <input
                                name="title"
                                placeholder="클래스 제목을 입력하세요"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                );

            case 3: // 이미지
                return (
                    <div className="bg-white p-8 rounded-lg">
                        <h2 className="text-xl font-bold mb-6 text-center">STEP.2 클래스 소개</h2>
                        <div className="text-center">
                            <div className="flex justify-center space-x-4 mb-6">
                                <label className={`inline-block py-3 px-6 rounded-lg cursor-pointer font-medium ${
                                    formData.mainImage 
                                        ? 'bg-orange-500 text-white hover:bg-orange-600' 
                                        : 'bg-orange-500 text-white hover:bg-orange-600'
                                }`}>
                                    자유롭게 작성
                                    <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'mainImage')} className="hidden" />
                                </label>
                                <button
                                    type="button"
                                    className="bg-gray-200 text-gray-600 py-3 px-6 rounded-lg font-medium cursor-not-allowed"
                                    disabled
                                >
                                    단계별로 작성
                                </button>
                            </div>
                            {formData.mainImage && (
                                <p className="text-sm text-gray-600 mt-4">선택된 파일: {formData.mainImage.name}</p>
                            )}
                            <p className="text-sm text-gray-500 mt-4">* 메인 이미지를 업로드해 주세요</p>
                        </div>
                    </div>
                );

            case 4: // 상세 내용
                return (
                    <div className="bg-white p-8 rounded-lg">
                        <h2 className="text-xl font-bold mb-6 text-center">STEP.2 클래스 소개</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">상세 설명</label>
                            <textarea
                                name="detailContent"
                                rows={6}
                                placeholder="클래스에 대한 상세 설명을 입력하세요"
                                value={formData.detailContent}
                                onChange={handleChange}
                                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                        </div>
                    </div>
                );

            case 5: // 커리큘럼
                return (
                    <div className="bg-white p-8 rounded-lg">
                        <h2 className="text-xl font-bold mb-6 text-center">STEP.2 클래스 소개</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    커리큘럼 <span className="text-red-500">(필수)</span>
                                </label>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">난이도</label>
                                    <div className="flex space-x-4">
                                        {['초급', '중급', '고급'].map(level => (
                                            <button
                                                key={level}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, curriculumDifficulty: level }))}
                                                className={`px-6 py-2 rounded-lg border font-medium ${
                                                    formData.curriculumDifficulty === level 
                                                        ? 'border-blue-500 bg-blue-50 text-blue-600' 
                                                        : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">커리큘럼</label>
                                    <textarea
                                        name="curriculum"
                                        rows={8}
                                        placeholder="커리큘럼을 자유롭게 작성해 주세요&#10;최소 40자 이상"
                                        value={formData.curriculum}
                                        onChange={handleChange}
                                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    />
                                    <div className="text-right text-sm text-gray-500 mt-1">
                                        ({formData.curriculum.length}/600)
                                    </div>
                                    <div className="text-right text-sm text-gray-400 mt-1">
                                        최소 40자 이상
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 6: // 호스트 소개 & 공간 정보
                return (
                    <div className="bg-white p-8 rounded-lg">
                        <h2 className="text-xl font-bold mb-6 text-center">STEP.2 클래스 소개</h2>
                        <div className="space-y-6">
                            {/* 멘토 정보 */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-3">호스트 정보</h3>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={mentorInfo.name}
                                        disabled
                                        className="w-full p-3 border border-gray-300 rounded bg-gray-100 text-gray-500"
                                    />
                                    <textarea
                                        value={mentorInfo.intro}
                                        disabled
                                        rows={3}
                                        className="w-full p-3 border border-gray-300 rounded bg-gray-100 text-gray-500 resize-none"
                                    />
                                </div>
                            </div>

                            {/* 지역 선택 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">지역 선택</label>
                                <select
                                    name="spaceRegionId"
                                    value={formData.spaceRegionId}
                                    onChange={handleChange}
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">지역을 선택하세요</option>
                                    {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-8 px-4">
                <div className="flex gap-8">
                    {/* 왼쪽 사이드바 */}
                    <aside className="w-64 bg-white p-6 rounded-lg h-fit">
                        <div className="space-y-2">
                            {/* STEP.0 */}
                            <div
                                className={`flex items-center justify-between p-3 rounded cursor-pointer ${
                                    currentStep === 0 ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                                }`}
                                onClick={() => handleStepClick(0)}
                            >
                                <span className="font-medium">STEP.0 온오프 선택</span>
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-sm ${
                                    completedSteps[0] ? 'bg-green-500' : 'bg-gray-300'
                                }`}>
                                    {completedSteps[0] ? '✓' : ''}
                                </span>
                            </div>

                            {/* STEP.1 */}
                            <div
                                className={`flex items-center justify-between p-3 rounded cursor-pointer ${
                                    currentStep === 1 ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                                }`}
                                onClick={() => handleStepClick(1)}
                            >
                                <span className="font-medium">STEP.1 클래스 유형</span>
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-sm ${
                                    completedSteps[1] ? 'bg-green-500' : 'bg-gray-300'
                                }`}>
                                    {completedSteps[1] ? '✓' : ''}
                                </span>
                            </div>

                            {/* STEP.2 */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between p-3 rounded bg-gray-100">
                                    <span className="font-medium">STEP.2 클래스 소개</span>
                                </div>
                                
                                {/* 서브스텝들 */}
                                <div className="ml-4 space-y-1">
                                    {[
                                        { id: 2, title: '제목 및 카테고리', completed: completedSteps[2] },
                                        { id: 3, title: '이미지', completed: completedSteps[3] },
                                        { id: 4, title: '상세 내용', completed: completedSteps[4] },
                                        { id: 5, title: '커리큘럼', completed: completedSteps[5] },
                                        { id: 6, title: '호스트 소개', completed: completedSteps[6] }
                                    ].map(step => (
                                        <div
                                            key={step.id}
                                            className={`flex items-center justify-between p-2 rounded cursor-pointer text-sm ${
                                                currentStep === step.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                                            }`}
                                            onClick={() => handleStepClick(step.id)}
                                        >
                                            <span>{step.title}</span>
                                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-xs ${
                                                step.completed ? 'bg-green-500' : 'bg-gray-300'
                                            }`}>
                                                {step.completed ? '✓' : ''}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* 메인 콘텐츠 */}
                    <main className="flex-1">
                        <form onSubmit={handleSubmit} onKeyDown={(e) => {
                            // Enter 키로 인한 의도치 않은 submit 방지
                            if (e.key === 'Enter' && e.target.type !== 'textarea') {
                                e.preventDefault();
                            }
                        }}>
                            {/* 상단 진행률 */}
                            <div className="bg-white p-4 rounded-lg mb-6">
                                <div className="flex justify-center space-x-8 mb-4">
                                    {[1, 2, 3, 4, 5, 6, 7].map(num => (
                                        <div
                                            key={num}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                                                num <= currentStep + 1 
                                                    ? 'bg-hover opacity-80 text-white' 
                                                    : 'bg-gray-200 text-gray-400'
                                            }`}
                                        >
                                            {num}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 스텝 콘텐츠 */}
                            {renderStepContent()}

                            {/* 네비게이션 버튼 */}
                            <div className="flex justify-between mt-8">
                                <button
                                    type="button"
                                    onClick={handlePrev}
                                    disabled={currentStep === 0}
                                    className={`py-3 px-6 rounded-lg font-medium ${
                                        currentStep === 0 
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                            : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                                    }`}
                                >
                                    이전
                                </button>
                                
                                {currentStep < 6 ? (
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="bg-hover hover:bg-hoverDark text-white py-3 px-6 rounded-lg font-medium"
                                    >
                                        다음
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium"
                                    >
                                        클래스 등록
                                    </button>
                                )}
                            </div>
                        </form>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AddClassPage;
