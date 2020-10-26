import axios from "axios";

const api = axios.create({
  baseURL: "https://happy-api.sallada.org",
});

export default api;
