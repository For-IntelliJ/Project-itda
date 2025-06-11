import React, {useState} from "react";
import FAQCard from "../components/FAQcard";

// FAQ 데이터
const faqDataMentor = [
    {
        question: "멘토 신청 후 언제부터 활동이 시작되나요?",
        answer: "멘토 신청 후 일주일 내에 운영팀의 검토가 완료되며, 승인되면 개별 안내 메시지와 함께 활동이 시작됩니다."
    },
    {
        question: "멘티와의 매칭 기준은 무엇인가요?",
        answer: "신청서에 작성한 분야, 경력, 가능한 시간 등을 바탕으로 멘티와 가장 적절한 매칭이 이루어집니다."
    },
    {
        question: "멘토링 시간은 어떻게 조율하나요?",
        answer: "멘티와 채팅 또는 이메일로 직접 협의하여 편한 시간에 조율하시면 됩니다."
    },
    {
        question: "멘토 활동에 필요한 자료는 제공되나요?",
        answer: "기본 가이드라인은 제공되며, 멘토님 재량에 따라 추가 자료를 만들어 사용하셔도 됩니다."
    },
    {
        question: "멘토링 활동은 봉사 시간으로 인정되나요?",
        answer: "일부 학교나 기관과의 제휴에 따라 봉사 시간으로 인정될 수 있으며, 필요한 경우 활동 확인서를 발급해드립니다."
    }
];

const faqDataMentee = [
    {
        question: "멘토링은 유료인가요?",
        answer: "본 플랫폼은 재능 나눔 기반으로 운영되어 모든 1:1 멘토링은 무료입니다."
    },
    {
        question: "한 명의 멘토에게 여러 번 질문해도 되나요?",
        answer: "네, 가능합니다. 단, 예의와 성실함을 지켜주시면 더 원활한 멘토링이 이어집니다."
    },
    {
        question: "멘토링 분야는 어떻게 선택하나요?",
        answer: "멘토 신청 페이지 또는 분야 검색 기능을 이용해 원하는 주제를 선택하실 수 있습니다."
    },
    {
        question: "멘토가 응답하지 않으면 어떻게 하나요?",
        answer: "48시간 이상 응답이 없는 경우, 운영팀에 문의해주시면 재매칭이나 조치를 도와드립니다."
    },
    {
        question: "멘토링 횟수에 제한이 있나요?",
        answer: "멘티 1인당 3명의 멘토에게 최대 5회까지 멘토링을 요청할 수 있습니다."
    }
];


const faqDataGroup = [
    {
        question: "단체 클래스를 신청하려면 어떤 절차가 필요한가요?",
        answer: "클래스 공지사항 확인 후, 단체 대표가 클래스 신청서를 작성해 제출하면 운영진이 검토 후 개별 연락드립니다."
    },
    {
        question: "단체 클래스는 온라인으로도 진행되나요?",
        answer: "네, 오프라인/온라인 모두 가능합니다. 신청 시 희망 방식을 명시해 주세요."
    },
    {
        question: "참여 인원 제한이 있나요?",
        answer: "기본적으로 클래스당 20명 내외가 적절하며, 상황에 따라 조정될 수 있습니다."
    },
    {
        question: "단체 클래스도 멘토 선택이 가능한가요?",
        answer: "네, 특정 멘토를 지정하여 클래스 진행을 요청하실 수 있으며 조율 후 확정됩니다."
    },
    {
        question: "준비물이 필요한가요?",
        answer: "수업 내용에 따라 준비물이 있을 수 있으며, 사전에 운영팀 또는 멘토가 안내드립니다."
    }
];

const faqDataEtc = [
    {
        question: "멘토링 진행 중 문제가 발생하면 어디에 문의하나요?",
        answer: "플랫폼 내 고객센터 또는 '문의하기' 게시판을 이용해 주세요. 최대한 빠르게 처리해드립니다."
    },
    {
        question: "이메일을 잘못 입력했어요. 수정할 수 있나요?",
        answer: "‘내 정보’ 페이지에서 직접 수정이 가능하며, 수정 후에는 다시 인증이 필요할 수 있습니다."
    },
    {
        question: "비밀번호를 잊어버렸어요. 어떻게 하나요?",
        answer: "로그인 페이지에서 '비밀번호 찾기'를 통해 재설정하실 수 있습니다."
    },
    {
        question: "플랫폼은 어떤 기술로 만들어졌나요?",
        answer: "React 기반 프론트엔드와 Spring Boot 백엔드로 구성되어 있으며, 사용자 편의성과 확장성을 고려해 개발되었습니다."
    },
    {
        question: "광고나 스폰서 제휴는 가능한가요?",
        answer: "제휴 제안은 고객센터 또는 공식 이메일로 문의해 주세요. 내부 검토 후 회신드리겠습니다."
    }
];

const categories = [
    {key: "mentor", label: "👨‍🏫 멘토님들이 자주 하는 질문"},
    {key: "mentee", label: "👨‍🎓 멘티분들이 자주 하는 질문"},
    {key: "group", label: "🌵 단체 클래스 질문 사항"},
    {key: "etc", label: "👓 기타"}
];

const categoryDataMap = {
    mentor: faqDataMentor,
    mentee: faqDataMentee,
    group: faqDataGroup,
    etc: faqDataEtc
};

function FAQPage() {
    const [selectedCategory, setSelectedCategory] = useState("mentor");

    return (
        <div className="w-full flex flex-col items-center px-4">
            {/* 배너 이미지 */}
            <img
                src="/img/faq.png"
                alt="faq-banner"
                className="block mx-auto my-8"
            />

            {/* 카테고리 탭 */}
            <div className="flex flex-wrap justify-center gap-6 mb-2">
                {categories.map((cat) => (
                    <button
                        key={cat.key}
                        onClick={() => setSelectedCategory(cat.key)}
                        className={`text-base font-bold font-['Noto_Sans_KR'] transition-colors duration-200 ${
                            selectedCategory === cat.key
                                ? "text-[#3D4EFE] font-extrabold"
                                : "font-pretender hover:text-[#3D4EFE] hover:opacity-60"
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* 구분선 */}
            <div className="w-[1200px] h-px border-b font-pretendard inline-flex mx-auto mb-20"/>

            {/* FAQ 리스트 */}
            <div className="w-full flex flex-col items-center gap-4">
                {categoryDataMap[selectedCategory].map((item, idx) => (
                    <FAQCard
                        key={idx}
                        question={item.question}
                        answer={item.answer}
                    />
                ))}
            </div>
        </div>
    );
}

export default FAQPage;