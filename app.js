const express = require('express');
const bodyParser  =  require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');



var app = express();




// Load view Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// body-parser middle-ware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// set static path public folder
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({ cookie: { maxAge: 60000 },
                  secret: 'woot',
                  resave: false,
                  saveUninitialized: false}));

// express messagse mifddleware
app.use(require('connect-flash')());
app.use(function(req,res,next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// express validator mifddleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));


// home route
app.get('/', function(req, res){
    req.flash('info', 'this is a message');

    res.render('index', {//pass variables
            title:'Events',
            events: ['sf','sdgf','dsfg'],
            user: req.user
        });
});


let articles = require('./routes/articles');
app.use('/articles', articles);


// start server
var server = app.listen(3000, function(){ // start server & make var available importable
    console.log('server started');
});
