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
	
	if(!localStorage.getItem('user_id')){
		$state.transitionTo("home.login");
	}else{
		//fetch the user data from server
		user_data_service.get_user_data_obj(function(result){
			if(result=="Inavlid User Id"){
   				$ionicPopup.alert({
   	                title:"<b>Error</b>",
   	                template: "Please login again to continue"
   		        });
   				$state.transitionTo("login");
   			}else{
   				//adding the user deatils into store
   				$scope.user_data_obj = result;
   				
   				//by default go to feeds view
   				$state.transitionTo('home.feeds');
   				
   				//messenger related request
   				messenger_chat_service.make_socket_connection($scope.user_data_obj.user_id);
   				messenger_chat_service.get_unread_messages($scope.user_data_obj.user_id,$scope.get_unread_messages_success,function(result){
   					console.log(result);
   				});
   				$scope.get_active_users();
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
	
	
	$scope.isLoggedIn = false;
	
	$scope.user_data_obj = {
			profile_pic : null
	}
	
}]);