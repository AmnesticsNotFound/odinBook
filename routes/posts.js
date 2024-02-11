var express = require('express');
var router = express.Router();
const Post = require("../models/post.js");
const postController = require("../controllers/postController");
//var appFunc = require("../app");

function checkAuth(req,res,next) {
    if (req.isAuthenticated()) {
      next();
    }
    else {
      res.redirect('/');
    }
  }
  

router.get('/getCreatePost', checkAuth, postController.getCreatePost);

router.post('/createPost', checkAuth, postController.createPost);

router.post('/createComment/:postId',checkAuth, postController.createComment)

router.post('/updateLikes/:likesID',checkAuth, postController.updateLikes)

//Order matters, put the 
router.get('/:id', checkAuth, postController.getPost);

module.exports = router;
