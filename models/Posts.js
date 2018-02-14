var mongoose = require("mongoose");

var PostSchema = new mongoose.Schema({
  title: String,
  locked: Boolean,
  lockedWith: String,
  usersWhoCommented: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  requesttype:String,
  link: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  authorName: String,
  upvotes: {
    type: Number,
    default: 0
  },
  downvotes: {
    type: Number,
    default: 0
  },
  usersWhoUpvoted: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  usersWhoDownvoted: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }]
});

PostSchema.methods.lockingPost = function(user, callback) {
  //Check what is the current lock status first , then update
  if(this.locked == false){
    this.locked = true;
    this.save(callback);
    
  }
  else{
    this.locked = false;
    this.save(callback);
  }
}

PostSchema.methods.upvote = function(user, callback) {
  // If this user hasn't upvoted yet:
  if (this.usersWhoUpvoted.indexOf(user._id) == -1) {
    this.usersWhoUpvoted.push(user._id);
    this.upvotes++;

    // If this user has downvoted, revert the downvote:
    if (this.usersWhoDownvoted.indexOf(user._id) != -1) {
      this.usersWhoDownvoted.splice(this.usersWhoDownvoted.indexOf(user._id), 1);
      this.downvotes--;
    }

    this.save(callback);
  } else {
    // TODO this violates idempotency of PUT, we should have another PUT method for reverting an upvote - or does it?
    this.usersWhoUpvoted.splice(this.usersWhoUpvoted.indexOf(user._id), 1);
    this.upvotes--;

    this.save(callback);
  }
}

PostSchema.methods.downvote = function(user, callback) {
  if (this.usersWhoDownvoted.indexOf(user._id) == -1) {
    this.usersWhoDownvoted.push(user._id);
    this.downvotes++;

    // If this user has upvoted, revert the upvote:
    if (this.usersWhoUpvoted.indexOf(user._id) != -1) {
      this.usersWhoUpvoted.splice(this.usersWhoUpvoted.indexOf(user._id), 1);
      this.upvotes--;
    }

    this.save(callback);
  } else {
    // TODO this violates idempotency of PUT, we should have another PUT method for reverting an upvote
    this.usersWhoDownvoted.splice(this.usersWhoDownvoted.indexOf(user._id), 1);
    this.downvotes--;

    this.save(callback);
  }
}

mongoose.model("Post", PostSchema);
