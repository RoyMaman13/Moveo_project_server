const express = require('express');
const http = require('http');
const cors = require('cors');
const routes = require('./routes'); // Import the routes module
const bodyParser = require('body-parser');
const { setupSocket } = require('./socketManager'); // Import the socket manager
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.SERVER_PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/', routes); // Use the routes module

// Socket.IO setup
setupSocket(server);

// Server listen
server.listen(4000 || process.env.SERVER_PORT, "0.0.0.0",() => {
  console.log(`Server is running on port ${PORT}`);
});
