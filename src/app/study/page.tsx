import { getMultipleRandomWords } from '@/app/actions/words';
import StudyClient from '../components/StudyClient';

// 🚨 배포 환경에서 캐싱 방지 - 매번 새로운 단어를 가져오도록 설정
export const dynamic = 'force-dynamic';

export default async function StudyPage() {
  const words = await getMultipleRandomWords();

  return <StudyClient initialWords={words} />;
}
