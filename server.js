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
  database: 'bom',
  server: 'bomdb.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
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

//================================================================================================
//                                          MATERIALS
//================================================================================================

// Endpoint to get the Materials table
app.get('/api/data', async (req, res) => {
  try {

    const result = await sql.query`SELECT * FROM Materials`;
    res.json(result.recordset);
  } catch (err) {
    console.error('Error querying database:', err);
    res.status(500).send('Server Error');
  }
});

// Endpoint to get a specific material with price details
app.get('/api/data/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await sql.query`
      SELECT m.*, p.PRICE_PRICE, p.PRICE_DATE
      FROM Materials m
      LEFT JOIN Price_List p ON m.MATERIAL_ID = p.MATERIAL_ID
    `;

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Material not found" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error querying material by ID:', err);
    res.status(500).send('Server Error');
  }
});

// Endpoint to get all products that use a specific material
app.get('/api/materials/:materialId/products', async (req, res) => {
  const { materialId } = req.params;

  try {
    const result = await sql.query`
      SELECT p.PRODUCT_ID, p.PRODUCT_NAME
      FROM PRODUCT p
      JOIN BOM b ON p.PRODUCT_ID = b.PRODUCT_ID
      WHERE b.MATERIAL_ID = ${materialId}
    `;
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching products for material:', error.message);
    res.status(500).json({ error: 'Failed to fetch products for material' });
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


//================================================================================================
//                                          PRODUCTS
//================================================================================================

// Get all products for the table
app.get('/api/products', async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM PRODUCT`;
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Server Error');
  }
});

// Get the product's material and qty for the form
app.get('/api/products/:id/materials', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await sql.query`
      SELECT m.MATERIAL_ID, m.MATERIAL_NAME, b.BOM_QTY
      FROM Materials m
      JOIN BOM b ON m.MATERIAL_ID = b.MATERIAL_ID
      WHERE b.PRODUCT_ID = ${id}
    `;
    res.json(result.recordset);
  } catch (err) {
    console.error('Error querying materials for product:', err);
    res.status(500).send('Server Error');
  }
});

app.get('/api/products/:productId/total-cost', async (req, res) => {
  const { productId } = req.params;

  try {
    // 1. Calculate the total material cost
    const materialCostResult = await sql.query`
      SELECT SUM(b.BOM_QTY * p.PRICE_PRICE) AS totalMaterialCost
      FROM BOM b
      JOIN Price_List p ON b.MATERIAL_ID = p.MATERIAL_ID
      WHERE b.PRODUCT_ID = ${productId}
    `;

    const totalMaterialCost = materialCostResult.recordset[0]?.totalMaterialCost || 0;

    // 2. Calculate the total other expenses
    const expenseResult = await sql.query`
      SELECT SUM(e.EXPRENCE_VALUE) AS totalOtherExpenses
      FROM OTHER_EXPENCES e
      WHERE e.PRODUCT_ID = ${productId}
    `;

    const totalOtherExpenses = expenseResult.recordset[0]?.totalOtherExpenses || 0;

    // 3. Calculate the total production cost
    const totalProductionCost = totalMaterialCost + totalOtherExpenses;

    // Return the calculated costs
    res.json({
      totalMaterialCost,
      totalOtherExpenses,
      totalProductionCost,
    });
  } catch (error) {
    console.error('Error calculating total cost for product:', error.message);
    res.status(500).json({ error: 'Failed to calculate total cost', details: error.message });
  }
});

//================================================================================================
//                                          EXPENCES
//================================================================================================


app.get('/api/expences', async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM EXPENCES`;
    res.setHeader('Content-Type', 'application/json'); // Ensure JSON response
    res.json(result.recordset); // Send query result as JSON
  } catch (err) {
    console.error('Error fetching expenses:', err.message, err.stack); // Log the error
    res.status(500).json({ error: 'Failed to fetch expenses', details: err.message });
  }
});

app.get('/api/expences/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql.query`SELECT EXPENCE_ID, EXPENCE_NAME FROM EXPENCES WHERE EXPENCE_ID = ${id}`;
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching expense by ID:', err.message);
    res.status(500).json({ error: 'Failed to fetch expense' });
  }
});

app.post('/api/expences', async (req, res) => {
  const { id, name } = req.body;
  try {
    await sql.query`INSERT INTO EXPENCES (EXPENCE_ID, EXPENCE_NAME) VALUES (${id}, ${name})`;
    res.status(201).json({ message: 'Expense added successfully' });
  } catch (err) {
    console.error('Error adding expense:', err.message);
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

app.delete('/api/expences/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await sql.query`DELETE FROM EXPENCES WHERE EXPENCE_ID = ${id}`;
    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    console.error('Error deleting expense:', err.message);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});


//================================================================================================
//                                            BOM
//================================================================================================


// Endpoint to get all BOM records
app.get('/api/bom', async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM BOM`;
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching BOM:', err);
    res.status(500).send('Server Error');
  }
});

// Endpoint to get a specific BOM record by product ID and material ID
app.get('/api/bom/:productId/:materialId', async (req, res) => {
  const { productId, materialId } = req.params;

  try {
    const result = await sql.query`
      SELECT * FROM BOM
      WHERE PRODUCT_ID = ${productId} AND MATERIAL_ID = ${materialId}
    `;

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'BOM record not found' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching BOM record:', err);
    res.status(500).send('Server Error');
  }
});

// Endpoint to add a new BOM record
app.post('/api/bom', async (req, res) => {
  const { productId, materialId, qty } = req.body;

  try {
    await sql.query`
      INSERT INTO BOM (PRODUCT_ID, MATERIAL_ID, BOM_QTY)
      VALUES (${productId}, ${materialId}, ${qty})
    `;
    res.status(201).json({ message: 'BOM record added successfully' });
  } catch (err) {
    console.error('Error adding BOM record:', err);
    res.status(500).json({ error: 'Failed to add BOM record' });
  }
});

// Endpoint to delete a BOM record by product ID and material ID
app.delete('/api/bom/:productId/:materialId', async (req, res) => {
  const { productId, materialId } = req.params;

  try {
    await sql.query`
      DELETE FROM BOM
      WHERE PRODUCT_ID = ${productId} AND MATERIAL_ID = ${materialId}
    `;
    res.json({ message: 'BOM record deleted successfully' });
  } catch (err) {
    console.error('Error deleting BOM record:', err);
    res.status(500).json({ error: 'Failed to delete BOM record' });
  }
});



app.post('/api/products/add', async (req, res) => {
  const { id, name, description, materials, expences } = req.body;

  console.log('Received data:', { id, name, description, materials, expences });

  const transaction = new sql.Transaction();
  try {
    console.log('Starting transaction...');
    await transaction.begin();

    // Insert into the PRODUCT table
    console.log('Inserting product...');
    const productQuery = `
      INSERT INTO PRODUCT (PRODUCT_ID, PRODUCT_NAME, PRODUCT_DESCRIPTION)
      VALUES (@id, @name, @description)
    `;
    const productRequest = new sql.Request(transaction);
    productRequest.input('id', sql.Numeric(18, 0), id);
    productRequest.input('name', sql.NVarChar(50), name);
    productRequest.input('description', sql.NVarChar(100), description);
    await productRequest.query(productQuery);
    console.log('Product inserted successfully.');

    // Insert into BOM (materials)
    for (const material of materials) {
      console.log('Processing material:', material);

      // Fetch BOM_QTY if it's not provided in the form
      let bomQty = material.qty;
      if (!bomQty) {
        const qtyQuery = `
          SELECT BOM_QTY
          FROM BOM
          WHERE PRODUCT_ID = @productId AND MATERIAL_ID = @materialId
        `;
        const qtyRequest = new sql.Request(transaction);
        qtyRequest.input('productId', sql.Numeric(18, 0), id);
        qtyRequest.input('materialId', sql.Numeric(18, 0), material.id);

        const qtyResult = await qtyRequest.query(qtyQuery);
        bomQty = qtyResult.recordset.length > 0 ? qtyResult.recordset[0].BOM_QTY : null;

        if (!bomQty) {
          throw new Error(`BOM quantity not found for material ID ${material.id}`);
        }
      }

      const bomQuery = `
        INSERT INTO BOM (PRODUCT_ID, MATERIAL_ID, BOM_QTY)
        VALUES (@productId, @materialId, @qty)
      `;
      const bomRequest = new sql.Request(transaction);
      bomRequest.input('productId', sql.Numeric(18, 0), id);
      bomRequest.input('materialId', sql.Numeric(18, 0), material.id);
      bomRequest.input('qty', sql.Numeric(10, 3), bomQty);
      await bomRequest.query(bomQuery);
      console.log('Material inserted successfully:', material);
    }

    // Insert into OTHER_EXPENCES (expenses)
    for (const expence of expences) {
      console.log('Processing expense:', expence);

      // Fetch EXPENSE_VALUE if it's not provided in the form
      let expenseValue = expence.price;
      if (!expenseValue) {
        const expenseQuery = `
          SELECT EXPRENCE_VALUE
          FROM EXPENCES
          WHERE EXPENCE_ID = @expenseId
        `;
        const expenseRequest = new sql.Request(transaction);
        expenseRequest.input('expenseId', sql.Numeric(18, 0), expence.id);

        const expenseResult = await expenseRequest.query(expenseQuery);
        expenseValue = expenseResult.recordset.length > 0 ? expenseResult.recordset[0].EXPRENCE_VALUE : null;

        if (!expenseValue) {
          throw new Error(`Expense value not found for expense ID ${expence.id}`);
        }
      }

      const otherExpensesQuery = `
        INSERT INTO OTHER_EXPENCES (PRODUCT_ID, EXPENCE_ID, EXPRENCE_VALUE)
        VALUES (@productId, @expenseId, @value)
      `;
      const otherExpensesRequest = new sql.Request(transaction);
      otherExpensesRequest.input('productId', sql.Numeric(18, 0), id);
      otherExpensesRequest.input('expenseId', sql.Numeric(18, 0), expence.id);
      otherExpensesRequest.input('value', sql.Numeric(10, 2), expenseValue);
      await otherExpensesRequest.query(otherExpensesQuery);
      console.log('Expense inserted successfully:', expence);
    }

    await transaction.commit();
    console.log('Transaction committed successfully.');
    res.status(201).json({ message: 'Product, materials, and expenses added successfully' });
  } catch (error) {
    await transaction.rollback();
    console.error('Transaction failed:', error.message);
    res.status(500).json({ error: 'Failed to add product, materials, and expenses', details: error.message });
  }
});

app.get('/api/products/:productId/total-cost', async (req, res) => {
  const { productId } = req.params;

  try {
    // 1. Calculate the total material cost
    const materialCostResult = await sql.query`
      SELECT SUM(b.BOM_QTY * p.PRICE_PRICE) AS totalMaterialCost
      FROM BOM b
      JOIN Price_List p ON b.MATERIAL_ID = p.MATERIAL_ID
      WHERE b.PRODUCT_ID = ${productId}
    `;

    const totalMaterialCost = materialCostResult.recordset[0]?.totalMaterialCost || 0;

    // 2. Calculate the total other expenses
    const expenseResult = await sql.query`
      SELECT SUM(e.EXPRENCE_VALUE) AS totalOtherExpenses
      FROM OTHER_EXPENCES e
      WHERE e.PRODUCT_ID = ${productId}
    `;

    const totalOtherExpenses = expenseResult.recordset[0]?.totalOtherExpenses || 0;

    // 3. Calculate the total production cost
    const totalProductionCost = totalMaterialCost + totalOtherExpenses;

    // Return the calculated costs
    res.json({
      totalMaterialCost,
      totalOtherExpenses,
      totalProductionCost,
    });
  } catch (error) {
    console.error('Error calculating total cost for product:', error.message);
    res.status(500).json({ error: 'Failed to calculate total cost', details: error.message });
  }
});

// =================================================================================================



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.get('/', (req, res) => {
  res.send('Welcome to the backend server!');
});

module.exports = app;