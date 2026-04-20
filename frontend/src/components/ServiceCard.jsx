import { Link } from 'react-router-dom'

function ServiceCard({ id, title, category, location, rating }) {
  return (
    <article className="service-card">
      <h3>{title}</h3>
      <p>
        <strong>Category:</strong> {category}
      </p>
      <p>
        <strong>Location:</strong> {location}
      </p>
      <p>
        <strong>Rating:</strong> {rating}
      </p>
      <Link to={`/services/${id}`} className="card-link">
        View Details
      </Link>
    </article>
  )
}

export default ServiceCard
