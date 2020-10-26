import axios from "axios";

const api = axios.create({
  baseURL: "http://happy-api.sallada.org",
});

export default api;
