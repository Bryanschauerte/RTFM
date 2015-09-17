var app = angular.module('rtfmApp',['firebase','ngRoute'])
//injectable costant
.constant('fb',{url: 'https://bs-angularfire-chat.firebaseio.com/'})

  .config(function($routeProvider){

    $routeProvider
      .when('/threads', {
        templateUrl: 'threads.html',
        controller: 'threadsCtrl',
        resolve: {
          threads: function(threadsService, $firebaseArray){
            return $firebaseArray(threadsService.getThreads()).$loaded();}
        }
      })

      .when('/threads/:threadId',{
        templateUrl: 'thread.html',
        controller: 'threadCtrl',
        resolve: {
          thread: function(threadsService, $firebaseObject, $route){
            //solution$loaded response with a promis when the data is prepared
            return $firebaseObject(threadsService.getThread($route.current.params.threadId)).$loaded();

          }
        }

      })

      .otherwise({redirectTo: '/threads'})

  })
