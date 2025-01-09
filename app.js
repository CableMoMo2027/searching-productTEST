const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();

const PORT = 3000;

//MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'june123456789',
    database: 'products',
    port: '3306'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connection to MySQL Database');
});

//Middleware
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));

//Route
app.get('/', (req,res) => {
    res.render('index', {products: [], query: ''});
});

app.post('/search', (req, res) => {
    const query = req.body.query;
    const sql = `SELECT * FROM product WHERE name LIKE ? or description LIKE ?`;

    db.query(sql, [`%${query}%`,`%${query}%`], (err, results) => {
        if(err) throw err;
        res.render('index', {products: results, query: query });
    });

});

app.get('/add', (req, res) => {
    res.render('add-product');
});

app.post('/add-product', (req, res) => {
    const {pname, price, desc} = req.body;
    const sql = `INSERT INTO product (name,price,description) VALUES (?,?,?)`;
    db.query(sql, [pname, price, desc], (err, result) => {
        if(err) throw err;
        console.log("Product added: ", result);
        res.redirect('/');
    });
});

//Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});