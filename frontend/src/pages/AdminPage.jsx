import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// FIX: Imported settingsAPI
import { userAPI, wishlistAPI, authAPI, settingsAPI } from '../services/api';

export default function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [wishlists, setWishlists] = useState([]);
  const [headerName, setHeaderName] = useState(''); // Initialize empty
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [userForm, setUserForm] = useState({ fullName: '', category: 'ADULT' });
  const [editingUser, setEditingUser] = useState(null); 

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('isAdmin');
    if (!isAdmin) {
      navigate('/login');
      return;
    }
    
    fetchUsers();
    fetchWishlists();
    loadHeaderName(); // FIX: Fetch from DB on load
  }, [navigate]);

  // FIX: Load from Database via API, not LocalStorage
  const loadHeaderName = async () => {
    try {
      const response = await settingsAPI.getHeader();
      setHeaderName(response.data.value);
    } catch (err) {
      console.error('Failed to load header setting', err);
      setHeaderName('Malagapo Christmas Wishlist'); // Fallback
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAll();
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      if(err.response && err.response.status === 401) authAPI.logout();
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlists = async () => {
    try {
      setLoading(true);
      const response = await wishlistAPI.getAll();
      setWishlists(response.data);
    } catch (err) {
      console.error('Failed to fetch wishlists:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await userAPI.delete(id);
      alert('User deleted successfully');
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Failed to delete user');
    }
  };

  const handleDeleteWishlist = async (id) => {
    if (!window.confirm('Are you sure you want to delete this wishlist?')) return;
    
    try {
      await wishlistAPI.delete(id);
      alert('Wishlist deleted successfully');
      fetchWishlists();
    } catch (err) {
      console.error(err);
      alert('Failed to delete wishlist');
    }
  };

  // FIX: Save to Database via API
  const handleSaveHeader = async () => {
    try {
      await settingsAPI.updateHeader(headerName);
      alert('Header name updated globally!');
    } catch (err) {
      console.error(err);
      alert('Failed to update header name');
    }
  };

  // --- EDIT HANDLERS ---
  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({ fullName: user.fullName, category: user.category });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setUserForm({ fullName: '', category: 'ADULT' });
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        await userAPI.update(editingUser.id, userForm);
        alert('User updated successfully');
        setEditingUser(null);
      } else {
        await userAPI.register(userForm);
        alert('User created successfully');
      }
      
      setUserForm({ fullName: '', category: 'ADULT' });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(editingUser ? 'Failed to update user' : 'Failed to save user');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-purple-900 text-white py-4 px-4 border-b-4 border-gray-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/')}
              className="bg-white text-purple-900 px-4 py-2 rounded font-semibold hover:bg-gray-100"
            >
              View Site
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b-2 border-gray-300">
          {['users', 'wishlists', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-purple-600 text-white border-2 border-gray-800 -mb-0.5'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className={`border-2 border-gray-800 shadow-lg p-6 transition-colors ${editingUser ? 'bg-yellow-50 border-yellow-500' : 'bg-white'}`}>
              <h2 className="text-2xl font-bold mb-4">
                {editingUser ? `Edit User: ${editingUser.fullName}` : 'Create New User'}
              </h2>
              
              <form onSubmit={handleUserSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    value={userForm.fullName}
                    onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Category</label>
                  <select
                    value={userForm.category}
                    onChange={(e) => setUserForm({ ...userForm, category: e.target.value })}
                    className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="ADULT">Adult</option>
                    <option value="KID">Kid</option>
                    <option value="PET">Pet</option>
                  </select>
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className={`px-6 py-2 rounded font-semibold text-white ${editingUser ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}`}
                  >
                    {editingUser ? 'Update User' : 'Create User'}
                  </button>
                  
                  {editingUser && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="bg-gray-500 text-white px-6 py-2 rounded font-semibold hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="bg-white border-2 border-gray-800 shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">All Users ({users.length})</h2>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-300">
                        <th className="text-left py-3 px-4">ID</th>
                        <th className="text-left py-3 px-4">Name</th>
                        <th className="text-left py-3 px-4">Category</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-4">{user.id}</td>
                          <td className="py-3 px-4 font-medium">{user.fullName}</td>
                          <td className="py-3 px-4">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {user.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 flex gap-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Wishlists Tab */}
        {activeTab === 'wishlists' && (
          <div className="bg-white border-2 border-gray-800 shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">All Wishlists ({wishlists.length})</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-3 px-4">Owner</th>
                      <th className="text-left py-3 px-4">Category</th>
                      <th className="text-left py-3 px-4">Items</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wishlists.map((wishlist) => (
                      <tr key={wishlist.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{wishlist.ownerName}</td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            {wishlist.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">{wishlist.items?.length || 0}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleDeleteWishlist(wishlist.id)}
                            className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white border-2 border-gray-800 shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Site Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Header Name
                </label>
                <input
                  type="text"
                  value={headerName}
                  onChange={(e) => setHeaderName(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded px-4 py-3 mb-3"
                />
                <button
                  onClick={handleSaveHeader}
                  className="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700"
                >
                  Save Header
                </button>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                <h3 className="font-semibold mb-2">⚠️ Configuration:</h3>
                <ul className="text-sm space-y-1 text-gray-700">
                  <li>• Passwords are managed in backend environment variables. </li>
                  <li>• Contact Developer for any change request. </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}