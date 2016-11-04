angular.module('aqua.home_app', ['angular-loading-bar'])
.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.parentSelector = '#main_view_header_id';
    cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner">Custom Loading Message...</div>';
}])
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
	$scope.isLoginView = false;
	$scope.show_login_option_menu = false;
	
	$scope.user_data_obj = {
			profile_pic : null
	};
	
	$scope.user_options = ['Logout'];
	
	if(!localStorage.getItem('user_id')){
		//by default go to order page
		$state.go('home.order');
	}else{
		//fetch the user data from server
		user_data_service.get_user_data_obj(function(result){
			if(result=="Inavlid User Id"){
   				$ionicPopup.alert({
   	                title:"<b>Error</b>",
   	                template: "Please login again to continue"
   		        });
   				//by default go to order page
   				$state.go('home.order');
   			}else{
   				//adding the user deatils into store
   				$scope.user_data_obj = result;
   				$scope.isLoggedIn = true;
   				
   				
   				//by default go to order page
   				$state.go('home.order');
   				
   			}
		},function(result){
			console.log(result);
   			$ionicPopup.alert({
	                title:"<b>Error</b>",
	                template: "Please login again to continue"
		        });
   			//by default go to order page
   			$state.go('home.order');
		});
		
	};
	
	$scope.toggle_show_login_option_menu = function(){
		$scope.show_login_option_menu = !$scope.show_login_option_menu;
	}
	
	$scope.show_login_page = function(){
		$scope.isLoginView = true;
		$state.go('home.login');
		
	};
	
	$scope.login_option_menu_click_handler = function(option){
		if(option=="Logout"){
			$scope.do_logout();
		}
	};
	
	$scope.do_logout = function(){
		localStorage.clear();
		$scope.isLoggedIn = false;
		$scope.isLoginView = false;
		$scope.show_login_option_menu = false;
	};
	
}]);