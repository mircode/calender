/**
 * 说明: 该模块主要用于拓展和封装一些公共方法
 * 
 * 该算法主要实现了一下功能:
 * 
 * 
 * 作者: 魏国兴
 * 日期: 20160411
 */
+function(){
	
	// 事件对象
	var events={
		on:function(type,handler){
			DOM.each(this.dom,function(element){
				// firefox google chrome
		        if(element.addEventListener){
		            element.addEventListener(type,handler,false);
		        // ie
		        }else if(element.attachEvent){
		            element.attachEvent('on'+type,handler);
		        // other
		        }else{
		            element['on'+type]=handler;
		        }
	        });
	    },
    	off:function(type,handler){
    		DOM.each(this.dom,function(element){
	    		// firefox google chrome
		        if(element.removeEventListener){
		            element.removeEventListener(type,handler,false);
		        // ie
		        }else if(element.detachEvent){
		            element.detachEvent('on'+type,handler);
		        // other
		        }else{
		            element['on'+type]=null;
		        }
	        });
    	}
    
	}
	
	
	
	/****************************
	// 实现细节
	/***************************/
	
	/**
	 * 拓展模板功能
	 * @param {String} html
	 * @param {Object} options
	 */
	function template(html,options){
		
		// 用于缓存编译过的模板
		var cache = {};
		
		function compile(html,options){
			
			var regExp=/<%([^%>]+)%>/g;
			var regVar=/<%=([^%>]+)%>/g;
        
        	var res=null;
			if(!/\W/.test(html)){
				res=cache[html]||compile(document.getElementById(html).innerHTML,options);
			}else{
		        var tmpl = 'var p=[];' +
		          'with(obj||{}){p.push(\'' +
		          html.replace(/\\/g, '\\\\')
		             .replace(/'/g, "\\'")
		             .replace(regVar, function(match, code) {
		               return "'," + code.replace(/\\'/g, "'") + ",'";
		             })
		             .replace(regExp || null, function(match, code) {
		               return "');" + code.replace(/\\'/g, "'").replace(/[\r\n\t]/g, ' ') + "p.push('";
		             })
		             .replace(/\r/g, '\\r')
		             .replace(/\n/g, '\\n')
		             .replace(/\t/g, '\\t')
		             + "');}return p.join('');";
		             
		          res=new Function('obj',tmpl)(options);
	        }
			return res;
	   }
	   return compile(html,options);
	}
	/**
	 * 
	 * 拓展元素选择器
	 * @param {String} sel 	         选择字符串
	 * @param {String} context 上线文环境
	 */
	function selector(sel,context){
		
		context=context||document;
		
		var dom=[];
		
		if(!(typeof sel == 'string')){
			dom.push(sel);
			return dom;
		}
		var doms=context.querySelectorAll(sel);
		for (var i=0;i<doms.length;i++){
			dom.push(doms[i]);
		}
		return dom;
	}
	
	
	// 遍历集合元素
	function each(obj,callback){
		for(var e in obj){
			callback(obj[e],e);
		}
	}
	// 更新某个元素中的html内容
	function html(html){
		
		if(html){
			DOM.each(this.dom,function(e){
				e.innerHTML=html;
			});
		}else{
			var res=[];
			DOM.each(this.dom,function(e){
				res.push(e.innerHTML);
			});
			return res.length==1?res[0]:res;
		}
		
	}
	// 判断是否拥有某个类名
	function hasClass(cls,e) {
		var reg=new RegExp('(\\s|^)'+cls+'(\\s|$)');
		e=e||this.dom[0];
		return e.className?reg.test(e.className):false;
	}

	// 添加类名
	function addClass(cls) {
		DOM.each(this.dom,function(e){
			if(!hasClass(cls,e)){
				e.className+= " "+cls;
			}
	  	});
	}
	// 删除类
	function removeClass(cls) {
		DOM.each(this.dom,function(e){
		    if(hasClass(cls,e)){
		        var reg=new RegExp('(\\s|^)'+cls+'(\\s|$)');
		        e.className=e.className.replace(reg,' ');
		    }
	 	});
	}
	// 显示
	function show(){
		DOM.each(this.dom,function(e){
			try{
				e.style.visibility='visible';
		    	e.style.display='inherit';
		    }catch(err){}
	 	});
	}
	// 隐藏
	function hide(){
		DOM.each(this.dom,function(e){
			try{
				e.style.visibility='hidden';
		   		e.style.display='none';
		   	}catch(err){}
	 	});
	}
	// 切换
	function toggle(){
		DOM.each(this.dom,function(e){
			try{
				var visibility=e.style.visibility=='hidden'?'visible':'hidden';
				var display=e.style.display=='none'||e.style.display==''?'inherit':'none';
				e.style.visibility=visibility;
		   		e.style.display=display;
		   	}catch(err){}
	 	});
	}
	function attr(name,value){
		if(value){
			DOM.each(this.dom,function(e){
				e.setAttribute(name,value);
	 		});	
		}else{
			var res=[];
			DOM.each(this.dom,function(e){
				res.push(e.getAttribute(name));
		 	});
		 	return res.length==1?res[0]:res;
	 	}
	}

	// 动态加载JS
	function getScript(urls,callback){
		
		var head = document.getElementsByTagName('head')[0];
		urls=typeof urls==='string'?[urls]:urls.concat();
		
		if(urls.length<=0){
			callback();
		}
		
		for(var i in urls){
	        var js = document.createElement('script');
	        js.setAttribute('type', 'text/javascript'); 
	        js.setAttribute('src', urls[i]);
        	head.appendChild(js);
        	if(document.all){ //IE
	            js.onreadystatechange=function(){
	                if (js.readyState=='loaded'||js.readyState=='complete'){
	                	
	                    (i==urls.length-1)&&callback();
	                }
	            }
	            js.onerror=function(){
					 (i==urls.length-1)&&callback();      		    	
	            }
	        }else{
	            js.onload=function(){
	                (i==urls.length-1)&&callback();
	            }
	            js.onerror=function(){
					 (i==urls.length-1)&&callback();   		    	
	            }
        	}
	        
	        
       }
	}
	window.DOM=window.DOM||function(seletor,context){
		if(this instanceof DOM){
			this.dom=selector(seletor,context);
			return this;
		}else{
			return new DOM(seletor,context);
		}
	}
	
	/****************************
	// 拓展静态方法
	/***************************/
	// 遍历对象和数组
	DOM.each=each;
	// 模板
	DOM.template=template;
	// 动态加载JS
	DOM.getScript=getScript;
	/****************************
	// 拓展共有方法
	/***************************/
	DOM.prototype.html=html;
	DOM.prototype.addClass=addClass;
	DOM.prototype.removeClass=removeClass;
	DOM.prototype.hasClass=hasClass;
	DOM.prototype.show=show;
	DOM.prototype.hide=hide;
	DOM.prototype.toggle=toggle;
	DOM.prototype.attr=attr;
	/****************************
	// 拓展事件对象
	/***************************/
	DOM.each(events,function(value,key){
		DOM.prototype[key]=value;
	});
}();
