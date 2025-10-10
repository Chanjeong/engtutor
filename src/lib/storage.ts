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
  }
};
