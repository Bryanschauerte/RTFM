var app = angular.module('rtfmApp').controller('threadsCtrl',function($scope, threads){
  //$scope.threads = $firebaseArray(threadsRef);
  //he has
  $scope.threads = threads;
  $scope.createThread = function(userName, newThreadTitle){
    $scope.threads.$add({
      username: userName, title: newThreadTitle
    });

  }


});
