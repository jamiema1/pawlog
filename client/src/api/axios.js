import Axios from 'axios';

// Port must match PORT used in server/.env 
const PORT = 80;
const HOST_NAME = `http://localhost:${PORT}`;

export default Axios.create({
  baseURL: HOST_NAME,
});
