import axios from 'axios';

const apiBackend = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});
export default apiBackend;

