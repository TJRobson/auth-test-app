var express = require('express')
var exphbs = require('express-handlebars')
var bodyParser = require('body-parser')
var expressSession = require('express-session')
var passport = require('passport')
var config = require('./knexfile')[process.env.NODE_ENV || 'development']
var knex = require('knex')(config)
var KnexSessionStore = require('connect-session-knex')(expressSession)
var users = require('./lib/users')
var flash = require('connect-flash')

var app = express()

 app.engine('handlebars', exphbs({defaultLayout: 'main'}))
 app.set('view engine', 'handlebars')
 app.use(bodyParser.urlencoded({ extended: false }))



app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: "I got a secret can you keep it",
  store: new KnexSessionStore({knex: knex})
}))

app.use(flash())
app.use(passport.initialize())
app.use(passport.session())



 app.get('/', function (req, res) {
  res.render('login-page')
 })

 app.get('/home-page', function (req, res){
   res.render('home-page')
 })

app.post('/signup', function (req, res) {
  if(users.exists(req.body.email)) {
    req.flash('error', 'User already exists')
    return res.redirect('/signup')
  }
  users.create(req.body.email, req.body.hash)
    .then( function () {
      res.render('home-page')
    })
    .catch( function (err) {
      console.log(err)
    })

})



module.exports = app
