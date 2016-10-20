aqua_app.requires.push('aqua.login_app');

aqua_app.config(function($stateProvider, $urlRouterProvider) {
	  $stateProvider
	  .state('home.login', {
	      url: "/login",
	      views: {
	    	  'app_content' : {
	    		  templateUrl: "login_app/templates/login.html",
	              controller: "login_controller"
	    	  }
	      }
	    })
});


angular.module('aqua.login_app', [])
.controller('login_controller', ['$scope','$state','$ionicPopup','$http',function($scope,
		$state,
		$ionicPopup,
		$http
	){
	
	
	$scope.currentView = "Login";
	
	$scope.first_name = "";
	$scope.last_name = "";
	$scope.email_id = "";
	$scope.password = "";
	
	$scope.update_first_name = function(first_name){
		$scope.first_name = first_name;
	};
	$scope.update_last_name = function(last_name){
		$scope.last_name = last_name;
	};
	$scope.update_email_id = function(email_id){
		$scope.email_id = email_id;
	};
	$scope.update_password = function(password){
		$scope.password = password;
	};
	
	$scope.goto_home_page = function(){
		localStorage.setItem('user_id','skip');
		$state.go('home.order');
	};
	
	$scope.goto_register_page = function(){
		$scope.currentView = "Register";
	};
	
	$scope.goto_login_page = function(){
		$scope.currentView = "Login";
	};
	
	$scope.create_account = function(){
		
		var emailFilter = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	    var illegalChars= /[\(\)\<\>\,\;\:\\\"\[\]]/ ;
    	if($scope.first_name=="" || $scope.first_name==null || $scope.last_name=="" || $scope.last_name==null || $scope.email_id=="" || $scope.email_id==null ||$scope.password=="" || $scope.password==null){
    		$ionicPopup.alert({
                title:"<b>Error</b>",
                template: "Please enter all the fields correctly"
	        });
    	}else if(!emailFilter.test($scope.email_id) || $scope.email_id.match(illegalChars)){
    		$ionicPopup.alert({
                title:"<b>Error</b>",
                template: "Please enter a valid email-id"
	        });
    	}else{
    		var req = {
    				 method: 'POST',
    				 url: deployment_location + '/Aquacan/requestServlet',
    				 data: { 
    					 	action : 'new_user_register',
    					 	first_name: $scope.first_name,
    					 	last_name : $scope.last_name,
    					 	password : $scope.password,
    					 	email_id : $scope.email_id
    				 	   }
    				};
    		
    		$http(req).then(function(result){
    			if(result.data == "User already exist"){
    				$ionicPopup.alert({
    	                title:"<b>Error</b>",
    	                template: "User with same creadentials already exist. Please try again"
    		        });
    			}else if(result.data == "Successfully inserted user in DB"){
    				$ionicPopup.alert({
    	                title:"<b>Error</b>",
    	                template: "Successfully created user. Login again to continue.."
    		        }).then(function(res) {
    		        	 //switch to login view
    		        	$scope.goto_login_page();
    		        });
    				
    				
    			}else{
    				$ionicPopup.alert({
    	                title:"<b>Error</b>",
    	                template: "Something went wrong. Please try again."
    		        });
    			}
    		
    		}, function(result){
    			console.log(result);
    			$ionicPopup.alert({
	                title:"<b>Error</b>",
	                template: "Something went wrong. Please try again."
		        });
    		});
    		
    		
    		
    	}
	};
	
	
	$scope.sign_in = function(){
		
		var emailFilter = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	    var illegalChars= /[\(\)\<\>\,\;\:\\\"\[\]]/ ;
    	if($scope.email_id=="" || $scope.email_id==null || $scope.password=="" || $scope.password==null){
    		$ionicPopup.alert({
                title:"<b>Error</b>",
                template: "Please enter all the fields correctly"
	        });
    	}else if(!emailFilter.test($scope.email_id) || $scope.email_id.match(illegalChars)){
    		$ionicPopup.alert({
                title:"<b>Error</b>",
                template: "Please enter a valid email-id"
	        });
    	}else{
    		var req = {
   				 method: 'POST',
   				 url: deployment_location + '/Aquacan/requestServlet',
   				 data: { 
   					 	action : 'login',
   					 	password : $scope.password,
   					 	email_id : $scope.email_id
   				 	   }
   				};
    		
    		
    		$http(req).then(function(result){
    			if(result.data=="User does not exist"){
    				$ionicPopup.alert({
    	                title:"<b>Error</b>",
    	                template: "Please enter a valid emailId or password"
    		        });
    			}else{
    				//adding the user deatils into store
    				var response  = result.data[0];
    				
    				//user_data_service.set_user_data_obj(response);
    				
    				localStorage.setItem('user_id',response.user_id);
    				
    				$state.go('home.order');
    			}
    		}, function(result){
    			console.log(result);
    			$ionicPopup.alert({
	                title:"<b>Error</b>",
	                template: "Something went wrong. Please try again."
		        });
    		});
    		
    	}
	};
	
	
	$scope.do_FB_login = function(){
		
		FB.getLoginStatus(function(response) {
  		  if (response.status === 'connected') {
  		    console.log('Logged in.');
  		    FB.api(
  		    	    "/me?fields=id,name,picture,about,bio,birthday,education,email,gender,first_name,last_name,relationship_status,work",
  		    	    function (response) {
  		    	      if (response && !response.error) {
  		    	    	  console.log(response);
  		    	    	  //newUserRegister will either insert new user into DB if not exist or it will return User already exist
  		    	    	  var req = {
  		     				 method: 'POST',
  		     				 url: deployment_location + '/Aquacan/requestServlet',
  		     				 data: { 
  		     					 	action : 'new_user_register',
  		     					 	first_name: response.first_name,
  		     					 	last_name : response.last_name,
  		     					 	email_id : response.email
  		     				 	   }
  		     				};
  		     		
	  		     		$http(req).then(function(result){
	  		     			$scope.on_FB_login_success(response); 	////response is USer data coming from facebook
	  		     		}, function(result){
	  		     			console.log(result);
	  		     		});
  		     		
  		    	      }
  		    	    }
  		    	);
  		  }
  		  else {
  		    FB.login(function(response) {
  		    	   // handle the response
  		    	console.log(response);
  		    	FB.api(
	    		    	    "/me?fields=id,name,about,bio,birthday,education,email,gender,picture,first_name,last_name,relationship_status,work",
	    		    	    function (response) {
	    		    	      if (response && !response.error) {
	    		    	    	  console.log(response);
	    		    	    	  //newUserRegister will either insert new user into DB if not exist or it will return User already exist
	      		    	    	  var req = {
	      	  		     				 method: 'POST',
	      	  		     				 url: deployment_location + '/Aquacan/requestServlet',
	      	  		     				 data: { 
	      	  		     					 	action : 'new_user_register',
	      	  		     					 	first_name: response.first_name,
	      	  		     					 	last_name : response.last_name,
	      	  		     					 	email_id : response.email
	      	  		     				 	   }
	      	  		     				};
	      	  		     		
	      		  		     		$http(req).then(function(result){
	      		  		     			$scope.on_FB_login_success(response); 	////response is USer data coming from facebook
	      		  		     		}, function(result){
	      		  		     			console.log(result);
	      		  		     		});
	    		    	      }
	    		    	    }
	    		    	);
  		    }, {scope: 'email,user_birthday,user_about_me,user_education_history,user_relationships,user_work_history'});
  		  }
  		});
	};
	
	$scope.on_FB_login_success = function(response){
		//response is User data coming from facebook
		
		var json = {
				DOB : response.birthday ? response.birthday : '',
				mail_id : response.email ? response.email : '',
				gender : response.gender ? response.gender : '',
				first_name : response.first_name ? response.first_name : '',
				last_name : response.last_name ? response.last_name : '',
				name : response.name ? response.name : '',
				profile_pic : response.id ? 'http://graph.facebook.com/'+response.id+'/picture?type=large' : ''
			}
		
		//first update the user information coming from facebook to DB and then select all data from User_profile table and add it store
		var req = {
				 method: 'POST',
				 url: deployment_location + '/Aquacan/requestServlet',
				 data: { 
					 	action : 'update_user_data',
					 	data: json
				 	   }
				};
		
		
		$http(req).then(function(result){
			var response  = result.data[0];
			
			//user_data_service.set_user_data_obj(response);
			
			localStorage.setItem('user_id',response.user_id);
			
			$state.go('home.order');
			
		}, function(result){
			console.log(result);
			$ionicPopup.alert({
               title:"<b>Error</b>",
               template: "Something went wrong. Please try again."
	        });
		});
		
		
		
	};
	
}]);