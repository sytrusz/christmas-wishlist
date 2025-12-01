export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-red-50 to-green-50">
      <div className="relative">
        {/* Animated Gift Box */}
        <div className="text-8xl animate-bounce">🎁</div>
        
        {/* Spinning Snowflakes */}
        <div className="absolute -top-8 -left-8 text-4xl animate-spin-slow">❄️</div>
        <div className="absolute -top-8 -right-8 text-3xl animate-spin-slow animation-delay-300">⭐</div>
        <div className="absolute -bottom-8 -left-8 text-3xl animate-spin-slow animation-delay-600">✨</div>
        <div className="absolute -bottom-8 -right-8 text-4xl animate-spin-slow animation-delay-900">🎄</div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-xl md:text-2xl font-bold text-gray-800 mb-2 animate-pulse">
          Loading your wishlists...
        </p>
        <p className="text-sm md:text-base text-gray-600">
          Please wait. The system is waking up ☕
        </p>
        
        {/* Progress dots */}
        <div className="flex gap-2 justify-center mt-4">
          <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-green-600 rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce animation-delay-400"></div>
        </div>
      </div>
    </div>
  );
}