const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: '34.58.14.110',
  user: 'root',
  password: 'QueryMaxxers',
  database: 'project-db',
});

// Test DB connection
db.connect(err => {
  if (err) {
    console.error('DB connection failed:', err.stack);
  } else {
    console.log('Connected to GCP MySQL database');
  }
});

// Category query
app.get('/get-categories', (req, res) => {
    db.query('SELECT * FROM Category', (err, results) => {
      if (err) {
        console.error('Query error:', err);
        res.status(500).send('Query failed');
      } else {
        res.json(results);
      }
    });
  });

// Question query
app.get('/get-questions', (req, res) => {

    const categoryId = req.query.category;

    const query = `SELECT * FROM Question
                WHERE category_id = ?
                ORDER BY RAND()
                LIMIT 5;`

    db.query(query, [categoryId], (err, results) => {
      if (err) {
        console.error('Query error:', err); 
        res.status(500).send('Query failed');
      } else {
        res.json(results);
      }
    });
  });
  
  

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
