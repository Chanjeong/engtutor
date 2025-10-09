import { getMultipleRandomWords } from '@/app/actions/words';
import StudyClient from './StudyClient';

export default async function StudyPage() {
  const words = await getMultipleRandomWords();

  return <StudyClient initialWords={words} />;
}
