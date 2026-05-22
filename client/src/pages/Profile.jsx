import { useState } from 'react';
import useAuth from '../hooks/useAuth.js';
import api from '../api/axios.js';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import toast from 'react-hot-toast';
import { validateName, validatePassword, validateConfirmPassword } from '../utils/validators.js';

const Profile = () => {
  const { user, updateUser } = useAuth();

  // ─── Profile Form ──────────────────────────────────────────────
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);

  // ─── Password Form ─────────────────────────────────────────────
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordLoading, setPasswordLoading] = useState(false);

  // ─── Handle Profile Change ─────────────────────────────────────
  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
    setProfileErrors({ ...profileErrors, [e.target.name]: null });
  };

  // ─── Handle Password Change ────────────────────────────────────
  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    setPasswordErrors({ ...passwordErrors, [e.target.name]: null });
  };

  // ─── Validate Profile ──────────────────────────────────────────
  const validateProfileForm = () => {
    const newErrors = {
      name: validateName(profileForm.name),
    };
    setProfileErrors(newErrors);
    return Object.values(newErrors).every((error) => error === null);
  };

  // ─── Validate Password ─────────────────────────────────────────
  const validatePasswordForm = () => {
    const newErrors = {
      currentPassword: passwordForm.currentPassword
        ? null
        : 'Current password is required.',
      newPassword: validatePassword(passwordForm.newPassword),
      confirmPassword: validateConfirmPassword(
        passwordForm.newPassword,
        passwordForm.confirmPassword
      ),
    };
    setPasswordErrors(newErrors);
    return Object.values(newErrors).every((error) => error === null);
  };

  // ─── Submit Profile ────────────────────────────────────────────
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfileForm()) return;

    setProfileLoading(true);
    try {
      const res = await api.put('/user/profile', profileForm);
      updateUser(res.data.user);
      toast.success('Profile updated successfully.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  // ─── Submit Password ───────────────────────────────────────────
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setPasswordLoading(true);
    try {
      await api.put('/password/change', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password changed successfully.');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Your Profile</h1>

        {/* Avatar & Name Banner */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600 flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${
              user?.isVerified
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {user?.isVerified ? 'Verified' : 'Not Verified'}
            </span>
          </div>
        </div>

        {/* Update Profile Form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Update Profile</h2>
          <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={profileForm.name}
              onChange={handleProfileChange}
              placeholder="Your full name"
              error={profileErrors.name}
            />
            <Input
              label="Avatar URL"
              type="text"
              name="avatar"
              value={profileForm.avatar}
              onChange={handleProfileChange}
              placeholder="https://example.com/avatar.jpg"
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Bio</label>
              <textarea
                name="bio"
                value={profileForm.bio}
                onChange={handleProfileChange}
                placeholder="Tell us a little about yourself..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-200 resize-none"
              />
            </div>
            <Button type="submit" loading={profileLoading}>
              Save Changes
            </Button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
            <Input
              label="Current Password"
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Your current password"
              error={passwordErrors.currentPassword}
            />
            <Input
              label="New Password"
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              placeholder="Min. 6 characters"
              error={passwordErrors.newPassword}
            />
            <Input
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Repeat new password"
              error={passwordErrors.confirmPassword}
            />
            <Button type="submit" loading={passwordLoading}>
              Change Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;