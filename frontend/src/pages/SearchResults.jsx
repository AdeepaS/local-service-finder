import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchServices } from '../services/api';
import ServiceCard from '../components/ui/ServiceCard';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  
  // Local state for filters
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');

  const categories = [
    'All Categories', 'Plumbing', 'Electrical', 'AC Repair', 
    'Appliance Repair', 'Carpentry', 'Cleaning', 'Painting'
  ];

  const loadServices = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries([...searchParams]);
      const data = await fetchServices(params);
      setServices(data.data.services);
      setPagination(data.data.pagination);
    } catch (err) {
      console.error('Failed to search services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
    // Sync local state with URL
    setSearchTerm(searchParams.get('search') || '');
    setLocation(searchParams.get('location') || '');
    setCategory(searchParams.get('category') || '');
  }, [searchParams]);

  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();
    
    const newParams = new URLSearchParams();
    if (searchTerm) newParams.set('search', searchTerm);
    if (location) newParams.set('location', location);
    if (category && category !== 'All Categories') newParams.set('category', category);
    
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage);
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Filters</h2>
            
            <form onSubmit={handleApplyFilters} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g. plumber"
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City or zip"
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  value={category || 'All Categories'}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:border-primary text-sm bg-white"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <button 
                type="submit" 
                className="w-full bg-primary hover:bg-secondary text-white font-medium py-2.5 rounded-lg transition-colors"
              >
                Apply Filters
              </button>
            </form>
          </div>
        </aside>

        {/* Results Grid */}
        <div className="flex-1">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {loading ? 'Searching...' : `${pagination.total} Services Found`}
            </h1>
          </div>

          {loading ? (
            <LoadingSkeleton count={6} />
          ) : services.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {services.map(service => (
                  <ServiceCard key={service._id} service={service} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center mt-12 gap-2">
                  <button 
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-gray-700 font-medium">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button 
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyState 
              title="No services found" 
              message="Try adjusting your filters or search terms to find what you're looking for."
              actionText="Clear Filters"
              onAction={() => setSearchParams({})}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
