import BookingHistory from '../components/features/bookings/BookingHistory';

function MyBookings() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
      <p className="text-gray-600 mb-6">Your upcoming and past bookings will appear here.</p>
      <BookingHistory />
    </div>
  )
}

export default MyBookings
