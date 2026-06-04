import FavoritesList from '../components/features/favorites/FavoritesList';

function Favorites() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Favorites</h1>
      <p className="text-gray-600 mb-6">Services you have marked as favorite will appear here.</p>
      <FavoritesList />
    </div>
  )
}

export default Favorites
