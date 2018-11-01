//浏览器控制JS
//编写者：曾谅亮
//时间：2017-6-14 10:02:04

var AZTBrowser = function(){
	return{
			openBrowserURL:function(url, top, func){
			var param = {"command":110,"code":0,"parameter":[url, top, document.cookie]};
			var jsonData =JSON.stringify(param);
			var data = Base64.encode(jsonData);
			var callBack = Math.random().toString(36).substr(2);
			try{
				var ajax=$.ajax({
				type : "get",
				async:false,
				url :"http://127.0.0.1:16888?data="+data,
				dataType : "jsonp",
				jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
				jsonpCallback:"success_jsonpCallback" + callBack,//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
				success : function(json){
						if(json.error == 0){
							func(json.error, json.parameter[0]);
						}
						else{
							func(json.error, json.msg);
						}
					}
				});
			}catch (e){
				alert("jsonp发送数据失败！");
				}
			},
			executeJS:function(id, js, func){
				var param = {"command":110,"code":1,"parameter":[id, js]};
				var jsonData =JSON.stringify(param);
				var data = Base64.encode(jsonData);
				var callBack = Math.random().toString(36).substr(2);;
				try{
					var ajax=$.ajax({
					type : "get",
					async:false,
					url :"http://127.0.0.1:16888?data="+data,
					dataType : "jsonp",
					jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
					jsonpCallback:"success_jsonpCallback" + callBack,//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
					success : function(json){
							if(json.error == 0){
								func(json.error, json.parameter[0]);
							}
							else{
								func(json.error, json.msg);
							}
						}
					});
				}catch (e){
					alert("jsonp发送数据失败！");
				}
			},
			waitStatus:function(id, outTime, func){
				var param = {"command":110,"code":2,"parameter":[id, outTime]};
				var jsonData =JSON.stringify(param);
				var data = Base64.encode(jsonData);
				var callBack = Math.random().toString(36).substr(2);
				try{
					var ajax=$.ajax({
					type : "get",
					async:false,
					url :"http://127.0.0.1:16888?data="+data,
					dataType : "jsonp",
					jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
					jsonpCallback:"success_jsonpCallback"  + callBack,//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
					success : function(json){
							if(json.error == 0){
								func(id,json.error, json.parameter[0], json.parameter[1]);
							}
							else{
								func(id,json.error, "-1", json.msg);
							}
						}
					});
				}catch (e){
					alert("jsonp发送数据失败！");
				}
			},
			sendStatus:function(status, data){
				window.external.sendStatus(status, data);
			},
			closeBrowser:function(){
				window.external.closeBrowser();
			}
	}
}();
