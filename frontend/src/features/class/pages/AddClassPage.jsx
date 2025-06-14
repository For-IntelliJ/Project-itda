import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AddClassPage = () => {
    // --- Step state ---
    const [mainStep, setMainStep] = useState(0);            // 0: 온/오프라인 선택
    const [step2SubStep, setStep2SubStep] = useState(0);    // 1-0 ~ 1-3: 세부 스텝들

    // --- Data state ---
    const [categories, setCategories] = useState([]);
    const [regions, setRegions] = useState([]);
    const [mentorName, setMentorName] = useState('');

    // --- Form fields ---
    const [formData, setFormData] = useState({
        onlineOffline: '',
        title: '',
        categoryId: '',
        mainImage: null,
        detailImage: null,
        detail: '',
        curriculumDifficulty: '',
        curriculum: '',
        mentorIntro: '',
        spaceRegionId: '',
        spaceRegionName: '',
        spaceAddress: ''
    });

    // --- Default image URL ---
    const DEFAULT_IMAGE_URL =
        'https://lh5.googleusercontent.com/proxy/1tcpSHHwVM4X5lkcebeX9xZVZuvq7whm5tb1Utabaw7DDS9CmVoHEavN9g0_VPJk2q2f7LxXpYeYWC4gvRlTdR3AgGhtQ-frxnodK2ChyBBLRVM5WMCLWsiqp5TIWqWA';

    // --- Refs for scroll targets ---
    const stepRefs = {
        '0': useRef(null),
        '1-0': useRef(null),
        '1-1': useRef(null),
        '1-2': useRef(null),
        '1-3': useRef(null)
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
            try {
                const resMentor = await axios.get('/api/users/1');
                setMentorName(resMentor.data.username);
            } catch (e) {
                console.error('멘토 로드 실패:', e);
            }
        };
        fetchInitialData();
    }, []);

    // --- Debug logging ---
    useEffect(() => { console.log('categories:', categories); }, [categories]);
    useEffect(() => { console.log('regions:', regions); }, [regions]);
    useEffect(() => { console.log('mentorName:', mentorName); }, [mentorName]);

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
        } else if (step2SubStep < 3) {
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
        const classData = {
            classname: formData.title,
            mento: { id: 1 },
            mentoInfo: formData.mentorIntro,
            category: { id: +formData.categoryId },
            curriculum: formData.curriculum,
            onoff: formData.onlineOffline === 'online' ? '온라인' : '오프라인',
            level: formData.curriculumDifficulty,
            detailContent: formData.detail,
            spaceInfo: formData.spaceRegionName,
            addr: formData.spaceAddress,
            region: { id: +formData.spaceRegionId },
            mainImagePath: formData.mainImage ? null : DEFAULT_IMAGE_URL,
            detailImagePath: formData.detailImage ? null : DEFAULT_IMAGE_URL
        };

        try {
            let response;
            if (formData.mainImage || formData.detailImage) {
                const fd = new FormData();
                fd.append('classData', new Blob([JSON.stringify(classData)], { type: 'application/json' }));
                formData.mainImage && fd.append('mainImage', formData.mainImage);
                formData.detailImage && fd.append('detailImage', formData.detailImage);
                response = await axios.post('/api/classes/with-files', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                response = await axios.post('/api/classes', classData);
            }
            console.log('서버 응답:', response.data);
            alert('클래스 생성 성공!');
        } catch (err) {
            console.error('에러:', err);
            alert(`클래스 생성 실패: ${err.response?.data || err.message}`);
        }
    };

    // --- Render content by step ---
    const renderContent = () => {
        if (mainStep === 0) {
            return (
                <section ref={stepRefs['0']} className="mb-6">
                    <h2 className="text-2xl font-bold mb-4">Step 1: 온/오프라인 선택</h2>
                    <p className="mb-6 text-gray-600">온라인 또는 오프라인 중 하나를 선택하세요.</p>
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
                </section>
            );
        }
        switch (step2SubStep) {
            case 0:
                return (
                    <section ref={stepRefs['1-0']} className="mb-6">
                        <h2 className="text-2xl font-bold mb-4">기본 정보</h2>
                        <p className="mb-6 text-gray-600">제목, 카테고리, 이미지를 등록합니다.</p>
                        <div className="space-y-4">
                            <input
                                name="title"
                                placeholder="제목을 입력하세요"
                                value={formData.title}
                                onChange={handleChange}
                                className="border border-gray-300 w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D4EFE] focus:border-transparent"
                            />
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                className="border border-gray-300 w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D4EFE] focus:border-transparent"
                            >
                                <option value="">카테고리 선택</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="bg-[#3D4EFE] text-white py-3 px-4 rounded-md text-center cursor-pointer hover:bg-[#2c3ed9] font-medium">
                                    메인 이미지 등록
                                    <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'mainImage')} className="hidden" />
                                </label>
                                <label className="bg-[#3D4EFE] text-white py-3 px-4 rounded-md text-center cursor-pointer hover:bg-[#2c3ed9] font-medium">
                                    상세 이미지 등록
                                    <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'detailImage')} className="hidden" />
                                </label>
                            </div>
                            <textarea
                                name="detail"
                                rows={4}
                                placeholder="상세 설명을 입력하세요"
                                value={formData.detail}
                                onChange={handleChange}
                                className="border border-gray-300 w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D4EFE] focus:border-transparent resize-none"
                            />
                        </div>
                    </section>
                );
            case 1:
                return (
                    <section ref={stepRefs['1-1']} className="mb-6">
                        <h2 className="text-2xl font-bold mb-4">커리큘럼</h2>
                        <p className="mb-6 text-gray-600">난이도와 커리큘럼 내용을 작성하세요.</p>
                        <div className="space-y-4">
                            <select
                                name="curriculumDifficulty"
                                value={formData.curriculumDifficulty}
                                onChange={handleChange}
                                className="border border-gray-300 w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D4EFE] focus:border-transparent"
                            >
                                <option value="">난이도 선택</option>
                                <option value="초급">초급</option>
                                <option value="중급">중급</option>
                                <option value="고급">고급</option>
                            </select>
                            <textarea
                                name="curriculum"
                                rows={6}
                                placeholder="커리큘럼 내용을 입력하세요"
                                value={formData.curriculum}
                                onChange={handleChange}
                                className="border border-gray-300 w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D4EFE] focus:border-transparent resize-none"
                            />
                        </div>
                    </section>
                );
            case 2:
                return (
                    <section ref={stepRefs['1-2']} className="mb-6">
                        <h2 className="text-2xl font-bold mb-4">멘토 소개</h2>
                        <p className="mb-6 text-gray-600">멘토 이름과 소개글을 입력합니다.</p>
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={mentorName}
                                disabled
                                className="border border-gray-300 w-full p-3 rounded-md bg-gray-100 text-gray-500"
                                placeholder="멘토 이름"
                            />
                            <textarea
                                name="mentorIntro"
                                rows={4}
                                placeholder="멘토 소개글을 입력하세요"
                                value={formData.mentorIntro}
                                onChange={handleChange}
                                className="border border-gray-300 w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D4EFE] focus:border-transparent resize-none"
                            />
                        </div>
                    </section>
                );
            case 3:
                return (
                    <section ref={stepRefs['1-3']} className="mb-6">
                        <h2 className="text-2xl font-bold mb-4">공간 정보</h2>
                        <p className="mb-6 text-gray-600">공간 지역과 상세 주소를 입력하세요.</p>
                        <div className="space-y-4">
                            <select
                                name="spaceRegionId"
                                value={formData.spaceRegionId}
                                onChange={e => {
                                    const id = e.target.value;
                                    const name = regions.find(r => r.id.toString() === id)?.name || '';
                                    setFormData(prev => ({ ...prev, spaceRegionId: id, spaceRegionName: name }));
                                }}
                                className="border border-gray-300 w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D4EFE] focus:border-transparent"
                            >
                                <option value="">지역 선택</option>
                                {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                            <input
                                type="text"
                                name="spaceAddress"
                                placeholder="상세 주소를 입력하세요"
                                value={formData.spaceAddress}
                                onChange={handleChange}
                                className="border border-gray-300 w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3D4EFE] focus:border-transparent"
                            />
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
                            온/오프라인
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
                            기본 정보
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
                            멘토 소개
                        </li>
                        <li
                            className={`cursor-pointer text-sm py-1 ${
                                mainStep === 1 && step2SubStep === 3 ? 'text-[#3D4EFE] font-medium' : 'text-gray-600 hover:text-[#3D4EFE]'
                            }`}
                            onClick={() => handleStepClick(1, 3)}
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
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-md font-semibold"
                        >
                            이전
                        </button>
                        {(mainStep === 0 || step2SubStep < 3) ? (
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
