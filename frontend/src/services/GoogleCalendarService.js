/**
 * Google Calendar API Service
 * React 애플리케이션에서 Google Calendar 연동을 위한 서비스
 */

class GoogleCalendarService {
  constructor() {
    this.config = {
      apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
      clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      discoveryDoc: 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
      scopes: 'https://www.googleapis.com/auth/calendar'
    };
    
    // 환경변수 확인
    if (!this.config.apiKey || !this.config.clientId) {
      console.error('Google API 설정이 누락되었습니다. .env 파일을 확인하세요.');
    }
    
    this.isInitialized = false;
    this.isSignedIn = false;
  }

  /**
   * Google API 초기화
   */
  async initialize() {
    try {
      if (this.isInitialized) return true;

      // gapi 라이브러리가 로드될 때까지 대기
      await this.waitForGapi();

      // Google API 클라이언트 초기화
      await new Promise((resolve, reject) => {
        window.gapi.load('client', async () => {
          try {
            await window.gapi.client.init({
              apiKey: this.config.apiKey,
              discoveryDocs: [this.config.discoveryDoc]
            });
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      });

      // Google Identity Services 초기화
      await this.initializeGSI();

      this.isInitialized = true;
      console.log('Google Calendar API 초기화 완료');
      return true;
    } catch (error) {
      console.error('Google Calendar API 초기화 실패:', error);
      throw error;
    }
  }

  /**
   * gapi 라이브러리 로드 대기
   */
  waitForGapi() {
    return new Promise((resolve, reject) => {
      const checkGapi = () => {
        if (window.gapi) {
          resolve();
        } else {
          setTimeout(checkGapi, 100);
        }
      };
      
      // 10초 후 타임아웃
      setTimeout(() => reject(new Error('Google API 로드 타임아웃')), 10000);
      checkGapi();
    });
  }

  /**
   * Google Identity Services 초기화
   */
  async initializeGSI() {
    return new Promise((resolve, reject) => {
      if (!window.google?.accounts) {
        reject(new Error('Google Identity Services가 로드되지 않았습니다'));
        return;
      }

      try {
        window.google.accounts.id.initialize({
          client_id: this.config.clientId
        });
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 구글 계정 로그인 (redirect_uri_mismatch 해결 버전)
   */
  signIn() {
    return new Promise((resolve, reject) => {
      if (!window.google?.accounts?.oauth2) {
        reject(new Error('Google OAuth2가 초기화되지 않았습니다'));
        return;
      }

      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: this.config.clientId,
        scope: this.config.scopes,
        callback: (response) => {
          if (response.error) {
            console.error('로그인 실패:', response);
            reject(response);
          } else {
            this.isSignedIn = true;
            console.log('로그인 성공');
            resolve(response);
          }
        }
      });

      tokenClient.requestAccessToken({prompt: 'consent'});
    });
  }

  /**
   * 로그인 상태 확인
   */
  checkAuthStatus() {
    try {
      const token = window.gapi?.client?.getToken();
      this.isSignedIn = !!token;
      return this.isSignedIn;
    } catch (error) {
      console.error('인증 상태 확인 실패:', error);
      return false;
    }
  }

  /**
   * '잇다' 캘린더 찾기 또는 생성
   */
  async findOrCreateItdaCalendar() {
    try {
      // 인증 확인
      if (!this.checkAuthStatus()) {
        await this.signIn();
      }

      // 기존 캘린더 목록 가져오기
      const response = await window.gapi.client.calendar.calendarList.list();
      const calendars = response.result.items;

      // '잇다' 캘린더 찾기
      const itdaCalendar = calendars.find(cal => cal.summary === '잇다');

      if (itdaCalendar) {
        console.log('기존 잇다 캘린더 발견:', itdaCalendar.id);
        return itdaCalendar.id;
      } else {
        // '잇다' 캘린더 생성
        console.log('잇다 캘린더 생성 중...');
        const newCalendar = await window.gapi.client.calendar.calendars.insert({
          resource: {
            summary: '잇다',
            description: '잇다 클래스 일정',
            timeZone: 'Asia/Seoul'
          }
        });
        
        console.log('잇다 캘린더 생성 완료:', newCalendar.result.id);
        return newCalendar.result.id;
      }
    } catch (error) {
      console.error('캘린더 찾기/생성 중 오류:', error);
      throw error;
    }
  }

  /**
   * 캘린더에 클래스 이벤트 추가
   */
  async addClassToCalendar(classInfo) {
    try {
      // 초기화 확인
      if (!this.isInitialized) {
        await this.initialize();
      }

      // 인증 확인
      if (!this.checkAuthStatus()) {
        await this.signIn();
      }

      // '잇다' 캘린더 ID 가져오기
      const calendarId = await this.findOrCreateItdaCalendar();

      // 이벤트 생성
      const event = {
        summary: classInfo.title,
        description: classInfo.description || `${classInfo.title} - ${classInfo.instructor || ''}`,
        start: {
          dateTime: classInfo.startDateTime,
          timeZone: 'Asia/Seoul'
        },
        end: {
          dateTime: classInfo.endDateTime,
          timeZone: 'Asia/Seoul'
        },
        location: classInfo.location || '',
        colorId: '2', // 초록색
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 30 },
            { method: 'email', minutes: 1440 } // 하루 전
          ]
        }
      };

      // 캘린더에 이벤트 추가
      const response = await window.gapi.client.calendar.events.insert({
        calendarId: calendarId,
        resource: event
      });

      console.log('캘린더 이벤트 생성 완료:', response.result);
      return response.result;
    } catch (error) {
      console.error('캘린더 이벤트 추가 중 오류:', error);
      throw error;
    }
  }

  /**
   * 클래스 이벤트 추가 (React 컴포넌트 호환)
   */
  async addClassEvent(title, selectedDate, classData) {
    try {
      // 시간 설정 (기본값 사용)
      const startTime = '10:00';
      const endTime = '11:00';
      
      const startDateTime = this.formatDateTime(selectedDate, startTime);
      const endDateTime = this.formatDateTime(selectedDate, endTime);
      
      const eventData = {
        title: title,
        description: `${title} 클래스`,
        startDateTime: startDateTime,
        endDateTime: endDateTime,
        location: classData.regionInfo?.name || classData.regionName || '잇다 스튜디오',
        instructor: classData.mentorProfile?.name || classData.mentorName
      };
      
      return await this.addClassToCalendar(eventData);
    } catch (error) {
      console.error('클래스 이벤트 추가 실패:', error);
      throw error;
    }
  }

  /**
   * 날짜와 시간을 ISO 8601 형식으로 변환
   */
  formatDateTime(date, time) {
    return `${date}T${time}:00+09:00`;
  }

  /**
   * 로그인 상태 확인 (React 컴포넌트에서 사용)
   */
  checkSignInStatus() {
    return this.checkAuthStatus();
  }

  /**
   * 초기화 (React 컴포넌트에서 사용)
   */
  async init() {
    return await this.initialize();
  }

  /**
   * 서비스 상태 확인
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      isSignedIn: this.isSignedIn,
      hasGapi: !!window.gapi,
      hasGoogleAuth: !!window.google?.accounts?.oauth2
    };
  }
}

// 싱글톤 인스턴스 생성
const googleCalendarService = new GoogleCalendarService();

export default googleCalendarService;