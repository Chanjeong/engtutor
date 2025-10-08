'use server';

export interface WordData {
  word: string;
  korean: string;
  english: string;
  partOfSpeech?: string;
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

    return {
      word: randomWord.word,
      english:
        randomWord.defs?.[0]?.split('\t')[1] || 'No definition available',
      partOfSpeech: randomWord.defs?.[0]?.split('\t')[0] || 'unknown',
      korean: '' // 번역 API로 채워질 예정
    };
  } catch {
    return null;
  }
}

// DeepL API로 한국어 번역 (고품질!)
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
    console.log(data);
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

    // 2. 한국어 번역
    const koreanTranslation = await translateToKorean(wordData.english);

    const result = {
      ...wordData,
      korean: koreanTranslation
    };

    return result;
  } catch {
    return null;
  }
}

// 🚀 병렬로 여러 단어 가져오기 (빠름!)
export async function getMultipleRandomWords(
  count: number = 10
): Promise<WordData[]> {
  // Promise.all로 병렬 처리
  const promises = Array(count)
    .fill(null)
    .map(() => getCompleteWordData());

  const results = await Promise.all(promises);

  // null 제거
  const words = results.filter((word): word is WordData => word !== null);

  return words;
}
