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
  password: 'Meto6kata!', // SQL Server password
  database: 'my-db',
  server: 'metivladi.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
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


app.get('/api/data', async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM Materials`;
    res.json(result.recordset);
  } catch (err) {
    console.error('Error querying database:', err);
    res.status(500).send('Server Error');
  }
});




// Endpoint to add a new material with price and price date
app.post('/api/materials', async (req, res) => {
  const { id, name, description, measure, price, priceDate } = req.body;

  try {
      // Insert into Materials table
      const materialQuery = `
          INSERT INTO Materials (MATERIAL_ID, MATERIAL_NAME, MATERIAL_DESCRIPTION, MATERIAL_MEASURE)
          VALUES (@id, @name, @description, @measure)
      `;

      const materialRequest = new sql.Request();
      materialRequest.input('id', sql.Int, id);
      materialRequest.input('name', sql.NVarChar, name);
      materialRequest.input('description', sql.NVarChar, description);
      materialRequest.input('measure', sql.NVarChar, measure);
      await materialRequest.query(materialQuery);

      // Insert into Price_List table
      const priceQuery = `
          INSERT INTO Price_List (MATERIAL_ID, PRICE_PRICE, PRICE_DATE)
          VALUES (@id, @price, @priceDate)
      `;

      const priceRequest = new sql.Request();
      priceRequest.input('id', sql.Int, id);
      priceRequest.input('price', sql.Decimal(10, 2), price);
      priceRequest.input('priceDate', sql.Date, priceDate);
      await priceRequest.query(priceQuery);

      res.status(201).json({ message: 'Material and price added successfully' });
  } catch (error) {
      console.error('Error inserting material and price:', error.message);
      res.status(500).json({ error: 'Database insertion failed', details: error.message });
  }
});

// Endpoint to delete a material and its associated price record
app.delete('/api/data/:id', async (req, res) => {
  const { id } = req.params;

  try {
      // Delete from Price_List table first
      const priceQuery = `
          DELETE FROM Price_List
          WHERE MATERIAL_ID = @id
      `;
      const priceRequest = new sql.Request();
      priceRequest.input('id', sql.Int, id);
      await priceRequest.query(priceQuery);

      // Then delete from Materials table
      const materialQuery = `
          DELETE FROM Materials
          WHERE MATERIAL_ID = @id
      `;
      const materialRequest = new sql.Request();
      materialRequest.input('id', sql.Int, id);
      await materialRequest.query(materialQuery);

      res.status(200).json({ message: 'Material and associated price record deleted successfully' });
  } catch (error) {
      console.error('Error deleting material and price record:', error.message);
      res.status(500).json({ error: 'Failed to delete material and price record', details: error.message });
  }
});


// Endpoint to update a material with price and price date
app.put('/api/data/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, measure, price, priceDate } = req.body;

  try {
      // Update the Materials table
      const materialQuery = `
          UPDATE Materials
          SET MATERIAL_NAME = @name, MATERIAL_DESCRIPTION = @description, MATERIAL_MEASURE = @measure
          WHERE MATERIAL_ID = @id
      `;
      const materialRequest = new sql.Request();
      materialRequest.input('id', sql.Int, id);
      materialRequest.input('name', sql.NVarChar, name);
      materialRequest.input('description', sql.NVarChar, description);
      materialRequest.input('measure', sql.NVarChar, measure);
      await materialRequest.query(materialQuery);

      // Update the Price_List table
      const priceQuery = `
          UPDATE Price_List
          SET PRICE_PRICE = @price, PRICE_DATE = @priceDate
          WHERE MATERIAL_ID = @id
      `;
      const priceRequest = new sql.Request();
      priceRequest.input('id', sql.Int, id);
      priceRequest.input('price', sql.Decimal(10, 2), price);
      priceRequest.input('priceDate', sql.Date, priceDate);
      await priceRequest.query(priceQuery);

      res.status(200).json({ message: 'Material and price updated successfully' });
  } catch (error) {
      console.error('Error updating material and price:', error.message);
      res.status(500).json({ error: 'Failed to update material and price' });
  }
});

// Endpoint to get a specific material with price details
app.get('/api/data/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Query for the material data
    const materialResult = await sql.query`SELECT * FROM Materials WHERE MATERIAL_ID = ${id}`;
    if (materialResult.recordset.length === 0) {
      return res.status(404).json({ error: "Material not found" });
    }

    // Query for the price data
    const priceResult = await sql.query`SELECT * FROM Price_List WHERE MATERIAL_ID = ${id}`;
    const materialData = materialResult.recordset[0];
    materialData.price = priceResult.recordset[0]?.PRICE_PRICE || null;
    materialData.priceDate = priceResult.recordset[0]?.PRICE_DATE || null;

    res.json(materialData);
  } catch (err) {
    console.error('Error querying material by ID:', err);
    res.status(500).send('Server Error');
  }
});



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.get('/', (req, res) => {
  res.send('Welcome to the backend server!');
});
