
/*
	version: v1.1.1
	author: yzz
	create time: 2017-03-13
	update time: 2017-03-13
	description: js pagination plugin
	log:
		2017-03-13: first created
*/

(function () {
	'use strict';
	var helper = {
		getMaxCount: function (pageIndex) {
			var maxCount = 10;	//设置分页最大显示的长度
			var pageIndexStr = '' + pageIndex;
			if (pageIndexStr.length <= 2) {
				maxCount = 9;
			} else if (pageIndexStr.length == 3) {
				maxCount = 7;
			} else if (pageIndexStr.length == 4) {
				maxCount = 5;
			} else {
				maxCount = 3;
			}
			return maxCount;
		},
		//检验设置对象
		getObj: function (obj) {
			obj.isValid = false;
			if (!obj.pageCount || obj.pageCount < 0) {
				obj.isValid = false;
			} else {
				obj.isValid = true;
				if (!obj.pageIndex || obj.pageIndex < 1 || obj.pageIndex > obj.pageCount) {
					obj.pageIndex = 1;
				}
				if (!obj.homePageText) {
					obj.homePageText = '[首页]';
				}
				if (!(obj.homePageShow === true || obj.homePageShow === false)) {
					obj.homePageShow = true;
				}
				if (!obj.endPageText) {
					obj.endPageText = '[末页]';
				}
				if (!(obj.endPageShow === true || obj.endPageShow === false)) {
					obj.endPageShow = true;
				}
				if (!obj.prevText) {
					obj.prevText = '[上一页]';
				}
				if (!obj.nextText) {
					obj.nextText = '[下一页]';
				}
				if (!(obj.prevShow === true || obj.prevShow === false)) {
					obj.prevShow = true;
				}
				if (!(obj.nextShow === true || obj.nextShow === false)) {
					obj.nextShow = true;
				}
				if (!obj.ellipseText) {
					obj.ellipseText = '...';
				}
				if (!(obj.jumpShow === true || obj.jumpShow === false)) {
					obj.jumpShow = true;
				}
				if (!obj.maxNumDisplay || obj.maxNumDisplay <= 2) {
					obj.maxNumDisplay = helper.getMaxCount(obj.pageIndex);
				}
				if (!obj.callback || !$.isFunction(obj.callback)) {
					obj.callback = function () { };
				}
			}
			return obj;
		},
		//获取html
		getHtml: function (obj) {
			var html = "";
			if (!!obj.homePageShow) {
				//设置首页按钮
				if (obj.pageIndex == 1) {
					html += '<a href="javascript:void(0)" style="cursor:default;">' + obj.homePageText + '</a>';
				} else {
					html += '<a class="jump" data-pageIndex="1" href="javascript:void(0)">' + obj.homePageText + '</a>';
				}
			}
			if (!!obj.prevShow) {
				//设置上一页按钮
				if (obj.pageIndex > 1) {
					html += '<a class="jump" data-pageIndex="' + (obj.pageIndex - 1) + '" href="javascript:void(0)">' + obj.prevText + '</a>';
				}
			}
			//设置前面的省略号
			if (obj.pageIndex > 1 && obj.pageIndex > Math.floor(obj.maxNumDisplay * 1.0 / 2) + 1) {
				html += '<a class="jump" title="' + (obj.pageIndex - 1 - Math.floor(obj.maxNumDisplay * 1.0 / 2)) + '" data-pageIndex="' + (obj.pageIndex - 1 - Math.floor(obj.maxNumDisplay * 1.0 / 2)) + '" href="javascript:void(0)">' + obj.ellipseText + '</a>';
			}
			//设置数字编号
			for (var i = Math.max(1, obj.pageIndex - Math.floor(obj.maxNumDisplay * 1.0 / 2)) ; i <= obj.pageIndex - 1; i++) {
				html += '<a class="jump" data-pageIndex="' + i + '" href="javascript:void(0)">' + i + '</a>';
			}
			html += '<a href="javascript:void(0)" style="cursor: default;">' + obj.pageIndex + '</a>';
			for (var i = obj.pageIndex + 1; i <= Math.min(obj.pageCount, obj.pageIndex + Math.floor(obj.maxNumDisplay * 1.0 / 2)) ; i++) {
				html += '<a class="jump" data-pageIndex="' + i + '" href="javascript:void(0)">' + i + '</a>';
			}
			//设置后面的省略号
			if (obj.pageCount - obj.pageIndex > Math.floor(obj.maxNumDisplay * 1.0 / 2)) {
				html += '<a class="jump" title="' + (obj.pageIndex + 1 + Math.floor(obj.maxNumDisplay * 1.0 / 2)) + '" data-pageIndex="' + (obj.pageIndex + 1 + Math.floor(obj.maxNumDisplay * 1.0 / 2)) + '" href="javascript:void(0)">' + obj.ellipseText + '</a>';
			}
			if (!!obj.nextShow) {
				//设置下一页按钮
				if (obj.pageIndex < obj.pageCount) {
					html += '<a class="jump" data-pageIndex="' + (obj.pageIndex + 1) + '" href="javascript:void(0)">' + obj.nextText + '</a>';
				}
			}
			if (!!obj.endPageShow) {
				//设置末页
				if (obj.pageIndex == obj.pageCount) {
					html += '<a href="javascript:void(0)" style="cursor:default;" >' + obj.endPageText + '</a>';
				} else {
					html += '<a class="jump" data-pageIndex="' + obj.pageCount + '" alt="共有' + obj.pageCount + '页" title="共有' + obj.pageCount + '页" href="javascript:void(0)">' + obj.endPageText + '</a>';
				}
			}
			if (!!obj.jumpShow) {
				//设置跳转到
				html += '转到<input type="number" value="1" style="width: 50px;">页<a class="go" style="cursor: pointer" href="javascript:void(0)">Go</a>';
			}
			return html;
		},
		//事件绑定
		bindEvent: function (obj, $bindjQObj) {
			$bindjQObj.children(".jump").unbind("click");
			$bindjQObj.children(".jump").bind("click", function () {
				var $that = $(this);
				var pageIndex = $that.attr("data-pageIndex");
				pageIndex = parseInt(pageIndex);
				obj.callback(pageIndex);
			});
			$bindjQObj.children(".go").unbind("click");
			$bindjQObj.children(".go").bind("click", function () {
				var $that = $(this);
				var pageIndex = $(this).parent().children('input').val();
				if (!pageIndex) {
					pageIndex = 1;
				}
				if (pageIndex > obj.pageCount) {
					pageIndex = obj.pageCount;
				} else if (pageIndex < 1) {
					pageIndex = 1;
				}
				pageIndex = parseInt(pageIndex);
				$(this).parent().children('input').val(pageIndex);
				obj.callback(pageIndex);
			});
		}
	}
	var pagination = {
		html: function (obj) {
			var $bindjQObj = $("#" + obj.bindId);
			if ($bindjQObj.length <= 0) {
				alert('--error! js pagination plugin "bindId" not found!--');
				return;
			}
			obj = helper.getObj(obj);
			if (!obj.isValid) {
				alert('--warn! js pagination plugin arguments is not valid!--');
				return;
			}
			$bindjQObj.empty().append($('<div>').addClass('yPagination').html(helper.getHtml(obj)));
			helper.bindEvent(obj, $bindjQObj.children());
		}
	}
	window.yPagination = pagination;
})()