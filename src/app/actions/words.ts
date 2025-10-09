'use server';

import { WordData } from '@/types/word';

// 품사를 한국어로 변환
function convertPartOfSpeech(pos: string): string {
  const posMap: Record<string, string> = {
    'n': '명사',
    'v': '동사',
    'adj': '형용사',
    'adv': '부사',
    'prep': '전치사',
    'pron': '대명사',
    'conj': '접속사',
    'interj': '감탄사',
    'u': '기타'
  };

  return posMap[pos];
}

export async function getRandomWordFromAPI(): Promise<WordData | null> {
  try {
    const randomChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));

    const response = await fetch(
      `https://api.datamuse.com/words?sp=${randomChar}*&max=10&md=d`
    );

    if (!response.ok) {
      throw new Error(`Datamuse API 호출 실패: ${response.status}`);
    }

    const data = await response.json();
    if (!data || data.length === 0) {
      return null;
    }
    // 랜덤하게 하나 선택
    const randomWord = data[Math.floor(Math.random() * data.length)];

    // 품사 추출 및 한국어 변환
    const posAbbr = randomWord.defs?.[0]?.split('\t')[0] || 'u';
    const partOfSpeechKorean = convertPartOfSpeech(posAbbr);

    // 영어 정의 추출 (fallback용)
    const englishDefinition = randomWord.defs?.[0]?.split('\t')[1] || '';

    return {
      word: randomWord.word,
      partOfSpeech: partOfSpeechKorean,
      korean: '',
      englishDef: englishDefinition
    };
  } catch {
    return null;
  }
}

export async function translateToKorean(text: string): Promise<string> {
  try {
    const deepLApiKey = process.env.DEEPL_API_KEY;

    if (!deepLApiKey) {
      throw new Error('DeepL API 키가 설정되지 않았습니다.');
    }

    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${deepLApiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        text: text,
        target_lang: 'KO',
        source_lang: 'EN'
      })
    });

    if (!response.ok) {
      throw new Error(`DeepL API 호출 실패: ${response.status}`);
    }

    const data = await response.json();
    return data.translations[0].text;
  } catch {
    return text;
  }
}

// 완전한 단어 데이터 생성 (API + 번역)
export async function getCompleteWordData(): Promise<WordData | null> {
  try {
    // 1. Words API에서 랜덤 단어 가져오기
    const wordData = await getRandomWordFromAPI();

    if (!wordData) {
      return null;
    }

    // 2. 단어 자체를 한국어로 번역 (1차 시도)
    let koreanTranslation = await translateToKorean(wordData.word);

    // 3. 번역 실패 체크 (번역 결과가 원래 단어와 같거나 비슷하면 실패)
    const isTranslationFailed =
      koreanTranslation.toLowerCase() === wordData.word.toLowerCase() ||
      koreanTranslation === wordData.word;

    // 4. 번역 실패 시 → 영어 정의를 번역 (2차 시도)
    if (isTranslationFailed && wordData.englishDef) {
      koreanTranslation = await translateToKorean(wordData.englishDef);
    }

    const result = {
      word: wordData.word,
      korean: koreanTranslation,
      partOfSpeech: wordData.partOfSpeech
    };

    return result;
  } catch {
    return null;
  }
}

// 🚀 병렬로 여러 단어 가져오기
export async function getMultipleRandomWords(
  count: number = 5
): Promise<WordData[]> {
  // Promise.all로 병렬 처리
  const promises = Array(count)
    .fill(null)
    .map(() => getCompleteWordData());

  const results = await Promise.all(promises);

  const words = results.filter((word): word is WordData => word !== null);

  return words;
}

// 📝 맞춘 단어 저장 (Server Action)
export async function saveLearnedWord(wordData: WordData): Promise<void> {
  // 서버에 저장하는 척 (실제로는 시간 지연만)
  await new Promise(resolve => setTimeout(resolve, 500));

  // 실제로는 여기서 DB에 저장:
  // await prisma.learnedWord.create({ data: { word: wordData.word } });

  console.log('✅ 맞춘 단어 저장:', wordData.word);
}

// 📕 틀린 단어 오답노트에 저장 (Server Action)
export async function saveWrongWord(wordData: WordData): Promise<void> {
  // 서버에 저장하는 척 (실제로는 시간 지연만)
  await new Promise(resolve => setTimeout(resolve, 500));

  // 실제로는 여기서 DB에 저장:
  // await prisma.wrongNote.create({ data: wordData });

  console.log('📕 오답노트 저장:', wordData.word);
}
