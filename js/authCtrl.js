//only one thing.. create auth objects authObject constructor
var app = angular.module('rtfmApp').controller('authCtrl', ['$scope', '$firebaseAuth', '$firebaseObject', '$firebaseArray', function($scope, $firebaseAuth, $firebaseObject, $firebaseArray){
    var firebaseRoot = $scope.getFirebaseRoot();
    var ref = new Firebase(firebaseRoot);
    var authObject = $firebaseAuth(ref);

    $scope.setAuthObject(authObject);

    $scope.google = function(){
      authObject.$authWithOAuthoPopup('google', {
        scope: 'email'
      }).then(function(authData){
        console.log('google auth success', authData);
      }, function(error){console.warn('google error', error);
    });
    };

$scope.facebook = function(){
  authObject.$authWithOAuthoPopup('facebook', {
    scope: 'email'}).then(
      function(authDAta){
        console.log('facebook success', authoData);
      },
         function(err){console.log('facebook error', err);}
});

};


$scope.login= function(loginUser){
  authObject.$authWithPassword(loginUser);
};

$scope.register = function (logInUser) {

  authObject.$createUser(logInUser).then(function(){
    $scope.login(logInUser);
  });
};

authObject.$onAuth(function(authData){
  console.log('authData', authData);
  if(!authData){ $scope.setUser(false);
  } else {
    var aclRef = new Firebase(firebaseRoot + 'acl/' + authData.uid);
    var acl = $firebaseObject(aclRef),
    email;

    acl.$loaded().then(function(acl){
      if(!acl.userKey) {
        acl.isAdmin = false;
        if(authData.provider === 'password'){
          acl.email = authData.password.email;
      } else if (authData.provider === 'google') {
          acl.email = authData.google.email;
      } else if (authData.provider === 'facebook') {
          acl.email = authData.facebook.email;
      }
  }
    acl.lastLogin = (new Data()).toString();
    acl.$save().then(function(){
      var usersRef = new Firebase(firebaseRoot + 'users');
      var users = $firebaseArray(usersRef.orderByChild('email').equalTo(acl.email));

      users.$loaded().then(function(users){
        console.log('users', users);
        if (!users.length) {
          $firebaseArray(usersRef).$add().then(function(ref){
              var user = $firebaseObject(new Firebase(firebaseRoot + 'users/' + ref.key()));
              user.email = acl.email;
              user.$save().then(function() {
                  acl.userKey = user.$id;
                  acl.$save().then(function() {
                      $scope.setUser(user);
                  });
              });
          });

      } else if(users.length === 1){
        var userKey = users[0].$id;
        var user = $firebaseObject(new Firebase(firebaseRoot + 'users/' + userKey));

        if(!acl.userKey){
          acl.userKey = userKey;
          acl.$save();
        }
        $scope.setUser(user);
      } else {
        console.warn('too many users found', users);
      }
  });
});
});

}
});

}]);
//access control list acl ...
//create ref at authdata.uid
//rules{nodename:
//json object//   { nextchildnode:{nextchildnode: {'uid':{.read:true, write:false;} }}}
//}
//firebase.debugg.js -- debugger
