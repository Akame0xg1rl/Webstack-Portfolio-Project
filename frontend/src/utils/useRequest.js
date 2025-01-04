import axios from "axios";

export const instance = axios.create({
  // baseURL: "https://bookztron-server.vercel.app/api",
  baseURL : "http://192.168.100.71:1337/api",
  headers: {
    "X-Access-Token": localStorage.getItem("access_token"),
  },
});
