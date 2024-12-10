angular.module('authApp', [])

//Register a user
.controller('registerController', function($scope, $http, $window) {
    console.log("debugtest1")
    $scope.registerUser = function(username, password) {
      $http.post('/api/register', { username, password })
        .then(function(response) {
          console.log('User registered successfully:', response.data);
          $window.location.href = './login.html';
        })
        .catch(function(error) {
          console.error('Error registering user:', error);
        });
    };
})
  
//Login a user
.controller('LoginController', function($scope, $http, $window) {
  $scope.loginUser = function(username, password) {
    $http.post('/api/login', { username, password })
      .then(function(response) {
        console.log('User logged in successfully:', response.data);
        $window.location.href = './calendar.html';
      })
      .catch(function(error) {
        console.error('Error logging in user:', error);
      });
    };
});
