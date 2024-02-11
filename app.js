if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

var createError = require('http-errors');
var express = require('express');
var path = require('path');
//var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");
const passport = require("passport");
//const dotenv = require('dotenv').config();
//const dotenv2 = require('dotenv')
const flash = require('express-flash');
const session = require("express-session");
const methodOverride = require('method-override');
//const { cookie } = require('express-validator');
const User = require("./models/user");
const Post = require("./models/post");
const mongoDb = process.env.MONGODB_URL;
const bcrypt = require("bcrypt");

const fs = require('fs');// I prefer require statements outside of function
const multer = require("multer");
const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload = multer({
  dest: "/home/adrian/OdinStuff/Node/OdinBook/public/uploads"
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));


const initializePassport = require('./passport-config');
initializePassport(passport,
  async(username) => {
   let users = await User.find().populate("followList").sort({id:1}).exec();
   //console.log(users);
   return users.find(user => user.username === username);
 },
  async(id) => {
   let users = await User.find().populate("followList").sort({id:1}).exec();
   //console.log(users.find(user => user.id === id));
   return users.find(user => user.id === id);
 }
);

function getRandomInt(max) {
  return Math.floor(Math.random() * max).toString();
}


var indexRouter = require('./routes/index');
var postsRouter = require('./routes/posts');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());


app.use(express.urlencoded({ extended: false }));
app.use(flash())
app.use(session({
  secret: getRandomInt(100).toString(),
  resave:false,
  saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session());
app.use(methodOverride('_method'));
//app.use(cookieParser());

app.use(express.static('public'))
app.use(express.static(path.join(__dirname, 'public')));
app.use("/public/javascripts", express.static('./public/javascripts'));
app.use(express.static(path.join(__dirname, 'public', 'stylesheets')));
app.use(express.static(__dirname + 'views'));
app.use(express.static(path.join(__dirname, 'public', 'images')));
app.use(express.static(path.join("/home/adrian/", 'Downloads')));//LOOK HERE





app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);



app.get('/', checkAuthLogin, async(req, res, next) => {
  res.render('login.pug');
});

app.get('/homepage', checkAuth, async(req, res, next) => {
  console.log(req.user);
  let posts = await Post.find().populate("user").sort({id:1}).exec();
    res.render('homepage.pug', {
      user:req.user,
      posts: posts,
    });

  
});

app.get("editProfile", checkAuth, async(req,res,next)=> {
  res.render("editProfile", {
    user:req.user,
  })
})

app.post('/', passport.authenticate('local', {
  successRedirect: '/homepage',
  failureRedirect: '/',
  failureFlash:true
}));



app.post("/register", upload.single("file"), async(req, res) => {
  
  //let imageAdd = "/home/adrian/Downloads/" + req.body.img;
  console.log(req.file);
  const tempPath = req.file.path;
  const targetPath = `/home/adrian/OdinStuff/Node/OdinBook/public/images/${req.file.originalname}`;
  if (req.file.mimetype !== "image/png" && req.file.mimetype !== "image/jpeg") {
    fs.unlink(tempPath, (err) => {
      if (err) throw err //handle your error the way you want to;
      console.log('File was deleted');//or else the file will be deleted
        });
    res.render("register",{
      error: "Image must be a .png or .jpg"
    });
    
  }
  else {
    fs.rename(tempPath, targetPath, err => {
      //add error check, prompt user for correct file if incorrect?
      //if (err) return handleError(err, res);

        
        
    });
  
  
  // destination will be created or overwritten by default.
  /*fs.copyFile(imageAdd, "/home/adrian/OdinStuff/Node/OdinBook/public/images", (err) => {
    if(err) throw err;
      console.log('copied image')
  });
  console.log(imageAdd);*/
try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password:hashedPassword,
      followList:[],
      img:"/" + req.file.originalname,
    });
    //user.save();
    res.redirect('/');
  } catch {
  res.redirect("/register");
}
  }
//console.log(users);
});

app.delete('/logout', (req,res) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    else {
      res.redirect('/');
    }
  });
})

function checkAuth(req,res,next) {
  if (req.isAuthenticated()) {
    next();
  }
  else {
    res.redirect('/');
  }
}

function checkAuthLogin(req,res,next) {
  if (req.isAuthenticated()) {
    res.redirect('/homepage');
  }
  else {
    next();
  }
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
