aqua_app.requires.push('aqua.order_app');

aqua_app.config(function($stateProvider, $urlRouterProvider) {
	  $stateProvider
	  .state('home.order', {
	      url: "/order",
	      views: {
	    	  'app_content' : {
	    		  templateUrl: "../app/order_app/templates/order.html",
	              controller: "order_controller"
	    	  }
	      }
          
	    })
});


angular.module('aqua.order_app', ['ionic','ion-place-tools'])
.controller('order_controller', ['$scope','$state','$ionicPopup','$http','$timeout',function($scope,
		$state,
		$ionicPopup,
		$http,
		$timeout
	){
	
	$scope.location = "";
	$scope.location_coords = {};
	$scope.dealer_data = [];
	$scope.popup_message = "Water delivery services nearby you";
	$scope.popup_message_visible= false;
	$scope.view_name = "select_dealer";
	$scope.map = {};
	$scope.autocomplete = {};
	
	$scope.update_location = function(location){
		$scope.location = location;
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
			
			
			var req = {
	  				 method: 'POST',
	  				 //url: deployment_location + '/Aquacan/order_app/data/dealerData.txt',
	  				 url : '../app/order_app/data/dealerData.txt',
	  				 data: { 
	  					 	action : 'get_dealer_data',
	  					 	latitude : $scope.location_coords.latitude,
	  					 	longitude  : $scope.location_coords.longitude
	  				 	   }
	  				};
	   		
	   		$http(req).then(function(result){
	   			$scope.dealer_data = result.data;
	   			$scope.popup_message_visible = true;
	   			$timeout(function(){
	   				$scope.popup_message_visible = false;
	   			},3000);
	   		}, function(result){
	   			console.log(result);
	   		});
			
			
			
		}else{
			
		}
	};
	
	
	$scope.bottle_data = [];
	$scope.total_price = 0;
	$scope.select_bottle = function(dealerDetails){
		$scope.popup_message_visible = false;
		$scope.view_name = 'select_bottle';
		$scope.bottle_data = dealerDetails.canDetails;
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