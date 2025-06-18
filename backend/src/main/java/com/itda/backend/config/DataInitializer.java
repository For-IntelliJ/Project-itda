package com.itda.backend.config;

import com.itda.backend.domain.*;
import com.itda.backend.domain.enums.*;
import com.itda.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Profile("!test") // 테스트 환경에서는 실행하지 않음
public class DataInitializer implements CommandLineRunner {

    private final MemberRepository memberRepository;
    private final CategoryRepository categoryRepository;
    private final RegionRepository regionRepository;
    private final ClassRepository classRepository;
    
    public DataInitializer(MemberRepository memberRepository,
                          CategoryRepository categoryRepository,
                          RegionRepository regionRepository,
                          ClassRepository classRepository) {
        this.memberRepository = memberRepository;
        this.categoryRepository = categoryRepository;
        this.regionRepository = regionRepository;
        this.classRepository = classRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println(">> [INFO] 데이터 초기화 시작");
        
        try {
            // 기존 데이터가 있는지 확인
            if (memberRepository.count() > 0) {
                System.out.println(">> [INFO] 기존 데이터가 존재합니다. 초기화를 건너뜁니다.");
                return;
            }
            
            // 1. 회원 데이터 생성
            createMembers();
            
            // 2. 카테고리 데이터 생성
            createCategories();
            
            // 3. 지역 데이터 생성
            createRegions();
            
            // 4. 클래스 데이터 생성
            createClasses();
            
            System.out.println(">> [INFO] 데이터 초기화 완료");
            
        } catch (Exception e) {
            System.err.println(">> [ERROR] 데이터 초기화 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private void createMembers() {
        // 멘토 회원 생성
        Member mentor1 = Member.builder()
                .username("김민수")
                .nickname("김민수")
                .email("mentor1@example.com")
                .password("password123")
                .phone("010-1234-5678")
                .gender(Gender.M)
                .role(Role.MENTOR)
                .loginType(LoginType.LOCAL)
                .build();
                
        Member mentor2 = Member.builder()
                .username("이지은")
                .nickname("이지은")
                .email("mentor2@example.com")
                .password("password123")
                .phone("010-2345-6789")
                .gender(Gender.F)
                .role(Role.MENTOR)
                .loginType(LoginType.LOCAL)
                .build();
                
        Member mentor3 = Member.builder()
                .username("박철수")
                .nickname("박철수")
                .email("mentor3@example.com")
                .password("password123")
                .phone("010-3456-7890")
                .gender(Gender.M)
                .role(Role.MENTOR)
                .loginType(LoginType.LOCAL)
                .build();
        
        memberRepository.save(mentor1);
        memberRepository.save(mentor2);
        memberRepository.save(mentor3);
        
        System.out.println(">> [INFO] 멘토 회원 3명 생성 완료");
    }
    
    private void createCategories() {
        String[] categoryNames = {
            "프로그래밍", "디자인", "요리", "음악", "미술", "운동", "언어", "수학"
        };
        
        for (String name : categoryNames) {
            Category category = Category.builder()
                    .name(name)
                    .build();
            categoryRepository.save(category);
        }
        
        System.out.println(">> [INFO] 카테고리 " + categoryNames.length + "개 생성 완료");
    }
    
    private void createRegions() {
        String[] regionNames = {
            "서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종",
            "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"
        };
        
        for (String name : regionNames) {
            Region region = Region.builder()
                    .name(name)
                    .build();
            regionRepository.save(region);
        }
        
        System.out.println(">> [INFO] 지역 " + regionNames.length + "개 생성 완료");
    }
    
    private void createClasses() {
        // 멘토, 카테고리, 지역 데이터 가져오기
        Member mentor1 = memberRepository.findById(1L).orElse(null);
        Member mentor2 = memberRepository.findById(2L).orElse(null);
        Member mentor3 = memberRepository.findById(3L).orElse(null);
        
        Category programming = categoryRepository.findById(1L).orElse(null);
        Category design = categoryRepository.findById(2L).orElse(null);
        Category cooking = categoryRepository.findById(3L).orElse(null);
        
        Region seoul = regionRepository.findById(1L).orElse(null);
        Region busan = regionRepository.findById(2L).orElse(null);
        Region daegu = regionRepository.findById(3L).orElse(null);
        
        if (mentor1 == null || programming == null || seoul == null) {
            System.err.println(">> [ERROR] 필수 데이터가 없습니다.");
            return;
        }
        
        // 클래스 데이터 생성
        ClassEntity class1 = ClassEntity.builder()
                .title("초보자를 위한 자바 프로그래밍")
                .curriculum("자바 기초부터 객체지향까지")
                .level(ClassLevel.초급)
                .onoff(OnOffType.온라인)
                .mainImage("/img/default_class.jpg")
                .detailContent("자바 프로그래밍의 기초부터 차근차근 배워보세요. 변수, 조건문, 반복문부터 객체지향 프로그래밍까지 체계적으로 학습할 수 있습니다.")
                .mentoInfo("5년차 백엔드 개발자로 다수의 프로젝트 경험이 있습니다.")
                .spaceInfo("온라인 화상회의 시스템을 통해 진행됩니다.")
                .mentor(mentor1)
                .category(programming)
                .region(seoul)
                .build();
                
        ClassEntity class2 = ClassEntity.builder()
                .title("UI/UX 디자인 기초")
                .curriculum("사용자 중심의 디자인 사고")
                .level(ClassLevel.초급)
                .onoff(OnOffType.오프라인)
                .mainImage("/img/placeholder1.jpg")
                .detailContent("사용자 경험을 고려한 디자인 방법론을 배웁니다. 피그마, 어도비 XD 등의 도구 사용법도 함께 익힐 수 있습니다.")
                .mentoInfo("UX 디자이너로 3년간 다양한 앱 디자인 경험을 보유하고 있습니다.")
                .spaceInfo("강남역 근처 디자인 스튜디오에서 진행됩니다.")
                .mentor(mentor2)
                .category(design)
                .region(seoul)
                .build();
                
        ClassEntity class3 = ClassEntity.builder()
                .title("이탈리아 요리 마스터")
                .curriculum("파스타부터 피자까지")
                .level(ClassLevel.중급)
                .onoff(OnOffType.오프라인)
                .mainImage("/img/placeholder2.jpg")
                .detailContent("정통 이탈리아 요리의 비법을 배워보세요. 직접 반죽부터 만들어보는 체험형 수업입니다.")
                .mentoInfo("이탈리아에서 2년간 요리를 배운 전문 셰프입니다.")
                .spaceInfo("전문 요리 교실에서 모든 재료와 도구가 제공됩니다.")
                .mentor(mentor3)
                .category(cooking)
                .region(busan)
                .build();
                
        ClassEntity class4 = ClassEntity.builder()
                .title("웹 개발 심화 과정")
                .curriculum("React와 Node.js 활용")
                .level(ClassLevel.고급)
                .onoff(OnOffType.온라인)
                .mainImage("/img/default_class.jpg")
                .detailContent("모던 웹 개발 기술 스택을 활용한 실전 프로젝트 개발. 포트폴리오로 활용할 수 있는 완성도 높은 웹 애플리케이션을 만들어봅니다.")
                .mentoInfo("풀스택 개발자로 7년간 다양한 웹 서비스 개발 경험이 있습니다.")
                .spaceInfo("온라인 실시간 코딩 세션으로 진행됩니다.")
                .mentor(mentor1)
                .category(programming)
                .region(seoul)
                .build();
                
        ClassEntity class5 = ClassEntity.builder()
                .title("브랜딩 디자인 워크샵")
                .curriculum("로고부터 브랜드 아이덴티티까지")
                .level(ClassLevel.중급)
                .onoff(OnOffType.오프라인)
                .mainImage("/img/placeholder1.jpg")
                .detailContent("브랜드의 정체성을 시각적으로 표현하는 방법을 배웁니다. 실제 브랜딩 프로젝트를 통해 실무 경험을 쌓을 수 있습니다.")
                .mentoInfo("브랜딩 전문 디자이너로 100여 개 브랜드 작업 경험이 있습니다.")
                .spaceInfo("홍대 디자인 스튜디오에서 진행되며 모든 디자인 도구가 제공됩니다.")
                .mentor(mentor2)
                .category(design)
                .region(seoul)
                .build();
                
        ClassEntity class6 = ClassEntity.builder()
                .title("프랑스 디저트 클래스")
                .curriculum("마카롱과 타르트 만들기")
                .level(ClassLevel.초급)
                .onoff(OnOffType.오프라인)
                .mainImage("/img/placeholder2.jpg")
                .detailContent("프랑스 전통 디저트의 제조법을 배워보세요. 기본 반죽부터 데코레이션까지 모든 과정을 체험할 수 있습니다.")
                .mentoInfo("프랑스 르 코르동 블루 출신 파티시에입니다.")
                .spaceInfo("전문 제과 실습실에서 개인별 작업대가 제공됩니다.")
                .mentor(mentor3)
                .category(cooking)
                .region(daegu)
                .build();
        
        classRepository.save(class1);
        classRepository.save(class2);
        classRepository.save(class3);
        classRepository.save(class4);
        classRepository.save(class5);
        classRepository.save(class6);
        
        System.out.println(">> [INFO] 클래스 6개 생성 완료");
    }
}
