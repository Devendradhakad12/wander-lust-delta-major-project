module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Login first");
    res.redirect("/auth/login");
  }
  next();
};

module.exports.saveRedirect = (req,res,next) =>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl
  }else{
    res.locals.redirectUrl = "/listings"
  }
  next()
}