import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileEditor from '../components/features/profile/ProfileEditor';
import AddressManager from '../components/features/profile/AddressManager';
import BookingHistory from '../components/features/bookings/BookingHistory';
import FavoritesList from '../components/features/favorites/FavoritesList';

const TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'addresses', label: 'Addresses', roles: ['customer'] },
  { id: 'bookings', label: 'Bookings', roles: ['customer'] },
  { id: 'favorites', label: 'Saved', roles: ['customer'] },
];

function Profile() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  if (!user) return null;

  const visibleTabs = TABS.filter(
    (tab) => !tab.roles || tab.roles.includes(user.role)
  );

  const setTab = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My account</h1>

      <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-8">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && <ProfileEditor />}
      {activeTab === 'addresses' && user.role === 'customer' && <AddressManager />}
      {activeTab === 'bookings' && user.role === 'customer' && <BookingHistory />}
      {activeTab === 'favorites' && user.role === 'customer' && <FavoritesList />}
    </div>
  );
}

export default Profile;
