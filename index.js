// application packages
const express = require('express')
const app = express()

const path = require('path')

// add template engine
const hbs = require('express-handlebars')
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/'
}))

app.use(express.static("public"));

const mysql = require('mysql')

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))

// create database connection
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qwerty',
    database: 'joga_mysql'
})

con.connect(function(err) {
    if (err) throw err
    console.log("Connected to joga_mysql db");
})

// show all articles - index page
app.get('/', (req, res) => {
    const query = 'SELECT * FROM article';

    con.query(query, (err, result) => {
        if (err) throw err;

        const articles = result || [];
        console.log(articles);

        res.render('index', { articles });
    });
});

// app start point
app.listen(3003, () => {
    console.log('App is started at http://localhost:3003')
});

