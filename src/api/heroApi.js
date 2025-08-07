// src/api/heroApi.js
import axios from "axios";

export const getSlides = () => {
  return axios.get("http://localhost:5000/api/heroslides");
};

export const uploadSlide = (data) => {
  return axios.post("http://localhost:5000/api/heroslides", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
