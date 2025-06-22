import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddClassPage = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    
    // --- Step state ---
    const [currentStep, setCurrentStep] = useState(0); // 0~5까지의 단계
    
    // --- Data state ---
    const [categories, setCategories] = useState([]);
    const [regions, setRegions] = useState([]);
    const [mentorInfo, setMentorInfo] = useState({ 
        name: user?.nickname || user?.username || '멘토 이름', 
        intro: '' 
    });

    // --- Form fields ---
    const [formData, setFormData] = useState({
        onlineOffline: '',
        title: '',
        categoryId: '',
        mainImage: null,
        mainImageUrl: '', // S3에서 받은 이미지 URL 저장
        detailContent: '',
        curriculumDifficulty: '',
        curriculum: '',
        spaceRegionId: '',
        mentorIntro: '', // 멘토 소개 추가
        spaceInfo: ''    // 공간 상세 정보 추가
    });

    // --- 이미지 업로드 상태 ---
    const [imageUploading, setImageUploading] = useState(false);

    // --- Step completion tracking ---
    const [completedSteps, setCompletedSteps] = useState({
        0: false, // 온오프 선택
        1: false, // 클래스 유형 (카테고리)
        2: false, // 제목 및 카테고리
        3: false, // 이미지
        4: false, // 상세 내용
        5: false, // 커리큘럼
        6: false, // 호스트 소개
        7: false  // 지역 정보
    });

    // --- Default image URL ---
    const DEFAULT_IMAGE_URL = 'https://via.placeholder.com/300x200?text=기본+이미지';

    // --- 권한 체크 ---
    useEffect(() => {
        if (!loading) {
            // 로그인되지 않은 경우
            if (!user) {
                alert('로그인이 필요합니다.');
                navigate('/login');
                return;
            }
            
            // MENTOR 권한이 아닌 경우
            if (user.role !== 'MENTOR') {
                alert('해당 기능은 멘토만 이용하실 수 있습니다. 멘토 신청을 통해 역할을 변경하세요!');
                navigate('/');
                return;
            }
        }
    }, [user, loading, navigate]);

    // --- Fetch initial data ---
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const resCategories = await axios.get('/api/categories');
                setCategories(resCategories.data);
            } catch (e) {

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
            3: !!formData.mainImage || !!formData.mainImageUrl, // 이미지 파일 또는 URL이 있으면 완료
            4: !!formData.detailContent,
            5: !!formData.curriculum && !!formData.curriculumDifficulty,
            6: !!formData.mentorIntro,
            7: !!formData.spaceRegionId && !!formData.spaceInfo
        }));
    }, [formData]);

    // --- Handlers ---
    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e, fieldName) => {
        const file = e.target.files[0];
        
        if (file) {
            // 파일 크기 검증 (10MB 제한)
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                alert('파일 크기가 너무 큽니다. 10MB 이하의 파일을 선택해주세요.');
                e.target.value = ''; // 입력 초기화
                return;
            }
            
            // 파일 형식 검증
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                alert('지원되지 않는 파일 형식입니다. JPG, PNG, GIF, WebP 파일만 업로드 가능합니다.');
                e.target.value = ''; // 입력 초기화
                return;
            }
            
            // 이미지를 바로 S3에 업로드
            if (fieldName === 'mainImage') {
                await uploadImageToS3(file);
            } else {
                // 다른 파일은 기존처럼 처리
                setFormData(prev => ({ ...prev, [fieldName]: file }));
            }
        }
    };
    
    // S3에 이미지 업로드 하는 함수 (프로필 이미지 업로드와 동일한 방식)
    const uploadImageToS3 = async (file) => {
        setImageUploading(true);
        
        try {
            const formData = new FormData();
            formData.append('image', file);
            
            const response = await axios.post(
                'http://56.155.32.85:8080/api/classes/upload-image',  // 새로운 EC2 IP
                formData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            
            if (response.data.success) {
                // S3 URL을 formData에 저장
                setFormData(prev => ({ 
                    ...prev, 
                    mainImage: file,
                    mainImageUrl: response.data.imageUrl 
                }));
                
                alert('이미지 업로드 완료!');
            } else {
                alert('이미지 업로드 실패: ' + response.data.message);
            }
            
        } catch (error) {
            alert('이미지 업로드 중 오류가 발생했습니다.');
        } finally {
            setImageUploading(false);
        }
    };

    const handleNext = (e) => {
        e.preventDefault(); // form submit 방지
        if (currentStep < 7) {
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
            !formData.curriculum || !formData.curriculumDifficulty || !formData.spaceRegionId ||
            !formData.mentorIntro || !formData.spaceInfo) {
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
            mainImage: formData.mainImageUrl || DEFAULT_IMAGE_URL, // S3 URL 사용
            mentorId: user?.id || 1,
            mentoInfo: formData.mentorIntro, // 멘토 소개 추가
            spaceInfo: formData.spaceInfo    // 공간 상세 정보 추가
        };

        try {
            // 이제 이미지는 이미 S3에 업로드되었으므로 일반 API 호출만 사용
            const response = await axios.post('/api/classes', classData);
            
            alert('클래스 생성 성공!');
            window.location.href = '/';
        } catch (err) {

            
            // 구체적인 에러 메시지 처리
            let errorMessage = '클래스 생성 실패';
            
            if (err.response) {
                // 서버 응답이 있는 경우
                const status = err.response.status;
                const data = err.response.data;
                
                if (status === 413) {
                    errorMessage = '파일 크기가 너무 큽니다. 더 작은 이미지를 선택해주세요.';
                } else if (status === 400) {
                    errorMessage = data?.message || '입력 데이터에 오류가 있습니다.';
                } else if (status === 403) {
                    errorMessage = '권한이 없습니다. 멘토 계정으로 로그인해주세요.';
                } else {
                    errorMessage = data?.message || `서버 오류가 발생했습니다. (상태 코드: ${status})`;
                }
            } else if (err.request) {
                // 네트워크 오류
                errorMessage = '네트워크 연결에 실패했습니다. 인터넷 연결을 확인해주세요.';
            }
            
            alert(errorMessage);
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
                            <div className="flex justify-center mb-6">
                                <label className={`inline-block py-3 px-6 rounded-lg cursor-pointer font-medium ${
                                    imageUploading 
                                        ? 'bg-gray-400 text-white cursor-not-allowed' 
                                        : (formData.mainImage || formData.mainImageUrl)
                                        ? 'bg-green-500 text-white hover:bg-green-600' 
                                        : 'bg-orange-500 text-white hover:bg-orange-600'
                                }`}>
                                    {imageUploading 
                                        ? '이미지 업로드 중...' 
                                        : (formData.mainImage || formData.mainImageUrl)
                                        ? '이미지 업로드 완료 ✓' 
                                        : '이미지 등록'
                                    }
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={e => handleFileChange(e, 'mainImage')} 
                                        className="hidden" 
                                        disabled={imageUploading}
                                    />
                                </label>
                            </div>
                            {(formData.mainImage || formData.mainImageUrl) && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-600">선택된 파일: {formData.mainImage?.name || 'S3 업로드 완료'}</p>
                                    {formData.mainImage && (
                                        <p className="text-xs text-gray-500">크기: {(formData.mainImage.size / 1024 / 1024).toFixed(2)}MB</p>
                                    )}
                                    {formData.mainImageUrl && (
                                        <p className="text-xs text-green-600">S3 URL: {formData.mainImageUrl}</p>
                                    )}
                                </div>
                            )}
                            <div className="text-sm text-gray-500 mt-4">
                                <p>* 메인 이미지를 업로드해 주세요</p>
                                <p>* 최대 10MB, JPG/PNG/GIF/WebP 형식 지원</p>
                                <p>* 이미지는 바로 S3에 업로드됩니다</p>
                            </div>
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

            case 6: // 호스트 소개
                return (
                    <div className="bg-white p-8 rounded-lg">
                        <h2 className="text-xl font-bold mb-6 text-center">STEP.2 클래스 소개</h2>
                        <div className="space-y-6">
                            {/* 멘토 정보 */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-3">호스트 소개</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">멘토 이름</label>
                                        <input
                                            type="text"
                                            value={user?.nickname || user?.username || '멘토 이름'}
                                            disabled
                                            className="w-full p-3 border border-gray-300 rounded bg-gray-100 text-gray-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            멘토 소개 <span className="text-red-500">(필수)</span>
                                        </label>
                                        <textarea
                                            name="mentorIntro"
                                            value={formData.mentorIntro}
                                            onChange={handleChange}
                                            rows={4}
                                            placeholder="자신을 소개하는 글을 작성해주세요. (경력, 전문분야, 수업 스타일 등)"
                                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        />
                                        <div className="text-right text-sm text-gray-500 mt-1">
                                            ({formData.mentorIntro.length}/500)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 7: // 지역 정보
                return (
                    <div className="bg-white p-8 rounded-lg">
                        <h2 className="text-xl font-bold mb-6 text-center">STEP.2 클래스 소개</h2>
                        <div className="space-y-6">
                            {/* 지역 정보 */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">지역 정보</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            지역을 선택하세요 <span className="text-red-500">(필수)</span>
                                        </label>
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
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            지역에 대한 상세 정보 <span className="text-red-500">(필수)</span>
                                        </label>
                                        <textarea
                                            name="spaceInfo"
                                            value={formData.spaceInfo}
                                            onChange={handleChange}
                                            rows={4}
                                            placeholder="예: 강남역 2번 출구에서 도보 5분, 지하철 2호선 강남역 직접 연결, 대형 바이크 락 마련, 전용 주차장 완비"
                                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        />
                                        <div className="text-right text-sm text-gray-500 mt-1">
                                            ({formData.spaceInfo.length}/300)
                                        </div>
                                        <p className="text-sm text-gray-400 mt-2">
                                            * 찾아오는 방법, 주차 정보, 대중교통 정보 등을 상세히 작성해주세요.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    // 로딩 중이거나 권한이 없으면 리렌더링하지 않음
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-gray-600">로딩 중...</p>
                </div>
            </div>
        );
    }

    if (!user || user.role !== 'MENTOR') {
        return null; // 권한 체크에서 리다이렉트 되므로 null 리턴
    }

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
                                        { id: 6, title: '호스트 소개', completed: completedSteps[6] },
                                        { id: 7, title: '지역 정보', completed: completedSteps[7] }
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
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
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
                                
                                {currentStep < 7 ? (
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
