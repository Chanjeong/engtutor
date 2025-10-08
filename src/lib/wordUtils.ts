import { WordData } from '@/app/actions/words';
import { WordProgress } from '@/types/word';

// WordData를 WordProgress로 변환
export function convertToWordProgress(wordData: WordData): WordProgress {
  return {
    word: wordData.word,
    korean: wordData.korean,
    english: wordData.english,
    partOfSpeech: wordData.partOfSpeech,
    example: wordData.example,
    phonetic: wordData.phonetic,
    status: 'unseen',
    lastStudied: null,
    wrongCount: 0,
    learnedDate: null
  };
}

// 여러 WordData를 WordProgress 배열로 변환
export function convertWordsToProgress(words: WordData[]): WordProgress[] {
  return words.map(convertToWordProgress);
}
