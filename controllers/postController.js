const Post = require("../models/post");
const Comment = require("../models/comment");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// eslint-disable-next-line no-undef
exports.getPost = async(req,res,next) => {  
    console.log("I think we got it");
    const postInfo = await Post.findOne({ _id: req.params.id }).populate("user").exec();
    let comments = await Comment.find().populate("user").populate("post").find({ post:req.params.id }).sort({_id:1}).exec();
    console.log(comments);
    res.render("post", {
        user:req.user,
        postInfo:postInfo,
        comments:comments,
    });
}

exports.getAllPosts = async(req,res,next) => {  
    //console.log("I think we got it");
    let posts = await Post.find().populate("user").sort({id:1}).exec();
    //let comments = await Comment.find().populate("user").populate("post").find({ post:req.params.id }).sort({_id:1}).exec();
    res.send({
        //user:req.user,
        posts:posts,
    });
}

// eslint-disable-next-line no-undef
exports.getCreatePost = async(req,res,next) => {
    res.render("create");
}

// eslint-disable-next-line no-undef
exports.createPost = [
    //console.log("hi");
    body("title")
    .trim()
    .isLength({min:1})
    .withMessage("Message must contain at least 1 character"),
    body("body")
    .trim()
    .isLength({min:1})
    .withMessage("Message must contain at least 1 character"),

    async (req,res,next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          console.log(req.body.text);
          res.send({
            errors:errors.errors
          })
        }
        else {
            let newPost = new Post({
                title:req.body.title,
                body:req.body.body,
                timestamp:Date.now(),
                user:req.user.id,
                likes:0
            })
            await newPost.save();
            console.log("Post Made");
            let posts = await Post.find().populate("user").sort({id:1}).exec();
            res.redirect("/homepage");
        }
    }

]

exports.createComment = [
    //console.log("hi");
    body("body")
    .trim()
    .escape()
    .isLength({min:1})
    .withMessage("Message must contain at least 1 character"),
    
    async (req,res,next) => {
        console.log(req.params.postId);
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          console.log(req.body.text);
          res.send({
            errors:errors.errors
          })
        }
        else {
            let newComment = new Comment({
                user:req.user,
                body:req.body.body,
                timestamp:Date.now(),
                post:req.params.postId
            })
            await newComment.save();
            console.log("Post Made");
            let posts = await Post.find().populate("user").sort({id:1}).exec();
            res.redirect(`http://localhost:3000/posts/${req.params.postId}`);
        }
    }

]

exports.updateLikes = async(req,res,next) => {
    //console.log(req.body.origin)
    let post = await Post.findOne({ _id: req.params.likesID });
    //console.log(req.user.id);
    if (post.likesArray.includes(req.user.id)) {
        console.log(post.likesArray);
        post.likes = post.likes - 1;
        let index = post.likesArray.indexOf(req.user.id);
        post.likesArray.splice(index,1);
        post.save();
        console.log(post.likesArray);
        res.send({
            user:req.user,
            msg:"failure",
        });
    }
    else {
        console.log("user liked");
        post.likes = post.likes + 1;
        post.likesArray.push(req.user.id);
        await post.save();
    // res.send("good");
    //console.log("gg");
        
        if (req.body.origin != null) {
            
            let posts = await Post.find().populate("user").sort({id:1}).exec();
            
            res.send({
                user:req.user,
                msg:"success",
            });
        }
        else {
            console.log("Render Page must be provided, check postController");
        }
}
}