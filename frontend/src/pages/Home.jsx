import { useEffect, useState } from 'react'
import ServiceCard from '../components/service/ServiceCard'
import { fetchServices } from '../services/api'

function Home() {
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchServices()
        setServices(data)
      } catch (error) {
        console.error('Error loading services:', error)
        setServices([])
      } finally {
        setIsLoading(false)
      }
    }

    loadServices()
  }, [])

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
        <h2>Available Services</h2>

        {isLoading ? <p>Loading services...</p> : null}

        {!isLoading && services.length === 0 ? <p>No services available</p> : null}

        {!isLoading && services.length > 0 ? (
          <div className="service-grid">
            {services.map((service) => (
              <ServiceCard
                key={service._id}
                title={service.title}
                category={service.category}
                location={service.location}
                priceRange={service.priceRange}
              />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  )
}

export default Home
