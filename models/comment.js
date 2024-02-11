const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    user:{type:Schema.Types.ObjectId, ref: "User", required:true},
    post:{type:Schema.Types.ObjectId, ref: "Post", required:true},
    timestamp:{type:Date, default:Date.now()},
    body:{type:String, minLength:1, maxLength: 1000, required:true},
});


// Virtual for message's URL
CommentSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/comment/${this._id}`;
});

// Export model
module.exports = mongoose.model("Comment", CommentSchema);
