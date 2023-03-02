import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "https://localhost:44301/api",
  headers: {
    "Content-Type": "application/json",
  },
});
