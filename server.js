// server.js
const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const port = 5001;

// Enable CORS for cross-origin requests
app.use(cors());
app.use(express.json());

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

// Endpoint to add a new material
app.post('/api/materials', async (req, res) => {
  const { id, name, description, measure } = req.body; // Changed amount to measure

  try {
      // Using parameterized query to prevent SQL injection and handle parameters safely
      const query = `
          INSERT INTO Materials (MATERIAL_ID, MATERIAL_NAME, MATERIAL_DESCRIPTION, MATERIAL_MEASURE)
          VALUES (@id, @name, @description, @measure)
      `;

      const request = new sql.Request();
      request.input('id', sql.Int, id);
      request.input('name', sql.NVarChar, name);
      request.input('description', sql.NVarChar, description);
      request.input('measure', sql.NVarChar, measure);

      const result = await request.query(query);

      res.status(201).json({ message: 'Material added successfully', result });
  } catch (error) {
      console.error('Error inserting material:', error.message); // Log specific error message
      res.status(500).json({ error: 'Database insertion failed', details: error.message }); // Send error details
  }
});

// Endpoint to delete a material
app.delete('/api/data/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await sql.query`DELETE FROM Materials WHERE MATERIAL_ID = ${id}`;
    if (result.rowsAffected[0] > 0) {
      res.status(200).json({ message: 'Material deleted successfully' });
    } else {
      res.status(404).json({ message: 'Material not found' });
    }
  } catch (error) {
    console.error('Error deleting material:', error);
    res.status(500).json({ error: 'Failed to delete material' });
  }
});

// Endpoint to update a material
app.put('/api/data/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, measure } = req.body;

  try {
      const result = await sql.query`
          UPDATE Materials
          SET MATERIAL_NAME = ${name}, MATERIAL_DESCRIPTION = ${description}, MATERIAL_MEASURE = ${measure}
          WHERE MATERIAL_ID = ${id}
      `;

      if (result.rowsAffected[0] > 0) {
          res.status(200).json({ message: 'Material updated successfully' });
      } else {
          res.status(404).json({ message: 'Material not found' });
      }
  } catch (error) {
      console.error('Error updating material:', error);
      res.status(500).json({ error: 'Failed to update material' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.get('/', (req, res) => {
  res.send('Welcome to the backend server!');
});
