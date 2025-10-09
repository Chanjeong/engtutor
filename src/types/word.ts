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
