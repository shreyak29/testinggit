const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'your_database_name'
  });

  router.get('/available-rooms', (req, res) => {
    // SQL query to retrieve available rooms
    const query = `
      SELECT room_number, floor_number, vacant_seats
      FROM room_master_tbl
      WHERE vacant_seats > 0
      ORDER BY floor_number, room_number
    `;
    connection.query(query, (err, results) => {
      if (err) {
        // Error handling
        console.error('Error retrieving available rooms: ' + err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      // Send response with available rooms data
      return res.status(200).json(results);
    });
  });

  
  router.post('/allocate-room', (req, res) => {
    const { studentId, hostelId, roomNumber } = req.body;
  
    // Check if room has vacant seats
    const checkVacantSeatsQuery = `
      SELECT vacant_seats
      FROM room_master_tbl
      WHERE hostel_id = ? AND room_number = ? AND vacant_seats > 0
    `;
    connection.query(checkVacantSeatsQuery, [hostelId, roomNumber], (err, results) => {
      if (err) {
        // Error handling
        console.error('Error checking vacant seats: ' + err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      if (results.length === 0) {
        // No vacant seats available in the selected room
        return res.status(400).json({ message: "No vacant seats available in the selected room" });
      }
  
      // Allocate room to student
      // Insert a record into the studentroom table
      const allocateRoomQuery = `
        INSERT INTO studentroom (hostel_id, room_number, student_id)
        VALUES (?, ?, ?)
      `;
      connection.query(allocateRoomQuery, [hostelId, roomNumber, studentId], (err, results) => {
        if (err) {
          // Error handling
          console.error('Error allocating room: ' + err);
          return res.status(500).json({ error: 'Internal server error' });
        }
  
        // Update vacant seats count in room_master_tbl
        const updateVacantSeatsQuery = `
          UPDATE room_master_tbl
          SET vacant_seats = vacant_seats - 1
          WHERE hostel_id = ? AND room_number = ?
        `;
        connection.query(updateVacantSeatsQuery, [hostelId, roomNumber], (err, results) => {
          if (err) {
            // Error handling
            console.error('Error updating vacant seats count: ' + err);
            return res.status(500).json({ error: 'Internal server error' });
          }
          // Send success response
          return res.status(200).json({ message: "Room allocated successfully" });
        });
      });
    });
  });

  module.exports = router;
