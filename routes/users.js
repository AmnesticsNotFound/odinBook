var express = require('express');
var router = express.Router();
var express = require('express');
var router = express.Router();
const Post = require("../models/post.js");
const User = require("../models/user.js");
const postController = require("../controllers/postController");
const userController = require("../controllers/userController");

function checkAuth(req,res,next) {
    if (req.isAuthenticated()) {
      next();
    }
    else {
      res.redirect('/');
    }
  }

router.get('/profile/:userID', checkAuth, userController.getUser);

router.get('/usersList', checkAuth, userController.usersList);

router.post("/updatePending", checkAuth, userController.updatePending);

router.post("/removeFollow", checkAuth, userController.removeFollow);

router.get("/inbox", checkAuth, userController.inbox);

router.post("/updateFollow", checkAuth, userController.updateFollow);

module.exports = router;
