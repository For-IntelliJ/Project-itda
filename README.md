# Project-itda
신구대 3-C 1st project 멘토-멘티 중계 웹 제작

## 🔧 백엔드 실행 방법

```bash
cd backend
cp src/main/resources/application-example.properties src/main/resources/application.properties
./gradlew bootRun
```
## 🔧 프론트엔드 실행 방법
```bash
cd frontend
cp .env.example .env
yarn install  
yarn start     
```

### ERD
| 테이블명             | 설명                    |
|------------------|-----------------------|
| `member`         | 회원 정보 (멘토/멘티)         |
| `mentor_profile` | 멘토 신청, 자기소개, 상태       |
| `class`          | 강의 정보                 |
| `category`       | 강의 카테고리               |
| `region`         | 지역명                   |
| `class_like`     | 강의 찜                  |
| `board`          | 커뮤니티 글 (후기, 일반 게시판 등) |
| `comment`        | 게시글 댓글                |
| `faq` (선택)       | 자주 묻는 질문              |
| ~~`message`~~    | ~~1:1 쪽지~~            |

1. member : 회원 정보 (멘토/멘티)

| 테이블명     | 필드명         | 타입                      | 설명            | 제약조건 / 관계           |
|----------| ----------- | ----------------------- | ------------- | ------------------- |
| `member` | id          | BIGINT                  | 사용자 ID (PK)   | PK, AUTO\_INCREMENT |
|          | username    | VARCHAR(50)             | 로그인용 ID       | UNIQUE, NOT NULL    |
|          | email       | VARCHAR(100)            | 이메일           | UNIQUE, NOT NULL    |
|          | password    | VARCHAR(255)            | 비밀번호 (암호화)    |                     |
|          | name        | VARCHAR(50)             | 실명             |                |
|          | nickname    | VARCHAR(50)             | 닉네임           | UNIQUE              |
|          | phone       | VARCHAR(20)             | 전화번호          | UNIQUE              |
|          | gender      | ENUM('M','F')           | 성별            |                     |
|          | role        | ENUM('mentor','mentee') | 사용자 역할        | DEFAULT 'mentee'    |
|          | login\_type | ENUM('local','kakao')   | 로그인 방식        | DEFAULT 'local'     |
|          | kakao\_id   | VARCHAR(100)            | 카카오 로그인 시 식별자 | nullable            |
|          | created\_at | TIMESTAMP               | 가입일           | DEFAULT now()       |
2. mentor_profile : 멘토 신청, 자기소개, 상태
   멘토 신청 시 필요한 정보(자기소개, 경력 등) + 승인 상태를 mentor_profile 테이블에 따로 분리해서 관리

| 테이블명             | 필드명      | 타입                                    | 설명          | 제약조건 / 관계           |
| ---------------- | -------- | ------------------------------------- | ----------- | ------------------- |
| `mentor_profile` | id       | BIGINT                                | 프로필 ID (PK) | PK, AUTO\_INCREMENT |
|                  | user\_id | BIGINT                                | 연결된 사용자 ID  | FK → user(id)       |
|                  | intro    | TEXT                                  | 멘토 자기소개     |                     |
|                  | status   | ENUM('pending','approved','rejected') | 승인 상태       | DEFAULT 'pending'   |
|                  | career   | VARCHAR(255)                          | 경력 요약       | nullable            |
3. category : 강의 카테고리
   클래스(class)가 어떤 분야인지 구분하기 위한 카테고리 정보를 저장
   예: "프로그래밍", "디자인", "음악", "어학" 등
   클래스와는 다대일(N:1) 관계 (JPA에서는 @ManyToOne으로 매핑)

   | 필드명    | 타입          | 설명      | 제약조건                |
   | ------ | ----------- | ------- | ------------------- |
   | `id`   | BIGINT      | 카테고리 ID | PK, AUTO\_INCREMENT |
   | `name` | VARCHAR(50) | 카테고리명   | UNIQUE, NOT NULL    |


4. region : 지역명
   강의가 진행되는 지역 정보 관리
   → 오프라인 강의 위치 필터링이나 지역별 검색 기능에 사용됨
   → class.region_id가 이 테이블을 참조함

 | 필드명    | 타입          | 설명    | 제약조건                |
   | ------ | ----------- | ----- | ------------------- |
   | `id`   | BIGINT      | 지역 ID | PK, AUTO\_INCREMENT |
   | `name` | VARCHAR(50) | 지역명   | UNIQUE, NOT NULL    |


5. class : 강의 정보
   멘토가 등록한 클래스(강의) 정보를 저장
   → mentor_profile, category, region과 연결됨
   → 프론트에 노출될 강의 카드의 모든 데이터는 여기서 가져감

   | 필드명              | 타입                   | 설명         | 제약조건 / 관계                               |
   | ---------------- | -------------------- | ---------- | --------------------------------------- |
   | `id`             | BIGINT               | 강의 ID      | PK, AUTO\_INCREMENT                     |
   | `mentor_id`      | BIGINT               | 멘토 사용자 ID  | FK → `user(id)` 또는 `mentor_profile(id)` |
   | `title`          | VARCHAR(100)         | 강의 제목      | NOT NULL                                |
   | `category_id`    | BIGINT               | 카테고리       | FK → `category(id)`                     |
   | `region_id`      | BIGINT               | 지역 정보      | FK → `region(id)`                       |
   | `curriculum`     | TEXT                 | 커리큘럼       | NULL 가능                                 |
   | `level`          | ENUM('초급','중급','고급') | 강의 난이도     | DEFAULT '초급'                            |
   | `onoff`          | ENUM('온라인','오프라인')   | 강의 방식      | DEFAULT '온라인'                           |
   | `main_image`     | VARCHAR(255)         | 대표 이미지 URL | NULL 가능                                 |
   | `detail_content` | TEXT                 | 상세 설명      | NULL 가능                                 |
   | `created_at`     | TIMESTAMP            | 강의 등록일     | DEFAULT CURRENT\_TIMESTAMP              |

6. class_like : 강의 찜
   멘티가 마음에 드는 강의를 찜하면 저장
   클래스와 유저 간의 N:N 관계를 중간 테이블로 구현
   @ManyToOne → user, class 둘 다

| 필드명        | 타입                    | 설명               | 제약조건 / 관계                  |
| ---------- | --------------------- |------------------| -------------------------- |
| `id`       | BIGINT                | 찜 ID             | PK, AUTO\_INCREMENT        |
| `user_id`  | BIGINT                | 찜한 사용자 ID        | FK → `user(id)`            |
| `class_id` | BIGINT                | 찜한 강의 ID         | FK → `class(id)`           |
| `liked_at` | TIMESTAMP             | 찜한 시간(프론트에서 정렬용) | DEFAULT CURRENT\_TIMESTAMP |
| (UNIQUE)   | (user\_id, class\_id) | 중복 찜 방지          | UNIQUE 제약조건                |

7. board : 커뮤니티 글
   자유게시판 및 질문/답변 게시판의 게시글 데이터를 통합 관리하기 위한 테이블
   게시판의 종류(type)에 따라 
   free: 자유글 (예: 후기, 잡담 등)
   question: 질문글 (답변은 comment 테이블로 연결)
   모든 게시글은 user와 연결되고, 댓글 기능은 별도 comment로 관리

 | 필드명          | 타입                       | 설명     |
   | ------------ | ------------------------ | ------ |
   | `id`         | BIGINT                   | 게시글 ID |
   | `writer_id`  | BIGINT                   | 작성자    |
   | `type`       | ENUM('free', 'question') | 게시판 유형 |
   | `title`      | VARCHAR(100)             | 제목     |
   | `content`    | TEXT                     | 본문     |
   | `hits`       | INT                      | 조회수    |
   | `created_at` | TIMESTAMP                | 작성일    |

8. comment : 게시글 댓글
   게시글(board)에 달린 댓글을 저장하는 테이블.
   작성자(user)와 게시글과 연결되며, ~~추후 대댓글 구조(parent_id)로 확장 가능~~

| 필드명          | 타입        | 설명        | 제약조건 / 관계                  |
| ------------ | --------- | --------- | -------------------------- |
| `id`         | BIGINT    | 댓글 ID     | PK, AUTO\_INCREMENT        |
| `board_id`   | BIGINT    | 소속 게시글 ID | FK → `board(id)`           |
| `writer_id`  | BIGINT    | 작성자 ID    | FK → `user(id)`            |
| `content`    | TEXT      | 댓글 내용     | NOT NULL                   |
| `created_at` | TIMESTAMP | 작성 시간     | DEFAULT CURRENT\_TIMESTAMP |

9. faq (선택)
   관리자가 등록한 자주 묻는 질문(FAQ)과 그에 대한 답변을 저장하는 테이블
   하드 코딩해도 되는데 혹시 몰라서 테이블로 만들어둠

| 필드명          | 타입           | 설명        | 제약조건 / 관계                  |
| ------------ | ------------ | --------- | -------------------------- |
| `id`         | BIGINT       | FAQ ID    | PK, AUTO\_INCREMENT        |
| `question`   | VARCHAR(255) | 질문 제목     | NOT NULL                   |
| `answer`     | TEXT         | 답변 내용     | NULL 가능                    |
| `category`   | VARCHAR(100) | 질문 분류(선택) | NULL 가능                    |
| `writer_id`  | BIGINT       | 작성자 ID    | FK → `user(id)` (선택사항)     |
| `created_at` | TIMESTAMP    | 등록일       | DEFAULT CURRENT\_TIMESTAMP |

10. message (선택)
   1:1 쪽지 기능은 구현하지 않기로 했지만, 추후 기능 확장을 위해 생성
    사용자 간 1:1 메시지(쪽지) 내역을 저장하는 테이블
    보낸 사람과 받은 사람 정보, 메시지 내용, 전송 시간 등을 저장

| 필드명           | 타입        | 설명       | 제약조건 / 관계                  |
| ------------- | --------- | -------- | -------------------------- |
| `id`          | BIGINT    | 메시지 ID   | PK, AUTO\_INCREMENT        |
| `sender_id`   | BIGINT    | 보낸 사람 ID | FK → `user(id)`            |
| `receiver_id` | BIGINT    | 받은 사람 ID | FK → `user(id)`            |
| `content`     | TEXT      | 메시지 내용   | NOT NULL                   |
| `sent_at`     | TIMESTAMP | 보낸 시간    | DEFAULT CURRENT\_TIMESTAMP |

11. apply 테이블 설계 목적
   멘티가 멘토의 class에 신청한 정보를 저장
   신청 상태를 관리 (예: 대기, 승인, 거절)
   신청 일자 기록
    mentee_id는 member 테이블 참조하며, 반드시 role = 'MENTEE'임을 확인하는 로직 만들기

| 필드명          | 타입        | 설명         | 제약조건 / 관계                                             |
| ------------ | --------- | ---------- | ----------------------------------------------------- |
| `id`         | BIGINT    | 신청 ID      | PK, AUTO\_INCREMENT                                   |
| `class_id`   | BIGINT    | 신청한 클래스 ID | FK → `class(id)`                                      |
| `mentee_id`  | BIGINT    | 신청한 멘티 ID  | FK → `member(id)`                                     |
| `status`     | ENUM      | 신청 상태      | DEFAULT 'PENDING' ('PENDING', 'APPROVED', 'REJECTED') |
| `applied_at` | TIMESTAMP | 신청 일시      | DEFAULT CURRENT\_TIMESTAMP                            |

12. review 테이블 설계 목적
   멘티가 멘토의 class에 대한 후기를 작성
   후기 내용, 평점, 작성 일자 등을 저장

| 필드명          | 타입        | 설명         | 제약조건 / 관계                  |
| ------------ | --------- | ---------- | -------------------------- |
| `id`         | BIGINT    | 후기 ID      | PK, AUTO\_INCREMENT        |
| `class_id`   | BIGINT    | 수강한 클래스 ID | FK → `class(id)`           |
| `mentee_id`  | BIGINT    | 작성자 ID     | FK → `member(id)`          |
| `rating`     | INT       | 평점         | 1\~5 범위 체크                 |
| `content`    | TEXT      | 후기 내용      | NULL 가능                    |
| `created_at` | TIMESTAMP | 작성 시간      | DEFAULT CURRENT\_TIMESTAMP |

13. mentor_like : 즐겨찾는 멘토
   멘티가 즐겨찾는 멘토를 저장하는 테이블
   기능 개발은 미정이나, 추후 확장을 위해 생성

| 필드명          | 타입        | 설명        | 제약조건 / 관계                  |
| ------------ | --------- | --------- | -------------------------- |
| `id`         | BIGINT    | 즐겨찾기 ID   | PK, AUTO\_INCREMENT        |
| `member_id`  | BIGINT    | 좋아요 누른 유저 | FK → `member(id)`          |
| `mentor_id`  | BIGINT    | 대상 멘토 ID  | FK → `member(id)`          |
| `created_at` | TIMESTAMP | 등록 시각     | DEFAULT CURRENT\_TIMESTAMP |
