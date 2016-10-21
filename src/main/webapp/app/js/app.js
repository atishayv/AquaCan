var aqua_app = angular.module('aqua',['ionic','aqua.home_app']);

aqua_app.config(function(
							$stateProvider, 
							$urlRouterProvider,
							$ionicConfigProvider
						) {
 
$ionicConfigProvider.views.transition('none');
$stateProvider
	.state("home", {
		url: "/home",
		//"abstract": true,
		templateUrl: "templates/home.html",
		controller: "home_controller",
	});



$urlRouterProvider.otherwise("/home");


});
