import axios from "axios"

export const apiSteam = axios.create({
  baseURL: "http://localhost:3000"
})

