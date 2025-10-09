'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-6xl mb-6">
          😢
        </motion.div>

        {/* Error Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          앗! 문제가 발생했어요
        </h2>

        {/* Error Message */}
        <div className="bg-red-50 rounded-lg p-4 mb-6">
          <p className="text-red-700 text-sm mb-1">
            {error.message || '단어를 불러오는데 실패했습니다.'}
          </p>
          {error.digest && (
            <p className="text-xs text-red-400">Error ID: {error.digest}</p>
          )}
        </div>

        {/* Possible Causes */}
        <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            💡 가능한 원인:
          </p>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>네트워크 연결 문제</li>
            <li>API 서버 오류</li>
            <li>DeepL API 키 설정 오류</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={reset}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg">
            🔄 다시 시도하기
          </motion.button>

          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
              ← 홈으로 돌아가기
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
