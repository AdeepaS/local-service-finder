// Central place for API helpers.
export const API_BASE_URL = 'http://localhost:5000/api'

export async function fetchServices() {
	const response = await fetch(`${API_BASE_URL}/services`)

	if (!response.ok) {
		throw new Error('Failed to fetch services')
	}

	return response.json()
}
