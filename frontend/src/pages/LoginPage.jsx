import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.trim()) {
      alert('Please enter the password');
      return;
    }

    setLoading(true);

    try {
      const username = isAdminLogin ? 'admin' : 'user';
      const success = await authAPI.login(username, password);

      if (success) {
        if (isAdminLogin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        alert('Incorrect password. Please try again.');
        setPassword('');
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert('Login failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-green-50 flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">
        
        {/* Login Card */}
        <div className="bg-white border-2 border-gray-800 shadow-lg p-8 transform transition-all hover:scale-[1.01] duration-300">
          
          {/* Animated Header */}
          <div className="text-center mb-6">
            <div className="relative inline-block mb-4">
              {/* Main Icon */}
              <div className="text-6xl animate-bounce">
                {isAdminLogin ? '👑' : '🎄'}
              </div>
              
              {/* Decorative Animated Elements */}
              <div className="absolute -top-2 -left-6 text-2xl animate-spin-slow">❄️</div>
              <div className="absolute -top-4 -right-4 text-xl animate-spin-slow animation-delay-300">⭐</div>
              <div className="absolute bottom-0 -right-8 text-xl animate-spin-slow animation-delay-600">✨</div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2 transition-colors duration-300">
              {isAdminLogin ? 'Admin Portal' : 'Login'}
            </h1>
            <p className="text-gray-600 text-sm">
              {isAdminLogin 
                ? 'Enter admin password to manage the system' 
                : 'Enter password to access wishlists'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Password *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                placeholder="Enter password"
                required
              />
            </div>

            {/* Login Type Toggle */}
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  setIsAdminLogin(!isAdminLogin);
                  setPassword('');
                }}
                className="text-sm text-red-600 hover:text-red-700 font-medium underline decoration-dashed underline-offset-4 hover:scale-105 transition-transform"
              >
                {isAdminLogin ? 'Switch to User Login' : 'Login as Admin'}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full font-bold py-3 border-2 border-gray-800 shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-0 ${
                isAdminLogin
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              } disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">❄️</span> Verifying...
                </span>
              ) : (
                isAdminLogin ? 'Admin Login' : 'Login'
              )}
            </button>
          </form>

          {/* Info Boxes */}
          <div className="mt-6 space-y-3">
            {/* Server Wake Up Note */}
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded flex gap-3 items-start animate-pulse">
              <span className="text-xl">☕</span>
              <p className="text-xs text-yellow-800 pt-1 leading-relaxed">
                <strong>Server Wake-up!</strong> The first login may take up to a minute while the server starts up. Please be patient!
              </p>
            </div>

            {/* Password Hint */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded flex gap-3 items-center">
              <span className="text-xl">🔑</span>
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> Ask admin for the password.
              </p>
            </div>
          </div>

          {/* Copyright Footer */}
          <div className="mt-3 pt-3 border-t border-gray-100 text-center">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
              © {new Date().getFullYear()} Nathan Rener Malagapo 
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}