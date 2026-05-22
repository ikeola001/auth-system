import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Welcome Banner */}
        <div className="bg-indigo-600 rounded-2xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-1">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-indigo-200 text-sm">
            You are securely logged in to your account.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Email Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Email</p>
            <p className="text-gray-800 font-medium text-sm break-all">{user?.email}</p>
          </div>

          {/* Verified Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Email Status</p>
            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
              user?.isVerified
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {user?.isVerified ? 'Verified' : 'Not Verified'}
            </span>
          </div>

          {/* Member Since Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Member Since</p>
            <p className="text-gray-800 font-medium text-sm">
              {new Date(user?.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/profile"
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
            >
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Edit Profile</p>
                <p className="text-xs text-gray-400">Update your name and bio</p>
              </div>
            </Link>

            <Link
              to="/profile"
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all"
            >
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Change Password</p>
                <p className="text-xs text-gray-400">Update your password</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;