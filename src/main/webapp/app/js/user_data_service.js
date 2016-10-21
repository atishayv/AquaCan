aqua_app.requires.push('aqua.app_services');

angular.module('aqua.app_services', [])
.factory('user_data_service', ['$http',function(
		$http
		){
	
	var service_obj = {
		user_data_obj : '',	
			
		get_user_data_obj : function(success_cal_bk,failure_cal_bk){
			var me= this;
			if(this.user_data_obj)
				success_cal_bk(this.user_data_obj);
			
			var req = {
	  				 method: 'POST',
	  				 url: deployment_location + 'requestServlet',
	  				 data: { 
	  					 	action : 'get_user_info',
	  					 	user_id : localStorage.getItem('user_id'),
	  				 	   }
	  				};
	   		
	   		$http(req).then(function(result){
	   			if(result.data=="Inavlid User Id"){
	   				localStorage.clear();
	   				success_cal_bk("Inavlid User Id");
	   			}else{
	   				//adding the user deatils into store
	   				var response  = result.data[0];
	   				me.user_data_obj = response;
	   				localStorage.setItem('user_id',response.user_id);
	   				
	   				success_cal_bk(response);
	   			}
	   		}, function(result){
	   			failure_cal_bk(result);
	   		});
			
		},
		
		set_user_data_obj : function(user_data_obj){
			this.user_data_obj = user_data_obj;
		}
	};
	
	return service_obj;
	
}]);