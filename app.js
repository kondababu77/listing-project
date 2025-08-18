require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const listing = require('./model_listing/model.js');
const path = require('path');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const wrapAsync = require('./utils/warpAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const {listingSchema,reviewSchema} = require('./scheama.js');
const review = require('./model_listing/review.js');
const listings = require('./routers/listings.js');
const reviews = require('./routers/reviews.js')
const userRouter = require('./routers/userRouter.js')

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport')
const LocalStrategy = require('passport-local');
const User = require('./model_listing/user.js')

app.engine('ejs',engine);
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,'/public')));

const dbURl = process.env.ATLASDB_URL

async function main() {
    await mongoose.connect(dbURl);
}

main().then(()=>{
    console.log('Connection successful');
}).catch((err) =>{
    console.log('Connection failed');
});



const store = MongoStore.create({
    mongoUrl : dbURl,
    crypto :{
        secret : 'mysecretcode'
    },
    touchAfter : 24*3600,
})
store.on('error', ()=>{
    console.log('Error in MONGO SESSION STORE');
})
const options = {
    store,
    secret: "mysecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, 
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) 
    }
};




app.use(session(options));
app.use(flash());

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error'); 
    res.locals.currUser = req.user;
    next();
})




app.get('/', wrapAsync(async (req, res, next) => {
    let AllListings = await listing.find();

    res.render('./listings/index.ejs', { AllListings });
}));
app.use("/listings", listings);
app.use("/listings/:id", reviews);
app.use("/",userRouter);

app.all("/*path", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).render('./listings/error.ejs',{err});
});

app.listen(3000, ()=>{
    console.log('App running on port 3000');
});
