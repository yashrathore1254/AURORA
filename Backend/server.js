import http from 'http';
import app from './src/app.js';
import { generateResponse } from "./src/services/ai.service.js"
import connectsocket from "./src/socket/socket.js";


const server = http.createServer(app);

connectsocket(server);

server.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT || 3000}`);
});
