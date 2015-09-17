var app = angular.module('rtfmApp').controller('threadCtrl',function($scope, thread, commentsRef, $firebaseObject, $firebaseArray){
  $scope.thread;
  $scope.comments = $firebaseArray(commentsRef);

  $scope.createComment = function(username, text) {
    $scope.comments.$add({
      username: username,
       text: text
    });
  };

});
