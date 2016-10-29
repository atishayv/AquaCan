angular.module('aqua.home_app', [])
.controller('home_controller', ['$scope','$state','$ionicSideMenuDelegate','$timeout','$http','$ionicPopup','$q','user_data_service',function($scope,
		$state,
		$ionicSideMenuDelegate,
		$timeout,
		$http,
		$ionicPopup,
		$q,
		user_data_service
	){
	
	
	
	
	$scope.isLoggedIn = false;
	
	$scope.user_data_obj = {
			profile_pic : null
	}
	
	if(!localStorage.getItem('user_id')){
		$state.go("home.login");
	}else{
		//fetch the user data from server
		user_data_service.get_user_data_obj(function(result){
			if(result=="Inavlid User Id"){
   				$ionicPopup.alert({
   	                title:"<b>Error</b>",
   	                template: "Please login again to continue"
   		        });
   				$state.go("home.login");
   			}else{
   				//adding the user deatils into store
   				$scope.user_data_obj = result;
   				$scope.isLoggedIn = true;
   				
   				
   				//by default go to feeds view
   				$state.go('home.order');
   				
   			}
		},function(result){
			console.log(result);
   			$ionicPopup.alert({
	                title:"<b>Error</b>",
	                template: "Please login again to continue"
		        });
		    $state.transitionTo("login");
		});
		
	}
	
}]);