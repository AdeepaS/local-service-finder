import ServiceCard from '../components/ServiceCard'

const services = [
  {
    id: '1',
    title: 'QuickFix Plumbing',
    category: 'Plumbing',
    location: 'Downtown',
    rating: '4.7/5',
  },
  {
    id: '2',
    title: 'BrightSpark Electricians',
    category: 'Electrical',
    location: 'West End',
    rating: '4.5/5',
  },
  {
    id: '4',
    title: 'SafeHome Security Setup',
    category: 'Home Security',
    location: 'East Side',
    rating: '4.6/5',
  },
]

function SearchResults() {
  return (
    <div className="container page">
      <h1>Search Results</h1>
      <p>Showing available local services (dummy data).</p>

      <div className="service-grid">
        {services.map((service) => (
          <ServiceCard key={service.id} {...service} />
        ))}
      </div>
    </div>
  )
}

export default SearchResults
