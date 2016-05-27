/**
 * 说明: 该模块主要用于组装 calendar.js dom.js event.js 生成日历
 * 
 * 作者: 魏国兴
 * 日期: 20160407
 */
+function(cal){
	
	// 日历对象
	var Calendar=cal||window.Calendar;
	// 初始化日历
	Calendar.init(new Date());
	
}(Calendar);