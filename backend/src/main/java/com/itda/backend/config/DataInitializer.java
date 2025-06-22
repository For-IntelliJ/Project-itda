package com.itda.backend.config;

import com.itda.backend.domain.*;
import com.itda.backend.domain.enums.*;
import com.itda.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

// @Component  // 실제 DB 데이터 사용을 위해 비활성화
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
            System.out.println(">> [DEBUG] 현재 데이터 현황:");
            System.out.println("  - 회원 수: " + memberRepository.count());
            System.out.println("  - 카테고리 수: " + categoryRepository.count());
            System.out.println("  - 지역 수: " + regionRepository.count());
            System.out.println("  - 클래스 수: " + classRepository.count());
            
            // 강제로 항상 데이터 초기화 (테스트용)
            System.out.println(">> [INFO] 테스트 데이터 강제 생성");
            
            // 1. 멘티 회원 생성
            createMentees();
            
            // 2. 멘토 회원 생성
            createMentors();
            
            // 3. 카테고리 데이터 생성
            createCategories();
            
            // 4. 지역 데이터 생성
            createRegions();
            
            // 5. 클래스 데이터 생성
            createClasses();
            
            System.out.println(">> [INFO] 데이터 초기화 완료");
            System.out.println(">> [INFO] 최종 클래스 수: " + classRepository.count());
            
        } catch (Exception e) {
            System.err.println(">> [ERROR] 데이터 초기화 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private void createMentees() {
        // 멘티 회원 생성
        Member mentee1 = Member.builder()
                .username("김영희")
                .nickname("김영희")
                .email("mentee1@example.com")
                .password("password123")
                .phone("010-1111-1111")
                .gender(Gender.F)
                .role(Role.MENTEE)
                .loginType(LoginType.LOCAL)
                .build();
                
        Member mentee2 = Member.builder()
                .username("이철수")
                .nickname("이철수")
                .email("mentee2@example.com")
                .password("password123")
                .phone("010-2222-2222")
                .gender(Gender.M)
                .role(Role.MENTEE)
                .loginType(LoginType.LOCAL)
                .build();
                
        Member mentee3 = Member.builder()
                .username("박지영")
                .nickname("박지영")
                .email("mentee3@example.com")
                .password("password123")
                .phone("010-3333-3333")
                .gender(Gender.F)
                .role(Role.MENTEE)
                .loginType(LoginType.LOCAL)
                .build();
        
        memberRepository.save(mentee1);
        memberRepository.save(mentee2);
        memberRepository.save(mentee3);
        
        System.out.println(">> [INFO] 멘티 회원 3명 생성 완료");
    }
    
    private void createMentors() {
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
        System.out.println(">> [DEBUG] 클래스 생성 시작");
        
        // 데이터 조회
        var mentors = memberRepository.findAll().stream()
                .filter(m -> m.getRole() == Role.MENTOR)
                .toList();
        var categories = categoryRepository.findAll();
        var regions = regionRepository.findAll();
        
        System.out.println(">> [DEBUG] 조회된 데이터: 멘토 " + mentors.size() + "명, 카테고리 " + categories.size() + "개, 지역 " + regions.size() + "개");
        
        if (mentors.isEmpty() || categories.isEmpty() || regions.isEmpty()) {
            System.err.println(">> [ERROR] 필수 데이터가 부족합니다.");
            return;
        }
        
        Member mentor1 = mentors.get(0);
        Member mentor2 = mentors.size() > 1 ? mentors.get(1) : mentor1;
        Member mentor3 = mentors.size() > 2 ? mentors.get(2) : mentor1;
        
        Category programming = categories.stream().filter(c -> c.getName().equals("프로그래밍")).findFirst().orElse(categories.get(0));
        Category design = categories.stream().filter(c -> c.getName().equals("디자인")).findFirst().orElse(categories.get(0));
        Category cooking = categories.stream().filter(c -> c.getName().equals("요리")).findFirst().orElse(categories.get(0));
        
        Region seoul = regions.stream().filter(r -> r.getName().equals("서울")).findFirst().orElse(regions.get(0));
        Region busan = regions.stream().filter(r -> r.getName().equals("부산")).findFirst().orElse(regions.get(0));
        
        // 클래스 데이터 생성
        ClassEntity class1 = ClassEntity.builder()
                .title("초보자를 위한 자바 프로그래밍")
                .curriculum("자바 기초부터 객체지향까지 체계적으로 학습합니다. 변수, 조건문, 반복문부터 시작하여 클래스와 객체, 상속, 다형성까지 단계별로 배워보세요.")
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
                .curriculum("사용자 중심의 디자인 사고방식을 익히고, 실제 앱과 웹사이트 디자인을 해봅니다.")
                .level(ClassLevel.초급)
                .onoff(OnOffType.오프라인)
                .mainImage("/img/default_class.jpg")
                .detailContent("사용자 경험을 고려한 디자인 방법론을 배웁니다. 피그마, 어도비 XD 등의 도구 사용법도 함께 익힐 수 있습니다.")
                .mentoInfo("UX 디자이너로 3년간 다양한 앱 디자인 경험을 보유하고 있습니다.")
                .spaceInfo("강남역 근처 디자인 스튜디오에서 진행됩니다.")
                .mentor(mentor2)
                .category(design)
                .region(seoul)
                .build();
                
        ClassEntity class3 = ClassEntity.builder()
                .title("이탈리아 요리 마스터")
                .curriculum("파스타, 피자, 리조또 등 정통 이탈리아 요리를 배워봅니다.")
                .level(ClassLevel.중급)
                .onoff(OnOffType.오프라인)
                .mainImage("/img/default_class.jpg")
                .detailContent("정통 이탈리아 요리의 비법을 배워보세요. 직접 반죽부터 만들어보는 체험형 수업입니다.")
                .mentoInfo("이탈리아에서 2년간 요리를 배운 전문 셰프입니다.")
                .spaceInfo("전문 요리 교실에서 모든 재료와 도구가 제공됩니다.")
                .mentor(mentor3)
                .category(cooking)
                .region(busan)
                .build();
                
        ClassEntity class4 = ClassEntity.builder()
                .title("웹 개발 심화 과정")
                .curriculum("React와 Node.js를 활용한 풀스택 웹 개발을 배웁니다.")
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
                .title("모바일 앱 디자인")
                .curriculum("iOS와 Android 앱 디자인 가이드라인을 학습합니다.")
                .level(ClassLevel.중급)
                .onoff(OnOffType.오프라인)
                .mainImage("/img/default_class.jpg")
                .detailContent("모바일 앱의 UX/UI 디자인 방법론을 배우고 실제 앱 화면을 디자인해봅니다.")
                .mentoInfo("모바일 앱 디자이너로 50여 개 앱 디자인 경험이 있습니다.")
                .spaceInfo("홍대 디자인 스튜디오에서 진행되며 모든 디자인 도구가 제공됩니다.")
                .mentor(mentor2)
                .category(design)
                .region(seoul)
                .build();
                
        ClassEntity class6 = ClassEntity.builder()
                .title("프랑스 디저트 클래스")
                .curriculum("마카롱, 타르트, 크림브륄레 등 프랑스 디저트를 만들어봅니다.")
                .level(ClassLevel.초급)
                .onoff(OnOffType.오프라인)
                .mainImage("/img/default_class.jpg")
                .detailContent("프랑스 전통 디저트의 제조법을 배워보세요. 기본 반죽부터 데코레이션까지 모든 과정을 체험할 수 있습니다.")
                .mentoInfo("프랑스 르 코르동 블루 출신 파티시에입니다.")
                .spaceInfo("전문 제과 실습실에서 개인별 작업대가 제공됩니다.")
                .mentor(mentor3)
                .category(cooking)
                .region(seoul)
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
