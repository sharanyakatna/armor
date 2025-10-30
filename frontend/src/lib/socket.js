// src/lib/socket.js
import { io } from "socket.io-client";
import { addLiveReport } from "./liveReportsStore";

// ✅ Persistent socket connection
const socket = io("http://localhost:8080", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

// 💥 Whenever an approved report arrives, update global memory
socket.on("approvedReport", (report) => {
  addLiveReport(report);
});

export default socket;
