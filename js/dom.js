/**
 * 说明: 该模块主要用于生成日历的HTML结构
 * 
 * 该算法主要实现了一下功能:
 * 
 * 1、实现模板引擎
 * 2、依赖calendar.js产生日历数据,通过模仿AngluarJS实现数据到页面最终的展示的映射
 * 
 * 作者: 魏国兴
 * 日期: 20160410
 */

+function(cal,$){
	
	// 日历对象
	var Calendar=cal||window.Calendar;
	
	/**
	 * 日历详情
	 * @param {Number} y 年
	 * @param {Number} m 月
	 */
	function calendarHTML(y,m){
				
		var month=Calendar.getCalendar(y,m);
		
		// 日历主体HTML片段
		var html='';	
			html+='<table class="op-calendar-new-table <%=tableSix%>">';
			html+='<tbody>';
			html+='<tr>';
			html+='<th>一</th>';
			html+='<th>二</th>';
			html+='<th>三</th>';
			html+='<th>四</th>';
			html+='<th>五</th>';
			html+='<th class="op-calendar-new-table-weekend">六</th>';
			html+='<th class="op-calendar-new-table-weekend">日</th>';
			html+='</tr>';
				
		// 日历天HTML片段
		var dtmpl='';
			dtmpl+='<td><div class="op-calendar-new-relative">';
			dtmpl+='<a class="<%=dateClass%>" href="javascript:;" date="<%=dateDay%>" data-othermonth="<%=othermonth%>">'; 
			dtmpl+='<span class="op-calendar-new-daynumber"><%=solarDay%></span>';
			dtmpl+='<span class="op-calendar-new-table-almanac"><%=lunarDay%></span>';
			dtmpl+='<%if(rest)%><span class="op-calendar-new-table-holiday-sign">休</span> </a>';
		    dtmpl+='</div></td>';
	    
	    /**
	     * 
	     * 正常：op-calendar-new-relative
	   	 * 周末：op-calendar-new-table-weekend
	     * 假日：op-calendar-new-table-festival
	     * 休息：op-calendar-new-table-rest
	     * 
	     */
	    var dateClasses={
	    	relative:'op-calendar-new-relative',
	    	weekend:'op-calendar-new-table-weekend',
	    	festival:'op-calendar-new-table-festival',
	    	rest:'op-calendar-new-table-rest',
	    	today:'op-calendar-new-table-today',
	    	selected:'op-calendar-new-table-selected',
	    	othermonth:'op-calendar-new-table-other-month'
	    };
	    var nwDay=new Date();
	    var today=nwDay.getFullYear()+'-'+(nwDay.getMonth()+1)+'-'+nwDay.getDate();
	    
	    var selected=$('.op-calendar-new-table-box').attr('date-selected');
		
		var rows=1;
		for(var j=0;j<month.length;j+=7){
			rows++;
			html+='<tr>';
			for(var i=j;i<j+7;i++){
				
				// 当前日期
				var dateDay=month[i].solarCalendar.year+'-'+month[i].solarCalendar.month+'-'+month[i].solarCalendar.day;
				// 日历
				var solarDay=month[i].solarCalendar.day;
				// 阴历
				var lunarDay=month[i].lunarCalendar.day;
				// 国际节日
		 		var interFestival=month[i].interFestival;
		 		// 国内节日
		 		var domesticFestival=month[i].domesticFestival;
				// 法定假日
				var legalHoliday=month[i].legalHoliday;
				// 节气
				var term=month[i].chinaEra.term;
				
				var othermonth=month[i].solarCalendar.othermonth;
				// 默认为正常
				var dateClass=othermonth?dateClasses['othermonth']:dateClasses['relative'];
				// 当天
				if(dateDay==today){
					dateClass+=' '+dateClasses['today'];
				}
				// 周末
				if(i%7==5||i%7==6){
					dateClass+=' '+dateClasses['weekend'];
				}
				// 休息
				if(legalHoliday){
					dateClass+=' '+dateClasses['rest'];
				}
				// 假日
				if(term||interFestival||domesticFestival){
					dateClass+=' '+dateClasses['festival'];
					lunarDay=term||interFestival||domesticFestival;
				}
				if(dateDay==selected){
					dateClass+=' '+dateClasses['selected'];
				}
				
				var day={
					dateClass:dateClass,
					dateDay:dateDay,
					solarDay:solarDay,
					lunarDay:lunarDay,
					rest:legalHoliday, //是否休息
					othermonth:othermonth
				}
				
				html+=DOM.template(dtmpl,day);
			}
			html+='</tr>';
		}
		html+='</tbody></table>';
		if(rows>6){
			html=$.template(html,{tableSix:'op-calendar-new-table-six'});
		}else{
			html=$.template(html,{tableSix:''});
		}
		$('.op-calendar-new-table-box').html(html);
	}
	/**
	 * 当天详细情况
	 * 
	 * @param {Number} y 年
	 * @param {Number} m 月
	 * @param {Number} d 日
	 */
	function detailHTML(y,m,d){
		
		var month=Calendar.getCalendar(y,m);
		
		var dtmpl='';
		dtmpl+='<p class="op-calendar-new-right-date"><%=today%> <%=week%></p>';
		dtmpl+='<p class="op-calendar-new-right-day"><%=dayTime%></p>';
		dtmpl+='<p class="op-calendar-new-right-lunar c-gap-top-small">'; 
		dtmpl+='<span><%=lunarMonth%><%=lunarDay%></span><span><%=eraYear%>年 【<%=zodiac%>】</span><span><%=eraMonth%>月 <%=eraDay%>日</span> </p>';
		dtmpl+='<div class="op-calendar-new-right-almanacbox">';
		dtmpl+='<p class="op-calendar-new-right-almanac c-clearfix">';
		dtmpl+='<span class="op-calendar-new-right-suit"><i>宜</i><%=yDay%></span>'; 
		dtmpl+='<span class="op-calendar-new-right-avoid"><i>忌</i><%=jDay%></span></p>';
		dtmpl+='</div>';
		
		
		for(var i in month){
			var dateDay=month[i].solarCalendar.year+'-'+month[i].solarCalendar.month+'-'+month[i].solarCalendar.day;
			if(dateDay===y+'-'+m+'-'+d){
				break;
			}
		}
		var selectedDay=month[i];
		
		m=m<10?'0'+m:m;
		d=d<10?'0'+d:d;
		
		var yDay=selectedDay.almanac?selectedDay.almanac.y.split('.').slice(0,6).join('<br>'):'无';
		var jDay=selectedDay.almanac?selectedDay.almanac.j.split('.').slice(0,6).join('<br>'):'无';
		var day={
			today:y+'-'+m+'-'+d,
			dayTime:d,
			week:selectedDay.solarCalendar.week,
			lunarMonth:selectedDay.lunarCalendar.month,
			lunarDay:selectedDay.lunarCalendar.day,
			eraYear:selectedDay.chinaEra.year,
			eraMonth:selectedDay.chinaEra.month,
			eraDay:selectedDay.chinaEra.day,
			zodiac:selectedDay.chinaEra.zodiac,
			yDay:yDay,
			jDay:jDay
		}
		dtmpl=$.template(dtmpl,day);
		$('.op-calendar-new-right').html(dtmpl);
		
	}
	
	/**
	 * 初始化年月,节日选择控件
	 * @param {Number} y
	 * @param {Number} m
	 */
	function dropDownHTML(y,m,d){
		
		/**
		 * 万年历支持查询的年份范围
		 */
		var minYear = 1899;//最小年限
		var maxYear = 2100;//最大年限
		
		// 国内传统节日
		var festival={
			'default':'假期安排',
			'i0101':'元旦 ',
			'd0101':'春节 ',
	        'd0115':'元宵节',
	        'd0202':'龙头节',
	        'd0505':'端午节',
	        'd0707':'七夕节',
	        'd0715':'中元节',
	        'd0815':'中秋节',
	        'd0909':'重阳节',
	        'd1001':'寒衣节',
	        'd1015':'下元节',
	        'd1208':'腊八节',
	        'd1223':'小年'
		};
		var html='';
		for(var i=minYear+1;i<maxYear;i++){
			html+='<li class="c-dropdown2-option" data-value="'+i+'" data-role="y">'+i+'年</li>';
		}
		// 输入框中的年
		$('.op-calendar-new-year-box .c-dropdown2-btn').html(y+'年')
		$('.op-calendar-new-year-box .c-dropdown2-btn').attr('data-value',y);
		$('.op-calendar-new-year-box .c-dropdown2-menubox').html(html)
		
		var html='';
		for(var i=1;i<=12;i++){
			html+='<li class="c-dropdown2-option" data-value="'+i+'" data-role="m">'+i+'月</li>';
		}
		// 输入框中的月
		$('.op-calendar-new-month-box .c-dropdown2-btn').html(m+'月');
		$('.op-calendar-new-month-box .c-dropdown2-btn').attr('data-value',m);
		$('.op-calendar-new-month-box .c-dropdown2-menubox').html(html);
		
		var html='';
		for(var i in festival){
			html+='<li class="c-dropdown2-option" data-value="'+i+'" data-role="f">'+festival[i]+'</li>';
		}
		// 输入框中的节日
		$('.op-calendar-new-holiday-box .c-dropdown2-btn').html('假期安排');
		$('.op-calendar-new-holiday-box .c-dropdown2-btn').attr('data-value','default');
		$('.op-calendar-new-holiday-box .c-dropdown2-menubox').html(html);
		
		// 设置当前选中的日期
		$('.op-calendar-new-table-box').attr('date-selected',y+'-'+m+'-'+d);
	}
	/**
	 * 更新输入框年月和当前选中的日期
	 * @param {Number} y
	 * @param {Number} m
	 * @param {Number} d
	 */
	function setDropDown(y,m,d){
		// 更新输入框的日期
		$('.op-calendar-new-year-box .c-dropdown2-btn').attr('data-value',y);
		$('.op-calendar-new-year-box .c-dropdown2-btn').html(y+'年');
		$('.op-calendar-new-month-box .c-dropdown2-btn').attr('data-value',m);
		$('.op-calendar-new-month-box .c-dropdown2-btn').html(m+'月');
		if(d){
			$('.op-calendar-new-table-box').attr('date-selected',y+'-'+m+'-'+d);
		}
	}
	function getDropDown(){
		// 输入框中的年
		var year=$('.op-calendar-new-year-box .c-dropdown2-btn').attr('data-value');
		// 输入框中的月
		var month=$('.op-calendar-new-month-box .c-dropdown2-btn').attr('data-value');
		// 输入框中的节日
		var festival=getFestival().date;
		// 当前选中的日期		
		var selected=$('.op-calendar-new-table-box').attr('date-selected');
		selected=(selected&&selected.length>0)?selected.split('-')[2]:0;
		
		var res={
			year:parseInt(year,10),
			month:parseInt(month,10),
			festival:festival,
			selected:parseInt(selected,10)
		}
		return res;
	}
	function setFestival(festival){
		// 输入框中的节日
		$('.op-calendar-new-holiday-box .c-dropdown2-btn').attr('data-value',festival.date);
		$('.op-calendar-new-holiday-box .c-dropdown2-btn').html(festival.name);
	}
	function getFestival(){
		// 输入框中的节日
		var date=$('.op-calendar-new-holiday-box .c-dropdown2-btn').attr('data-value');
		var name=$('.op-calendar-new-holiday-box .c-dropdown2-btn').html();
		var res={
			date:date,
			name:name
		};
		return res;
	}
	// 向Calendar命名空间中添加UI属性
	Calendar.UI={
		dropDownHTML:dropDownHTML,
		getDropDown:getDropDown,
		setDropDown:setDropDown,
		setFestival:setFestival,
		getFestival:getFestival,
		detailHTML:function(y,m,d){
			// 加载对应的库,然后初始化日历
			Calendar.loadCalendarLib(y,function(){
				detailHTML(y,m,d);
			});
		},
		calendarHTML:function(y,m){
			// 加载对应的库,然后初始化日历
			Calendar.loadCalendarLib(y,function(){
				calendarHTML(y,m);
			});
		}
	}
	
	// 日历初始化入口函数
	Calendar.init=function(today){
		// 获取当前日期
		var y=today.getFullYear();
		var m=today.getMonth()+1;
		var d=today.getDate();
		
		// 生成日历下拉框
		Calendar.UI.dropDownHTML(y,m,d);
		
		// 初始化日历
		Calendar.UI.calendarHTML(y,m);
		Calendar.UI.detailHTML(y,m,d);
	}
	
}(Calendar,DOM);
