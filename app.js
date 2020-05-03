const express = require('express');
const bodyParser  =  require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const request = require('request');
const cheerio = require('cheerio');

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

const url = "https://www.teamsportia.se/produktkategori/cykel/klassiska-cyklar/damcyklar/";

// home route
app.get('/', function(req, res){
    req.flash('success', 'this is a message');



    request(url, function (err, enres, body) { // Ladd in sidan
        if(err)
        {
            console.log(err, "error loading page");
        }
        else
        {
            var priser = [];
            let $ = cheerio.load(body);  // Ladda hela sidan

            // För värje listelement
            $('.site-main ul.products.columns-3 li.product').each(function(index){
                const Name = $(this).find('h2').text();     // Hitta Namn
                const Price = $(this).find('span.woocommerce-Price-amount').text(); //Hitta Pris
                const Img   = $(this).find('img').attr('src');
                console.log('Namn: ',Name,' Pris:', Price);

                wop = {name:Name,price:Price,img:Img}
                priser.push(wop);
            });
            //console.log(priser)

            res.render('index', {//pass variables
                    title:'Events',
                    events:priser,
                });
        }
    });

});


let articles = require('./routes/articles');
app.use('/articles', articles);


// start server
var server = app.listen(3000, function(){ // start server & make var available importable
    console.log('server started');
});
