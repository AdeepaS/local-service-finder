import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchServices } from '../services/api';
import ServiceCard from '../components/ui/ServiceCard';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [recentServices, setRecentServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const categories = [
    'Plumbing', 'Electrical', 'AC Repair', 'Appliance Repair', 
    'Carpentry', 'Cleaning', 'Painting'
  ];

  useEffect(() => {
    const loadRecent = async () => {
      try {
        const data = await fetchServices({ limit: 3 });
        setRecentServices(data.data.services);
      } catch (err) {
        console.error('Failed to load recent services:', err);
      } finally {
        setLoading(false);
      }
    };
    loadRecent();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim() && !location.trim()) return;
    
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (location) params.append('location', location);
    
    navigate(`/services?${params.toString()}`);
  };

  const handleCategoryClick = (category) => {
    navigate(`/services?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-20 px-4 mb-12 rounded-b-3xl shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
            Find Trusted Local Professionals
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Book top-rated service providers for your home and business needs. Fast, reliable, and secure.
          </p>
          
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 bg-white p-3 rounded-xl shadow-lg max-w-3xl mx-auto">
            <div className="flex-1 relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </span>
              <input
                type="text"
                placeholder="What service do you need?"
                className="w-full pl-10 pr-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-1 relative border-t md:border-t-0 md:border-l border-gray-200">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </span>
              <input
                type="text"
                placeholder="Zip code or city"
                className="w-full pl-10 pr-4 py-3 rounded-lg border-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-accent hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Popular Categories</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className="px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-700 font-medium shadow-sm hover:shadow-md hover:border-primary hover:text-primary transition-all duration-200"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Recent Services */}
      <section className="max-w-6xl mx-auto px-4 mb-20">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Recently Added Services</h2>
          <button 
            onClick={() => navigate('/services')}
            className="text-primary font-medium hover:text-secondary flex items-center gap-1"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>

        {loading ? (
          <LoadingSkeleton count={3} />
        ) : recentServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentServices.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center p-12 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-500">No services available right now.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
