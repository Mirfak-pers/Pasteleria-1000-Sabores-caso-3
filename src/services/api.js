const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const fetchProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products`);
  return response.json();
};