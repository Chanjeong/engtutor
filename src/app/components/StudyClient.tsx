'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { WordData } from '@/types/word';
import { storage } from '@/lib/storage';

interface StudyClientProps {
  initialWords: WordData[];
}

export default function StudyClient({ initialWords }: StudyClientProps) {
  // useState로 단어 관리
  const [words] = useState(initialWords);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentWord = words[currentIndex];

  const progress = {
    current: currentIndex + 1,
    total: initialWords.length,
    percentage: ((currentIndex + 1) / initialWords.length) * 100
  };

  const handleCorrect = () => {
    const word = currentWord;

    // localStorage에 저장
    storage.saveLearnedWord(word);

    // 답 숨기기
    setShowAnswer(false);

    // 다음 단어로 이동 (마지막이면 완료 체크를 위해 +1)
    setCurrentIndex(prev => prev + 1);
  };

  const handleWrong = () => {
    const word = currentWord;

    // localStorage에 오답노트 저장
    storage.saveWrongWord(word);

    // 답 숨기기
    setShowAnswer(false);

    // 다음 단어로 이동 (마지막이면 완료 체크를 위해 +1)
    setCurrentIndex(prev => prev + 1);
  };

  if (currentIndex >= initialWords.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-xl shadow-xl p-8">
          <p className="text-6xl mb-6">🎉</p>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">학습 완료!</h1>
          <Link href="/">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
              홈으로 돌아가기
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header with Progress */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            🎯 단어 학습
          </h1>

          {/* Progress Bar */}
          <div className="bg-white rounded-lg p-4 shadow-md">
            <p className="text-sm text-gray-600 mb-2">
              진행:{' '}
              <span className="font-bold text-blue-600">
                {progress.current}
              </span>{' '}
              / {progress.total}개 ({Math.round(progress.percentage)}%)
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress.percentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Back Button */}
        <div className="mb-6">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
              ← 홈으로
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
                  <div className="text-left bg-blue-50 rounded-lg p-6">
                    <p className="text-3xl text-blue-600 font-semibold mb-2">
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
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-10 rounded-xl text-lg transition-colors duration-200 shadow-lg">
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
              ❌ 모르겠어요
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCorrect}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl text-lg transition-colors duration-200 shadow-lg">
              ✅ 맞았어요
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
