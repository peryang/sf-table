(function($){
    //定义在闭包函数中的全局变量，用来初始化参数，其他的所有函数可以调用
    var config;
    //一些私有函数，相当于php类中private的私有方法，被主函数调用
    var privateFunction = function(){
        // 执行代码
        console.log(arguments[0]);
    }
    
	$(document).delegate(".y-table-header-item input", "focus", function(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		var _this = this;
		$(_this).next(".y-table-filter").removeClass("hide");
	});
	$(document).delegate(".y-table-header-item input", "click", function(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		var _this = this;
		var key = $(_this).val();
		var liObjs = $(_this).next("ul").find("li");
		liObjs.addClass("hide");
		for (var i = 0; i < liObjs.length; i++) {
			if($(liObjs[i]).html().indexOf(key) > -1){
				$(liObjs[i]).removeClass("hide");
			}
		}
	});
	$(document).delegate(".y-table-header-item input", "keyup", function(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		var _this = this;
		var key = $(_this).val();
		var liObjs = $(_this).next("ul").find("li");
		liObjs.removeClass("active");
		liObjs.addClass("hide");
		if(!key){
			$(_this).next("ul").find("li")
			liObjs.removeClass("hide");
			return true;
		}
		for (var i = 0; i < liObjs.length; i++) {
			if($(liObjs[i]).html().indexOf(key) > -1){
				$(liObjs[i]).removeClass("hide");
			}
		}
		
		var index = $(_this).parents(".y-table-header-item").data("index");
		var bodyItems = $(".y-table .y-table-body .row .y-table-body-item[data-index='"+index+"']");
		$(".y-table .y-table-body .row").addClass("hide");
		for (var i = 0; i < bodyItems.length; i++) {
			if($(bodyItems[i]).html().indexOf(key) > -1){
				$(bodyItems[i]).parents(".row").removeClass("hide");
			}
		}
	});
	$(document).delegate("body", "click", function(ev) {
		ev.preventDefault();
		$(".y-table-filter").addClass("hide");
		console.log("click body filter");
	});
	$(document).delegate(".y-table-filter li", "click", function(ev) {
		ev.preventDefault();
		var _this = this;
		$(_this).parent().find("li").removeClass("active");
		$(_this).addClass("active");
		var value = $(_this).html();
		
		$(".y-table-filter").addClass("hide");
		$(".y-table-filter li").addClass("hide");
		
		$(_this).parents(".y-table-filter").prev("input").val(value);
		
		var index = $(_this).parents(".y-table-header-item").data("index");
		var bodyItems = $(".y-table .y-table-body .row .y-table-body-item[data-index='"+index+"']");
		$(".y-table .y-table-body .row").addClass("hide");
		for (var i = 0; i < bodyItems.length; i++) {
			if($(bodyItems[i]).html().indexOf(value) > -1){
				$(bodyItems[i]).parents(".row").removeClass("hide");
			}
		}
	});

    //主函数包含在method中，对外暴露，可以被jquery的实例对象执行
    var methods = {
        //初始化的函数，传入参数对象
        init: function(options){
            // 在每个元素上执行方法，同时返回该jqueryded的实例对象
            // console.log(options);
            return this.each(function() {
                var $this = $(this);
                // console.log($this);
                // 尝试去获取settings，如果不存在，则返回“undefined”
                var settings = $this.data('yTable');
                // console.log(settings);
                 // 如果获取settings失败，则根据options和default创建它
                if(typeof(settings) == 'undefined'){
                    var defaults = {
                        name:'zengbing',
                        sex:'nan',
                        onSomeEvent: function() {}
                    };
                    settings = $.extend({}, defaults, options);
                // 保存我们新创建的settings
                    $this.data('yTable',settings);
                }else{
                    // 如果我们获取了settings，则将它和options进行合并（这不是必须的，你可以选择不这样做）
                    settings = $.extend({}, settings, options);
                // 如果你想每次都保存options，可以添加下面代码：
                    $this.data('yTable', settings);
                }
                //将该配置参数赋值全局变量，方便其他函数调用
                config=settings;
                // 执行私有的方法，完成相关逻辑任务
               	privateFunction(config);
            });
        },
        updateTable: function(data){
			if(!data.column || !data.data || !data.column instanceof Array || !data.data instanceof Array){
				console.warn("数据格式错误!");
				return false;
			}
			if(data.column.length != data.data[0].length){
				console.warn("标题和内容列数不同!");
				return false;
			}
			var yHead = $('<div class="y-table-header"></di>');
			for (var i = 0; i < data.column.length; i++) {
				var yHeadItem = $('<div class="y-table-header-item" data-index="'+i+'">'+data.column[i].text+'</di>');
				if(data.column[i].filter){
					yHeadItem = $('<div class="y-table-header-item" data-index="'+i+'"></di>');
					var filter = $(['<div class="y-table-filter-container">',
						'<input value="" />',
						'<ul class="y-table-filter hide">',
							'<li>1</li>',
							'<li>2</li>',
							'<li>3</li>',
						'</ul>',
					'</div>'].join(""));
					yHeadItem.append(filter);
				}
				yHead.append(yHeadItem);
			}
			$(this).append(yHead);
			var yBody = $('<div class="y-table-body"></di>');
			for (var i = 0; i < data.data.length; i++) {
				var yBodyRow = $('<div class="row"></di>');
				for (var j = 0; j < data.data[i].length; j++) {
					var yBodyItem = $('<div class="y-table-body-item" data-index="'+j+'">'+data.data[i][j]+'</di>');
					yBodyRow.append(yBodyItem);
				}
				yBody.append(yBodyRow);
			}
			$(this).append(yBody);
			
			var headItems = $(".y-table-header .y-table-header-item");
			var bodyRows = $(".y-table-body .row");
			var bodyItems = $(".y-table-body .row .y-table-body-item");
			var width = Math.ceil(100/headItems.length);
			for (var i = 0; i < headItems.length-1; i++) {
				$(headItems[i]).css("width", width+"%");
				for (var j = 0; j < bodyRows.length; j++) {
					$(bodyRows[j]).find(".y-table-body-item:eq("+i+")").css("width", width+"%");
				}
				if(i > 0){
					var prevWidth = $(headItems[i-1]).css("width");
					$(headItems[i]).find(".y-table-filter").css("left", prevWidth);
				}
			}
		},
        //销毁缓存的变量
        destroy: function(options) {
            // 在每个元素中执行代码
            return $(this).each(function() {
                var $this = $(this);
	            // 执行代码
	            // 删除元素对应的数据
                $this.removeData('yTable');
            });
        },
        //其他的主题函数。可以完成对象的其他操作
        val: function(options1,options2,options3) {
        // 这里的代码通过.eq(0)来获取选择器中的第一个元素的，我们或获取它的HTML内容作为我们的返回值
            var someValue = this.eq(0).html();
            // 返回值
            console.log(arguments);
            return someValue;
        },
        getContent: function(){
            return this.each(function(){
                var content=$(this).text();
                console.log(content);
                //获取全局变量的初始化的值
                console.log(config)
            });
        }
    };
    
    $.fn.yTable = function(){
        var method = arguments[0];
        if(methods[method]) {
            method = methods[method];
            //将含有length属性的数组获取从第下标为1的之后的数组元素，并返回数组
            arguments = Array.prototype.slice.call(arguments,1);
        }else if( typeof(method) == 'object' || !method ){
            method = methods.init;
        }else{
            $.error( 'Method ' +  method + ' does not exist on jQuery.yTable' );
            return this;
        }
        //jquery的实例对象将拥有执行method的能力，method的this是指jquery的实例对象
        return method.apply(this,arguments);
    }
})(jQuery);