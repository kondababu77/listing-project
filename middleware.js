module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectURL = req.originalUrl
        req.flash('error','you must logged in create listing')
        return res.redirect('/login');
    }
    next();
}

module.exports.saveRedirectURL = (req,res,next)=>{
    if(req.session.redirectURL){
        res.locals.redirectURL = req.session.redirectURL;
    }
    next();
}