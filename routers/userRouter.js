const express = require('express');
const router = express.Router();
const User = require('../model_listing/user');
const passport = require('passport');
const { saveRedirectURL } = require('../middleware');

router.get('/signup', (req, res) => {
    res.render('./listings/signup.ejs');
})

router.post('/signup', async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ email, username });
        let regUser = await User.register(newUser, password);
        req.login(regUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to wanderlust')
            res.redirect('/listings')
        })
    } catch (err) {
        req.flash('success', 'Already username exist')
        res.render('./listings/signup.ejs');
    }
});

router.get('/login', async (req, res) => {
    res.render('./listings/login.ejs');
});

router.post('/login', saveRedirectURL,passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), async (req, res) => {
    req.flash('success', 'Welcome back to wanderlust')
    let redirectURL = res.locals.redirectURL || '/listings';
    res.redirect(redirectURL)
})

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            next(err);
        } else {
            req.flash('success', 'you are logged out');
            res.redirect('/listings');
        }
    })
})

module.exports = router;