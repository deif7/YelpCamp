if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session')
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError=require('./utils/ExpressError');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize');
const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews')


// const dbUrl = process.env.DB_URL
const dbUrl =  'mongodb://localhost:27017/yelp-camp';
// 'mongodb://localhost:27017/yelp-camp'
//process.env.DB_URL ||

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
mongoose.set('useFindAndModify', false);


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'))) // To reach the directory
app.use(mongoSanitize());

// const store = new MongoDBStore({
//     url : dbUrl,
//     secret: 'thisshoutbeabettersecret',
//     touchAfter: 24 * 60 * 60
// });

// store.on('error', function(e){
//     console.log("SESSION STORE ERROR");
// })

const secret = process.env.CLOUDINARY_SECRET || 'thisshoutbeabettersecret'

const sessionConfig = {
    name: 'session',
    secret,
    resave : false,
    saveUninitialized : true,
    coockie: {
        httpOnly:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

}

app.use(session(sessionConfig));
app.use(flash());



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));    

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next)=>{
   res.locals.currentUser = req.user; 
   res.locals.success = req.flash('success')
   res.locals.error = req.flash('error');
   next();
})


app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use ('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res)=>{
    res.render('home')
})
app.get('*', function (req, res) {
    const index = path.join(__dirname, 'build', 'index.html');
    res.sendFile(index);
  });

app.all('*',(req,res,next)=>{
   next(new ExpressError('Page not found', 404));
})

app.use((err,req,res,next)=>{
    const {statusCode=500}=err;
    if(!err.message) err.message="Oh no error"
    res.status(statusCode).render('error',{err})
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Serving on ${port}`);
})  