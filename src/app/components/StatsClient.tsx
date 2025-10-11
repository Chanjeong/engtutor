'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { storage } from '@/lib/storage';
import type { StatsData } from '@/types/word';

export default function StatsClient() {
  // 하나의 state로 통합!
  const [stats, setStats] = useState<StatsData>({
    totalLearned: 0,
    totalWrong: 0,
    totalReviews: 0,
    successRate: 0,
    dailyData: [],
    distributionData: [],
    mostWrong: [],
    streak: 0
  });
  const [period, setPeriod] = useState<7 | 30>(7);

  useEffect(() => {
    // 여기서 직접 로드 (경고 해결)
    const basicStats = storage.getStats();
    const daily = storage.getDailyStats(period);
    const distribution = storage.getDistributionData();
    const topWrong = storage.getMostWrongWords(5);
    const studyStreak = storage.getStudyStreak();

    setStats({
      ...basicStats,
      dailyData: daily,
      distributionData: distribution,
      mostWrong: topWrong,
      streak: studyStreak
    });
  }, [period]);

  // 카운터 애니메이션용 컴포넌트
  const AnimatedCounter = ({
    value,
    suffix = ''
  }: {
    value: number;
    suffix?: string;
  }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let start = 0;
      const end = value;
      const duration = 1000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }, [value]);

    return (
      <>
        {count}
        {suffix}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              📊 학습 통계
            </h1>
            <p className="text-gray-600">당신의 학습 여정을 한눈에</p>
          </div>
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow text-black">
              🏠 홈으로
            </motion.button>
          </Link>
        </motion.div>

        {/* 기간 선택 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3 justify-center">
          <button
            onClick={() => setPeriod(7)}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              period === 7
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}>
            7일
          </button>
          <button
            onClick={() => setPeriod(30)}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              period === 30
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}>
            30일
          </button>
        </motion.div>

        {/* 요약 카드들 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* 총 학습 */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-2xl mb-2">📚</div>
            <div className="text-sm text-gray-500 mb-1">총 학습</div>
            <div className="text-3xl font-bold text-blue-600">
              <AnimatedCounter value={stats.totalLearned + stats.totalWrong} />
            </div>
          </motion.div>

          {/* 맞힌 단어 */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-2xl mb-2">✅</div>
            <div className="text-sm text-gray-500 mb-1">맞힌 단어</div>
            <div className="text-3xl font-bold text-green-600">
              <AnimatedCounter value={stats.totalLearned} />
            </div>
          </motion.div>

          {/* 틀린 단어 */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-2xl mb-2">❌</div>
            <div className="text-sm text-gray-500 mb-1">틀린 단어</div>
            <div className="text-3xl font-bold text-red-600">
              <AnimatedCounter value={stats.totalWrong} />
            </div>
          </motion.div>

          {/* 정답률 */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-sm text-gray-500 mb-1">정답률</div>
            <div className="text-3xl font-bold text-purple-600">
              <AnimatedCounter value={stats.successRate} suffix="%" />
            </div>
          </motion.div>
        </motion.div>

        {/* 차트 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 학습 추이 (넓게 2칸) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              📈 학습 추이
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="dateLabel"
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="learned"
                  name="맞힌 단어"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="wrong"
                  name="틀린 단어"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* 단어 분포 파이 차트 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              🍩 단어 분포
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value">
                  {stats.distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {stats.distributionData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 일별 학습량 바 차트 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              📊 일별 학습량
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="dateLabel"
                  stroke="#9ca3af"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar
                  dataKey="learned"
                  name="맞힌 단어"
                  fill="#10b981"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="wrong"
                  name="틀린 단어"
                  fill="#ef4444"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* 가장 어려운 단어 & 스트릭 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6">
            {/* 스트릭 카드 */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg p-6 text-white">
              <div className="text-4xl mb-2">🔥</div>
              <div className="text-sm opacity-90 mb-1">연속 학습</div>
              <div className="text-4xl font-bold mb-2">
                <AnimatedCounter value={stats.streak} />일
              </div>
              <div className="text-sm opacity-90">
                {stats.streak === 0
                  ? '학습을 시작해보세요!'
                  : '계속 달려가세요!'}
              </div>
            </div>

            {/* 가장 어려운 단어 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                ⚠️ 주의 단어
              </h2>
              {stats.mostWrong.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  틀린 단어가 없습니다! 🎉
                </p>
              ) : (
                <div className="space-y-3">
                  {stats.mostWrong.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                      <div>
                        <div className="font-semibold text-gray-800">
                          {item.word}
                        </div>
                        <div className="text-sm text-gray-600">
                          {item.korean}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-red-600">
                          {item.count}회
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.lastWrong}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
