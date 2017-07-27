/**
 * --------------------------------------------------
 *
 * 功能： 扁平化，简单信息提示框。类似七牛后台提示框。
 *
 * --------------------------------------------------
 *
 * 依赖： jquery
 *
 * --------------------------------------------------
 *
 * 使用：
 * 先引入jquery，再引入该js。然后就可以使用。
 *
 *   prompt.add('给我一个理由忘记');
 *   prompt.add('仿佛有痛楚。如果我晕眩', 'bottom');
 *
 * --------------------------------------------------
 * 
 *  方法：
 *  初始化：init(Object options);
 *  添加提示消息：add(String content, String position);
 *  
 *  init方法，用来初始化选项的。默认会初始化一次，即默认值。
 *  add方法，用来添加提示消息。第一个参数是提示消息的内容，第二个参数是提示消息展示的位置。
 *  位置仅有三个值可选：'top','bottom','center'。分别表示展示在顶部，底部，中间。该参数可省略。省略或非该三个值，强制为'top'。
 *
 * --------------------------------------------------
 * 
 * 选项：
 *  1. max 信息提示框同时显示的最大个数。默认4
 *  2. delay 信息提示框展示的时间，单位毫秒。默认2800
 *  3. height 顶部或底部消息提示框时，消息提示框的高度。默认50
 *  4. centerWidth 中间模态提示框时，提示框的宽度。默认400
 *  5. centerHeight 中间模态提示框时，提示框的高度。默认90
 *  6. fontSize 提示框文字的大小。默认16
 *  7. color 提示框的文字颜色。 默认#3d995f
 *  8. backgroundColor 提示框的背景颜色。默认#d7fae3
 *  9. borderColor 提示框的边框颜色。默认#d7fae3
 *  
 *  默认有一套默认值。引入js就可以使用。如果想修改默认值，可以通过init方法。
 *  如：prompt.init({'fontSize':14, 'max':3, 'height': 45});
 *  
 *  还可以直接修改。
 *  如：prompt.fontSize = 14;
 *   
 *  这些修改，都必须在add方法之前操作。
 *
 * --------------------------------------------------
 *
 * author: vini123 
 * web: https://mlxiu.com
 * blog:https://blog.vini123.com
 *
 * --------------------------------------------------
 */ 
 	
var prompt;
(function(factory){
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	}else if (typeof exports === 'object') {
		factory(require('jquery'));
	}
	else{
		factory(jQuery);
	}
})(function($){
	'use strict';

	var theself;
	var console = window.console || {log:function(value){}};
	
	function Prompt()
	{
		this.running = 0;
		this.list = [];
		this.timer = null;

		this.init();

		theself = this;

		$(window).resize(Prompt.resize);
	};

	Prompt.top = 'top';

	Prompt.center = 'center';

	Prompt.bottom = 'bottom';

	Prompt.analysisOptions = function(options, key, value)
	{
		if(!options)
			return value;

		if(!options[key])
			return value;

		return options[key];
	};

	Prompt.prototype = {
		constructor: Prompt,

		init:function(options)
		{
			this.max = Prompt.analysisOptions(options, 'max', 4); 
			this.delay = Prompt.analysisOptions(options, 'delay', 2.8 * 1000);
			this.height = Prompt.analysisOptions(options, 'height', 50);
			this.centerWidth = Prompt.analysisOptions(options, 'centerWidth', 400);
			this.centerHeight = Prompt.analysisOptions(options, 'centerHeight', 90);
			this.fontSize = Prompt.analysisOptions(options, 'fontSize', '16px');
			this.color = Prompt.analysisOptions(options, 'color', '#3d995f');
			this.backgroundColor = Prompt.analysisOptions(options, 'backgroundColor', '#d7fae3');
			this.borderColor = Prompt.analysisOptions(options, 'borderColor', '#d7fae3');	
		},

		add:function(content, position = null)
		{
			if(!content)return;

			if(!position || (position != Prompt.top && position != Prompt.center && position != Prompt.bottom)){
				position = Prompt.top;
			}

			theself.list.push({content:content, position:position});
			Prompt.run();
		}
	};

	Prompt.run = function()
	{
		if(!theself.list || theself.list.length <= 0 || theself.running >= theself.max)
		{
			return;
		}

		var curMsg = theself.list.shift();
		if(curMsg.position == Prompt.center)
		{
			theself.list.unshift(curMsg);
			Prompt.stopTimer();
			Prompt.nextCenterListener();
			return;
		}

		if(theself.runCenter)
		{
			theself.list.unshift(curMsg);
			return;
		}

		var samePositionNum = 0;
		$('.prompt').each(function(index){
			if($(this).data('position') == curMsg.position)
			{
				samePositionNum ++;
			}
		});

		var distance = (samePositionNum + 0.5) * theself.height;
		var html,element;

		if(curMsg.position == Prompt.top)
		{
			html = Prompt.sprintf('<div class="prompt" data-position="%s" style="position:fixed;display:inline-block;width:100%;height:%s;line-height:%s;top:%s;left:0;background-color:%s;color:%s;border:1px solid %s;font-size:%s;font-weight:700;z-index:999;text-align:center;opacity:0;">%s</div>', curMsg.position, theself.height + 'px', theself.height + 'px', distance + 'px',
									theself.backgroundColor, theself.color, theself.borderColor, theself.fontSize, curMsg.content);

			element = $(html);
			element.animate({'top': (distance - theself.height * 0.5), 'opacity':1}, 'swing');
		}
		else if(curMsg.position == Prompt.bottom)
		{
			$('.prompt').each(function(){
				if($(this).data('position') == Prompt.bottom)
				{
					var bottom = $(this).data('bottom') + theself.height;
					$(this).data('bottom', bottom);
					$(this).stop(false, true);
					$(this).animate({'bottom':bottom}, 'swing');
				}
			})

			html = Prompt.sprintf('<div class="prompt" data-bottom="%s" data-position="%s" style="position:fixed;display:inline-block;width:100%;height:%s;line-height:%s;bottom:%s;left:0;background-color:%s;color:%s;border:1px solid %s;font-size:%s;font-weight:700;z-index:999;text-align:center;opacity:0;">%s</div>', 0, curMsg.position, theself.height + 'px', theself.height + 'px', -theself.height + 'px',
									theself.backgroundColor, theself.color, theself.borderColor, theself.fontSize, curMsg.content);

			element = $(html);
			element.animate({'bottom': 0, 'opacity':1}, 'swing');
		}

		$('body').append(element);
		theself.running ++;

		Prompt.startTimer();
	};

	Prompt.complete = function()
	{
		var firstElement;
		var firstPosition;
		var samePositionNum = 0;
		var otherPositionNum = 0;

		$('.prompt').each(function(){
			if(!firstElement)
			{
				firstElement = $(this);
				firstPosition = firstElement.data('position');

				if(firstPosition == Prompt.top)
				{
					firstElement.animate({'top': (parseInt($(this).css('top')) - theself.height), 'opacity': 0}, 600, null, function(){
						firstElement.remove();
						firstElement = null;

						theself.running --;
						Prompt.run();	
					});
				}
				else if(firstPosition == Prompt.bottom)
				{
					firstElement.animate({'bottom': (parseInt($(this).css('bottom')) + theself.height), 'opacity': 0}, 600, null, function(){
						firstElement.remove();
						firstElement = null;

						theself.running --;
						Prompt.run();	
					});
				}
				return true;
			}

			if(firstPosition == $(this).data('position'))
			{
				samePositionNum ++;
			}
			else
			{
				otherPositionNum ++;
			}
		})

		var otherElement;
		$('.prompt').each(function(i){
			if(i == 0)
				return true;

			if(samePositionNum > 0)
			{
				if($(this).data('position') == firstPosition)
				{
					if($(this).data('position') == Prompt.top)
					{
						$(this).animate({'top': (parseInt($(this).css('top')) - theself.height)}, 600);
					}
				}
			} 

			if(otherPositionNum > 0)
			{
				if($(this).data('position') != firstPosition)
				{
					if(!otherElement)
					{
						otherElement = $(this);
						if(otherElement.data('position') == Prompt.top)
						{
							otherElement.animate({'top': (parseInt($(this).css('top')) - theself.height), 'opacity': 0}, 600, null, function(){
								otherElement.remove();
								otherElement = null;

								theself.running --;
								Prompt.run();
							});
						}
						else if(otherElement.data('position') == Prompt.bottom)
						{
							otherElement.animate({'bottom': (parseInt($(this).css('bottom')) + theself.height), 'opacity': 0}, 600, null, function(){
								otherElement.remove();
								otherElement = null;

								theself.running --;
								Prompt.run();
							});
						}
						return true;
					}

					if($(this).data('position') == Prompt.top)
					{
						$(this).animate({'top': (parseInt($(this).css('top')) - theself.height)}, 600);
					}
				}
			}
		})

		if($('.prompt').length <= 0)
		{
			Prompt.stopTimer();
		}
	};

	Prompt.resize = function(){
		$('.prompt').each(function(){

			$(this).css('width', $(window).width());
			if($(this).data('position') == Prompt.center)
			{
				$(this).css('height', $(window).height());
			}
		});
	};

	// 当下一个提示框是居中提示，阻塞后续展示。当之前的提示框展示完毕，才开始从居中这个开始展示。
	Prompt.nextCenterListener = function(){
		if($('.prompt').length > 0)
			return;

		var curMsg = theself.list.shift();
		var html = Prompt.sprintf('<div class="prompt" data-position="%s" style="position:fixed;width:100%;height:100%;background-color:rgba(0,0,0, 0.72);top:0;left:0;"><div style="position:fixed;display:inline-block;width:%s;height:%s;line-height:%s;text-align:center;font-size:%s;font-weight:700;left:50%;top:50%; margin-left:%s; margin-top:%s; border-radius:6px;background-color:%s;color:%s;border:1px solid %s;">%s</div></div>', curMsg.position, theself.centerWidth + 'px', theself.centerHeight + 'px', theself.centerHeight + 'px', theself.fontSize, -theself.centerWidth * 0.5 + 'px', -theself.centerHeight * 0.5 + 'px', theself.backgroundColor, theself.color, theself.borderColor,curMsg.content);
		$('body').append($(html));	

		$('.prompt').bind('click', Prompt.centerElementClick);

		theself.runCenter = true;
	};

	Prompt.centerElementClick = function(){
		$(this).animate({opacity:0}, 500, null, function(){
			$('.prompt').unbind('click');
			$(this).remove();

			theself.runCenter = false;

			for(var i = 0; i < theself.max; i++)
			{
				Prompt.run();
			}
		})
	};

	Prompt.startTimer = function()
	{
		if(!theself.timer)
		{
			theself.timer = setInterval(Prompt.complete, theself.delay);
		}
	};

	Prompt.stopTimer = function()
	{
		if(!theself.timer)
		{
			clearInterval(theself.timer);
			theself.timer = null;
		}
	};

	Prompt.sprintf = function(){
		var arg = arguments;
		if(arg.length <= 0){
			console.log('you must fill params!');
			return '';
		}

		var str = arg[0];

		for(var i = 1; i< arg.length; i++){
			str = str.replace(/%s/, arg[i]);
		}
		return str;
	};

	prompt = new Prompt();
})