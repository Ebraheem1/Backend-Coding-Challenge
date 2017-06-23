var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var router= require('./app/routes');
var app = express();
//Database name is SocialPlatform
var DB_URI = "mongodb://localhost:27017/SocialPlatform";
require('./config/passport')(passport);
// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
// View Engine
app.set('view engine','ejs');

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

//Passport init
app.use(passport.initialize());
app.use(passport.session());

//To remove the warning
mongoose.Promise = global.Promise;

//DB connection
mongoose.connect(DB_URI, function(err) {
    if (err) {
        console.log('There is an erroor: ' + err);

    } else {
        console.log('Success!');
    }
});

// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));
// Connect Flash
app.use(flash());
//Global Vars
app.use(function (req, res, next) {
  res.locals.req = req;
  res.locals.res = res;
  res.locals.errors=null;
  res.locals.message = req.message;
  res.locals.user = req.user || null;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//using the routes file
app.use(router);

app.listen(8080, function() {

    console.log('The server is listening on port 8080.....');

});