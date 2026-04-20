import { useParams } from 'react-router-dom'

function ServiceDetails() {
  const { id } = useParams()

  return (
    <div className="container page">
      <h1>Service Details</h1>
      <p>This page will show full details for service ID: {id}</p>
      <p>In future, this data will come from the backend API.</p>
    </div>
  )
}

export default ServiceDetails
