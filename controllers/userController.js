const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");


exports.getUser = async(req, res, next) => {
  console.log(req.params.userID)
    let posts = await Post.find().populate("user").find({ user:req.params.userID}).sort({id:1}).exec();
    let user2 = await User.findOne({_id: req.params.userID}).exec();
    
    res.render('profile', {
      user:req.user,
      user2:user2,
      posts:posts,
    });
  }

exports.usersList = async(req,res,next) => {
    let users = await User.find().sort({id:1}).exec();
    res.render('usersList', {
      users:users,
      user:req.user
    })
  }

exports.updatePending = async(req,res,next) => {
    let users = await User.find().sort({id:1}).exec();
    let receiver = await User.findOne({ _id:req.body.followReceiver}).exec();
    
      if(!receiver.pendingList.includes(req.user)) {
        receiver.pendingList.push(req.user);
        
        await receiver.save();
        res.render('usersList', {
          users:users,
          user:req.user
        })
      }
    }

exports.removeFollow = async(req,res,next)=> {
    let users = await User.find().sort({id:1}).exec();
    let receiver = await User.findOne({ _id:req.body.followReceiver}).exec();

    if(receiver.followList.includes(req.user._id)) {
      let follower = receiver.followList.indexOf(req.user._id);
      receiver.followList.splice(follower, 1);
      await receiver.save();
      res.render('usersList', {
        users:users,
        user:req.user
      })
    }
  }

exports.inbox = async(req,res,next) => {
    let users = await User.find().sort({id:1}).exec();
    let user = await User.findOne({_id:req.user._id}).populate("pendingList").exec();
    console.log(user);
    res.render('inbox', {
      users:users,
      user:user,
    });
  }

exports.updateFollow = async(req,res,next) => {
    //adding follower to follow list
    if (req.body.type == "accept") {
        req.user.followList.push(req.body.pendUser);
        await req.user.save();
        console.log("saved");
    }

    //getting index of follower in pending list so we may remove it. Once a user is in followList it no longer needs to be in pendingList
    let pendUser = req.user.pendingList.indexOf(req.body.pendUser);
    //console.log(req.user.pendingList);
    req.user.pendingList.splice(pendUser, 1);
    await req.user.save();

    let users = await User.find().sort({id:1}).exec();
    let user = await User.findOne({_id:req.user._id}).populate("pendingList").exec();
    res.render('inbox', {
        users:users,
        user:user,
      });
    //user.pendingList.remove
}