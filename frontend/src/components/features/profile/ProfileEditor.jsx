import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { updateProfile, changePassword } from '../../../services/userApi';

function ProfileEditor() {
  const { user, refreshProfile } = useAuth();
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.profile?.location || '',
    businessName: user?.profile?.businessName || '',
    experience: user?.profile?.experience || '',
    description: user?.profile?.description || '',
    profileImage: user?.profile?.profileImage || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileMsg, setProfileMsg] = useState(null);
  const [passwordMsg, setPasswordMsg] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const isProvider = user?.role === 'provider';

  useEffect(() => {
    if (!user) return;
    setProfileForm({
      name: user.name || '',
      phone: user.phone || '',
      location: user.profile?.location || '',
      businessName: user.profile?.businessName || '',
      experience: user.profile?.experience ?? '',
      description: user.profile?.description || '',
      profileImage: user.profile?.profileImage || '',
    });
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileError(null);
    setProfileMsg(null);
    try {
      const payload = {
        name: profileForm.name.trim(),
        phone: profileForm.phone.trim() || undefined,
        profile: {
          location: profileForm.location.trim() || undefined,
          profileImage: profileForm.profileImage.trim() || undefined,
          businessName: profileForm.businessName.trim() || undefined,
          experience: profileForm.experience ? Number(profileForm.experience) : undefined,
          description: profileForm.description.trim() || undefined,
        },
      };
      await updateProfile(payload);
      await refreshProfile();
      setProfileMsg('Profile updated successfully.');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    setSavingPassword(true);
    setPasswordError(null);
    setPasswordMsg(null);
    try {
      await changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
        passwordForm.confirmPassword
      );
      setPasswordMsg('Password changed successfully.');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-10">
      <form onSubmit={handleProfileSubmit} className="bg-white border border-gray-100 rounded-xl p-6 space-y-4 max-w-xl">
        <h3 className="font-bold text-gray-900 text-lg">Account details</h3>
        <p className="text-sm text-gray-500">Email: {user?.email}</p>
        <p className="text-sm text-gray-500">Role: {user?.role}</p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
          <input name="name" value={profileForm.name} onChange={handleProfileChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input name="phone" value={profileForm.phone} onChange={handleProfileChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input name="location" value={profileForm.location} onChange={handleProfileChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile image URL</label>
          <input name="profileImage" value={profileForm.profileImage} onChange={handleProfileChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="https://..." />
        </div>

        {isProvider && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business name</label>
              <input name="businessName" value={profileForm.businessName} onChange={handleProfileChange} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Years of experience</label>
              <input type="number" name="experience" value={profileForm.experience} onChange={handleProfileChange} min="0" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">About your business</label>
              <textarea name="description" value={profileForm.description} onChange={handleProfileChange} rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
            </div>
          </>
        )}

        {profileMsg && <p className="text-green-600 text-sm">{profileMsg}</p>}
        {profileError && <p className="text-red-600 text-sm">{profileError}</p>}
        <button type="submit" disabled={savingProfile} className="bg-primary hover:bg-secondary text-white font-semibold px-4 py-2 rounded-lg disabled:opacity-50">
          {savingProfile ? 'Saving...' : 'Save profile'}
        </button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="bg-white border border-gray-100 rounded-xl p-6 space-y-4 max-w-xl">
        <h3 className="font-bold text-gray-900 text-lg">Change password</h3>
        <input type="password" placeholder="Current password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        <input type="password" placeholder="New password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))} required minLength={6} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        <input type="password" placeholder="Confirm new password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))} required className="w-full border border-gray-300 rounded-lg px-3 py-2" />
        {passwordMsg && <p className="text-green-600 text-sm">{passwordMsg}</p>}
        {passwordError && <p className="text-red-600 text-sm">{passwordError}</p>}
        <button type="submit" disabled={savingPassword} className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-4 py-2 rounded-lg disabled:opacity-50">
          {savingPassword ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </div>
  );
}

export default ProfileEditor;
