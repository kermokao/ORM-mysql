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

app.use(express.static('public'))

const mysql = require('mysql')

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))

// create database connection
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qwerty',
    database: 'joga_mysql'
})

con.connect(function (err) {
    if (err) throw err
    console.log('Connected to joga_mysql db')
})

// homepage
app.get('/', (req, res) => {
    const query = 'SELECT * FROM article'

    con.query(query, (err, result) => {
        if (err) throw err

        const articles = result

        res.render('index', {
            articles: articles
        })
    })
})

// show article by slug
app.get('/article/:slug', (req, res) => {
    const query = `
        SELECT article.*, author.name AS author_name
        FROM article
        JOIN author ON article.author_id = author.id
        WHERE article.slug = ?
    `

    con.query(query, [req.params.slug], (err, result) => {
        if (err) throw err

        const article = result.length ? result[0] : null

        if (!article) {
            return res.status(404).send('Article not found')
        }

        res.render('article', {
            article: article
        })
    })
})

// app start point
app.listen(3003, () => {
    console.log('App is started at http://localhost:3003')
})
