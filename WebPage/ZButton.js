var ZButton =
{
	create: function(this_chart,content,height,font,default_status)
	{
		var chart=this_chart;
		var ctx=chart.getContext("2d");

		var devicePixelRatio = window.devicePixelRatio || 1;
		var backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
							ctx.mozBackingStorePixelRatio ||
							ctx.msBackingStorePixelRatio ||
							ctx.oBackingStorePixelRatio ||
							ctx.backingStorePixelRatio || 1;
		var ratio = devicePixelRatio / backingStoreRatio;

		ctx.font = font;
		ctx.textBaseline = "middle";
		ctx.textAlign="start";
		text=ctx.measureText(content);

		var object={};
		var active=true;
		var display_x=0;
		var display_y=0;
		var highlight=false;
		var mouse_cilck_flag=0;

		object.content=content;
		object.status_count=3;
		object.height=height;
		object.width=draw_button(ctx,object.height,content,font,0);
		object.status=(default_status==undefined?1:default_status);

		object.resetFont = function(this_font)
		{
			font=this_font;
			ctx.font = this_font;
			ctx.textBaseline = "middle";
			ctx.textAlign="start";
			text=ctx.measureText(content);
			object.width=draw_button(ctx,object.height,content,font,0);
		}

		object.actual_length=function()
		{
			if (active) return object.width;
			else return 0;
		}

		object.onclick=function(){;}//Commom API
		object.onfocus=function(){;}//Commom API

		object.display= function()
		{
			chart.addEventListener(
				'mousedown',
				function(evt)
				{
					var this_x = (evt.pageX-chart.offsetLeft)*ratio;
					var this_y = (evt.pageY-chart.offsetTop)*ratio;
					object.catchmouseevent(this_x,this_y,1);
				});
			chart.addEventListener(
				'mousemove',
				function(evt)
				{
					var this_x = (evt.pageX-chart.offsetLeft)*ratio;
					var this_y = (evt.pageY-chart.offsetTop)*ratio;
					object.catchmouseevent(this_x,this_y,mouse_cilck_flag);
				});
			chart.addEventListener(
				'mouseup',
				function(evt)
				{
					var this_x = (evt.pageX-chart.offsetLeft)*ratio;
					var this_y = (evt.pageY-chart.offsetTop)*ratio;
					object.catchmouseevent(this_x,this_y,0);
				});
			active=true;
		};

		object.hide= function(){active=false};

		object.draw=function(this_x,this_y,bkg_color,
			/*Not Necessarily required*/style,
			/*Not Necessarily required*/this_width)
		{
			if(active)
			{
				display_x=this_x;
				display_y=this_y;

				if(style!=undefined)
				{
					if (style=="left")
					{
						display_x=this_x;
						display_y=this_y;
						object.width=this_width;
					}
					if (style=="right")
					{
						display_x=this_x-this_width;
						display_y=this_y;
						object.width=this_width;
					}
				}

				var front_color="#FFFFFF";
				if(color_illuminance(bkg_color)>0.9)front_color="#000000";
				var this_color_set=
					{
						front: 		front_color,
						background: bkg_color,
						highlight:	color_mix(front_color,bkg_color,0.6),
					}
				draw_button(ctx,object.height,content,font,object.status,this_x,this_y,this_color_set,highlight,style,this_width);
			}
		}

		object.catchmouseevent=function(this_x,this_y,mouseStatus)
		{
			if(active)
			{
				if(
					this_x>display_x 
					&& this_x<(display_x+object.width)
					&& this_y>display_y
					&& this_y<(display_y+object.height)
					)
				{
					object.onfocus(object.status,object);
					highlight=true;
					if(mouse_cilck_flag==1 && mouseStatus==0)
					{
						mouse_cilck_flag=0;
						object.status++;
						if(object.status>object.status_count)object.status=1;
						object.onclick(object.status,object);
					}
					mouse_cilck_flag=mouseStatus;
				}
				else
				{
					highlight=false;
					mouse_cilck_flag=0;
				}
			}
		}
		//ButtonList.push(object);
		return object;
	}
};

function hexToRgb(hex) 
{
    var color = [], rgb = [];
    hex = hex.replace("#","");

    if (hex.length == 3)
    {
        var tmp = [];
        for (var i = 0; i < 3; i++)
        {
            tmp.push(hex.charAt(i) + hex.charAt(i));
        }
        hex = tmp.join("");
    }
    for (var i = 0; i < 3; i++) {
        color[i] = "0x" + hex.substr(i * 2, 2);
        rgb.push(parseInt(parseInt(color[i])));
    }
    return rgb;
}

function rgbToHex(rgb) {
	var hex="#";
    for (var i = 0; i < 3; i++) {
        hex += ("0" + Math.ceil(rgb[i]).toString(16)).slice(-2);
    }
    return hex;
}

function color_highlight(hex_color,highlight_ratio)
{
	highlight_ratio=highlight_ratio<0?0:highlight_ratio;
	var rgb=hexToRgb(hex_color);
	for (var i=0;i<3;i++)
	{
		rgb[i]=rgb[i]*highlight_ratio>255?255:(rgb[i]*highlight_ratio);
	}
	return rgbToHex(rgb);
}

function color_mix(hex_color_1,hex_color_2,mix_ratio)
{
	mix_ratio=mix_ratio<0?0:mix_ratio;
	mix_ratio=mix_ratio>1?1:mix_ratio;

	var rgb_1=hexToRgb(hex_color_1);
	var rgb_2=hexToRgb(hex_color_2);
	var rgb=[0,0,0];
	for (var i=0;i<3;i++)
	{
		rgb[i]=rgb_1[i]*mix_ratio+rgb_2[i]*(1-mix_ratio);
	}
	return rgbToHex(rgb);
}

function color_illuminance(hex_color)
{
	var rgb=hexToRgb(hex_color);
	var val=0;
	for (var i=0;i<3;i++)
	{
		val+=rgb[i]*rgb[i];
	}
	val=Math.sqrt(val);
	return val/Math.sqrt(3*255*255);
}

function draw_button(ctx,height,content,font,status,x,y,color_family,highlight,style,width)
{
	if(style==undefined)
	{
		return draw_button_style1(ctx,height,content,font,status,x,y,color_family,highlight);
	}
	if(style=="left" || style=="right")
	{
		draw_button_banner(ctx,height,content,font,status,x,y,color_family,highlight,style,width);
		return width;
	}
}

function draw_button_banner(ctx,height,content,font,status,x,y,color_family,highlight,style,width)
{

	if(status==1)
	{
		fill_color=color_family.background;
		text_color=color_family.front;
	}

	if(status==2)
	{
		fill_color=color_mix(color_family.background,"#000000",0.8);
		text_color=color_family.front;
	}

	if(highlight==true)
	{
		fill_color=color_mix(fill_color,"#FFFFFF",0.9);
		text_color=color_family.front;
	}

	ctx.font = font;
	ctx.textBaseline = "middle";
	ctx.textAlign=style;
	text_length=ctx.measureText(content).width;
	var inner_pedding=Math.floor(height*0.2);

	while(content.length>1 && (text_length+inner_pedding+height/2)>width)
	{
		content=content.slice(0,content.length-1);
		text_length=ctx.measureText(content).width;
	}

	if (style=="left")
	{
		ctx.fillStyle=fill_color;
		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.lineTo(x+width-height/2,y);
		ctx.lineTo(x+width,y+height);
		ctx.lineTo(x,y+height);
		ctx.lineTo(x,y);
		ctx.fill();
		ctx.fillStyle=text_color;
		ctx.fillText(content,x+inner_pedding,y+height/2);
	}

	if (style=="right")
	{
		ctx.fillStyle=fill_color;
		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.lineTo(x-width+height/2,y);
		ctx.lineTo(x-width,y+height);
		ctx.lineTo(x,y+height);
		ctx.lineTo(x,y);
		ctx.fill();
		ctx.fillStyle=text_color;
		ctx.fillText(content,x-inner_pedding,y+height/2);
	}
}

function draw_button_style1(ctx,height,content,font,status,x,y,color_family,highlight)
{
	ctx.font = font;
	ctx.textBaseline = "middle";
	ctx.textAlign="start";
	text=ctx.measureText(content);

	var round_ratio=0.5;

	var pedding=Math.floor(height*0.25);
	var inner_pedding=Math.floor(height*0.1);

	var width=parseInt(text.width)+pedding*2+inner_pedding*2;

	if(status>0 && status<=3)
	{
		var border_color="#FFFFFF";
		var fill_color="#FFFFFF";
		var text_color="#FFFFFF";

		if(status==1)
		{
			border_color=color_family.front;
			fill_color=color_family.front;
			text_color=color_family.background;
		}

		if(status==2)
		{
			border_color=color_family.front;
			fill_color=color_family.background;
			text_color=color_family.front;
		}

		if(status==3)
		{
			border_color=color_family.highlight;
			fill_color=color_family.highlight;
			text_color=color_family.background;
		}

		if(highlight==true)
		{
			ctx.beginPath();
			rounded_rect_path(
				ctx,round_ratio,
				x+pedding/2,y+pedding/2,
				width-pedding/1,height-pedding/1
				);

			ctx.strokeStyle=border_color;
			ctx.lineWidth=pedding/8;
			ctx.stroke();
		}

		ctx.beginPath();
		rounded_rect_path(ctx,round_ratio,x+pedding,y+pedding,width-pedding*2,height-pedding*2);

		ctx.strokeStyle=border_color;
		ctx.lineWidth=pedding/4;
		ctx.stroke();
		ctx.fillStyle=fill_color;
		ctx.fill();
		ctx.fillStyle=text_color;
		ctx.fillText(content,x+pedding+inner_pedding,y+height/2);
	}

	return width-pedding;
}


function rounded_rect_path(context,percentage,x,y,width,height)
{
	var short_edge=width>height?height:width;
	var radious=short_edge*(percentage>1?1:percentage)/2;
	var one_degree=Math.PI/2;
	context.moveTo(x,y+radious);
	context.arc(x+radious,y+radious,radious,one_degree*2,one_degree*3);
	context.lineTo(x+width-radious,y);
	context.arc(x+width-radious,y+radious,radious,one_degree*3,one_degree*0);
	context.lineTo(x+width,y+height-radious);
	context.arc(x+width-radious,y+height-radious,radious,one_degree*0,one_degree*1);
	context.lineTo(x+radious,y+height);
	context.arc(x+radious,y+height-radious,radious,one_degree*1,one_degree*2);
	context.lineTo(x,y+radious);
}