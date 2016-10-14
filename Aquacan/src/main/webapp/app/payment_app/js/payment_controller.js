aqua_app.requires.push('aqua.payment_app');

aqua_app.config(function($stateProvider, $urlRouterProvider) {
	  $stateProvider
	  .state('home.payment', {
	      url: "/payment",
	      params: {bottle_detail : null, total_price : null},
	      views: {
	    	  'app_content' : {
	    		  templateUrl: "../payment_app/templates/payment.html",
	              controller: "payment_controller"
	    	  }
	      }
          
	    })
});


angular.module('aqua.payment_app', [])
.controller('payment_controller', ['$scope','$state','$ionicPopup','$http','$timeout','$stateParams','$ionicHistory',function($scope,
		$state,
		$ionicPopup,
		$http,
		$timeout,
		$stateParams,
		$ionicHistory
	){
	
	if($stateParams.total_price && $stateParams.total_price>0)
		$scope.message = "Your order is placed. Water bottle will be delivered in 20 min. Please keep Rs."+$stateParams.total_price+" cash ready.";
	else
		$scope.message = "Something went wrong. Please try again..";
	
	$scope.go_to_previous_state = function(){
		$ionicHistory.goBack();
	}
	
	$scope.go_to_initial_state = function(){
		$state.go('home.order', {}, {reload: true});
	}
	
}]);