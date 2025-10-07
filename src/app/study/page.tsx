'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getMultipleRandomWords, WordData } from '@/app/actions/words';

export default function Study() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [wrongWords, setWrongWords] = useState<string[]>([]);
  const [words, setWords] = useState<WordData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API에서 랜덤 단어 데이터 가져오기
  useEffect(() => {
    const loadWords = async () => {
      try {
        setLoading(true);
        const randomWords = await getMultipleRandomWords(5);

        if (randomWords.length === 0) {
          setError('단어를 불러올 수 없습니다.');
          return;
        }

        setWords(randomWords);
      } catch (err) {
        setError('단어를 불러오는 중 오류가 발생했습니다.');
        console.error('Error loading words:', err);
      } finally {
        setLoading(false);
      }
    };

    loadWords();
  }, []);

  const currentWord = words[currentWordIndex];

  const handleCorrect = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setShowAnswer(false);
    } else {
      alert('모든 단어를 완료했습니다! 🎉');
    }
  };

  const handleWrong = () => {
    if (currentWord) {
      setWrongWords([...wrongWords, currentWord.word]);
    }
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setShowAnswer(false);
    } else {
      alert('모든 단어를 완료했습니다! 🎉');
    }
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">랜덤 단어를 불러오는 중...</p>
          <p className="text-gray-400 text-sm mt-2">
            번역 중이니 잠시만 기다려주세요
          </p>
        </motion.div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center bg-white rounded-xl shadow-xl p-8 max-w-md mx-4">
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-500 text-sm mb-4">API 키를 확인해주세요</p>
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

  // 단어가 없을 때
  if (words.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🎯 랜덤 단어 학습
          </h1>
          <p className="text-gray-600">
            {currentWordIndex + 1} / {words.length} 단어
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <motion.div
              className="bg-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentWordIndex + 1) / words.length) * 100}%`
              }}
              transition={{ duration: 0.5 }}
            />
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
        <motion.div
          key={currentWordIndex}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-gray-800 mb-6">
              {currentWord.word}
            </motion.h2>

            {showAnswer ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4">
                <div className="text-left">
                  {currentWord.partOfSpeech && (
                    <p className="text-sm text-gray-500 mb-2">
                      [{currentWord.partOfSpeech}]
                    </p>
                  )}
                  <p className="text-2xl text-blue-600 font-semibold mb-4">
                    {currentWord.korean}
                  </p>
                  <p className="text-lg text-gray-700 mb-2">
                    {currentWord.english}
                  </p>
                  {currentWord.example && (
                    <p className="text-gray-600 italic text-sm">
                      "{currentWord.example}"
                    </p>
                  )}
                  {currentWord.phonetic && (
                    <p className="text-sm text-gray-500 mt-2">
                      /{currentWord.phonetic}/
                    </p>
                  )}
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
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                답 보기
              </motion.button>
            )}
          </div>
        </motion.div>

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
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
              ❌ 틀렸어요
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCorrect}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
              ✅ 맞았어요
            </motion.button>
          </motion.div>
        )}

        {/* Wrong Words Count */}
        {wrongWords.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-center">
              틀린 단어: {wrongWords.length}개
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
