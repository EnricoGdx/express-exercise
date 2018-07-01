const express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('mongodb://Prova:Password1@ds125181.mlab.com:25181/express-exercise', ['users']);
var ObjectId = mongojs.ObjectId;

const port = process.env.PORT || 8080;

var app = express();

/*var logger = function(res, resp, next){

    console.log('Logging...');
    next();
}
app.use(logger);*/

//viev engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// set static path

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){

    res.locals.errors = null;
    next();
});

app.use(expressValidator());

app.get('/', function(req,res){

    db.users.find(function (err, docs){

        res.render('index', {
            title: 'Customers',
            users: docs
        });
    });
});

app.post("/users/add", function(req, res){

    req.checkBody('first_name', 'First Name is Required').notEmpty();
    req.checkBody('last_name', 'Last Name is Required').notEmpty();
    req.checkBody('email', 'E-mail is Required').notEmpty();

    var errors = req.validationErrors();

    if(errors){
        res.render('index', {
            title: 'Customers',
            users: users,
            errors: errors
        });
    } else{
        
        var newUser = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
        }

        db.users.insert(newUser, function(err, result){

            if(err){
                console.log(err);
            }
            else {
                res.redirect('/');
            }
        })
    }
});

app.delete('/users/delete/:id', function(req, res){

    db.users.remove({_id: ObjectId(req.params.id)}, function(err, result){
        if(err){
            console.log(err);
        }
        res.redirect('/');
    });
});

app.listen(port, function(){
    
    console.log('Server stared on port ' + port + '...');
})