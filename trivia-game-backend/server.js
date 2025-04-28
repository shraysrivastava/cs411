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



app.get('/get-game-sessions', (req, res) => {
  const { userId } = req.query;
  const query = `
    SELECT session_id, time_elapsed, score, num_correct, attempts
    FROM GameSession
    WHERE userId = ?
    ORDER BY session_id DESC
    LIMIT 20;
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Game sessions query error:', err);
      res.status(500).send('Query failed');
    } else {
      res.json(results);
    }
  });
});

app.get('/get-user', (req, res) => {
  const { username } = req.query;
  const query = `
    SELECT userId
    FROM User
    WHERE username = ?;
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Fetch user error', err);
      res.status(500).send('Query failed');
    } else {
      res.json(results);
    }
  });
});

app.get('/get-session-questions', (req, res) => {
  const { sessionId } = req.query;
  const query = `
    SELECT q.question_text, gsq.is_correct
    FROM GameSessionQuestion gsq
    JOIN Question q ON gsq.question_id = q.question_id
    WHERE gsq.session_id = ?;
  `;

  db.query(query, [sessionId], (err, results) => {
    if (err) {
      console.error('Session questions query error:', err);
      res.status(500).send('Query failed');
    } else {
      res.json(results);
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

app.get('/user-questions', (req, res) => {
  const userId = req.query.user_id;

  const query = `SELECT * FROM Question WHERE user_id = ?`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user questions:', err);
      return res.status(500).send('Failed to fetch questions');
    }
    res.json(results);
  });
});

app.post('/add-question', (req, res) => {
  const { question_text, correct_answer, option1, option2, option3, category_id, difficulty, user_id } = req.body;

  const query = `
    INSERT INTO Question (question_text, correct_answer, option1, option2, option3, category_id, difficulty, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [question_text, correct_answer, option1, option2, option3, category_id, difficulty, user_id], (err, result) => {
    if (err) {
      console.error('Error adding question:', err);
      return res.status(500).send('Failed to add question');
    }
    res.json({ success: true, question_id: result.insertId });
  });
});

// Edit a question
app.put('/edit-question', (req, res) => {
  const { question_id, question_text, correct_answer, option1, option2, option3, category_id, difficulty } = req.body;

  const query = `
    UPDATE Question
    SET question_text = ?, correct_answer = ?, option1 = ?, option2 = ?, option3 = ?, category_id = ?, difficulty = ?
    WHERE question_id = ?
  `;

  db.query(query, [question_text, correct_answer, option1, option2, option3, category_id, difficulty, question_id], (err) => {
    if (err) {
      console.error('Error editing question:', err);
      return res.status(500).send('Failed to edit question');
    }
    res.json({ success: true });
  });
});

// Delete a question
app.delete('/delete-question', (req, res) => {
  const { question_id } = req.query;

  const query = `DELETE FROM Question WHERE question_id = ?`;

  db.query(query, [question_id], (err) => {
    if (err) {
      console.error('Error deleting question:', err);
      return res.status(500).send('Failed to delete question');
    }
    res.json({ success: true });
  });
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
