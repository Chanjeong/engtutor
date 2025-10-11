// 단어 상태 타입
export type WordStatus = 'unseen' | 'learned' | 'wrong';

// 단어 데이터 인터페이스 (API에서 가져온 원본 데이터)
export interface WordData {
  word: string; // 영어 단어 (예: "apple")
  korean: string; // 한국어 뜻 (예: "사과")
  partOfSpeech?: string; // 품사 (예: "명사")
  englishDef?: string; // 영어 정의 (fallback용)
}
export interface WordProgress {
  word: string;
  korean: string;
  english: string;
  partOfSpeech?: string;
  status: WordStatus;
  lastStudied: string | null; // ISO date string
  wrongCount: number;
  learnedDate: string | null; // 배운 날짜
}

// 앱 설정 인터페이스
export interface AppSettings {
  dailyLimit: number; // 하루 학습 단어 수 (5, 10, 20, 50, 100)
}

// 학습 세션 데이터
export interface StudySession {
  date: string; // YYYY-MM-DD
  wordsLoaded: string[]; // 오늘 로드된 단어 ID들
  completed: boolean; // 오늘 학습 완료 여부
}

// LocalStorage에 저장될 전체 데이터 구조
export interface StorageData {
  settings: AppSettings;
  wordBank: WordProgress[]; // 모든 단어
  currentSession: StudySession;
  version: string; // 데이터 버전 (마이그레이션용)
}

// 통계 데이터
export interface Statistics {
  total: number;
  learned: number;
  wrong: number;
  unseen: number;
  todayProgress: number; // 오늘 학습한 단어 수
  todayLimit: number; // 오늘 학습 목표
}

// 오늘 학습 진행 상황
export interface TodayProgress {
  total: number; // 오늘 목표 단어 수
  completed: number; // 완료한 단어 수
  remaining: number; // 남은 단어 수
  percentage: number; // 진행률 (0-100)
  isComplete: boolean; // 완료 여부
}

// === 통계 페이지 전용 타입들 ===

// 날짜별 학습 데이터 (차트용)
export interface DailyData {
  date: string; // YYYY-MM-DD
  learned: number; // 해당 날짜에 맞힌 단어 수
  wrong: number; // 해당 날짜에 틀린 단어 수
  total: number; // 해당 날짜 총 학습량
  dateLabel: string; // 화면 표시용 날짜 (예: "1/15")
}

// 단어 상태별 분포 데이터 (파이 차트용)
export interface DistributionData {
  name: string; // "맞힌 단어" | "틀린 단어"
  value: number; // 개수
  color: string; // 색상 코드
  emoji: string; // 이모지
  [key: string]: string | number; // Recharts를 위한 index signature
}

// 가장 많이 틀린 단어 정보
export interface WrongWord {
  word: string; // 영어 단어
  korean: string; // 한국어 뜻
  count: number; // 틀린 횟수
  lastWrong: string; // 마지막으로 틀린 날짜
}

// 통계 페이지 전체 데이터 (통합)
export interface StatsData {
  totalLearned: number; // 총 맞힌 단어
  totalWrong: number; // 총 틀린 단어
  totalReviews: number; // 총 복습 횟수
  successRate: number; // 정답률 (%)
  dailyData: DailyData[]; // 날짜별 데이터
  distributionData: DistributionData[]; // 분포 데이터
  mostWrong: WrongWord[]; // 가장 많이 틀린 단어 목록
  streak: number; // 연속 학습 일수
}
