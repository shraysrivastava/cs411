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

db.connect(err => {
  if (err) {
    console.error('DB connection failed:', err.stack);
  } else {
    console.log('Connected to GCP MySQL database');
  }
});

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

app.get('/get-questions', (req, res) => {
  const categoryId = req.query.category;
  const query = `
    SELECT * FROM Question
    WHERE category_id = ?
    ORDER BY RAND()
    LIMIT 5;
  `;
  db.query(query, [categoryId], (err, results) => {
    if (err) {
      console.error('Query error:', err);
      res.status(500).send('Query failed');
    } else {
      res.json(results);
    }
  });
});


app.post('/session-start', (req, res) => {
  const { user_id } = req.body;

  const insertQuery = `
    INSERT INTO GameSession (user_id, time_elapsed, score, num_correct, attempts)
    VALUES (?, 0, 0, 0, 0)
  `;

  db.query(insertQuery, [user_id], (err, result) => {
    if (err) {
      console.error('Failed to start session:', err);
      return res.status(500).send('Failed to start session');
    }
    res.json({ session_id: result.insertId });
  });
});


app.post('/session-answer', (req, res) => {
  const { session_id, question_id, is_correct } = req.body;

  const insertQuery = `
    INSERT INTO GameSessionQuestion (session_id, question_id, is_correct)
    VALUES (?, ?, ?)
  `;

  db.query(insertQuery, [session_id, question_id, is_correct], (err) => {
    if (err) {
      console.error('Failed to record answer:', err);
      return res.status(500).send('Failed to record answer');
    }
    res.sendStatus(200);
  });
});

app.put('/session-finish', (req, res) => {
  const { session_id, score, num_correct, attempts, time_elapsed } = req.body;

  const updateQuery = `
    UPDATE GameSession
    SET score = ?, num_correct = ?, attempts = ?, time_elapsed = ?
    WHERE session_id = ?
  `;

  db.query(updateQuery, [score, num_correct, attempts, time_elapsed, session_id], (err) => {
    if (err) {
      console.error('Failed to finish session:', err);
      return res.status(500).send('Failed to finish session');
    }
    res.sendStatus(200);
  });
});


app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
