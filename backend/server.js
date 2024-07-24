const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Pranjal@12345',
    database: 'personaldetails'
});

db.connect((err) => {
    if(err) {
        throw err;
    }
    console.log('Connected to MySQL Database')
});

app.post('/submit', (req, res) => {
    const { firstName, lastName, phone, email } = req.body;
    const sql = 'INSERT INTO users (firstName, lastName, phone, email) VALUES (?, ?, ?, ?)';
    db.query(sql, [firstName, lastName, phone, email], (err, result) => {
        if(err) {
            return res.status(500).send(err);
        }
        res.send('User Data Saved!');
    });
});

app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, phone, email } = req.body;
    console.log(`Updating user with ID ${id}:`, req.body);
    const sql = 'UPDATE users SET firstName = ?, lastName = ?, phone = ?, email = ? WHERE id = ?';
    db.query(sql, [firstName, lastName, phone, email, id], (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            return res.status(500).send(err);
        }
        console.log('User data updated:', result);
        res.send('User Data Updated!');
    });
});


app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).send(err);
        }
        res.send('User Data Deleted!');
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});