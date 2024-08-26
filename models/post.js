const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user:{type:Schema.Types.ObjectId, ref: "User", required:true},
    timestamp:{type:Date, default:Date.now()},
    body:{type:String, minLength:1, maxLength: 1000, required:true},
    title:{type:String, minLength:1, maxLength: 1000, required:true},
    likesArray:{type:Array},
    likes:{type:Number},
});


// Virtual for message's URL
PostSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/post/${this._id}`;
});

// Export model
module.exports = mongoose.model("Post", PostSchema);
