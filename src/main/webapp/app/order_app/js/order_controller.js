aqua_app.requires.push('aqua.order_app');

aqua_app.config(function($stateProvider, $urlRouterProvider) {
	  $stateProvider
	  .state('home.order', {
	      url: "/order",
	      views: {
	    	  'app_content' : {
	    		  templateUrl: "order_app/templates/order.html",
	              controller: "order_controller"
	    	  }
	      }
          
	    })
});


angular.module('aqua.order_app', ['ionic','ion-place-tools'])
.controller('order_controller', ['$scope','$state','$ionicPopup','$http','$timeout','cfpLoadingBar',function($scope,
		$state,
		$ionicPopup,
		$http,
		$timeout,
		cfpLoadingBar
	){
	
	$scope.location = "";
	$scope.location_coords = {};
	$scope.dealer_data = [];
	$scope.popup_message = "you";
	$scope.popup_message_visible= false;
	$scope.view_name = "select_dealer";
	$scope.map = {};
	$scope.autocomplete = {};
	
	$scope.update_location = function(location){
		$scope.location = location;
		
		$scope.popup_message = location;
		
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({
		  address: location
		}, function(results, status) {
		  if (status == google.maps.GeocoderStatus.OK) {
		    console.log(results);
		    $scope.location_coords = {};
		    $scope.location_coords.latitude = results[0].geometry.location.lat();
		    $scope.location_coords.longitude = results[0].geometry.location.lng();
		    $scope.get_dealer_list();
		  } else {
			  console.log(results);
		  }
		});
	};
	
	$scope.get_current_location = function(){
		if (navigator.geolocation){ 
			navigator.geolocation.getCurrentPosition(function(position){
				$scope.location_coords = position.coords;
				/*$scope.map = new google.maps.Map(document.getElementById('map'), {
			          center: new google.maps.LatLng(position.coords.latitude,position.coords.longitude),
			          zoom: 13
			     });
				$scope.registerForAutoSuggest(document.getElementById('loc_input_id'));*/
				$scope.get_dealer_list();
			}, function(result){
				//don't show any result, ask to enter location
				$scope.location_coords = {};
			});
		}else{
			//don't show any result, ask to enter location
			$scope.location_coords = {};
		}
	};
	
	$scope.get_dealer_list = function(){
		if($scope.location_coords.latitude && $scope.location_coords.longitude){
			cfpLoadingBar.start();
			
			var req = {
	  				 method: 'POST',
	  				 url: deployment_location + 'requestServlet',
	  				 //url : 'order_app/data/dealerData.txt',
	  				 data: { 
	  					 	action : 'get_dealer_data',
	  					 	latitude : $scope.location_coords.latitude,
	  					 	longitude  : $scope.location_coords.longitude
	  				 	   }
	  				};
	   		
	   		$http(req).then(function(result){
	   			cfpLoadingBar.complete();
	   			
	   			if(typeof result.data=="string"){
	   				$scope.dealer_data = [];
	   				$scope.popup_message = "Didn't find any water service nearby "+$scope.popup_message + ". Please enter a different location";
	   			}else{
	   				$scope.dealer_data = result.data;
	   				$scope.popup_message = "Water delivery services nearby "+$scope.popup_message;
	   			}
	   			$scope.popup_message_visible = true;
	   			$timeout(function(){
	   				$scope.popup_message_visible = false;
	   			},3000);
	   			
	   		}, function(result){
	   			console.log(result);
	   			cfpLoadingBar.complete();
	   		});
			
			
			
		}else{
			
		}
	};
	
	
	$scope.bottle_data = [];
	$scope.total_price = 0;
	$scope.select_bottle = function(dealerDetails){
		cfpLoadingBar.start();
		
		$scope.popup_message_visible = false;
		
		
		var req = {
 				 method: 'POST',
 				 url: deployment_location + 'requestServlet',
 				 data: { 
 					 	action : 'get_bottle_details',
 					 	dealer_id : dealerDetails.dealer_id,
 				 	   }
 				};
  		
  		$http(req).then(function(result){
  			$scope.view_name = 'select_bottle';
  			$scope.bottle_data = result.data;
  			cfpLoadingBar.complete();
  		}, function(result){
  			console.log(result);
  			cfpLoadingBar.complete();
  		});
		
		
		
		
	}
	
	$scope.select_dealer = function(){
		$scope.popup_message_visible = false;
		$scope.view_name = 'select_dealer';
		$scope.bottle_data = [];
		$scope.total_price = 0;
	}
	
	$scope.update_bottle_quantity = function(bottle_details){
		if(bottle_details.quantity){
			bottle_details.quantity = bottle_details.quantity +1;
		}else{
			bottle_details.quantity = 1;
		}
		$scope.total_price = $scope.total_price + parseInt(bottle_details.price);
	}
	
	$scope.make_payment = function(){
		if($scope.total_price>0){
			$state.go('home.payment',{'bottle_detail'  : $scope.bottle_data,'total_price' : $scope.total_price});
		}else{
			$ionicPopup.alert({
                title:"<b>Info</b>",
                template: "Please select a bottle"
	        });
		}
	}
	
	
	
	$scope.registerForAutoSuggest = function(elem){
		
		$scope.autocomplete = new google.maps.places.Autocomplete(
	  	      /** @type {!HTMLInputElement} */ (
	  	    		elem));
		$scope.autocomplete.bindTo('bounds', $scope.map);
	    
		$scope.autocomplete.addListener('place_changed', function() {
			console.log($scope.autocomplete.getPlace());
	        
	        $('#'+elem.id).val($scope.autocomplete.getPlace().formatted_address);
		});
	   /* google.maps.event.addListener($scope.autocomplete, 'place_changed', function() {
	        console.log($scope.autocomplete.getPlace());
	        
	        $('#'+elem.id).val($scope.autocomplete.getPlace().formatted_address);
	        
	    });*/
	}
	
	
	$scope.get_current_location();
	
	
}]);