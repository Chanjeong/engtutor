'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  getTodayRemainingWords,
  getTodayProgress,
  updateWordStatus,
  markSessionComplete,
  loadData,
  getTodayWords,
  selectTodayWords,
  addWords,
  needsMoreWords
} from '@/lib/storage';
import { WordProgress } from '@/types/word';
import { getMultipleRandomWords } from '@/app/actions/words';
import { convertWordsToProgress } from '@/lib/wordUtils';

export default function StudyClient() {
  const [words, setWords] = useState<WordProgress[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [progress, setProgress] = useState({
    total: 0,
    completed: 0,
    remaining: 0,
    percentage: 0,
    isComplete: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 초기화 및 데이터 로드
  useEffect(() => {
    const initializeStudy = async () => {
      try {
        setIsLoading(true);
        const data = loadData();

        // 1. 오늘의 단어가 이미 있는지 확인
        let todayWords = getTodayWords();

        // 2. 없으면 새로 선택
        if (todayWords.length === 0) {
          // 2-1. 단어 풀이 부족하면 추가
          if (needsMoreWords() || data.wordBank.length === 0) {
            const needed = Math.max(50 - data.wordBank.length, 30);
            const newWordsData = await getMultipleRandomWords(needed);
            const newWords = convertWordsToProgress(newWordsData);
            addWords(newWords);
          }

          // 2-2. 오늘의 단어 선택
          selectTodayWords();
          todayWords = getTodayWords();
        }

        // 3. 남은 단어 로드
        const remainingWords = getTodayRemainingWords();
        const progressInfo = getTodayProgress();

        setWords(remainingWords);
        setProgress(progressInfo);
      } catch (err) {
        console.error('초기화 실패:', err);
        setError('단어를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeStudy();
  }, []);

  // 진행률 업데이트
  const refreshData = () => {
    const remainingWords = getTodayRemainingWords();
    const progressInfo = getTodayProgress();

    setWords(remainingWords);
    setProgress(progressInfo);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">단어를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center bg-white rounded-xl shadow-xl p-8 max-w-md mx-4">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
              홈으로 돌아가기
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // 완료 화면
  if (progress.isComplete && progress.total > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center bg-white rounded-2xl shadow-2xl p-12 max-w-md mx-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}>
            <p className="text-6xl mb-6">🎉</p>
          </motion.div>

          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            오늘 공부를 마쳤습니다!
          </h1>

          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <p className="text-lg text-gray-700 mb-2">
              오늘 학습한 단어:{' '}
              <span className="font-bold text-blue-600">
                {progress.completed}개
              </span>
            </p>
            <p className="text-sm text-gray-500">내일 또 만나요! 💪</p>
          </div>

          <div className="space-y-3">
            <Link href="/" className="block">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                홈으로 돌아가기
              </motion.button>
            </Link>

            <Link href="/wrong-notes" className="block">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                오답노트 확인하기
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // 단어가 없을 때
  if (words.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center bg-white rounded-xl shadow-xl p-8 max-w-md mx-4">
          <p className="text-gray-600 mb-4">학습할 단어가 없습니다.</p>
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
              홈으로 돌아가기
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const currentWord = words[currentWordIndex];

  const handleCorrect = () => {
    updateWordStatus(currentWord.word, 'learned');

    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setShowAnswer(false);
      refreshData();
    } else {
      // 마지막 단어 완료
      markSessionComplete();
      refreshData();
      // 완료 화면으로 즉시 전환
      setProgress(prev => ({ ...prev, isComplete: true }));
    }
  };

  const handleWrong = () => {
    updateWordStatus(currentWord.word, 'wrong', true);

    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setShowAnswer(false);
      refreshData();
    } else {
      // 마지막 단어 완료
      markSessionComplete();
      refreshData();
      // 완료 화면으로 즉시 전환
      setProgress(prev => ({ ...prev, isComplete: true }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto">
        {/* Header with Progress */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🎯 랜덤 단어 학습
          </h1>

          {/* 오늘 진행률 */}
          <div className="bg-white rounded-lg p-4 mb-4 shadow-md">
            <p className="text-sm text-gray-600 mb-2">
              오늘 학습:{' '}
              <span className="font-bold text-blue-600">
                {progress.completed}
              </span>{' '}
              / {progress.total}개 ({progress.percentage}%)
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
              ← 홈으로 돌아가기
            </motion.button>
          </Link>
        </motion.div>

        {/* Word Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWordIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="text-center">
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-5xl font-bold text-gray-800 mb-6">
                {currentWord.word}
              </motion.h2>

              {showAnswer ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4">
                  <div className="text-left bg-gray-50 rounded-lg p-6">
                    {currentWord.partOfSpeech && (
                      <p className="text-sm text-gray-500 mb-3">
                        품사: [{currentWord.partOfSpeech}]
                      </p>
                    )}
                    <p className="text-2xl text-blue-600 font-semibold mb-4">
                      뜻: {currentWord.korean}
                    </p>
                    <p className="text-lg text-gray-700">
                      정의: {currentWord.english}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAnswer(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-10 rounded-xl text-lg transition-colors duration-200 shadow-lg">
                  답 보기
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
            transition={{ duration: 0.5 }}
            className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleWrong}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-6 rounded-xl text-lg transition-colors duration-200 shadow-lg">
              ❌ 틀렸어요
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
      </motion.div>
    </div>
  );
}
