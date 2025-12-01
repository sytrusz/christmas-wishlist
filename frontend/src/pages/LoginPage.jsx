import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api'; // Import the auth service

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
      // Determine username based on the toggle state
      const username = isAdminLogin ? 'admin' : 'user';

      // Call the backend to verify credentials
      const success = await authAPI.login(username, password);

      if (success) {
        // Redirect based on role
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
        <div className="bg-white border-2 border-gray-800 shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🎄</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isAdminLogin ? 'Admin Login' : 'Login'}
            </h1>
            <p className="text-gray-600">
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
                className="w-full border-2 border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
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
                className="text-sm text-red-600 hover:text-red-700 font-medium underline"
              >
                {isAdminLogin ? 'Switch to User Login' : 'Login as Admin'}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full font-bold py-3 border-2 border-gray-800 shadow-lg transition-all ${
                isAdminLogin
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              } disabled:bg-gray-400 disabled:cursor-not-allowed`}
            >
              {loading ? 'Verifying...' : isAdminLogin ? 'Admin Login' : 'Login'}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> Ask admin for password.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}