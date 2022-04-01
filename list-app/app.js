const express = require('express');
const mysql = require('mysql');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

const connection = mysql.createConnection({
    // データベース名、パスワードなど
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'progate',
});

app.get('/', (req, res) => {
    res.render('top.ejs');
});

app.get('/index', (req, res) => {
    connection.query('SELECT * FROM list_app', (error, results) => {
        //console.log(results);
        res.render('index.ejs', { items: results });
    });
});

app.get('/new', (req, res) => {
    res.render('new.ejs');
});

app.post('/create', (req, res) => {
    // データベースに追加する処理を書いてください
    connection.query(
        'INSERT INTO list_app (name) VALUES (?)',
        [req.body.itemName],
        (error, results) => {
            res.redirect('/index');
        }
    );
});

app.post('/delete/:id', (req, res) => {
    //console.log(req.params.id);
    connection.query(
        'DELETE FROM list_app WHERE id = ?',
        [req.params.id],
        (error, results) => {
            res.redirect('/index');
        }
    );
});

app.get('/edit/:id', (req, res) => {
    connection.query(
        'SELECT * FROM list_app WHERE id = ?',
        [req.params.id],
        (error, results) => {
            res.render('edit.ejs', { item: results[0] });
        }
    );
});

app.post('/update/:id', (req, res) => {
    connection.query(
        'UPDATE list_app SET name = ? WHERE id = ?',
        [req.body.itemName, req.params.id],
        (error, results) => {
            res.redirect('/index');
        }
    );
});

app.listen(3000);
