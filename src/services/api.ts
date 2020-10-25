import axios from "axios";

const api = axios.create({
  baseURL: "https://happy-typescript-api.herokuapp.com",
});

export default api;
