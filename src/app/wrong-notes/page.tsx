'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { storage, StoredWord } from '@/lib/storage';

type SortType = 'date' | 'count';

export default function WrongNotesPage() {
  const [wrongWords, setWrongWords] = useState<StoredWord[]>([]);
  const [sortBy, setSortBy] = useState<SortType>('count');

  useEffect(() => {
    loadWrongWords();
  }, []);

  const loadWrongWords = () => {
    const words = storage.getWrongWords();
    setWrongWords(words);
  };

  const sortedWords = [...wrongWords].sort((a, b) => {
    if (sortBy === 'count') {
      return (b.reviewCount || 0) - (a.reviewCount || 0);
    } else {
      return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
    }
  });

  const handleDelete = (word: string) => {
    if (confirm(`"${word}"를 오답노트에서 삭제하시겠습니까?`)) {
      const updated = wrongWords.filter(w => w.word !== word);
      localStorage.setItem('engtutor_wrong_words', JSON.stringify(updated));
      setWrongWords(updated);
    }
  };

  const handleClearAll = () => {
    if (confirm('모든 오답노트를 삭제하시겠습니까?')) {
      localStorage.removeItem('engtutor_wrong_words');
      setWrongWords([]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '오늘';
    if (diffDays === 1) return '어제';
    if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow-md transition-colors">
                ← 홈으로
              </motion.button>
            </Link>

            {wrongWords.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearAll}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors">
                🗑️ 전체 삭제
              </motion.button>
            )}
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📕 오답 노트
          </h1>
          <p className="text-gray-600">틀렸던 단어들을 다시 복습하세요</p>
        </motion.div>

        {/* Stats & Controls */}
        {wrongWords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex gap-6">
                <div>
                  <p className="text-sm text-gray-600">틀린 단어</p>
                  <p className="text-3xl font-bold text-red-600">
                    {wrongWords.length}개
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">평균 복습 횟수</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {(
                      wrongWords.reduce(
                        (sum, w) => sum + (w.reviewCount || 0),
                        0
                      ) / wrongWords.length
                    ).toFixed(1)}
                    회
                  </p>
                </div>
              </div>

              <Link href="/review">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors">
                  🔄 전체 복습 시작
                </motion.button>
              </Link>
            </div>

            {/* Sort Controls */}
            <div className="mt-4 pt-4 border-t flex gap-2">
              <button
                onClick={() => setSortBy('count')}
                className={`text-sm px-3 py-1 rounded-full transition-colors ${
                  sortBy === 'count'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                복습 횟수순
              </button>
              <button
                onClick={() => setSortBy('date')}
                className={`text-sm px-3 py-1 rounded-full transition-colors ${
                  sortBy === 'date'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                최근 순
              </button>
            </div>
          </motion.div>
        )}

        {/* Word List */}
        <AnimatePresence mode="popLayout">
          {sortedWords.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center bg-white rounded-xl shadow-lg p-12">
              <p className="text-6xl mb-4">🎉</p>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                오답노트가 비어있어요!
              </h2>
              <p className="text-gray-600 mb-6">
                아직 틀린 단어가 없거나, 모두 복습을 완료했어요.
              </p>
              <Link href="/study">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors">
                  🎯 학습 시작하기
                </motion.button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              {sortedWords.map((word, index) => (
                <motion.div
                  key={word.word}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-800">
                          {word.word}
                        </h3>
                        {word.partOfSpeech && (
                          <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {word.partOfSpeech}
                          </span>
                        )}
                      </div>

                      <p className="text-lg text-blue-600 mb-3">
                        뜻: {word.korean}
                      </p>

                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>
                          복습 횟수:{' '}
                          {Array(word.reviewCount || 0)
                            .fill('❌')
                            .join(' ')}
                          <span className="font-semibold ml-1">
                            ({word.reviewCount || 0}회)
                          </span>
                        </span>
                        <span>•</span>
                        <span>{formatDate(word.savedAt)}</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(word.word)}
                      title="삭제"
                      className="ml-4 bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-colors">
                      🗑️
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
