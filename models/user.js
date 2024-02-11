const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username:{type:String, required:true, maxlength:20}, 
  password:{type:String, required:true, maxLength:100},
  followList:[{type:Schema.Types.ObjectId,ref: "User", required:false}],
  pendingList:[{type:Schema.Types.ObjectId,ref: "User", required:false}],
  img:{type:String, required: false},
  //lastReceiver:{type:Schema.Types.ObjectId,ref: "MessageList", required: false},
  //currentReceiver:{type:String, required: false},
});


// Virtual for user's URL
UserSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/user/${this._id}`;
});

// Export model
module.exports = mongoose.model("User", UserSchema);
