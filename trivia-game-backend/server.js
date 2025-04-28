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
  const query = `CALL GetRandomQuestions(?);`;
  db.query(query, [categoryId], (err, results) => {
    if (err) {
      console.error('Query error:', err);
      res.status(500).send('Query failed');
    } else {
      res.json(results[0]);
    }
  });
});

app.get('/get-leaderboard', (req, res) => {
  const query = `
    SELECT username, total_score, total_sessions, avg_score_per_session
    FROM Leaderboard
    ORDER BY total_score DESC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Leaderboard query error:', err);
      res.status(500).send('Query failed');
    } else {
      res.json(results);
    }
  });
});


app.post('/session-complete', (req, res) => {
  const { user_id, score, num_correct, attempts, time_elapsed, answers } = req.body;

  db.beginTransaction(err => {
    if (err) {
      console.error('Transaction start error:', err);
      return res.status(500).send('Transaction error');
    }

    const sessionInsert = `
      INSERT INTO GameSession (user_id, time_elapsed, score, num_correct, attempts)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sessionInsert, [user_id, time_elapsed, score, num_correct, attempts], (err, result) => {
      if (err) {
        return db.rollback(() => {
          console.error('Insert GameSession failed:', err);
          res.status(500).send('Failed to create session');
        });
      }

      const sessionId = result.insertId;

      const answerValues = answers.map(ans => [sessionId, ans.question_id, ans.is_correct]);

      const answerInsert = `
        INSERT IGNORE INTO GameSessionQuestion (session_id, question_id, is_correct)
        VALUES ?
      `;

      db.query(answerInsert, [answerValues], (err) => {
        if (err) {
          return db.rollback(() => {
            console.error('Insert GameSessionQuestion failed:', err);
            res.status(500).send('Failed to record answers');
          });
        }

        db.commit(commitErr => {
          if (commitErr) {
            return db.rollback(() => {
              console.error('Commit error:', commitErr);
              res.status(500).send('Commit failed');
            });
          }

          res.sendStatus(200);
        });
      });
    });
  });
});

app.post('/downvote-question', (req, res) => {
  const { question_id } = req.body;

  const updateQuery = `
    UPDATE Question
    SET downvote = downvote + 1
    WHERE question_id = ?
  `;

  db.query(updateQuery, [question_id], (err) => {
    if (err) {
      console.error('Failed to downvote question:', err);
      return res.status(500).send('Failed to downvote');
    }
    res.sendStatus(200);
  });
});


app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
