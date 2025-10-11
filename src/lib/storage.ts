import { WordData } from '@/types/word';

export interface StoredWord extends WordData {
  savedAt: string;
  reviewCount?: number;
}

const STORAGE_KEYS = {
  LEARNED: 'engtutor_learned_words',
  WRONG: 'engtutor_wrong_words'
} as const;

export const storage = {
  saveLearnedWord(word: WordData): void {
    const learned = this.getLearnedWords();
    const exists = learned.some(w => w.word === word.word);
    if (exists) return;

    learned.push({
      ...word,
      savedAt: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEYS.LEARNED, JSON.stringify(learned));
  },

  saveWrongWord(word: WordData): void {
    const wrong = this.getWrongWords();
    const existingIndex = wrong.findIndex(w => w.word === word.word);

    if (existingIndex !== -1) {
      wrong[existingIndex].reviewCount =
        (wrong[existingIndex].reviewCount || 0) + 1;
      wrong[existingIndex].savedAt = new Date().toISOString();
    } else {
      wrong.push({
        ...word,
        savedAt: new Date().toISOString(),
        reviewCount: 1
      });
    }
    localStorage.setItem(STORAGE_KEYS.WRONG, JSON.stringify(wrong));
  },

  getLearnedWords(): StoredWord[] {
    const data = localStorage.getItem(STORAGE_KEYS.LEARNED);
    return data ? JSON.parse(data) : [];
  },

  getWrongWords(): StoredWord[] {
    const data = localStorage.getItem(STORAGE_KEYS.WRONG);
    return data ? JSON.parse(data) : [];
  },

  getStats() {
    const learned = this.getLearnedWords();
    const wrong = this.getWrongWords();

    return {
      totalLearned: learned.length,
      totalWrong: wrong.length,
      totalReviews: wrong.reduce((sum, w) => sum + (w.reviewCount || 0), 0),
      successRate:
        learned.length + wrong.length > 0
          ? Math.round((learned.length / (learned.length + wrong.length)) * 100)
          : 0
    };
  },

  exportData() {
    return {
      learned: this.getLearnedWords(),
      wrong: this.getWrongWords(),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
  },

  importData(data: ReturnType<typeof this.exportData>): void {
    if (data.learned) {
      localStorage.setItem(STORAGE_KEYS.LEARNED, JSON.stringify(data.learned));
    }
    if (data.wrong) {
      localStorage.setItem(STORAGE_KEYS.WRONG, JSON.stringify(data.wrong));
    }
  },

  clearAll(): void {
    localStorage.removeItem(STORAGE_KEYS.LEARNED);
    localStorage.removeItem(STORAGE_KEYS.WRONG);
  },

  removeFromWrongNote(word: string): void {
    const wrong = this.getWrongWords();
    const filtered = wrong.filter(w => w.word !== word);
    localStorage.setItem(STORAGE_KEYS.WRONG, JSON.stringify(filtered));
  },

  // 📊 통계용 메서드들

  /**
   * 날짜별 학습 데이터 가져오기
   * 최근 N일간의 맞힌/틀린 단어 수를 날짜별로 그룹화
   */
  getDailyStats(days: number = 7) {
    const learned = this.getLearnedWords();
    const wrong = this.getWrongWords();
    const allWords = [...learned, ...wrong];

    // 최근 N일의 날짜 배열 생성
    const dates: string[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]); // YYYY-MM-DD
    }

    // 날짜별로 데이터 그룹화
    const dailyData = dates.map(date => {
      const learnedCount = learned.filter(w =>
        w.savedAt.startsWith(date)
      ).length;
      const wrongCount = wrong.filter(w => w.savedAt.startsWith(date)).length;

      return {
        date,
        learned: learnedCount,
        wrong: wrongCount,
        total: learnedCount + wrongCount,
        // 날짜를 보기 좋게 포맷 (MM/DD)
        dateLabel: new Date(date).toLocaleDateString('ko-KR', {
          month: 'numeric',
          day: 'numeric'
        })
      };
    });

    return dailyData;
  },

  /**
   * 단어 상태별 분포 데이터
   * 파이 차트용
   */
  getDistributionData() {
    const stats = this.getStats();

    return [
      {
        name: '맞힌 단어',
        value: stats.totalLearned,
        color: '#10b981', // green-500
        emoji: '✅'
      },
      {
        name: '틀린 단어',
        value: stats.totalWrong,
        color: '#ef4444', // red-500
        emoji: '❌'
      }
    ];
  },

  /**
   * 가장 많이 틀린 단어 Top N
   */
  getMostWrongWords(limit: number = 5) {
    const wrong = this.getWrongWords();

    // reviewCount 기준으로 내림차순 정렬
    const sorted = [...wrong].sort(
      (a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)
    );

    return sorted.slice(0, limit).map(w => ({
      word: w.word,
      korean: w.korean,
      count: w.reviewCount || 0,
      lastWrong: new Date(w.savedAt).toLocaleDateString('ko-KR')
    }));
  },

  /**
   * 학습 스트릭(연속 일수) 계산
   */
  getStudyStreak() {
    const learned = this.getLearnedWords();
    const wrong = this.getWrongWords();
    const allWords = [...learned, ...wrong];

    if (allWords.length === 0) return 0;

    // 날짜만 추출하고 중복 제거
    const studyDates = Array.from(
      new Set(allWords.map(w => w.savedAt.split('T')[0]))
    )
      .sort()
      .reverse(); // 최신순 정렬

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const dateStr of studyDates) {
      const studyDate = new Date(dateStr);
      studyDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor(
        (currentDate.getTime() - studyDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === streak) {
        streak++;
        currentDate = studyDate;
      } else {
        break;
      }
    }

    return streak;
  },

  /**
   * 누적 학습 데이터 (시간에 따른 누적)
   */
  getCumulativeData(days: number = 30) {
    const learned = this.getLearnedWords();
    const dailyStats = this.getDailyStats(days);

    let cumulative = 0;
    return dailyStats.map(day => {
      cumulative += day.learned;
      return {
        ...day,
        cumulative
      };
    });
  }
};
