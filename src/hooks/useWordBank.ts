'use client';

import { useState, useEffect } from 'react';
import {
  loadData,
  updateSettings,
  updateWordStatus,
  getLearnedWords,
  getWrongWords,
  getStatistics,
  getTodayWords,
  setTodayWords,
  addWords,
  markSessionComplete,
  getUnseenWords,
  getTodayRemainingWords,
  getTodayProgress,
  selectTodayWords,
  needsMoreWords
} from '@/lib/storage';
import {
  WordProgress,
  AppSettings,
  Statistics,
  TodayProgress
} from '@/types/word';

export function useWordBank() {
  const [settings, setSettings] = useState<AppSettings>({ dailyLimit: 10 });
  const [statistics, setStatistics] = useState<Statistics>({
    total: 0,
    learned: 0,
    wrong: 0,
    unseen: 0,
    todayProgress: 0,
    todayLimit: 10
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    const data = loadData();
    setSettings(data.settings);
    setStatistics(getStatistics());
    setIsLoaded(true);
  }, []);

  // 설정 업데이트
  const updateDailyLimit = (limit: number) => {
    updateSettings({ dailyLimit: limit });
    setSettings({ dailyLimit: limit });
    refreshStatistics();
  };

  // 통계 새로고침
  const refreshStatistics = () => {
    setStatistics(getStatistics());
  };

  // 단어 추가
  const addNewWords = (words: WordProgress[]) => {
    addWords(words);
    refreshStatistics();
  };

  // 단어 상태 업데이트
  const markWordAsLearned = (word: string) => {
    updateWordStatus(word, 'learned');
    refreshStatistics();
  };

  const markWordAsWrong = (word: string) => {
    updateWordStatus(word, 'wrong', true);
    refreshStatistics();
  };

  const moveWrongToLearned = (word: string) => {
    updateWordStatus(word, 'learned');
    refreshStatistics();
  };

  // 오늘의 학습 단어 가져오기
  const loadTodayWords = (): WordProgress[] => {
    return getTodayWords();
  };

  // 오늘의 학습 단어 설정
  const setTodayStudyWords = (words: string[]) => {
    setTodayWords(words);
    refreshStatistics();
  };

  // 학습 완료
  const completeSession = () => {
    markSessionComplete();
    refreshStatistics();
  };

  // 학습 가능한 단어 가져오기
  const getAvailableWords = (): WordProgress[] => {
    return getUnseenWords();
  };

  // 오늘의 남은 단어 가져오기
  const getRemainingWords = (): WordProgress[] => {
    return getTodayRemainingWords();
  };

  // 오늘의 진행 상황
  const getTodayProgressInfo = (): TodayProgress => {
    return getTodayProgress();
  };

  // 오늘의 단어 선택
  const chooseTodayWords = (): string[] => {
    const words = selectTodayWords();
    refreshStatistics();
    return words;
  };

  // 단어 풀 부족 여부
  const checkNeedsMoreWords = (): boolean => {
    return needsMoreWords();
  };

  return {
    // 상태
    settings,
    statistics,
    isLoaded,

    // 설정 관련
    updateDailyLimit,

    // 단어 관리
    addNewWords,
    markWordAsLearned,
    markWordAsWrong,
    moveWrongToLearned,

    // 학습 세션 관리
    loadTodayWords,
    setTodayStudyWords,
    completeSession,
    getAvailableWords,
    getRemainingWords,
    getTodayProgressInfo,
    chooseTodayWords,
    checkNeedsMoreWords,

    // 데이터 조회
    getLearnedWords,
    getWrongWords,

    // 기타
    refreshStatistics
  };
}
