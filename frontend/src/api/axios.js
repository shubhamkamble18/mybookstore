import axios from 'axios';

// Create an Axios instance pointing to the custom backend URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend endpoint
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
