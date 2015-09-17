var app = angular.module('rtfmApp',['firebase','ngRoute'])
//injectable costant
.constant('fb',{url: 'https://bs-angularfire-chat.firebaseio.com/'})

  .config(function($routeProvider){

    $routeProvider
      .when('/threads', {
        templateUrl: 'templates/threads.html',
        controller: 'threadsCtrl',
        resolve: {
          threads: function(threadsService, $firebaseArray){
            return $firebaseArray(threadsService.getThreads()).$loaded();}
        }
      })

      .when('/threads/:threadId',{
        templateUrl: 'templates/thread.html',
        controller: 'threadCtrl',
        resolve: {
          thread: function(threadsService, $firebaseObject, $route){
            //solution$loaded response with a promise when the data is prepared
            return $firebaseObject(threadsService.getThread($route.current.params.threadId)).$loaded();

          },
          //step 8
          commentsRef: function(threadsService, $route){
            return threadsService.getComments($route.current.params.threadId);
          }
        }

      })

      .otherwise({redirectTo: '/threads'})

  })
