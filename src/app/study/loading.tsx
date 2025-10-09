export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header Skeleton */}
        <div className="text-center mb-8 space-y-4">
          <div className="h-9 bg-white/60 rounded-lg w-48 mx-auto animate-pulse"></div>

          {/* Progress Bar Skeleton */}
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="h-4 bg-gray-200 rounded w-32 mb-2 mx-auto animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded-full w-full animate-pulse"></div>
          </div>
        </div>

        {/* Back Button Skeleton */}
        <div className="mb-6">
          <div className="h-10 bg-white/60 rounded-lg w-32 animate-pulse"></div>
        </div>

        {/* Word Card Skeleton */}
        <div className="bg-white rounded-2xl shadow-xl p-12 mb-8 animate-pulse">
          <div className="text-center space-y-6">
            {/* Word Skeleton */}
            <div className="h-14 bg-gray-200 rounded-lg w-64 mx-auto"></div>

            {/* Part of Speech Skeleton */}
            <div className="h-4 bg-gray-100 rounded w-20 mx-auto"></div>

            {/* Button Skeleton */}
            <div className="h-14 bg-blue-200 rounded-xl w-40 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
