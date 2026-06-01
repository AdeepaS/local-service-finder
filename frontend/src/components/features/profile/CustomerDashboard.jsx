import { Link } from 'react-router-dom';
import BookingHistory from '../bookings/BookingHistory';

function CustomerDashboard() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
      <p className="text-gray-600 mb-8">Manage your bookings, saved services, and profile.</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <Link
          to="/profile?tab=bookings"
          className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:border-primary transition-colors"
        >
          <p className="font-bold text-gray-900">My bookings</p>
          <p className="text-sm text-gray-500 mt-1">View and manage requests</p>
        </Link>
        <Link
          to="/profile?tab=favorites"
          className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:border-primary transition-colors"
        >
          <p className="font-bold text-gray-900">Saved services</p>
          <p className="text-sm text-gray-500 mt-1">Your favorite listings</p>
        </Link>
        <Link
          to="/profile?tab=addresses"
          className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:border-primary transition-colors"
        >
          <p className="font-bold text-gray-900">Addresses</p>
          <p className="text-sm text-gray-500 mt-1">Saved locations for booking</p>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recent bookings</h2>
          <Link to="/profile?tab=bookings" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <BookingHistory limit={5} />
      </div>
    </div>
  );
}

export default CustomerDashboard;
