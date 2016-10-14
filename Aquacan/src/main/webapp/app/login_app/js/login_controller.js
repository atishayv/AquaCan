aqua_app.requires.push('aqua.login_app');

aqua_app.config(function($stateProvider, $urlRouterProvider) {
	  $stateProvider
	  .state('login', {
	      url: "/login",
          templateUrl: "login_app/templates/login.html",
          controller: "login_controller"
	    })
});


angular.module('aqua.login_app', [])
.controller('login_controller', ['$scope','$state','$ionicPopup','$http',function($scope,
		$state,
		$ionicPopup,
		$http
	){
	
	
	$scope.currentView = "Login";
	
	
	$scope.goto_home_page = function(){
		localStorage.setItem('user_id','skip');
		$state.go('home.order');
	}
	
}]);