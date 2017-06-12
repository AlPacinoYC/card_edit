/*Created by YC 2017/03/27*/ ;
(
	function() {
		var card = function() {
			var that = this;
			/*new card()继承init属性*/
			that.init();
		};

		card.prototype = {
			init: function() {
				/*注册拖拽事件*/
				$(".card  span").dragging({
					move: 'both', //拖动方向，x y both
					randomPosition: false
				});
				thats = this; 
				/*名片正反面*/
				var positive = [];
				var back = [];
				/*所有的事件采用事件委托*/
				$("body").on("click", function(e) {
					if($(e.target).hasClass("label")) {
						/*保存操作前的状态，用来撤销*/
						thats.store_message();
						var span = document.createElement("SPAN");
							span.innerHTML = "点击修改";
							/*对于不可以修改的元素做lab的class标记*/
							span.className = "span lab";
							/*判断当前编辑页面是正面还是反面，来新增元素到其中*/
							$(".card_positive").css("display") == "inline-block" ? $(".card_positive").append(span) : $(".card_back").append(span);
							/*绑定使事件*/
							$(span).dragging({
								move: 'both', //拖动方向，x y both
								randomPosition: false
							});
							
					} else if($(e.target).hasClass("field")) {
						thats.store_message();
						var span = document.createElement("SPAN");
							span.innerHTML = "点击修改";
							span.className = "span";
							$(".card_positive").css("display") == "inline-block" ? $(".card_positive").append(span) : $(".card_back").append(span);
							$(span).dragging({
								move: 'both', //拖动方向，x y both
								randomPosition: false
							});
					} else if($(e.target).hasClass("del")) {
						/*删除选定的元素*/
						$(self).remove();
						thats.store_message();
					} else if($(e.target).hasClass("save")) {
						thats.store_message();
						/*保存前要适配不同手机的大小，将位置，大小设置成百分比。正反面都设置成display:block，置于文档流，用来计算相对位置和大小*/
						if($(".guide_positive").hasClass("active")){
							$(".card_back").css({"display":"block","visibility":"hidden"});
						}else{
							$(".card_positive").css({"display":"block","visibility":"hidden"});
						}
						c = { "items": [] }
						/*遍历每一个元素将宽高转换成百分比*/
						$(".wrap_card .card  span").each(function(i, item) {
							var left = $(item).css("left");
							var left = left.slice(0, left.length - 2);
							var left = (left / faWidth) * 100;
							var top = $(item).css("top");
							var top = top.slice(0, top.length - 2);
							var top = (top / faHeight) * 100;
							$(item).css({ "left": left + "%", "top": top + "%" });
							css = $(item).attr("style");
							c.items.push(css);
						});

						/*$(".wrap_card .card  span img").each(function(i, item) {
							var width = $(item).css("width");
							var width = width.slice(0, width.length - 2);
							var width = (width / faWidth) * 100;
							$(item).parents(".span").css({ "width": width + "%", "display": "inline-block" });
							css = $(item).attr("style");
							c.items.push(css);
						});*/
						
						if(getQueryString("id")==getQueryString("companyId")){
							message = {name:decodeURI(escape(getQueryString("name"))),
							           companyId:getQueryString("companyId"),
							           companyName:decodeURI(escape(getQueryString("name"))),
							           positiveContent: $(".card_positive").prop('outerHTML'),
							           backContent:$(".card_back").prop('outerHTML'),
							           templateType:0
							}
						}
                        if(type == "edit"){
                        	/*修改的模板提交到数据库覆盖*/
                        	message.positiveContent = $(".card_positive").prop('outerHTML');
                        	message.backContent = $(".card_back").prop('outerHTML');
                        	 $.ajax({
									type:"POST",
									url:window.url+"cardTemplate/update?id="+id,
									async:false,
									crossDomain:true,
									xhrFields: {  withCredentials: true  },
									data:message,
									success:function(data){
										if(data.code == "0001"){
										   layer.msg("保存成功！");	
										}else if(data.code =="1001"){
											window.location.href = "login.html"
										}	  
									},
								    error:function(e){
								    	console.log(e)
								    }
							});
							/*如果点击了预览，新开预览页面*/
							if(typeof(isPreview)!="undefined"&&isPreview){
									window.open("back.html?id="+id+"&ispreview=true");
								}
							/*重置isPreview*/
							isPreview = false;
                        }else if( type == "add"){
                        	/*新增的模板提交到数据库新增*/
                        	message.positiveContent = $(".card_positive").prop('outerHTML');
                        	message.backContent = $(".card_back").prop('outerHTML');
                        	$.ajax({
									type:"POST",
									url:window.url+"cardTemplate/add",
									async:false,
									crossDomain:true,
									xhrFields: {  withCredentials: true  },
									data:message,
									success:function(data){
										if(data.code == "0001"){
											guideId = data.result;
										   layer.msg("保存成功！");	
										  
										}	else if(data.code =="1001"){
											window.location.href = "login.html"
										} 
									},
								    error:function(e){
								    	console.log(e)
								    }
							});
							/*如果点击了预览，新开预览页面*/
							 if(typeof(isPreview)!="undefined"&&isPreview){
								   	window.open("back.html?id="+guideId+"&ispreview=true");
									var urls = window.location.origin + window.location.pathname;
									window.location.href = urls+"?type=edit&id="+guideId;
							   }
							 /*重置isPreview*/
							 isPreview = false;
                        }
						/*localStorage.positive = $(".card_positive").prop('outerHTML');
						localStorage.back = $(".card_back").prop('outerHTML');*/
						/*还原正反面的状态*/
						if($(".card_positive").css("visibility")=="hidden"){
							$(".card_positive").css({"display":"none","visibility":"visible"});
						}else if($(".card_back").css("visibility")=="hidden"){
							$(".card_back").css({"display":"none","visibility":"visible"});
						}

					} else if($(e.target).hasClass("preview")) {
						/*预览的逻辑是先提交再预览*/
						isPreview = true;
						$(".save").click();
					} else if($(e.target).hasClass("back")) {
						/*撤回上一步*/
						$(".card_positive").replaceWith(card_positive);
						$(".card_back").replaceWith(card_back);
						/*重新绑定事件能拖拽*/
						$(".card  span").dragging({
							move: 'both', //拖动方向，x y both
							randomPosition: false
						});
					} else if($(e.target).hasClass("icon") || ($(e.target).parents(".icon").length)) {
						/*新增小图标*/
						$(".icon_upload").click();
						$(".icon_upload").change(function() {
							var file = this.files[0];
							if(file && file.size <= 20480) {
								/*判断图标的大小，超出提示并且不做处理*/
								var reader = new FileReader();
								reader.onload = function(event) {
									var txt = event.target.result;
									 var image = new Image();
					                     image.onload=function(){
					                          var width = image.width;
					                          var height = image.height + 2;
					                          var span = document.createElement("SPAN");
					                           /*读取图片的base64格式，新增到页面*/
											  span.innerHTML = "<img src='" + txt + "'>";
											  span.className = self.className;
											  $(span).css({width:width,height:height,top:0})
											  $(".card_positive").css("display") == "inline-block" ? $(".card_positive").append(span) : $(".card_back").append(span);
											  $(span).dragging({
												move: 'both', //拖动方向，x y both
												randomPosition: false
											  });
											    $(".icon_upload").replaceWith("<input type='file' hidden='hidden' name='' class='icon_upload' value=''/>"); 
					                       }
									image.src= txt;
									/*$(".card_positive").css("display") == "inline-block" ? $(".card_positive").append(span) : $(".card_back").append(span);*/
									/*$(span).dragging({
										move: 'both', //拖动方向，x y both
										randomPosition: false
									});*/
                                    return false
								};
							} else {
								layer.msg("小图标不能超过20k!");
								$(".add_pic_ipt").val("");
							}
							reader.readAsDataURL(file);

						})

					} else if($(e.target).hasClass("add_pic_buttom")) {
							thats.store_message();
						$(".add_pic_ipt").click();
						$(".add_pic_ipt").change(function() {
							if($(".img_type option:selected").val() == 2) {
								var file = this.files[0];
								if(file && file.size <= 262144) {
									var reader = new FileReader();
									reader.onload = function(event) {
										 var txt = event.target.result;
										 var image = new Image();
					                     image.onload=function(){
					                          var width = image.width;
					                          var height = image.height;
					                          var percentage = width/height;
					                          /*保证图片的长宽比为1.64-1.68之间*/
					                          if(percentage<1.68 && percentage>=1.64){
					                          	$(".card_positive").css("display") == "inline-block" ? $(".card_positive").css("background-image", "url(" + txt + ")"):$(".card_back").css("background-image", "url(" + txt + ")");
					                            $(".add_pic_ipt").val("");
					                            
					                          }else{
					                          	layer.msg("上传图片正确的宽长比例为618:371!");
					                          	$(".add_pic_ipt").val("");
					                          }
					                      };
					                      image.src= txt;
										

									};
								} else if(file.size > 262144){
									layer.msg("背景图片不能大于256k!")
								}
								reader.readAsDataURL(file);
							}

						})
					} else if($(e.target).hasClass("back_color")) {
						/*设置背景色*/
						if($(e.target).find("input[name = back_color]").css("opacity") == "0") {
							$(e.target).find("input[name = back_color]").css("opacity", "1");
						} else {
							$(e.target).find("input[name = back_color]").css("opacity", "0");
						}
					} else if($(e.target).hasClass("guide_cards")) {
						/*切换正反面*/
						$(".guide_cards").removeClass("active");
						$(e.target).addClass("active");
						if($(e.target).hasClass("guide_positive")) {
							$(".card_positive").css("display", "inline-block");
							$(".card_back").css("display", 'none');
						} else {
							$(".card_positive").css("display", "none");
							$(".card_back").css("display", 'inline-block');
						}
					} else if($(e.target).hasClass("btn")) {
						/*切换添加文字，添加图片*/
						if($(e.target).hasClass("pic")) {
							$(".pic").removeClass("reset");
							$(".characters").addClass("reset");
							$(".edit_characters").css("display", "none");
							$(".edit_pic").css("display", "block");
						} else if($(e.target).hasClass("characters")) {
							$(".pic").addClass("reset");
							$(".characters").removeClass("reset");
							$(".edit_characters").css("display", "block");
							$(".edit_pic").css("display", "none");
							
							thats.store_message();
							

							
						}
					}else if($(e.target).hasClass("pic_local")) {
						/*复制本地图片*/
						if($(self).find("img").length){
							if($(".card_positive").css("display") == "inline-block" ){
								var clone = $($(self).find("img")).clone()
								$(clone).dragging({
									move: 'both', //拖动方向，x y both
									randomPosition: false
								});
								$(".card_positive").append(clone);
								
							}else{
								var clone = $(self).clone()
								$(clone).dragging({
									move: 'both', //拖动方向，x y both
									randomPosition: false
								});
								$(".card_back").append($(self).clone());
							}
						}else{
							layer.msg("请复制图片");
						}
					}else if($(e.target).hasClass("preview")) {/*
						if($(".guide_positive").hasClass("active")){
							$(".card_back").css({"display":"block","visibility":"hidden"});
						}else{
							$(".card_positive").css({"display":"block","visibility":"hidden"});
						}
						$(".wrap_card .card  span").each(function(i, item) {
							var left = $(item).css("left");
							var left = left.slice(0, left.length - 2);
							var left = (left / faWidth) * 100;
							var top = $(item).css("top");
							var top = top.slice(0, top.length - 2);
							var top = (top / faHeight) * 100;
							$(item).css({ "left": left + "%", "top": top + "%" });
						});

						$(".wrap_card .card  span img").each(function(i, item) {
							var width = $(item).css("width");
							var width = width.slice(0, width.length - 2);
							var width = (width / faWidth) * 100;
							$(item).parents(".span").css({ "width": width + "%", "display": "inline-block" });
						});
                       
						localStorage.positive = $(".card_positive").prop('outerHTML');
						localStorage.back = $(".card_back").prop('outerHTML');
						
						if($(".card_positive").css("visibility")=="hidden"){
							$(".card_positive").css({"display":"none","visibility":"visible"});
						}else if($(".card_back").css("visibility")=="hidden"){
							$(".card_back").css({"display":"none","visibility":"visible"});
						}
						
						window.location.href = "back.html";*/
						
					}

				})

				$(".wrap_card").on("click", ".span", function(){
					/*记录当前点击拖拽元素*/
					self = this;
					/*编辑当前带年纪拖拽元素*/
					$(".card .span").removeClass("selected");
					$(self).addClass("selected");
					//$("input:not([type ^= radio])").val("");
					/*$("select").each(function(i,item){
						$(item).find("option:first").prop("selected", 'selected');
					});	*/
					
					thats.read_message();
				})

				$('body').on("input", function(e) {
					thats.store_message();
					if($(e.target).hasClass("color")) {
						/*设置字体颜色*/
						var val = $(e.target).val();
						$(self).css("color", val);
					} else if($(e.target).hasClass("ftsize")) {
						/*设置字体相对大小*/
						var val = $(e.target).val()/28.125;
						$(self).css("font-size", val + "em")
					} else if($(e.target).hasClass("contents")) {
						/*设置内容*/
						thats.store_message();
						var val = $(e.target).val();
						$(self).html(val);
					} else if($(e.target).hasClass("zIndex")){
						/*设置层级关系*/
						var val = $(e.target).val();
						$(self).css("z-index", val);
					} else if($(e.target).attr("name") == "back_color") {
						/*设置背景色*/
						var val = $(e.target).val();
						$(".card_positive").css("display") == "inline-block" ? $(".card_positive").css("background-color", val) : $(".card_back").css("background-color", val);
					}else if($(e.target).hasClass("width")){
						/*设置宽*/
						var val = $(e.target).val();
						$(self).css("width", val + "%")
					}else if($(e.target).hasClass("height")){
						/*设置高*/
						var val = $(e.target).val();
						$(self).css("height", val +"%")
					}
                
				});

				$("body").on("change", function(e) {
					if($(e.target).hasClass("type")) {
						thats.store_message();
						var val = e.target.value;
						/*如果有lab class只增加对应字段的class，修改html并作保存；如果没lab 的class则在此基础上标记字段排序，方便回填数据*/
						$(self).hasClass("lab")&&$(self).attr('class','').addClass("span lab"+" "+val)&&$(self).html($(e.target).find("option:selected").html());
						!$(self).hasClass("lab")&&$(self).attr('class','').addClass("span"+" "+val).attr("data-type",$(".field_type").val()).attr("data-order",$(".field_order").val());
						layer.msg("修改成功");
					} else if($(e.target).hasClass("ftFamily")) {
						/*设置字体*/
						thats.store_message();
						var val = e.target.value;
						$(self).css("font-family", val);
					} else if($(e.target).hasClass("writingModel")) {
						thats.store_message();
						var val = e.target.value;
						$(self).css("writing-mode", val);
					} else if(e.target.type == "radio") {
						/*设置加粗和斜体*/
						thats.store_message();
						if(e.target.value == "ftweight") {
							$(self).css("font-weight", 700);
						} else if(e.target.value == "ftstyle") {
							$(self).css("font-style", "italic");
						} else if(e.target.value == "regular") {
							$(self).css("font-style", "initial")
							$(self).css("font-weight", 500);
						}
					} else if($(e.target).hasClass("textAlign")){
						/*设置对齐方式*/
						thats.store_message();
						var val = e.target.value;
						$(self).css("text-align", val);
					}
					
				});
			},
			store_message: function() {
				/*保存数据*/
				card_positive = $(".card_positive").prop('outerHTML');
				card_back = $(".card_back").prop('outerHTML');
			},
			read_message:function() {
				/*计算当前元素状态，回填到状态栏*/
				var width = $(self).width() / 648 * 100;
				var height = $(self).height() / $(".card").height() * 100;
				var z_index = $(self).css("z-index");
				var content = $(self).html() == "点击修改" ? "":$(self).html();
				var color = $(self).css("color");
				var ftsize = $(self).css("font-size");
				var rootSize = $(".wrap_card").css("font-size");
				var rootSize = rootSize.slice(0,rootSize.length-2)
				var ftsize = Math.floor(ftsize.slice(0,ftsize.length-2)/rootSize*28.125);
				var types = self.classList;
				var type = [];
				for(var i=0;i<self.classList.length;i++){
					type.push(types[i])
				}
				/*重写Array的remove原型，删除某一项数据*/
				Array.prototype.remove = function(val){
					var index = this.indexOf(val);
					(index >-1)&&this.splice(index,1)
				}
				type.remove("selected");
				$(self).hasClass("span")?type.remove("span"):type;
			    $(self).hasClass("lab")?type.remove("lab"):type;
			    var type = type[0];
				var writing_mode = $(self).css("writing-mode");
				var ft_family = $(self).css("font-family");
				$(".width").val(Math.round(width*100)/100);
				$(".height").val(Math.round(height*100)/100);
				$(".zIndex").val(z_index);
				$(".contents").val(content);
				$(".color").val(color);
				$(".ftsize").val(ftsize);
				$(".type").val(type);
				$(".field_type").val($(self).data("field_type"));
				$(".field_order").val($(self).data("field_order"));
				$(self).css("font-weight")==700&&$("input[type = radio][value = ftweight]").attr("checked","checked");
				$(self).css("font-style")=="italic"&&$("input[type = radio][value = ftstyle]").attr("checked","checked");
				$(".ftFamily").val(ft_family);
				$(".writingModel").val(writing_mode);
			}
		};
        /*注册card方法到windows对象*/
		window.card = card;
	}
)();

new card();