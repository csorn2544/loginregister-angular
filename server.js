const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt'); 
const app = express();
const port = 3000;


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'activitydb',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

app.use(bodyParser.json());
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;
  const defaultUserRole = 'user'; // Set your default role here

  // Check if the username already exists in the database
  db.query('SELECT * FROM users WHERE username = ?', [username], (checkErr, checkResult) => {
    if (checkErr) {
      console.error('Error checking username:', checkErr);
      res.status(500).json({ success: false, message: 'Registration failed. Please try again later.' });
      return;
    }

    if (checkResult.length > 0) {
      // Username already exists
      res.status(400).json({ success: false, message: 'Username already exists. Please choose a different username.' });
      return;
    }

    // Hash and salt the password before storing it
    bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
      if (hashErr) {
        console.error('Error hashing password:', hashErr);
        res.status(500).json({ success: false, message: 'Registration failed. Please try again later.' });
        return;
      }

      // Insert the user into the database with the hashed password and default role
      db.query(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        [username, email, hashedPassword, defaultUserRole],
        (insertErr, result) => {
          if (insertErr) {
            console.error('Error registering user:', insertErr);
            res.status(500).json({ success: false, message: 'Registration failed. Please try again later.' });
            return;
          }

          // Query the database to confirm the user's details, including the role
          db.query('SELECT * FROM users WHERE id = ?', [result.insertId], (selectErr, selectResult) => {
            if (selectErr) {
              console.error('Error selecting user after registration:', selectErr);
              res.status(500).json({ success: false, message: 'Registration successful, but error retrieving user details.' });
              return;
            }

            const newUser = selectResult[0];

            res.json({
              success: true,
              message: 'Registration successful',
              user: { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role },
            });
          });
        }
      );
    });
  });
});





app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  console.log('Login request received for username:', username);

  if (!username) {
    res.status(400).json({ success: false, message: 'Username is required for login.' });
    return;
  }

  const query = 'SELECT * FROM users WHERE username = ?';

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error during login query:', err);
      res.status(500).json({ success: false, message: 'Login failed. Please try again later.' });
      return;
    }

    console.log('Results from the database:', results);

    if (results.length === 0) {
      res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    } else {
      const user = results[0];

      bcrypt.compare(password, user.password, (bcryptErr, passwordMatch) => {
        if (bcryptErr) {
          console.error('Error comparing passwords:', bcryptErr);
          res.status(500).json({ success: false, message: 'Login failed. Please try again later.' });
          return;
        }

        console.log('Password match result:', passwordMatch);

        if (passwordMatch) {
          res.json({
            success: true,
            message: 'Login successful',
            user: { id: user.id, username: user.username, email: user.email },
          });
        } else {
          res.status(401).json({ success: false, message: 'Invalid credentials. Passwords do not match.' });
        }
      });
    }
  });
});



app.get('/api/users/user-activities/:userId', (req, res) => {
  const userId = req.params.userId;

  db.query('SELECT * FROM users WHERE id = ?', [userId], (checkUserErr, checkUserResult) => {
    if (checkUserErr) {
      console.error('Error checking user:', checkUserErr);
      res.status(500).json({ success: false, message: 'Error checking user.' });
      return;
    }

    if (checkUserResult.length === 0) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }
    db.query('SELECT * FROM activity WHERE user_id = ?', [userId], (err, results) => {
      if (err) {
        console.error('Error fetching user activities:', err);
        res.status(500).json({ success: false, message: 'Error fetching user activities.' });
        return;
      }

      res.json({ success: true, activities: results });
    });
  });
});

  


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
