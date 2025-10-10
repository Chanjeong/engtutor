'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { storage, StoredWord } from '@/lib/storage';

export default function ReviewClient() {
  const [words, setWords] = useState<StoredWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const wrongWords = storage.getWrongWords();
    setWords(wrongWords);
  }, []);

  const currentWord = words[currentIndex];

  const progress = {
    current: currentIndex + 1,
    total: words.length,
    percentage: ((currentIndex + 1) / words.length) * 100
  };

  const handleCorrect = () => {
    const word = currentWord;

    // 맞춘 단어에 추가
    storage.saveLearnedWord(word);

    // 오답노트에서 제거
    storage.removeFromWrongNote(word.word);

    // 답 숨기기
    setShowAnswer(false);

    // 다음 단어로
    setCurrentIndex(prev => prev + 1);
  };

  const handleWrong = () => {
    const word = currentWord;

    // 복습 횟수만 증가 (오답노트에 계속 유지)
    storage.saveWrongWord(word);

    // 답 숨기기
    setShowAnswer(false);

    // 다음 단어로
    setCurrentIndex(prev => prev + 1);
  };

  if (currentIndex >= words.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-xl shadow-xl p-8">
          <p className="text-6xl mb-6">🎉</p>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">복습 완료!</h1>
          <p className="text-gray-600 mb-6">오답노트를 모두 복습했어요!</p>
          <div className="flex gap-4 justify-center">
            <Link href="/">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                홈으로 돌아가기
              </button>
            </Link>
            <Link href="/wrong-notes">
              <button className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                오답노트 보기
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header with Progress */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            🔄 오답노트 복습
          </h1>

          {/* Progress Bar */}
          <div className="bg-white rounded-lg p-4 shadow-md">
            <p className="text-sm text-gray-600 mb-2">
              진행:{' '}
              <span className="font-bold text-purple-600">
                {progress.current}
              </span>{' '}
              / {progress.total}개 ({Math.round(progress.percentage)}%)
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress.percentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* 복습 횟수 표시 */}
            {currentWord.reviewCount && currentWord.reviewCount > 1 && (
              <p className="text-xs text-red-500 mt-2">
                이미 {currentWord.reviewCount}번 틀렸어요 💪
              </p>
            )}
          </div>
        </motion.div>

        {/* Back Button */}
        <div className="mb-6">
          <Link href="/wrong-notes">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
              ← 오답노트로
            </motion.button>
          </Link>
        </div>

        {/* Word Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWord.word}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-12 mb-8">
            <div className="text-center">
              <motion.h2
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-5xl font-bold text-gray-800 mb-6">
                {currentWord.word}
              </motion.h2>

              {currentWord.partOfSpeech && (
                <p className="text-sm text-gray-500 mb-6">
                  [{currentWord.partOfSpeech}]
                </p>
              )}

              {showAnswer ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4">
                  <div className="text-left bg-purple-50 rounded-lg p-6">
                    <p className="text-3xl text-purple-600 font-semibold mb-2">
                      뜻: {currentWord.korean}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAnswer(true)}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-4 px-10 rounded-xl text-lg transition-colors duration-200 shadow-lg">
                  뜻 보기
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons */}
        {showAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleWrong}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-6 rounded-xl text-lg transition-colors duration-200 shadow-lg">
              ❌ 또 틀렸어요
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCorrect}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl text-lg transition-colors duration-200 shadow-lg">
              ✅ 이번엔 맞췄어요!
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
