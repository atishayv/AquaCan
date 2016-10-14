angular.module('aqua.home_app', [])
.controller('home_controller', ['$scope','$state','$ionicSideMenuDelegate','$timeout','$http','$ionicPopup','$q',function($scope,
		$state,
		$ionicSideMenuDelegate,
		$timeout,
		$http,
		$ionicPopup,
		$q
	){
	
	if(!localStorage.getItem('user_id')){
		$state.transitionTo("login");
	}
	
	
}]);