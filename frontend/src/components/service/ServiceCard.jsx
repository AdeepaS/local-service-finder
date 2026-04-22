function ServiceCard({ title, category, location, priceRange }) {
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
        <strong>Price Range:</strong> {priceRange}
      </p>
    </article>
  )
}

export default ServiceCard
