'use server';

export interface WordData {
  word: string;
  korean: string;
  english: string;
  example?: string;
  phonetic?: string;
  partOfSpeech?: string;
}

export interface WordsApiResponse {
  word: string;
  pronunciation?: {
    all?: string;
  };
  results?: {
    definition: string;
    partOfSpeech: string;
    examples?: string[];
  }[];
}

// Datamuse API에서 랜덤 단어 가져오기 (완전 무료!)
export async function getRandomWordFromAPI(): Promise<WordData | null> {
  try {
    console.log('Datamuse API 사용 (결제수단 불필요)');

    // 랜덤 단어 검색을 위한 랜덤 문자
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
      example: randomWord.defs?.[1]?.split('\t')[1] || undefined,
      phonetic: undefined,
      korean: '' // 번역 API로 채워질 예정
    };
  } catch (error) {
    console.error('Datamuse API 오류:', error);
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
    return data.translations[0].text;
  } catch (error) {
    console.error('DeepL 번역 API 오류:', error);
    return text; // 번역 실패 시 원문 반환
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

    return {
      ...wordData,
      korean: koreanTranslation
    };
  } catch (error) {
    console.error('완전한 단어 데이터 생성 오류:', error);
    return null;
  }
}

// 여러 단어 가져오기 (순차적으로 API 호출)
export async function getMultipleRandomWords(
  count: number = 5
): Promise<WordData[]> {
  console.log('API에서 순차적으로 단어 가져오기');

  const words: WordData[] = [];

  // 순차적으로 단어 가져오기 (한도 초과 방지)
  for (let i = 0; i < count; i++) {
    try {
      console.log(`${i + 1}/${count} 단어 요청 중...`);
      const wordData = await getCompleteWordData();
      if (wordData) {
        words.push(wordData);
        console.log(`✅ ${i + 1}/${count} 단어 완료: ${wordData.word}`);
      }

      // 요청 간 딜레이 (API 한도 방지) - 1초 대기
      if (i < count - 1) {
        console.log('⏳ 1초 대기 중...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`❌ ${i + 1}번째 단어 가져오기 실패:`, error);
    }
  }

  console.log(`🎉 총 ${words.length}개 단어 성공적으로 가져옴`);
  return words;
}
