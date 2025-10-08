import {
  StorageData,
  WordProgress,
  WordStatus,
  AppSettings,
  Statistics,
  TodayProgress
} from '@/types/word';

const STORAGE_KEY = 'engtutor_data';
const STORAGE_VERSION = '1.0.0';

// 기본 설정값
const DEFAULT_SETTINGS: AppSettings = {
  dailyLimit: 10
};

// 기본 데이터 구조
const DEFAULT_DATA: StorageData = {
  settings: DEFAULT_SETTINGS,
  wordBank: [],
  currentSession: {
    date: getTodayDate(),
    wordsLoaded: [],
    completed: false
  },
  version: STORAGE_VERSION
};

// 오늘 날짜 가져오기 (YYYY-MM-DD)
export function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// LocalStorage에서 데이터 불러오기
export function loadData(): StorageData {
  if (typeof window === 'undefined') {
    return DEFAULT_DATA;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_DATA;
    }

    const data: StorageData = JSON.parse(stored);

    // 날짜가 바뀌었으면 새로운 세션 시작
    if (data.currentSession.date !== getTodayDate()) {
      data.currentSession = {
        date: getTodayDate(),
        wordsLoaded: [],
        completed: false
      };
      saveData(data);
    }

    return data;
  } catch {
    return DEFAULT_DATA;
  }
}

// LocalStorage에 데이터 저장
export function saveData(data: StorageData): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    alert('저장하는데 실패하였습니다');
  }
}

// 설정 업데이트
export function updateSettings(settings: Partial<AppSettings>): void {
  const data = loadData();
  data.settings = { ...data.settings, ...settings };
  saveData(data);
}

// 단어 추가 (새로운 단어를 word bank에 추가)
export function addWords(words: WordProgress[]): void {
  const data = loadData();

  // 중복 체크 (이미 있는 단어는 추가하지 않음)
  const existingWords = new Set(data.wordBank.map(w => w.word));
  const newWords = words.filter(w => !existingWords.has(w.word));

  data.wordBank.push(...newWords);
  saveData(data);
}

// 단어 상태 업데이트
export function updateWordStatus(
  word: string,
  status: WordStatus,
  incrementWrongCount: boolean = false
): void {
  const data = loadData();
  const wordData = data.wordBank.find(w => w.word === word);

  if (wordData) {
    wordData.status = status;
    wordData.lastStudied = getTodayDate();

    if (status === 'learned') {
      wordData.learnedDate = getTodayDate();
    }

    if (incrementWrongCount) {
      wordData.wrongCount += 1;
    }

    saveData(data);
  }
}

// 오늘의 학습 단어 가져오기
export function getTodayWords(): WordProgress[] {
  const data = loadData();

  // 이미 오늘 단어를 로드했으면 그 단어들 반환
  if (data.currentSession.wordsLoaded.length > 0) {
    return data.wordBank.filter(w =>
      data.currentSession.wordsLoaded.includes(w.word)
    );
  }

  return [];
}

// 오늘의 학습 단어 설정 (처음 로드 시)
export function setTodayWords(words: string[]): void {
  const data = loadData();
  data.currentSession.wordsLoaded = words;
  saveData(data);
}

// 학습 완료 처리
export function markSessionComplete(): void {
  const data = loadData();
  data.currentSession.completed = true;
  saveData(data);
}

// 학습 가능한 단어 가져오기 (아직 안 본 단어들)
export function getUnseenWords(): WordProgress[] {
  const data = loadData();
  return data.wordBank.filter(w => w.status === 'unseen');
}

// 배운 단어 가져오기
export function getLearnedWords(): WordProgress[] {
  const data = loadData();
  return data.wordBank.filter(w => w.status === 'learned');
}

// 틀린 단어 가져오기
export function getWrongWords(): WordProgress[] {
  const data = loadData();
  return data.wordBank.filter(w => w.status === 'wrong');
}

// 통계 데이터 가져오기
export function getStatistics(): Statistics {
  const data = loadData();

  return {
    total: data.wordBank.length,
    learned: data.wordBank.filter(w => w.status === 'learned').length,
    wrong: data.wordBank.filter(w => w.status === 'wrong').length,
    unseen: data.wordBank.filter(w => w.status === 'unseen').length,
    todayProgress: data.currentSession.wordsLoaded.length,
    todayLimit: data.settings.dailyLimit
  };
}

// 오늘의 남은 단어 가져오기 (아직 학습 안 한 단어)
export function getTodayRemainingWords(): WordProgress[] {
  const data = loadData();

  // 오늘 로드된 단어가 없으면 빈 배열 반환
  if (data.currentSession.wordsLoaded.length === 0) {
    return [];
  }

  // 오늘의 단어 중에서 unseen 상태인 것만 반환
  return data.wordBank.filter(
    w =>
      data.currentSession.wordsLoaded.includes(w.word) && w.status === 'unseen'
  );
}

// 오늘 학습한 단어 개수 (learned + wrong)
export function getTodayCompletedCount(): number {
  const data = loadData();

  if (data.currentSession.wordsLoaded.length === 0) {
    return 0;
  }

  return data.wordBank.filter(
    w =>
      data.currentSession.wordsLoaded.includes(w.word) &&
      (w.status === 'learned' || w.status === 'wrong')
  ).length;
}

// 오늘의 학습 세션이 완료되었는지 확인
export function isTodaySessionComplete(): boolean {
  const data = loadData();
  return data.currentSession.completed;
}

// 오늘 학습 진행 상황 가져오기
export function getTodayProgress(): TodayProgress {
  const data = loadData();
  const total = data.currentSession.wordsLoaded.length;
  const completed = getTodayCompletedCount();
  const remaining = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    remaining,
    percentage,
    isComplete: remaining === 0 && total > 0
  };
}

// 오늘의 단어 선택 (unseen 단어에서 dailyLimit만큼)
export function selectTodayWords(): string[] {
  const data = loadData();
  const unseenWords = getUnseenWords();
  const limit = data.settings.dailyLimit;

  // unseen 단어에서 설정한 개수만큼 선택
  const selected = unseenWords.slice(0, limit).map(w => w.word);

  // currentSession에 저장
  data.currentSession.wordsLoaded = selected;
  data.currentSession.completed = false;
  saveData(data);

  return selected;
}

// 단어 풀이 충분한지 확인 (최소 20개 유지)
export function needsMoreWords(): boolean {
  const unseenWords = getUnseenWords();
  return unseenWords.length < 20;
}

// 데이터 초기화 (개발/테스트용)
export function resetData(): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem(STORAGE_KEY);
}
