// server.js
const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const port = 5001;

// Enable CORS for cross-origin requests
app.use(cors());

// Azure SQL Database configuration
const sqlConfig = {
  user: 'node', // SQL Server username
  password: 'Meto6kata', // SQL Server password
  database: 'my-db',
  server: 'metodi.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
  options: {
    encrypt: true, // Use encryption for Azure SQL Database
    trustServerCertificate: true,
  },
};

// Connect to SQL Server
sql.connect(sqlConfig, (err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to Azure SQL Database');
  }
});

// Define a sample API endpoint to get data
app.get('/api/data', async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM Materials`; // Replace with your actual SQL query
    res.json(result.recordset); // Sends the results as JSON
  } catch (err) {
    console.error('Error querying database:', err);
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.get('/', (req, res) => {
  res.send('Welcome to the backend server!');
});
