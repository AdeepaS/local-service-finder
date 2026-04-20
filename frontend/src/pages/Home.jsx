import ServiceCard from '../components/ServiceCard'

const featuredServices = [
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
    id: '3',
    title: 'FreshHome Cleaning',
    category: 'Cleaning',
    location: 'North Side',
    rating: '4.8/5',
  },
]

function Home() {
  return (
    <div className="container page">
      <section className="hero-section">
        <h1>Find Trusted Local Services Near You</h1>
        <p>Search for plumbers, electricians, cleaners, and more in your area.</p>

        {/* Search input is UI-only for this initial version */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search services or category..."
            aria-label="Search services"
          />
          <button type="button">Search</button>
        </div>
      </section>

      <section>
        <h2>Featured Services</h2>
        <div className="service-grid">
          {featuredServices.map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
