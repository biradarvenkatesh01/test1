/**
 * Central API Service
 * Handles communication with the backend with automatic Clerk token injection.
 */

const rawApiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
const API_BASE = rawApiBase.endsWith('/') ? rawApiBase.slice(0, -1) : rawApiBase;

/**
 * Helper to perform authenticated fetch requests
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @param {function} getToken - Clerk useAuth().getToken function
 */
async function authenticatedRequest(endpoint, options = {}, getToken) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (getToken) {
    try {
      const token = await getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (err) {
      console.error('Error fetching auth token:', err);
    }
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = 'An error occurred while processing your request.';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // JSON parsing failed, use status text or default
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * Generate flashcards for a specific topic
 * @param {string} topic - The study topic
 * @param {number} count - Number of cards (1-6)
 * @param {function} getToken - Clerk token getter
 */
export async function generateCards(topic, count, getToken) {
  return authenticatedRequest(
    '/generate',
    {
      method: 'POST',
      body: JSON.stringify({ topic, count }),
    },
    getToken
  );
}

/**
 * Retrieve saved flashcards for the current user
 * @param {function} getToken - Clerk token getter
 */
export async function getCards(getToken) {
  return authenticatedRequest(
    '/getcards',
    {
      method: 'GET',
    },
    getToken
  );
}

/**
 * Delete a specific flashcard by ID
 * @param {string} id - The card ID
 * @param {function} getToken - Clerk token getter
 */
export async function deleteCard(id, getToken) {
  return authenticatedRequest(
    `/deletecard/${id}`,
    {
      method: 'DELETE',
    },
    getToken
  );
}
