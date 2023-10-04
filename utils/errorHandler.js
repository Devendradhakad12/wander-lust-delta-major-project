
// create error
 const createError = (status, msg) => {
  const err = new Error();
  err.status = status;
  err.message = msg;
  return err;
};

//* next error hnadler
  const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.status || 500;
  const message =  err.message
  res.status(statusCode).render("error.ejs",{message})

};

const catchErrorHandler = (res, err, next) => {
    //* Try Catch error Handler
    // wrong mongo db id
    if (err.name == "CastError") {
      const message = `Invailid: ${err.path}`;
      return next(createError(500, message));
    }
    // validation error
    else if (err.name === "ValidationError") {
      return next(createError(400,err.message))
    }
    // mongoose duplicate key error
    else if (err.code === 11000) {
      return next(
        createError(400, `Duplicate ${Object.keys(err.keyValue)} Enterd`)
      );
    }
    // wrong jwt error
    else if (err.name === "jsonWebTokenError") {
      return next(createError(400, `Json Web Token is invalid, try again`));
    }
    // Jwt  expire error
    else if (err.name === "TokenExpireError") {
      return next(createError(400, `Json Web Token is expire, try again`));
    }
    // MongoDB Parse Error
    else if (err.name === "MongoParseError") {
      return next(createError(400, `MongoParseError ${err.message}`));
    } else {
      next(err);
    }
  };
  
  
  // wrapAsync
  function wrapAcync(func) {
    return function(req,res,next){
      func(req,res,next).catch((err)=> catchErrorHandler(res,err,next) )
    }
  }
  
  module.exports = {catchErrorHandler,errorHandler,createError,wrapAcync}