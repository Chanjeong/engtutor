'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { storage } from '@/lib/storage';

export default function HomeAnimation() {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    if (showResetConfirm) {
      storage.clearAll();
      setShowResetConfirm(false);
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md space-y-6">
        {/* 헤더 */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📚 English Tutor
          </h1>
          <p className="text-gray-600">간단하고 효과적인 영어 단어 학습</p>
        </motion.div>

        {/* 메인 액션 버튼들 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-6 space-y-3">
          <Link href="/study">
            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: '0 10px 40px rgba(59, 130, 246, 0.3)'
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg mb-3">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">🎯</span>
                <span>단어 학습 시작</span>
              </div>
            </motion.button>
          </Link>

          <div className="grid grid-cols-2 gap-3">
            <Link href="/wrong-notes">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200">
                <div className="text-2xl mb-1">📝</div>
                <div className="text-sm">오답 노트</div>
              </motion.button>
            </Link>

            <Link href="/stats">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200">
                <div className="text-2xl mb-1">📊</div>
                <div className="text-sm">통계 보기</div>
              </motion.button>
            </Link>
          </div>

          {/* 초기화 버튼 */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleReset}
            className={`w-full font-semibold py-3 px-6 rounded-xl transition-all duration-200 ${
              showResetConfirm
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}>
            {showResetConfirm
              ? '⚠️ 다시 클릭하면 모든 데이터가 삭제됩니다'
              : '🔄 학습 데이터 초기화'}
          </motion.button>
        </motion.div>

        {/* 하단 메시지 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-gray-500">
          <p>오늘도 열심히 공부해요! 💪</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
