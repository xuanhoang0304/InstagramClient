import { getCookie } from "cookies-next";
import { io } from "socket.io-client";

import envConfig from "./envConfig";

const URL =
  process.env.NODE_ENV === "production"
    ? envConfig.BACKEND_URL
    : "http://localhost:5000";
const token = getCookie("accessToken");
export const socket = io(URL, {
  autoConnect: true,
  withCredentials: true,
  auth: {
    token,
  },
  transports: ["websocket"],
});
