// src/socket.js
import { io } from "socket.io-client";
import server from "./enviornment.js";

const socket = io(`${server}`, { autoConnect: false });  

// const socket = io("http://localhost:8080", { autoConnect: false });

export default socket;
