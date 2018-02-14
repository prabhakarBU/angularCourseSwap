(function() {
  "use strict";
  
  var express = require("express");
  var router = express.Router();

  var mongoose = require("mongoose");
  var Post = mongoose.model("Post");
  var Comment = mongoose.model("Comment");

  var jwt = require("express-jwt");
  var auth = jwt({
    secret: "SECRET", // TODO again, this should be stored in an ENV variable and kept off the codebase, same as it is in the User model
    userProperty: "payload"
  });
  
  router.route("/posts/:post/comments")
    .post(auth, function(req, res, next) {
      //console.log("adding new comment ");
      var comment = new Comment(req.body);
      comment.post = req.post;
      comment.upvotes = 1;
      comment.usersWhoUpvoted.push(req.payload._id);
      comment.locked = false;
      //console.log("\n "+ req.post.locked + " || " + req.post.lockedWith === comment.authorString );
      //check if post is locked and also if post.lockedWith == currentUserId , update comment.locked = post.locked
//      console.log( comment.post.lockedWith == comment.author);
//      console.log(comment.post.lockedWith.equals(comment.author));
//      console.log( req.post.lockedWith == comment.author);
//      console.log( req.post.lockedWith.equals(comment.author));

if(req.post.lockedWith === comment.authorString){
  comment.locked = req.post.locked;
}
/*
if(req.post.lockedWith === '' ){
        console.log("locked with is empty");
        comment.locked = false;        
      }
      else{
        console.log("locked with exists !! ");
        if(req.post.lockedWith.equals(comment.authorString) == true){
          comment.locked = req.post.locked;
        }
      }
   */ 
      
//      console.log("current comment : "+ comment._id + " : author : " + comment.author);
      
//      console.log("all comments : "+ req.post.comments );
//     console.log("all comments individually : ");
      
//      for(var i=0;i<req.post.comments.length;i++){

//        console.log(req.post.comments[i]);

//      }
      

//console.log(comment.author.username + "----------------checkingif commenter is not post author" + req.post.author.username);
//console.log("\n"+ comment.author.equals(req.post.author));
comment.save(function(err, comment) {
        if (err) {
          return next(err);
        }

        req.post.comments.push(comment);
        if(comment.author.equals(req.post.author) === false){
          req.post.usersWhoCommented.push(comment.author);
        }
        req.post.save(function(err, post) {
          if (err) {
            return next(err);
          }

          Comment.populate(comment, {
            path: "author",
            select: "username"
          }).then(function(comment) {
            res.json(comment);
          });
        })
      })
    });

  router.route("/posts/:post/comments/:comment")
    .delete(auth, function(req, res, next) {
      // TODO better, more standard way to do this?
      if (req.comment.author != req.payload._id) {
        res.statusCode = 401;
        return res.end("invalid authorization");
      }

      // TODO better way to handle this?
      req.post.comments.splice(req.post.comments.indexOf(req.comment), 1);
      req.post.save(function(err, post) {
        if (err) {
          return next(err);
        }

        req.comment.remove(function(err) {
          if (err) {
            return next(err);
          }

          // TODO what's the best practice here?
          res.send("success");
        });
      });
    });

    router.route("/posts/:post/comments/:comment/locked")
    .put(auth, function(req, res, next) {
      req.comment.lockingComment(req.payload, function(err, comment) {
        //console.log("inside router locking now !!");
        if (err) {
          return next(err);
        }

        Comment.populate(comment, {
          path: "author",
          select: "username"
        }).then(function(comment) {
          res.json(comment);
        });
      });


    });

    router.route("/posts/:post/locked")
    .put(auth, function(req, res, next) {
      //console.log("inside router !");
      var comment = new Comment(req.body);
      //console.log("==="+req.post.locked+" | " + comment.authorString);
      req.post.lockedWith = comment.authorString;
      /*
      if(req.post.locked == false){
      }
      else{
        req.post.lockedWith = "";
      }*/

      req.post.lockingPost(req.payload, function(err, post) {
        if (err) {
          return next(err);
        }

        Post.populate(post, {
          path: "author",
          select: "username"
        }).then(function(post) {
          res.json(post);
        });
      });
    });

    router.route("/posts/:post/comments/:comment/upvote")
    .put(auth, function(req, res, next) {
      req.comment.upvote(req.payload, function(err, comment) {
        if (err) {
          return next(err);
        }

        Comment.populate(comment, {
          path: "author",
          select: "username"
        }).then(function(comment) {
          res.json(comment);
        });
      });
    });

  router.route("/posts/:post/comments/:comment/downvote")
    .put(auth, function(req, res, next) {
      req.comment.downvote(req.payload, function(err, comment) {
        if (err) {
          return next(err);
        }

        Comment.populate(comment, {
          path: "author",
          select: "username"
        }).then(function(comment) {
          res.json(comment);
        });
      });
    });

  router.param("post", function(req, res, next, id) {
    var query = Post.findById(id);

    query.exec(function(err, post) {
      if (err) {
        return next(err);
      }

      if (!post) {
        return next(new Error("can't find post"));
      }

      req.post = post;
      return next();
    });
  });

  router.param("comment", function(req, res, next, id) {
    var query = Comment.findById(id);

    query.exec(function(err, comment) {
      if (err) {
        return next(err);
      }

      if (!comment) {
        return next(new Error("can't find comment"));
      }

      req.comment = comment;
      return next();
    });
  });

  module.exports = router;
})();
