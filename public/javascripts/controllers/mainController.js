(function() {
  "use strict";
  
  var app = angular.module("flapper-news.controllers.main", [
    "ui.router","ui.bootstrap"
  ]);

  app.config([
    "$stateProvider",
    function($stateProvider) {
      $stateProvider.state("home", {
        parent: "root",
        url: "/home",
        views: {
          "container@": {
            templateUrl: "partials/home",
            controller: "MainController"
          }
        },
        resolve: {
          getPostsPromise: [
            "postService",
            function(postService) {
              return postService.getAll();
            }
          ]
         }
      });
    }
  ]);

  app.controller("MainController", [
    "$scope",
    "postService",
    "authService",
    function($scope, postService, authService) {
      $scope.isLoggedIn = authService.isLoggedIn;

      $scope.posts = postService.posts;

      $scope.shouldShowAddNewPostForm = false;

      //input text Course Select Options
/*      $scope.items = ['one', 'two', 'three', 'four', 'five'];
      $scope.key = '';
      $scope.search = function (value) {
          return $scope.key !== '' && value.indexOf($scope.key) >= 0;
      }  

      $scope.selected = '';
      $scope.states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
      "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
      "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", 
      "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Dakota", "North Carolina",
      "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", 
      "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];

      */
      
      $scope.title = '';
      $scope.link = '';


/*
      $scope.courses = [
        {id:"CS 557" , name:"Distributed Systems"},
        {id:"CS 444" , name:"Computer Security"},
        {id:"CS 567" , name:"Web Development"}
      ];
*/
$scope.courses = [
  "CS 557 - Distributed Systems",
  "CS520 - Computer Architecture",
  "CS571 - Programming Languages",
  "CS 575 - Design & Analysis Comp Algorithm",
  "CS 527 Mobile Computing and Networking",
  "CS 528 Data Comm and Computer Networks",
  "CS 529 High Performance Computer Networks",
  "CS 533 Information Retrieval",
  "CS 540 Topics in Object-Oriented Programming",
  "CS 542 Design Patterns",
  "CS 547 Web Services & XML Programming",
  "CS 551 Systems Programming",
  "CS 553 Introduction to Grid Computing",
  "CS 554 Introduction to Real-time Embedded Systems (must complete the project option)",
  "CS 555 Introduction to Visual Information Processing",
  "CS 557 Introduction to Distributed Systems",
  "CS 558 Introduction to Computer Security (must complete the project option)",
  "CS 560 Computer Graphics",
  "CS 572 Compiler Construction",
  "CS 576 Programming Models for Emerging Platforms (must complete the project option)",
  "CS 580G Game Development for Mobile Platforms",
  "CS 622 Advanced Computer Architecture Seminar",
  "CS 634 Web Data Management (must complete the project option)",
  "CS 654 Distributed Systems"
];
$scope.selectedCourses =[

      ];

          
      function onSelectedCourse(courseSelected){
          //$window.alert("Selected Value: " + courseSelected);
          //console.log("Selected Value: " + courseSelected);

      }

      function onCourseAdd(addThisCourse){
        //console.log(" Addig this coursee--- " + addThisCourse);
        $scope.selectedCourses.push(addThisCourse);
        $scope.link = '';
      
      }

      function deleteSelectedCourse(link){
        var index=$scope.selectedCourses.indexOf(link)
        $scope.selectedCourses.splice(index,1);
      }

      function addPost() {
        if (!$scope.title || $scope.title === "") {
          //console.log("returning" + $scope.title);
          return;
        }
        //console.log("inside addpost controller :: " + $scope.link);
        postService.create({
          title: $scope.title,
          link: $scope.selectedCourses,
          requesttype: $scope.requesttype,
          author: authService.currentUserId(),
          authorName: authService.currentUser()
        });

        $scope.title = "";
        $scope.link = "";
        $scope.selectedCourses = "";
        $scope.shouldShowAddNewPostForm = false;
      }

      function deletePost(post) {
        // TODO add modal confirmation
        postService.deletePost(post);
      }

      function incrementUpvotes(post) {
        postService.upvote(post);
      }

      function incrementDownvotes(post) {
        postService.downvote(post);
      }

      function getUpvoteColor(post) {
        if (post.upvoteHover || isUpvotedByCurrentUser(post)) {
          return "text-primary";
        } else {
          return "text-muted";
        }
      }

      function getDownvoteColor(post) {
        if (post.downvoteHover || isDownvotedByCurrentUser(post)) {
          return "text-danger";
        } else {
          return "text-muted";
        }
      }

      function isUpvotedByCurrentUser(post) {
        return post.usersWhoUpvoted.indexOf(authService.currentUserId()) != -1;
      }

      function isDownvotedByCurrentUser(post) {
        return post.usersWhoDownvoted.indexOf(authService.currentUserId()) != -1;
      }

      function showAddNewPostForm() {
        $scope.shouldShowAddNewPostForm = true;
      }

      function hideAddNewPostForm() {
        $scope.shouldShowAddNewPostForm = false;
        $scope.title = "";
        $scope.link = "";
      }

      function showDeletePost(post) {
        return post.author._id == authService.currentUserId();
      }

      $scope.addPost = addPost;
      $scope.deletePost = deletePost;
      $scope.incrementUpvotes = incrementUpvotes;
      $scope.incrementDownvotes = incrementDownvotes;
      $scope.getUpvoteColor = getUpvoteColor;
      $scope.getDownvoteColor = getDownvoteColor;
      $scope.showAddNewPostForm = showAddNewPostForm;
      $scope.hideAddNewPostForm = hideAddNewPostForm;
      $scope.showDeletePost = showDeletePost;
      $scope.onSelectedCourse = onSelectedCourse;
      $scope.onCourseAdd = onCourseAdd;
      $scope.deleteSelectedCourse = deleteSelectedCourse;
    }
  ]);
})();
//http://jsfiddle.net/mLrynxh2/2/
//http://plnkr.co/edit/ZdShIA?p=preview
//https://www.w3schools.com/bootstrap/bootstrap_ref_css_buttons.asp