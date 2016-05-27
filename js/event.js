/**
 * 说明: 该模块主要用于生成日历的HTML结构
 * 
 * 该算法主要实现了一下功能:
 * 
 * 1、依赖calendar.js产生日历数据,通过模仿AngluarJS实现数据到页面最终的展示的映射
 * 
 * 作者: 魏国兴
 * 日期: 20160407
 */
+function(cal,$){
	
	// 日历对象
	var Calendar=cal||window.Calendar;
	
	// 下拉组件初始化
	$('.c-dropdown2').on('click',function(event){
		// 阻止冒泡
		stopProp(event);
		
		// 事件源
		var target=event.currentTarget;
		// 隐藏所有的菜单
		$('.c-dropdown2-menu').hide();
		// toggle当前菜单
		$('.c-dropdown2-menu',target).toggle();
		
		// 鼠标移动到下拉菜单上
		$('.c-dropdown2-option',target).on('mouseover',function(){
			// 移除其他元素的选中状态
			$('.c-dropdown2-menubox li',target).removeClass('c-dropdown2-selected');
			// 给当前元素添加选中状态
			$(this).addClass('c-dropdown2-selected');
		});
		
		// 点击下拉菜单
		$('.c-dropdown2-option',target).on('click',function(event){
			// 阻止冒泡
			stopProp(event);
			// 填充选中的菜单
			$('.c-dropdown2-btn',target).html(DOM(this).html());
			// 设置数值
			$('.c-dropdown2-btn',target).attr('data-value',DOM(this).attr('data-value'));
			// 隐藏菜单
			$('.c-dropdown2-menu',target).hide();
			
			// 触发查询
			search($(this).attr('data-role')==='f'?true:false);
		});
		
		// 点击其他地方的时候,隐藏菜单按钮
		$('body').on('click',function(){
			$('.c-dropdown2-menu').hide();
		});
		
		// 阻止冒泡
		function stopProp(event){
			var event=event?event:window.event;
			if (event.stopPropagation){
	            event.stopPropagation();
	        } else {
	            event.cancelBubble = true;
	        }
		}
		
	});
	
	// 点击日历中的某一天
	$('.op-calendar-new-table-box').on('click',function(event){
		
		// this值
		// var currentTarget=event.currentTarget;
		
		// 获取点击事件
		var event=event?event:window.event;
		// 事件源
		var target=event.target||event.srcElement;
		
		// 点击时间
		var date=target.getAttribute('date')||target.parentNode.getAttribute('date');
		
		if(date){
	    	var year=date.split('-')[0];
	    	var month=date.split('-')[1];
	    	var day=date.split('-')[2];
	    	
	    	var node=target.getAttribute('date')?target:target.parentNode;
	    	
	    	$('.op-calendar-new-table-box a').removeClass('op-calendar-new-table-selected');
	    	$(node).addClass('op-calendar-new-table-selected');
	    	
	    	var othermonth=$(node).attr('data-othermonth');
	    	$('.op-calendar-new-table-box').attr('date-selected',date);
	    	if(othermonth==false){
	    		Calendar.UI.detailHTML(year,month,day);
			}else{    	
		    	// 设置下拉框日期
				Calendar.UI.setDropDown(year,month);
				// 触发查询
				search();
			}
   		 }
	});
	
	// 选择月
	$('.op-calendar-new-month-box').on('click',function(event){
		
		// 事件源
		var target=event.target||event.srcElement;
		
		var res=Calendar.UI.getDropDown();
		var year=res.year;
		var month=res.month;
		
		if($(target).hasClass('op-calendar-new-prev-month')){
			year=month>1?year:year-1;
			month=month>1?month-1:12;
		}
		if($(target).hasClass('op-calendar-new-next-month')){
			year=month<12?year:year+1;
			month=month<12?month+1:1;
		}
		// 设置下拉框日期
		Calendar.UI.setDropDown(year,month);
		
		// 触发查询
		search();
	});
	
	// 回到今天
	$('.op-calendar-new-backtoday').on('click',function(event){
		// 重新初始化日历
		Calendar.init(new Date());
	});
	
	
	
	function search(qfestival){
		// 获取下拉框的年月和节日
		var res=Calendar.UI.getDropDown();
		// 输入框中的年
		var year=res.year;
		// 输入框中的月
		var month=res.month;
		// 当前日期
		var day=(new Date()).getDate();
		// 输入框中的节日
		var festival=res.festival;
		// 当前选中的日期
		var selected=res.selected;
		
		if(festival!='default'&&qfestival){
			
			var fm=parseInt(festival.substring(1,3),10);
			var fd=parseInt(festival.substring(3,5),10);
				
			// 国内传统节日 农历转公历
			if(!festival.startsWith('i')){
				var fdays=Calendar.getSolarCalendar(year,fm,fd);
				year=fdays[0].year;
				month=fdays[0].month;
				day=fdays[0].day;
				
			}else{
				month=fm;
				day=fd;
			}
			
			// 更新输入框的日期
			Calendar.UI.setDropDown(year,month,day);
			
			Calendar.UI.calendarHTML(year,month);
			Calendar.UI.detailHTML(year,month,day);
				
		}else{
			Calendar.UI.setFestival({date:'default',name:'假期安排'});
			// 更新输入框的日期
			Calendar.UI.setDropDown(year,month,selected||day);
			
			Calendar.UI.calendarHTML(year,month);
			Calendar.UI.detailHTML(year,month,selected||day);
			
		}
	}
}(Calendar,DOM);
