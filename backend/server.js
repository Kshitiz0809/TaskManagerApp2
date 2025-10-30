const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Database initialization endpoint (call once after deployment)
app.get('/api/init-db', async (req, res) => {
  try {
    // Create todos table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        text VARCHAR(500) NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create index if it doesn't exist
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at DESC)
    `);
    
    res.json({ 
      success: true, 
      message: 'Database initialized successfully!' 
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET all todos
app.get('/api/todos', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM todos ORDER BY created_at DESC'
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single todo by ID
app.get('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Todo not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE new todo
app.post('/api/todos', async (req, res) => {
  try {
    const { text, completed = false } = req.body;
    
    if (!text || text.trim() === '') {
      return res.status(400).json({ success: false, error: 'Text is required' });
    }

    const result = await pool.query(
      'INSERT INTO todos (text, completed) VALUES ($1, $2) RETURNING *',
      [text.trim(), completed]
    );
    
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE todo
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;
    
    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (text !== undefined) {
      updates.push(`text = $${paramCount}`);
      values.push(text.trim());
      paramCount++;
    }

    if (completed !== undefined) {
      updates.push(`completed = $${paramCount}`);
      values.push(completed);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, error: 'No fields to update' });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE todos 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Todo not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM todos WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Todo not found' });
    }

    res.json({ success: true, message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE all todos
app.delete('/api/todos', async (req, res) => {
  try {
    await pool.query('DELETE FROM todos');
    res.json({ success: true, message: 'All todos deleted successfully' });
  } catch (error) {
    console.error('Error deleting all todos:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET statistics for the last 7 days
app.get('/api/stats', async (req, res) => {
  try {
    // Get daily statistics for the last 7 days
    const statsQuery = `
      WITH RECURSIVE dates AS (
        SELECT CURRENT_DATE - INTERVAL '6 days' AS date
        UNION ALL
        SELECT date + INTERVAL '1 day'
        FROM dates
        WHERE date < CURRENT_DATE
      )
      SELECT 
        TO_CHAR(dates.date, 'YYYY-MM-DD') as date,
        TO_CHAR(dates.date, 'Dy') as day_name,
        COALESCE(COUNT(CASE WHEN t.completed = true THEN 1 END), 0) as completed,
        COALESCE(COUNT(CASE WHEN t.completed = false THEN 1 END), 0) as pending,
        COALESCE(COUNT(t.id), 0) as total
      FROM dates
      LEFT JOIN todos t ON DATE(t.created_at) = dates.date
      GROUP BY dates.date
      ORDER BY dates.date ASC;
    `;
    
    const result = await pool.query(statsQuery);
    
    // Get overall statistics
    const overallQuery = `
      SELECT 
        COUNT(*) as total_todos,
        COUNT(CASE WHEN completed = true THEN 1 END) as completed_todos,
        COUNT(CASE WHEN completed = false THEN 1 END) as pending_todos,
        COUNT(CASE WHEN DATE(created_at) = CURRENT_DATE THEN 1 END) as today_todos,
        COUNT(CASE WHEN DATE(created_at) = CURRENT_DATE AND completed = true THEN 1 END) as today_completed
      FROM todos;
    `;
    
    const overallResult = await pool.query(overallQuery);
    
    res.json({ 
      success: true, 
      dailyStats: result.rows,
      overall: overallResult.rows[0]
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api/todos`);
});
