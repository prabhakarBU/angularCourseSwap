(function() {
  "use strict";

  var app = angular.module("flapper-news.controllers.post", [
    "ui.router"
  ]);

  app.config([
    "$stateProvider",
    function($stateProvider) {
      $stateProvider.state("post", {
        parent: "root",
        url: "/posts/{id}",
        views: {
          "container@": {
            templateUrl: "partials/post",
            controller: "PostController"
          }
        },
        resolve: {
          post: [
            "$stateParams",
            "postService",
            function($stateParams, postService) {
              return postService.get($stateParams.id);
            }
          ]
        },
      });
    }
  ]);

  app.controller("PostController", [
    "$scope",
    "postService",
    "post",
    "authService",
    function($scope, postService, post, authService) {
      $scope.isLoggedIn = authService.isLoggedIn;
      
      $scope.post = post;
      //$scope.courses = course;
      $scope.lockstatus = '';
      $scope.shouldShowAddNewCommentForm = false;

//      console.log("Showing all courses : " + courses );

      function addComment() {
        if ($scope.body === '') {
          return;
        }
              //console.log("adding new comment in controller");

        postService.addComment(post._id, {
          body: $scope.body,
          author: authService.currentUserId(),
          authorString: authService.currentUser()
        }).success(function(comment) {
          $scope.post.comments.push(comment);
        });

        $scope.body = "";
        $scope.shouldShowAddNewCommentForm = false;
      }


      //also put "lock":true , when same user adds new comment
      function lockComment(comment){
        //console.log("checking what's getting locked: "+ comment);
        postService.lockingComment(post,comment);
      }

      function incrementUpvotes(comment) {
        postService.upvoteComment(post, comment);
      }

      function incrementDownvotes(comment) {
        postService.downvoteComment(post, comment);
      }

      function deleteComment(comment) {
        // TODO add modal confirmation
        postService.deleteComment(post, comment)
          .success(function() {
            post.comments.splice(post.comments.indexOf(comment), 1);
          });
      }

      function getUpvoteColor(comment) {
        if (comment.upvoteHover || isUpvotedByCurrentUser(comment)) {
          return "text-primary";
        } else {
          return "text-muted";
        }
      }

      function getDownvoteColor(comment) {
        if (comment.downvoteHover || isDownvotedByCurrentUser(comment)) {
          return "text-danger";
        } else {
          return "text-muted";
        }
      }

      function isUpvotedByCurrentUser(comment) {
        return comment.usersWhoUpvoted.indexOf(authService.currentUserId()) != -1;
      }

      function isDownvotedByCurrentUser(comment) {
        return comment.usersWhoDownvoted.indexOf(authService.currentUserId()) != -1;
      }

      function showAddNewCommentForm() {
        $scope.shouldShowAddNewCommentForm = true;
      }

      function hideAddNewCommentForm() {
        $scope.shouldShowAddNewCommentForm = false;
        $scope.body = "";
      }

      function showDeleteComment(comment) {
        return comment.author._id == authService.currentUserId();
      }

      function showLockComment(comment){
        //console.log(post.author +" |check showLockComment| " +authService.currentUserId());
        //console.log( " ; "+ post.author == authService.currentUserId());
        //return comment.author._id != authService.currentUserId();
        return post.author === authService.currentUserId() && comment.author._id != authService.currentUserId() && post.lockedWith === comment.authorString;
      }

      function checkIfLocked(){
        return post.locked;        
      }

      function showIfLocked(comment){
        return comment.author._id == authService.currentUserId();        
      }

      function toggleLockUnlock(comment){
        if(comment.locked){
          if(comment.locked == false){
            return false;
          }
          else{
            return true;
          }
        }
        else{
          return false;
        }
      }

      $scope.addComment = addComment;
      $scope.lockComment = lockComment;
      $scope.checkIfLocked = checkIfLocked;
      $scope.showIfLocked = showIfLocked;
      $scope.incrementUpvotes = incrementUpvotes;
      $scope.incrementDownvotes = incrementDownvotes;
      $scope.deleteComment = deleteComment;
      $scope.getUpvoteColor = getUpvoteColor;
      $scope.getDownvoteColor = getDownvoteColor;
      $scope.showAddNewCommentForm = showAddNewCommentForm;
      $scope.hideAddNewCommentForm = hideAddNewCommentForm;
      $scope.showDeleteComment = showDeleteComment;
      $scope.showLockComment = showLockComment;
      $scope.toggleLockUnlock = toggleLockUnlock;
    }
  ]);
})();
