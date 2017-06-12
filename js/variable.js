//var url = "http://192.168.1.199:8183/";
var url = "http://192.168.1.242:8060/";

//var url = "http://192.168.1.197:8060/"
/*var url ="http://192.168.1.209:8060/"*/

/*$.ajaxSetup({
	dataFilter :function(data){
		data1 = $.parseJSON(data);
			if(data1.code == 1001){
		 	window.location.href ="login.html"
	     }
	     var result = data1.result;
	     if(result){
		     if($.isArray(result)){
		     	result.forEach(function(item){
		     		if(item && item.ctime && $.isNumeric(item.ctime)){ 
				    	item.ctime = $.timeUtils.UnixToDate(item.ctime/1000,true);
				    }	
		     	});
			 }else{
				if(result && result.ctime && $.isNumeric(result.ctime)){
					result.ctime = $.timeUtils.UnixToDate(result.ctime,true);
				}
			 }
			 return  JSON.stringify(data1);
		 }
		return data;
	}
});*/

/*注销*/
		$(".logout").click(function(){
			$.ajax({
					type:"get",
					url:url+"user/logout",
					async:true,
					crossDomain:true,
					xhrFields: {  withCredentials: true  },
					success:function(data){
						data.code == "0001" && (window.location.href = "login.html");
					},
				    error:function(e){
				    	console.log(e)
				    }
				});
		})