import React, { useState, useRef } from "react";
import {useNavigate} from "react-router-dom";
import EditProfileModal from "../components/EditProfileModal";
import CancelContentModal from "../components/CancelContentModal";
import axios from "axios";

function EditProfile() {
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);//이중확인창
    const navigate = useNavigate();


    // 사진 업로드 후 저장 눌렀을 때
    const handleSave = () => {
        navigate("/mypagelayout?tab=profileset", {
            state: {
                profileData,//이부분에는 오늘의 다짐만 불러와야겠군
                previewUrl,
            }
        });
    };
    
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        bio: '',
        phone: '',
        linkedin: '',
        github: '',
        personalweb: '',
        personalwebname: ''
    });

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    //파일선택함수
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            //미리보기 URL생성
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
                setIsModalOpen(true);
            };
            reader.readAsDataURL(file);

            // 파일 서버 전송
            const formData = new FormData();
            formData.append("file", file);

            //백엔드 주소(fetch대신 axios 사용)
            axios.post("http://localhost:8080/api/profile/upload", formData, {
                withCredentials: true,  // 이 부분 추가
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
                .then(res => {
                    console.log("업로드 결과:", res.data);
                })
                .catch(err => {
                    console.error(err);
                });

        }
    };

    const closeModal = () => setIsModalOpen(false);

    //취소버튼 클릭시 이중확인창 
    const handleCancel = () => {
        setIsCancelModalOpen(true);
    };
    
    //이중확인창에서 확인 누르면 그제서야 실제 초기화
    const confirmCancel = () => {
        setIsCancelModalOpen(false);
        setPreviewUrl(null);
        setProfileData({
            name: '',
            email: '',
            bio: '',
            phone: '',
            linkedin: '',
            github: '',
            personalweb: '',
            personalwebname: ''
        });
    };

    //이중확인창에서 취소 클릭시 닫히는 함수
    const closeCancelModal = () => {
        setIsCancelModalOpen(false);
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const profileItems = [
        { label: "이름", key: "name" },
        { label: "이메일", key: "email" },
        { label: "오늘의다짐", key: "bio", textarea: true },
        { label: "전화번호", key: "phone" }
    ];

    const profileItems2 = [
        { label: "LinkedIn URL", key: "linkedin" },
        { label: "GitHub URL", key: "github" },
        { label: "개인 웹사이트 URL", key: "personalweb" },
        { label: "개인 웹사이트 이름", key: "personalwebname" }
    ];

    return (
        <div className="w-full max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-10">프로필 수정하기</h1>
            <div className="w-[800px] h-full border border-gray-800 rounded-xl">
                <div className="m-10">
                    {/* 사진 업로드 */}
                    <div className="flex mb-10">
                        <img
                            src={previewUrl || "/img/Basic_Profile.png"}
                            alt="미리보기"
                            className="w-[180px] h-[180px] rounded-full bg-gray-200 object-cover mr-10"
                        />
                        <div>
                            <button
                                type="button"
                                onClick={handleUploadClick}
                                className="border border-gray-800 w-[120px] h-[45px] rounded-lg mt-16 hover:text-white hover:bg-[#3D4EFE]"
                            >
                                사진 업로드
                            </button>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            {isModalOpen && (
                                <EditProfileModal
                                    onClose={closeModal}
                                    previewUrl={previewUrl}
                                />
                            )}
                        </div>
                    </div>

                    {/* 기본 정보 */}
                    <div className="space-y-2.5">
                        {profileItems.map(({ label, key, textarea }) => (
                            <div
                                key={key}
                                className={`border border-black rounded-lg p-4 ${key === "bio" ? "h-[250px]" : "h-[90px]"}`}
                            >
                                <div className="font-semibold mb-2">{label}</div>
                                {textarea ? (
                                    <textarea
                                        name={key}
                                        value={profileData[key]}
                                        onChange={handleChange}
                                        className="w-full h-full resize-none outline-none bg-transparent"
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        name={key}
                                        value={profileData[key]}
                                        onChange={handleChange}
                                        className="w-full outline-none bg-transparent"
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* 링크 */}
                    <div className="mt-10 space-y-2.5">
                        <div className="border-b border-black pb-2 font-bold text-2xl">링크추가</div>
                        <div className="space-y-2.5">
                            <div className="flex gap-2">
                                <div className="border border-black rounded-lg p-2 flex-1 flex flex-col">
                                    <label className="font-semibold mb-1">개인 웹사이트 URL</label>
                                    <input
                                        type="text"
                                        name="personalweb"
                                        value={profileData.personalweb}
                                        onChange={handleChange}
                                        className="w-full outline-none bg-transparent"
                                    />
                                </div>
                                <div className="border border-black rounded-lg p-2 flex-1 flex flex-col">
                                    <label className="font-semibold mb-1">개인 웹사이트 이름</label>
                                    <input
                                        type="text"
                                        name="personalwebname"
                                        value={profileData.personalwebname}
                                        onChange={handleChange}
                                        className="w-full outline-none bg-transparent"
                                    />
                                </div>
                            </div>
                            {profileItems2
                                .filter(item => !["personalweb", "personalwebname"].includes(item.key))
                                .map(({ label, key }) => (
                                    <div key={key} className="border border-black rounded-lg p-2 flex flex-col">
                                        <label className="font-semibold mb-1">{label}</label>
                                        <input
                                            type="text"
                                            name={key}
                                            value={profileData[key]}
                                            onChange={handleChange}
                                            className="w-full outline-none bg-transparent"
                                        />
                                    </div>
                                ))}
                        </div>

                        <div className="flex justify-end space-x-2 mt-10">
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-200 rounded"
                                onClick={handleCancel}
                            >
                                취소
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 bg-[#3D4EFE] text-white rounded"
                                onClick={handleSave}
                            >
                                저장
                            </button>
                        </div>
                        {isCancelModalOpen && (
                            <CancelContentModal
                                onClose={closeCancelModal}
                                onConfirm={confirmCancel} //변수에 기능을 넣은거구나!!
                            />
                        )}
                        {/*페이지를 이동해야한다 만약 저장버튼을 누른다면 profileSet으로 Navigate*/}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditProfile;
