const User = require('../models/user')
const passport = require('passport');



module.exports.renderRegister = (req, res)=>{
    res.render('users/register')
}


module.exports.register =  async (req,res)=>{
    try{
        const {username, email, password} = req.body;
        const user =  new User({username, email});
        const registeredUser= await User.register(user, password);
        req.login(registeredUser, err =>{
            if(err) return next(err);
            console.log(registeredUser);
            req.flash('success','Welcome to Campground');
            res.redirect('/campgrounds')
        })
  } catch(e){
        req.flash('error', e.message);
        res.redirect('/register')
}
}


module.exports.renderLogIn = (req, res)=>{
    res.render('users/login')
}


module.exports.login =  (req, res)=>{
    req.flash('success', 'Welcome back !');
    const redicrectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redicrectUrl)
}

module.exports.logout = (req, res)=>{
    req.logout();
    req.flash('success', 'GoodBye');
    res.redirect('/campgrounds')
}