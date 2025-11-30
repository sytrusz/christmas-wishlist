import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName.trim()) {
      alert('Please enter your full name');
      return;
    }

    if (!category) {
      alert('Please select a category');
      return;
    }

    try {
      setLoading(true);
      await userAPI.register({
        fullName: fullName.trim(),
        category: category,
      });
      alert('Registration successful! You can now create your wishlist.');
      navigate('/create');
    } catch (err) {
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert('Registration failed. This name might already exist.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-green-50 flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Home
        </button>

        {/* Registration Card */}
        <div className="bg-white border-2 border-gray-800 shadow-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🎄 Register 🎄</h1>
            <p className="text-gray-600">Create your account to make a wishlist</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border-2 border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Category *
              </label>
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="category"
                    value="ADULT"
                    checked={category === 'ADULT'}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-5 h-5 text-red-600"
                  />
                  <span className="ml-3 text-lg font-medium">👨 Adult</span>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="category"
                    value="KID"
                    checked={category === 'KID'}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-5 h-5 text-red-600"
                  />
                  <span className="ml-3 text-lg font-medium">👶 Kid</span>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="category"
                    value="PET"
                    checked={category === 'PET'}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-5 h-5 text-red-600"
                  />
                  <span className="ml-3 text-lg font-medium">🐾 Pet</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white font-bold py-3 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed border-2 border-gray-800 shadow-lg"
            >
              {loading ? 'Registering...' : 'Register & Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}