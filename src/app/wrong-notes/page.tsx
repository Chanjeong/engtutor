'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function WrongNotes() {
  // 임시 데이터 (나중에 상태 관리로 변경)
  const wrongWords = [
    { word: 'abundant', korean: '풍부한', wrongCount: 3 },
    { word: 'benevolent', korean: '자비로운', wrongCount: 2 },
    { word: 'cumbersome', korean: '번거로운', wrongCount: 1 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📝 오답 노트
          </h1>
          <p className="text-gray-600">틀린 단어들을 다시 복습해보세요</p>
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

        {/* Wrong Words List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4">
          {wrongWords.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <p className="text-gray-500 text-lg">
                아직 틀린 단어가 없어요! 🎉
              </p>
              <p className="text-gray-400 text-sm mt-2">
                단어 학습을 시작해보세요
              </p>
            </div>
          ) : (
            wrongWords.map((word, index) => (
              <motion.div
                key={word.word}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {word.word}
                    </h3>
                    <p className="text-gray-600 text-lg mb-2">{word.korean}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-red-500 font-medium">
                        틀린 횟수: {word.wrongCount}회
                      </span>
                      <div className="flex space-x-1">
                        {Array.from({ length: word.wrongCount }, (_, i) => (
                          <span key={i} className="text-red-400">
                            ❌
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                    다시 학습
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Stats */}
        {wrongWords.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📊 학습 통계
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-red-500">
                  {wrongWords.length}
                </p>
                <p className="text-sm text-gray-600">틀린 단어 수</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-500">
                  {wrongWords.reduce((sum, word) => sum + word.wrongCount, 0)}
                </p>
                <p className="text-sm text-gray-600">총 틀린 횟수</p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
