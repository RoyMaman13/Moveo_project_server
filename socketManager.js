const socket = require('socket.io');
const db = require('./db');

// Function to update the mentor ID to '-1' in the 'codeblock' table, activated when mentor socket is disconected
function updateMentorToMinusOne(mentorSessionId) {
  const checkSql = 'SELECT * FROM codeblock WHERE mentor = ?';
  db.query(checkSql, mentorSessionId, (err, result) => {
    if (err) {
      console.error('Error:', err.message);
    } else {
      if (result.length > 0) {
        const updateSql = 'UPDATE codeblock SET mentor = "-1" WHERE mentor = ?';
        db.query(updateSql, mentorSessionId, (updateErr, updateResult) => {
          if (updateErr) {
            console.error('Error updating mentor:', updateErr.message);
          } else {
            console.log('Updated mentor to -1');
          }
        });
      } else {
        console.log('Mentor not found in any rows');
      }
    }
  });
}

// Function to set up a WebSocket connection using Socket.IO
function setupSocket(server) {
  const io = socket(server, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    },
  });
// Handles client connections and disconnections
  io.on('connection', (socket) => {
    console.log('New client connected');

// Listens for 'textChanged' event from the client and broadcasts the updated code
    socket.on('textChanged', (text) => {
      socket.broadcast.emit('textUpdated', text);
    });
// Listens for client disconnection and updates the mentor ID to '-1'
    socket.on('disconnect', () => {
      console.log('Client disconnected');
      updateMentorToMinusOne(socket.id);
    });
  });
}

module.exports = { setupSocket };
