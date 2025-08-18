const express = require('express');
const app = express();
const session = require('express-session');
const engine = require('ejs-mate');
const path = require('path');
const flash = require('connect-flash');

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: 'mysupersecretstring', 
    resave: false, 
    saveUninitialized: true 
}));
app.use(flash());

app.get('/test', (req, res) => {
    if (req.session.count) {
        req.session.count++;
    } else {
        req.session.count = 1;
    }
    res.send(`Your session count ${req.session.count}`);
});

app.get('/details', (req, res) => {
    let { name } = req.query;
    req.session.name = name;
    req.flash("success", "User registered successfully");
    res.render('page.ejs', {
        name: req.session.name,
        msg: req.flash('success')
    });
});

app.listen(3000, () => {
    console.log('Server is running on 3000');
});
