//Code by Yuxuan Zhang
//All Rights Reserved
//Non-profit use are approved
var Debug=false;
var AllowCache=false;
var Auto_upd= undefined;//replace it with milliseconds will make the data update automatically
var ChartList= [];

window.onresize= RESET_ALL_CHART ;

function CacheStr()
{
	if(AllowCache==false)
	{
		var str = Math.random().toString(36).substr(2);
		return '?'+str
	}
	else return ''
}

function RESET_ALL_CHART()
{
	for (i=0;i<ChartList.length;i++)
	{
		//alert(ChartList.length);
		ChartList[i].RESET();
	}
}

if (navigator.userAgent.indexOf("iPhone")>0)
{
	try
	{
		window.addEventListener("orientationchange", RESET_ALL_CHART , false)
	}
	catch(err)
	{
		;
	}
}

function refresh_ALL()
{
	for (i=0;i<ChartList.length;i++)
	{
		//alert(ChartList.length);
		ChartList[i].refresh();
	}
}

var ChartDataPKG =
{
	Left_Axis_Color			:"#FF6600",
	Left_Axis_BKG_Color		:"#FFDDAA",
	Left_Axis_OnGrag_Color	:"#FFBB66",

	Right_Axis_Color		:"#00AAFF",
	Right_Axis_BKG_Color	:"#DDEEFF",
	Right_Axis_OnGrag_Color	:"#BBDDFF",

	Left_Axis_Name			:"Unknown",
	Right_Axis_Name			:"Unknown",

	upd_timestamp			:undefined, //This value will be taken as 'NOW'

	Data_L_Name				:undefined,
	Data_R_Name				:undefined,

	Data_L					:undefined,
	Data_R					:undefined,

	HighLight 				:{L:[],R:[]},
}

var ChartStyle =
{
	//----------------------[0]Desktop Device; [1]Mobile Vertical; [2]Mobile Horizational; [3]iPad;
	Default_Mark_line_len:	[5    ,5    ,5    ,5    ],
	Default_Mark_line_wid:	[2    ,2    ,2    ,2    ],
	Default_side_spacing:	[5    ,5    ,5    ,5    ],
	Default_line_width: 	[0.8  ,0.8  ,0.8  ,0.5  ],
	Default_DBG_lineHeight:	[18   ,14   ,14   ,14   ],
	Default_marker_WIDTH:	[45   ,45   ,45   ,45   ],	
	Default_Scale_Index:	[1    ,2    ,1.5  ,1    ],  //Define the Scale Index of fonts
	Default_L_limit:		[240  ,120  ,240  ,120  ],	//Bottom Horizational Axis default display Range
	Default_R_limit:		[0    ,0    ,0    ,0    ],	//Bottom Horizational Axis default display Range
	Default_L_limit_max:	[26279,26279,26279,26279],	//Bottom Horizational Axis default Scale limit (Will Be ReCaculated Later)
	Default_R_limit_min:	[0    ,0    ,0    ,0    ],	//Bottom Horizational Axis default Scale limit (Will Be ReCaculated Later)
	Default_L_max:			[28   ,28   ,28   ,28   ],	//Left Vertical Axis default display Range **IMPORTANT**
	Default_L_min:			[18   ,18   ,18   ,18   ],	//Left Vertical Axis default display Range **IMPORTANT**
	Default_R_max:			[65   ,65   ,65   ,65   ],	//Right Vertical Axis default display Range **IMPORTANT**
	Default_R_min:			[35   ,30   ,30   ,35   ],	//Right Vertical Axis default display Range **IMPORTANT**
	Default_H_Lines:		[5    ,4    ,4    ,5    ],	//Number of horizational Grids **IMPORTANT**
	Default_V_Lines:		[20   ,10   ,15   ,20   ],	//Number of vertical Grids **IMPORTANT**
														//Will Decide the chart ratio if HightOverRide=undefined
	HEIGHT_Banner:			[40   ,40   ,40   ,40   ],	//Top Banner Hight (Not Available Yet)

	On_Scale_Drag_Color:	"#CCCCCC",
	Assist_Line_Color:		"#00CACA",
	Assist_Line_Drag_Color:	"#00CACA",
	Assist_Font_Color:		"#999999",
	Axis_Font_Color:		"#666666",
	Grid_Color:				"#666666",
	Banner_Color: 			"#DDDDDD",//"#00AA88",
	Alert_Color: 			"#FF0000",

	bottom_axis_ratio: 		3600000,// 1 hour = 3600000 milliseconds
	bottom_axis_unit: 		"Hours Ago",

	Display_Banner: 		true, 		//Display Banner
	Move_right_on_refresh:  false,		//the graph will automatically move to "now" on refresh if true
	HightOverRide: 			undefined,	//specify a ratio (Float) If you want to override default ratios
	reverse_bottom_axis: 	false,		//(Not Available For Adujstment Yet)
	reverse_L_axis: 		false,		//(Not Available For Adujstment Yet)
	reverse_R_axis: 		false,		//(Not Available For Adujstment Yet)
	dragg_able: 			true,		//(Not Available For Adujstment Yet)
	left_axis_scale: 		true,		//(Not Available For Adujstment Yet)
	right_axis_scale: 		true,		//(Not Available For Adujstment Yet)
	bottom_axis_scale: 		true,		//(Not Available For Adujstment Yet)
	left_data_assist_line:	true,		//(Not Available For Adujstment Yet)
	right_data_assist_line:	true,		//(Not Available For Adujstment Yet)
}

var ZChart =
{
	create: function(chart_ID,ChartStyle)
	{
		//------------------------------------------------------------
		//Values
			var object={};//FATAL:DO NOT REMOVE
			var display=true;
			//DATA
			var ChartDataPKG;
			var ChartStyle;
			var ZChart_Button_list={};
			ZChart_Button_list.Banner=undefined;
			ZChart_Button_list.L=[];
			ZChart_Button_list.R=[];
			//var timer = setInterval(refresh(evt),100);
			//ARROWS ▶ ◀ ▲ ▼
			//Preset
			var Device=0;//0: Desktop; 1:Mobile; 2:Mobile_Horizational_Orentation 3:Tablet

			//PRE_DEFINED VALUES
				var chart=document.getElementById(chart_ID);
				var ctx=chart.getContext("2d");
					ctx.save();
				var devicePixelRatio = window.devicePixelRatio || 1;
				var backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
									ctx.mozBackingStorePixelRatio ||
									ctx.msBackingStorePixelRatio ||
									ctx.oBackingStorePixelRatio ||
									ctx.backingStorePixelRatio || 1;
				var ratio = devicePixelRatio / backingStoreRatio;

			//Args Adjustments

			//Global Settings
				var Default_Mark_line_len=	ChartStyle.Default_Mark_line_len;
				var Default_Mark_line_wid=	ChartStyle.Default_Mark_line_wid;
				var Default_side_spacing =	ChartStyle.Default_side_spacing;
				var Default_line_width=		ChartStyle.Default_line_width;
				var Default_L_limit_max=	ChartStyle.Default_L_limit_max;
				var Default_R_limit_min=	ChartStyle.Default_R_limit_min;
				var Default_DBG_lineHeight=	ChartStyle.Default_DBG_lineHeight;
				var Default_marker_WIDTH=	ChartStyle.Default_marker_WIDTH;
				var Default_Scale_Index=	ChartStyle.Default_Scale_Index;
				var Default_L_max=			ChartStyle.Default_L_max;
				var Default_L_min=			ChartStyle.Default_L_min;
				var Default_R_max=			ChartStyle.Default_R_max;
				var Default_R_min=			ChartStyle.Default_R_min;
				var Default_L_limit=		ChartStyle.Default_L_limit;
				var Default_R_limit=		ChartStyle.Default_R_limit;
				var Default_H_Lines=		ChartStyle.Default_H_Lines;
				var Default_V_Lines=		ChartStyle.Default_V_Lines;
				var Default_HEIGHT_Banner=	ChartStyle.HEIGHT_Banner;

			//Style Preset
				var On_Scale_Drag_Color=	ChartStyle.On_Scale_Drag_Color;
				var Assist_Line_Color=		ChartStyle.Assist_Line_Color;
				var Assist_Line_Drag_Color=	ChartStyle.Assist_Line_Drag_Color;
				var Assist_Font_Color=		ChartStyle.Assist_Font_Color;
				var Axis_Font_Color=		ChartStyle.Axis_Font_Color;
				var Grid_Color=				ChartStyle.Grid_Color;
				var Banner_Color=			ChartStyle.Banner_Color;
				var Alert_Color=			ChartStyle.Alert_Color;

			//Scale Preset
				var bottom_axis_ratio= 		ChartStyle.bottom_axis_ratio;
				var bottom_axis_unit= 		ChartStyle.bottom_axis_unit;

			//Will Be changed later:
				var L_limit_max=5;
				var R_limit_min=0;
				var DBG_lineHeight=0;
				var marker_WIDTH=0;
				var Scale_Index=0;
				var max_L=0;
				var min_L=0;
				var max_R=0;
				var min_R=0;
				var L_limit=0;
				var R_limit=0;
				var H_Lines=0;
				var V_Lines=0;
				var Mark_line_len=0;
				var Mark_line_wid=0;
				var side_spacing =0;
				var golbal_line_width=0;
				var Banner_line_height=0;

				var chart_ratio=0;
				var Grid_length=0;
				var Mouse_Position_Flag=0;
				var Mouse_Down_Flag=0; //0:None 1:Center_Area 2:Left_Marker 3:Rlght_Marker 4:Bottom_Marker 5:Bottom Axis Line
				var HEIGHT=0
				var HEIGHT_Banner=0;
				var HEIGHT_Chart=0;
				var HEIGHT_Container=0;
				var WIDTH=0;

				var banner_button_status=0;

				var upd_timestamp=0;

			//VARIABLES
				var x=0;
				var y=0;
				var org_x=0;
				var org_y=0;
				var org_L=0;
				var org_R=0;
				var org_max_L=0;
				var org_min_L=0;
				var org_max_R=0;
				var org_min_R=0;

			// Colors Will Be Modified Later
				var Left_Axis_Color=			"#888888";
				var Left_Axis_BKG_Color=		"#AAAAAA";
				var Left_Axis_OnGrag_Color=		"#BBBBBB";
				var Right_Axis_Color=			"#888888";
				var Right_Axis_BKG_Color=		"#AAAAAA";
				var Right_Axis_OnGrag_Color=	"#BBBBBB";
		//------------------------------------------------------------
		//Interaction presets

			object.onfocus= function (ts,object){;} //API

			document.oncontextmenu=function (){return false;}

			chart.onmousedown = function (evt) 
			{
				x = (evt.pageX-chart.offsetLeft)*ratio;
				y = (evt.pageY-chart.offsetTop)*ratio;
				org_x = x;
				org_y = y;
				org_L = L_limit;
				org_R = R_limit;
				org_max_L = max_L;
				org_min_L = min_L;
				org_max_R = max_R;
				org_min_R = min_R;

				Mouse_Down_Flag=object.get_area_id(org_x,org_y);		

				object.refresh();
			}

			chart.onmouseup = function (evt) 
			{
				x = (evt.pageX-chart.offsetLeft)*ratio;
				y = (evt.pageY-chart.offsetTop)*ratio;
				Mouse_Down_Flag=0;
				object.refresh();
			}
			
			chart.onmousemove = function (evt)
			{
				if(evt.which==0)
				{
					Mouse_Down_Flag=0;
				}
				object.refresh_evt(evt);
			}

			chart.ontouchstart = function (evt) 
			{
				x = (evt.pageX-chart.offsetLeft)*ratio;
				y = (evt.pageY-chart.offsetTop)*ratio;
				org_x = x;
				org_y = y;
				org_L = L_limit;
				org_R = R_limit;
				org_max_L = max_L;
				org_min_L = min_L;
				org_max_R = max_R;
				org_min_R = min_R;

				Mouse_Down_Flag=object.get_area_id(org_x,org_y);

				evt.preventDefault();
				if(	false
					|| Mouse_Down_Flag==1
					|| Mouse_Down_Flag==2
					|| Mouse_Down_Flag==3
					|| Mouse_Down_Flag==4
					|| Mouse_Down_Flag==5
					) 
				{
					window.event.returnValue = false;
				}
				else
				{
					window.event.returnValue = true;
				}

				object.refresh();
			}

			chart.ontouchend = function (evt)
			{
				x = (evt.pageX-chart.offsetLeft)*ratio;
				y = (evt.pageY-chart.offsetTop)*ratio;
				Mouse_Down_Flag=0;
				object.refresh();
			}

			chart.ontouchmove= function (evt)
			{
				x = (evt.pageX-chart.offsetLeft)*ratio;
				y = (evt.pageY-chart.offsetTop)*ratio;
				object.refresh (evt);
			}

			object.refresh_evt = function (evt)
			{
				x = (evt.pageX-chart.offsetLeft)*ratio;
				y = (evt.pageY-chart.offsetTop)*ratio;
				object.refresh();
			}
		//------------------------------------------------------------
		//Data PKG
			object.hide = function()
			{
				display=false;
				object.refresh();
			}
			object.display = function()
			{
				display=true;
				object.refresh();
			}


			object.update_data = function (PKG)
			{
				ChartDataPKG=PKG;

				ZChart_Button_list.Banner=undefined;
				ZChart_Button_list.L=[];
				ZChart_Button_list.R=[];

				if(ChartDataPKG!=undefined)
				{
					if(ChartStyle.Display_Banner)
					{
						ZChart_Button_list.Banner=[];

						var banner_button_L=ZButton.create(chart,ChartDataPKG.Left_Axis_Name,Banner_line_height,object.font_size_uni_str(18)+" ZFont-regular Heavy",1);
						banner_button_L.display();
						banner_button_L.status_count=2;
						banner_button_L.onfocus=function(){object.refresh();};
						banner_button_L.onclick=function(status)
						{

							for(var buttons=0;buttons<ZChart_Button_list.L.length;buttons++)
							{
								if(status==2) ZChart_Button_list.L[buttons].display();
								else ZChart_Button_list.L[buttons].hide();
							}
							for(var buttons=0;buttons<ZChart_Button_list.R.length;buttons++)
							{
								ZChart_Button_list.R[buttons].hide();
							}
							ZChart_Button_list.Banner[1].status=1;
							object.refresh();
						};
						ZChart_Button_list.Banner.push(banner_button_L);

						var banner_button_R=ZButton.create(chart,ChartDataPKG.Right_Axis_Name,Banner_line_height,object.font_size_uni_str(18)+" ZFont-regular Heavy",1);
						banner_button_R.display();
						banner_button_R.status_count=2;
						banner_button_R.onfocus=function(){object.refresh()};
						banner_button_R.onclick=function(status)
						{
							for(var buttons=0;buttons<ZChart_Button_list.L.length;buttons++)
							{
								ZChart_Button_list.L[buttons].hide();
							}
							for(var buttons=0;buttons<ZChart_Button_list.R.length;buttons++)
							{
								if(status==2) ZChart_Button_list.R[buttons].display();
								else ZChart_Button_list.R[buttons].hide();
							}
							ZChart_Button_list.Banner[0].status=1;
							object.refresh()
						};
						ZChart_Button_list.Banner.push(banner_button_R);

						var name_pointer=0;

						for(var i=0;i<ChartDataPKG.Data_L.length;i++)
						{
							var HIGHLIGHT=[0];
							for(var j=1;j<ChartDataPKG.Data_L[i].length;j++)
							{
								var data_name="DATA-"+(name_pointer+1).toString();
								if(ChartDataPKG.Data_L_Name[name_pointer]!=undefined)
								{
									data_name=ChartDataPKG.Data_L_Name[name_pointer];
									var data_button=ZButton.create(chart,data_name,Banner_line_height,object.font_size_uni_str(15)+" ZFont-regular",3-ChartDataPKG.Data_L[i][j][0]);
									data_button.hide();
									data_button.tinydataPKG={cur_i:i,cur_j:j};
									data_button.onclick=function(status,this_object)
									{
										//alert(this_object.tinydataPKG.cur_i+" "+this_object.tinydataPKG.cur_j+" "+(3-status));
										ChartDataPKG.HighLight.L[this_object.tinydataPKG.cur_i][this_object.tinydataPKG.cur_j]=1;
										ChartDataPKG.Data_L[this_object.tinydataPKG.cur_i][this_object.tinydataPKG.cur_j][0]=3-status;
										object.refresh();
									}
									data_button.onfocus=function(status,this_object)
									{
										//alert(this_object.tinydataPKG.cur_i+" "+this_object.tinydataPKG.cur_j+" "+(3-status));
										ChartDataPKG.HighLight.L[this_object.tinydataPKG.cur_i][this_object.tinydataPKG.cur_j]=1;
										object.refresh();
									}
									ZChart_Button_list.L.push(data_button);
									name_pointer++;
								}
								HIGHLIGHT.push(0);
							}
							ChartDataPKG.HighLight.L.push(HIGHLIGHT);
						}

						name_pointer=0;

						for(var i=0;i<ChartDataPKG.Data_R.length;i++)
						{
							var HIGHLIGHT=[0];
							for(var j=1;j<ChartDataPKG.Data_R[i].length;j++)
							{
								var data_name="DATA-"+(name_pointer+1).toString();
								if(ChartDataPKG.Data_R_Name[name_pointer]!=undefined)
								{
									data_name=ChartDataPKG.Data_R_Name[name_pointer];
									var data_button=ZButton.create(chart,data_name,Banner_line_height,object.font_size_uni_str(15)+" ZFont-regular",3-ChartDataPKG.Data_R[i][j][0]);
									data_button.hide();
									data_button.tinydataPKG={cur_i:i,cur_j:j};
									data_button.onclick=function(status,this_object)
									{
										//alert(this_object.tinydataPKG.cur_i+" "+this_object.tinydataPKG.cur_j+" "+(3-status));
										ChartDataPKG.HighLight.R[this_object.tinydataPKG.cur_i][this_object.tinydataPKG.cur_j]=1;
										ChartDataPKG.Data_R[this_object.tinydataPKG.cur_i][this_object.tinydataPKG.cur_j][0]=3-status;
										object.refresh();
									}
									data_button.onfocus=function(status,this_object)
									{
										//alert(this_object.tinydataPKG.cur_i+" "+this_object.tinydataPKG.cur_j+" "+(3-status));
										ChartDataPKG.HighLight.R[this_object.tinydataPKG.cur_i][this_object.tinydataPKG.cur_j]=1;
										object.refresh();
									}
									ZChart_Button_list.R.push(data_button);
									name_pointer++;
								}
								HIGHLIGHT.push(0);
							}
							ChartDataPKG.HighLight.R.push(HIGHLIGHT);
						}

					}

					if (ChartDataPKG.upd_timestamp!=undefined)
					{
						upd_timestamp=ChartDataPKG.upd_timestamp;
					}
					else
					{
						upd_timestamp=Date.now();
						//alert(Date.now())
					}

					Left_Axis_Color=		ChartDataPKG.Left_Axis_Color;
					Left_Axis_BKG_Color=	ChartDataPKG.Left_Axis_BKG_Color;
					Left_Axis_OnGrag_Color=	ChartDataPKG.Left_Axis_OnGrag_Color;
					Right_Axis_Color=		ChartDataPKG.Right_Axis_Color;
					Right_Axis_BKG_Color=	ChartDataPKG.Right_Axis_BKG_Color;
					Right_Axis_OnGrag_Color=ChartDataPKG.Right_Axis_OnGrag_Color;

					object.RESET();

					if(ChartDataPKG.Move_right_on_refresh==true)
					{
						var mov_len=R_limit-R_limit_min;
						L_limit-=mov_len;
						R_limit=R_limit_min;
					}
				}
				else//if PKG==Undefined
				{
					Left_Axis_Color=			"#888888";
					Left_Axis_BKG_Color=		"#AAAAAA";
					Left_Axis_OnGrag_Color=		"#BBBBBB";
					Right_Axis_Color=			"#888888";
					Right_Axis_BKG_Color=		"#AAAAAA";
					Right_Axis_OnGrag_Color=	"#BBBBBB";
				}

				object.refresh();
			}
		//------------------------------------------------------------
		//Core Draphic
			object.graph_banner = function(ctx)
			{
				var previous_HEIGHT_Banner=HEIGHT_Banner;
				if(ChartStyle.Display_Banner && ZChart_Button_list.Banner!=undefined)
				{
					ctx.fillStyle=Banner_Color;
					ctx.fillRect(
						0,0,
						WIDTH,Banner_line_height
						);
					ctx.fillStyle="#000000";
					ctx.font =object.font_size_uni_str(18)+" ZFont-regular";
					ctx.textBaseline = "middle";
					ctx.textAlign="center";
					ctx.fillText(chart_ID,WIDTH/2,Banner_line_height/2);
					text_len=ctx.measureText(chart_ID).width*1.3;
					text_len=text_len>WIDTH/3?text_len:WIDTH/3;
					ZChart_Button_list.Banner[0].height=Banner_line_height;
					ZChart_Button_list.Banner[0].resetFont(object.font_size_uni_str(18)+" ZFont-bold");
					ZChart_Button_list.Banner[0].draw(
						0,
						0,
						Left_Axis_Color,
						"left",
						(WIDTH-text_len)/2);
					ZChart_Button_list.Banner[1].height=Banner_line_height;
					ZChart_Button_list.Banner[1].resetFont(object.font_size_uni_str(18)+" ZFont-bold");
					ZChart_Button_list.Banner[1].draw(
						WIDTH,
						0,
						Right_Axis_Color,
						"right",
						(WIDTH-text_len)/2);

					HEIGHT_Banner=Banner_line_height;

					if(ZChart_Button_list.Banner[0].status==2 || ZChart_Button_list.Banner[1].status==2)
					{
						if(ZChart_Button_list.Banner[0].status==2)
						{
							ctx.fillStyle=Left_Axis_Color;
							ctx.fillRect(0,HEIGHT_Banner,WIDTH,HEIGHT_Banner);
							var n=0;
							var x_handle=0;
							for(var i=0;i<ZChart_Button_list.L.length;i++)
							{
								if(ZChart_Button_list.L[i].width+x_handle>WIDTH && ZChart_Button_list.L[i].width<WIDTH)
								{
									HEIGHT_Banner+=Banner_line_height;
									x_handle=0;
									ctx.fillStyle=Left_Axis_Color;
									ctx.fillRect(0,HEIGHT_Banner,WIDTH,Banner_line_height);
								}
								ZChart_Button_list.L[i].height=Banner_line_height;
								ZChart_Button_list.L[i].resetFont(object.font_size_uni_str(15)+" ZFont-regular");
								ZChart_Button_list.L[i].draw(x_handle,HEIGHT_Banner,Left_Axis_Color);
								x_handle+=ZChart_Button_list.L[i].width;
							}
							HEIGHT_Banner+=Banner_line_height;
						}
						else if(ZChart_Button_list.Banner[1].status==2)
						{
							ctx.fillStyle=Right_Axis_Color;
							ctx.fillRect(0,HEIGHT_Banner,WIDTH,HEIGHT_Banner);
							var n=0;
							var x_handle=0;
							for(var i=0;i<ZChart_Button_list.R.length;i++)
							{
								if(ZChart_Button_list.R[i].width+x_handle>WIDTH && ZChart_Button_list.R[i].width<WIDTH)
								{
									HEIGHT_Banner+=Banner_line_height;
									x_handle=0;
									ctx.fillStyle=Right_Axis_Color;
									ctx.fillRect(0,HEIGHT_Banner,WIDTH,Banner_line_height);
								}
								ZChart_Button_list.R[i].height=Banner_line_height;
								ZChart_Button_list.R[i].resetFont(object.font_size_uni_str(15)+" ZFont-regular");
								ZChart_Button_list.R[i].draw(x_handle,HEIGHT_Banner,Right_Axis_Color);
								x_handle+=ZChart_Button_list.R[i].width;
							}
							HEIGHT_Banner+=Banner_line_height;
						}
					}
				}
				else if(ChartStyle.Display_Banner)
				{
					HEIGHT_Banner=Banner_line_height;

					ctx.fillStyle=Banner_Color;
					ctx.fillRect(
						0,0,
						WIDTH,Banner_line_height
						);

					ctx.font=object.font_size_uni_str(18)+" ZFont-regular";
					ctx.fillStyle="#666666";
					ctx.textBaseline="middle";
					ctx.textAlign="center";
					ctx.fillText("Loading...",WIDTH/2,Banner_line_height/2);
				}
				else
				{
					HEIGHT_Banner=0;
				}
				if(previous_HEIGHT_Banner!=HEIGHT_Banner)
				{
					object.refresh();
				}
			}

			object.graph_grid_gen = function (ctx)
			{
				//Chart Grid Drawing
				//------------------------
				ctx.strokeStyle=Grid_Color;
				ctx.lineWidth = golbal_line_width/2;
				ctx.beginPath();

				//Horizontal Grid
				for (var i=0; i<=H_Lines; i++)
				{ 
					ctx.moveTo(0,HEIGHT_Banner+i*Grid_length);
					ctx.lineTo(WIDTH,HEIGHT_Banner+i*Grid_length);
				}

				//Vertial Grid
				for (var i=0; i<=V_Lines; i++)
				{ 
					ctx.moveTo(i*Grid_length,HEIGHT_Banner+0);
					ctx.lineTo(i*Grid_length,HEIGHT_Banner+HEIGHT_Chart);
				}

				ctx.stroke();
			}
			
			object.draw_data = function (line_color,ts_table,value_table,scale_ceil,scale_floor,highlight)
			{
				ctx.strokeStyle=line_color;
				ctx.lineWidth = golbal_line_width;
				if(highlight==1)
				{
					ctx.lineWidth = golbal_line_width*2;
				}
				if(highlight==-1)
				{
					ctx.globalAlpha=0.3;
					ctx.lineWidth = golbal_line_width/2;
				}
				if(highlight==-2)
				{
					ctx.lineWidth = golbal_line_width/3;
				}
				//some code here
				var L_limit_TS=upd_timestamp-L_limit*bottom_axis_ratio;
				var R_limit_TS=upd_timestamp-R_limit*bottom_axis_ratio;

				//alert("L/R Limit "+L_limit_TS+" "+R_limit_TS);
				
				var absX=0;
				var absY=0;
				var val=0;
				var pointer=1;

				while (ts_table[pointer]>R_limit_TS && pointer<ts_table.length) pointer+=1;
				if(pointer>1)pointer-=1;

				if(pointer<ts_table.length)
				{
					//alert("In Circ");
					ctx.beginPath();

					val=value_table[pointer];
					if (val>scale_ceil) val=scale_ceil;
					if (val<scale_floor) val=scale_floor;
					absX=WIDTH*(position_ratio(L_limit_TS,R_limit_TS,ts_table[pointer]));
					absY=HEIGHT_Banner+HEIGHT_Chart*(1-(val-scale_floor)/(scale_ceil-scale_floor));
					ctx.moveTo(absX,absY);
					pointer+=1;

					//alert("Move To "+absX+" "+absY)
					while (true)
					{
						val=value_table[pointer];
						if (val>scale_ceil) val=scale_ceil;
						if (val<scale_floor) val=scale_floor;

						absX=WIDTH*(position_ratio(L_limit_TS,R_limit_TS,ts_table[pointer]));
						absY=HEIGHT_Banner+HEIGHT_Chart*(1-(val-scale_floor)/(scale_ceil-scale_floor));

						ctx.lineTo(absX,absY);

						//alert("Line To "+absX+" "+absY)
						pointer+=1;

						if(absX<0 || absX>WIDTH || pointer>ts_table.length) break;
					}
					ctx.stroke();
				}
				ctx.globalAlpha=1;
			}

			object.graph_content_gen = function (ctx)
			{
				//Chart Content Drawing
				if (ChartDataPKG!=undefined)
				{
					//LEFT AXIS
					if (ChartDataPKG.Data_L!=undefined)
					{
						for(var i=0;i<ChartDataPKG.Data_L.length;i+=1)
						{
							if(ChartDataPKG.Data_L[i].length>=2)
							{
								for(var j=1;j<ChartDataPKG.Data_L[i].length;j+=1)
								{
									if(ChartDataPKG.Data_L[i][j].length>2 && (ChartDataPKG.Data_L[i][j][0]!=0 || ChartDataPKG.HighLight.L[i][j]!=0))
									{
										if(ChartDataPKG.Data_L[i][j][0]==1 && ChartDataPKG.HighLight.L[i][j]==0)ChartDataPKG.HighLight.L[i][j]=-1;
										if(ChartDataPKG.Data_L[i][j][0]==1 && ChartDataPKG.HighLight.L[i][j]==1)ChartDataPKG.HighLight.L[i][j]=0;
										if(ChartDataPKG.Data_L[i][j][0]==0 && ChartDataPKG.HighLight.L[i][j]==1)ChartDataPKG.HighLight.L[i][j]=-2;
										//alert("Chart Table L "+i+" "+j);
										object.draw_data(
											ChartDataPKG.Left_Axis_Color,
											ChartDataPKG.Data_L[i][0],
											ChartDataPKG.Data_L[i][j],
											max_L,min_L,
											ChartDataPKG.HighLight.L[i][j]);
										ChartDataPKG.HighLight.L[i][j]=0;
									}
								}
							}
						}
					}
					//RIGHT AXIS
					if (ChartDataPKG.Data_R!=undefined)
					{
						for(var i=0;i<ChartDataPKG.Data_R.length;i++)
						{
							if(ChartDataPKG.Data_R[i].length>=2)
							{
								for(var j=1;j<ChartDataPKG.Data_R[i].length;j++)
								{
									if(ChartDataPKG.Data_R[i][j].length>2 && (ChartDataPKG.Data_R[i][j][0]!=0 || ChartDataPKG.HighLight.R[i][j]!=0))
									{
										if(ChartDataPKG.Data_R[i][j][0]==1 && ChartDataPKG.HighLight.R[i][j]==0)ChartDataPKG.HighLight.R[i][j]=-1;
										if(ChartDataPKG.Data_R[i][j][0]==1 && ChartDataPKG.HighLight.R[i][j]==1)ChartDataPKG.HighLight.R[i][j]=0;
										if(ChartDataPKG.Data_R[i][j][0]==0 && ChartDataPKG.HighLight.R[i][j]==1)ChartDataPKG.HighLight.R[i][j]=-2;
										//alert("Chart Table R "+i+" "+j);
										object.draw_data(
											ChartDataPKG.Right_Axis_Color,
											ChartDataPKG.Data_R[i][0],
											ChartDataPKG.Data_R[i][j],
											max_R,min_R,
											ChartDataPKG.HighLight.R[i][j]);
										ChartDataPKG.HighLight.R[i][j]=0;
									}
								}
							}
						}
					}
				//alert("exit");
				}
			}

			object.graph_assistline = function (position_x)
			{
				ctx.save();
				var data_tag=Math.floor(L_limit+(R_limit-L_limit)*x/WIDTH)

				//Vertical assistline
				if(Mouse_Down_Flag==1)
				{
					ctx.strokeStyle=Assist_Line_Drag_Color;

					if (Mouse_Down_Flag==1)
					{
						if(L_limit==L_limit_max || R_limit==R_limit_min)
						{
							ctx.strokeStyle=Alert_Color;
						}
					}

					ctx.lineWidth = 1.5;
					if(ratio==2) ctx.lineWidth = 3;
				}
				else if(Mouse_Down_Flag==0)
				{
					ctx.strokeStyle=Assist_Line_Color;
					ctx.setLineDash([10,8]);
					ctx.lineWidth = 1;
					if(ratio==2) ctx.lineWidth = 2;
				}
				ctx.beginPath();
				ctx.moveTo(position_x,HEIGHT_Banner+0);
				ctx.lineTo(position_x,HEIGHT_Banner+HEIGHT_Chart);
				ctx.stroke();
				ctx.restore();

				if (ChartDataPKG!=undefined)
				{
					/*
					ctx.textAlign="center";
					ctx.textBaseline="top";
					ctx.fillStyle="#000000";
					ctx.font="bold italic "+object.font_size_uni_str(12)+" ZFont-regular";

					ctx.fillText("ORG"+data_tag.toString(),WIDTH/2,5)
					ctx.fillText("STP"+(upd_timestamp-data_tag*bottom_axis_ratio).toString(),WIDTH/2,25)
					ctx.fillText("CVT"+data_ts_tag.toString(),WIDTH/2,45)
					*/

					for (var i=0;i<ChartDataPKG.Data_L.length;i++)
					{
						data_ts_tag=find_value(ChartDataPKG.Data_L[i][0],upd_timestamp-data_tag*bottom_axis_ratio);

						for (var j=1;j<ChartDataPKG.Data_L[i].length;j++)
						{
							var Left_Axis_Buf=ChartDataPKG.Data_L[i][j][data_ts_tag];
							//Left Axis assistline
							if(Left_Axis_Buf>min_L && Left_Axis_Buf<max_L && ChartDataPKG.Data_L[i][j][0]>1)
							{
								ctx.strokeStyle=Left_Axis_Color;
								ctx.setLineDash([5,5]);
								ctx.lineWidth = 0.5;
								if(ratio==2) ctx.lineWidth = 1;
								var Left_Axis_Data_axis_Y=HEIGHT_Chart*(1-(Left_Axis_Buf-min_L)/(max_L-min_L));

								ctx.beginPath();
								ctx.moveTo(0,HEIGHT_Banner+Left_Axis_Data_axis_Y);
								ctx.lineTo(WIDTH,HEIGHT_Banner+Left_Axis_Data_axis_Y);
								ctx.stroke();
								ctx.restore();
								ctx.restore();

								//Left Axis Data Tag
								ctx.textAlign="left";
								ctx.textBaseline="top";
								ctx.fillStyle=Left_Axis_Color;
								ctx.font=object.font_size_uni_str(12)+" ZFont-regular";

								var axis_x=position_x;
									axis_x=(axis_x<marker_WIDTH?marker_WIDTH:axis_x);
									axis_x=axis_x>(WIDTH-marker_WIDTH)?(WIDTH-marker_WIDTH):axis_x;
								var axis_y=Left_Axis_Data_axis_Y;
								var horizational_space=4;
								var vertical_space=4;

								if ((WIDTH-axis_x)<(Grid_length*1.5))
								{
									ctx.textAlign="right";
									horizational_space=-4;
								}

								if ((HEIGHT_Chart-axis_y)<Grid_length)
								{
									ctx.textBaseline="bottom";
									vertical_space=-4;
								}

								ctx.fillText(format_F(Left_Axis_Buf,2),axis_x+horizational_space*ratio,HEIGHT_Banner+axis_y+vertical_space*ratio);
								ctx.restore();
							}
						}			
					}
		
					for (var i=0;i<ChartDataPKG.Data_R.length;i++)
					{
						data_ts_tag=find_value(ChartDataPKG.Data_R[i][0],upd_timestamp-data_tag*bottom_axis_ratio);

						for (var j=1;j<ChartDataPKG.Data_R[i].length;j++)
						{

							var Right_Axis_Buf=ChartDataPKG.Data_R[i][j][data_ts_tag];
							//Right Axis assistline
							if(Right_Axis_Buf>min_R && Right_Axis_Buf<max_R && ChartDataPKG.Data_R[i][j][0]>1)
							{
								ctx.strokeStyle=Right_Axis_Color;
								ctx.setLineDash([5,5]);
								ctx.lineWidth = 0.5;
								if(ratio==2) ctx.lineWidth = 1;
								var Right_Axis_Data_axis_Y=HEIGHT_Chart*(1-(Right_Axis_Buf-min_R)/(max_R-min_R));

								ctx.beginPath();
								ctx.moveTo(0,HEIGHT_Banner+Right_Axis_Data_axis_Y);
								ctx.lineTo(WIDTH,HEIGHT_Banner+Right_Axis_Data_axis_Y);
								ctx.stroke();

								//Right Axis Data Tag
								ctx.textAlign="left";
								ctx.textBaseline="top";
								ctx.fillStyle=Right_Axis_Color;
								ctx.font=object.font_size_uni_str(12)+" ZFont-regular";

								var axis_x=position_x;
									axis_x=(axis_x<marker_WIDTH?marker_WIDTH:axis_x);
									axis_x=axis_x>(WIDTH-marker_WIDTH)?(WIDTH-marker_WIDTH):axis_x;
								var axis_y=Right_Axis_Data_axis_Y;
								var horizational_space=4;
								var vertical_space=4;

								if ((WIDTH-axis_x)<(Grid_length*1.5))
								{
									ctx.textAlign="right";
									horizational_space=-4;
								}

								if ((HEIGHT_Chart-axis_y)<Grid_length)
								{
									ctx.textBaseline="bottom";
									vertical_space=-4;
								}

								ctx.fillText(format_F(Right_Axis_Buf,2),axis_x+horizational_space*ratio, HEIGHT_Banner+axis_y+vertical_space*ratio);
							}
						}
					}
					
					//Time Tag
					ctx.textAlign="left";
					ctx.fillStyle=Assist_Font_Color;
					ctx.font=object.font_size_uni_str(10)+" ZFont-regular";

					var date=new Date(ChartDataPKG.Data_L[0][0][data_ts_tag]);
					Y = date.getFullYear() + '-';
					M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
					D = date.getDate() ;
					h = date.getHours() + ':';
					m = date.getMinutes() + ':';
					s = date.getSeconds(); 
					
					ts_dt=Y+M+D;
					ts_ms=h+m+s;

					var axis_x=position_x;
						axis_x=(axis_x<marker_WIDTH?marker_WIDTH:axis_x);
						axis_x=axis_x>(WIDTH-marker_WIDTH)?(WIDTH-marker_WIDTH):axis_x;
					var axis_y=Math.ceil(HEIGHT_Chart-Grid_length/3);
					var horizational_space=4;
					var vertical_space=4;

					if ((WIDTH-axis_x)<(Grid_length*1.5))
					{
						ctx.textAlign="right";
						horizational_space=-4;
					}

					ctx.textBaseline="bottom";
					ctx.fillText(ts_dt, axis_x+horizational_space*ratio,HEIGHT_Banner+axis_y+vertical_space*ratio);
					ctx.textBaseline="top";
					ctx.fillText(ts_ms, axis_x+horizational_space*ratio,HEIGHT_Banner+axis_y+vertical_space*ratio);

					ctx.fillText(
						ChartDataPKG.Data_L[0][0][data_ts_tag].toString(),
						axis_x+horizational_space*ratio,
						HEIGHT_Banner+vertical_space*ratio)
					ctx.restore();
					ctx.setLineDash([]);

					var L_cur_data=[],R_cur_data=[];

					for (var i=0;i<ChartDataPKG.Data_L.length;i++)
					{
						data_ts_tag=find_value(ChartDataPKG.Data_L[i][0],upd_timestamp-data_tag*bottom_axis_ratio);

						for (var j=1;j<ChartDataPKG.Data_L[i].length;j++)
						{
							L_cur_data.push(ChartDataPKG.Data_L[i][j][data_ts_tag]);
						}
					}

					for (var i=0;i<ChartDataPKG.Data_R.length;i++)
					{
						data_ts_tag=find_value(ChartDataPKG.Data_R[i][0],upd_timestamp-data_tag*bottom_axis_ratio);

						for (var j=1;j<ChartDataPKG.Data_R[i].length;j++)
						{
							R_cur_data.push(ChartDataPKG.Data_R[i][j][data_ts_tag]);
						}
					}


					object.onfocus(ChartDataPKG.Data_L[0][0][data_ts_tag].toString(),L_cur_data,R_cur_data);//API Call
				}
			}

			object.graph_highlight = function (ctx)
			{
				if(Mouse_Down_Flag==0)
				{
					if(Mouse_Position_Flag==2)
					{
						ctx.fillStyle=Left_Axis_BKG_Color;
						ctx.fillRect(
							0,HEIGHT_Banner+0,
							marker_WIDTH,HEIGHT_Chart
							);
					}
					}
					if(Mouse_Position_Flag==3)
					{
						ctx.fillStyle=Right_Axis_BKG_Color;
						ctx.fillRect(
							WIDTH-marker_WIDTH,HEIGHT_Banner+0,
							marker_WIDTH,HEIGHT_Chart
							);
				}
				if(Mouse_Down_Flag==2)
				{
					if(Mouse_Position_Flag==2)
					{
						ctx.fillStyle=Left_Axis_OnGrag_Color;
						ctx.fillRect(
							0,HEIGHT_Banner+0,
							marker_WIDTH,HEIGHT_Chart
							);
					}
					if(Mouse_Position_Flag==1)
					{
						ctx.fillStyle=On_Scale_Drag_Color;
						ctx.fillRect(
							0,HEIGHT_Banner+0,
							marker_WIDTH,HEIGHT_Chart
							);
					}
				}
				if(Mouse_Down_Flag==3)
				{
					if(Mouse_Position_Flag==3)
					{
						ctx.fillStyle=Right_Axis_OnGrag_Color;
						ctx.fillRect(
							WIDTH-marker_WIDTH,HEIGHT_Banner+0,
							marker_WIDTH,HEIGHT_Chart
							);
					}
					if(Mouse_Position_Flag==1)
					{
						ctx.fillStyle=On_Scale_Drag_Color;
						ctx.fillRect(
							WIDTH-marker_WIDTH,HEIGHT_Banner+0,
							marker_WIDTH,HEIGHT_Chart
							);
					}
				}
			}

			object.graph_marker_gen = function (ctx)
			{
				//Changing Variables
				var Padding_space=0;
				//Left Marker
				ctx.textAlign="left";
				ctx.fillStyle=Left_Axis_Color;

				if (Mouse_Down_Flag==1)
				{
					if(L_limit==L_limit_max)
					{
						ctx.fillStyle=Alert_Color;
					}
				}

				ctx.font="Bold "+object.font_size_uni_str(12)+" ZFont-regular";
				var max_Marker=max_L;
				var min_Marker=min_L;
				for (var i=0; i<=H_Lines; i++)
				{
					ctx.textBaseline="middle";
					if(i==0) ctx.textBaseline="top";
					if(i==H_Lines) ctx.textBaseline="bottom";
					var MARK=min_Marker+((H_Lines-i)/(H_Lines))*(max_Marker-min_Marker);
					ctx.fillText(format_F(MARK,1),0+side_spacing*ratio,HEIGHT_Banner+i*Grid_length);
				}

				//Left Mark lines
				ctx.strokeStyle=Left_Axis_Color;

				if (Mouse_Down_Flag==1)
				{
					if(L_limit==L_limit_max)
					{
						ctx.strokeStyle=Alert_Color;
					}
				}

				ctx.beginPath();
				ctx.lineWidth=Mark_line_wid;
				ctx.moveTo(Mark_line_wid/2,HEIGHT_Banner+0);
				ctx.lineTo(Mark_line_wid/2,HEIGHT_Banner+HEIGHT_Chart);
				ctx.stroke();
				for (var i=0; i<=H_Lines; i++)
				{
					ctx.beginPath();
					Padding_space=0;
					if(i==0) Padding_space=Mark_line_wid/2;
					if(i==H_Lines) Padding_space=-Mark_line_wid/2;
					ctx.lineWidth=Mark_line_wid;
					ctx.moveTo(0+Mark_line_wid,HEIGHT_Banner+i*Grid_length+Padding_space);
					ctx.lineTo(Mark_line_len+Mark_line_wid,HEIGHT_Banner+i*Grid_length+Padding_space);
					ctx.stroke();
					if(i<H_Lines)
					{
						for(var j=1;j<5;j++)
						{
							ctx.lineWidth=Math.floor(Mark_line_wid/2);
							ctx.beginPath();
							ctx.moveTo(0+Mark_line_wid,HEIGHT_Banner+i*Grid_length+j*Grid_length/5);
							ctx.lineTo(Mark_line_len/1.5+Mark_line_wid,HEIGHT_Banner+i*Grid_length+j*Grid_length/5);
							ctx.stroke();
						}
					}
				}
				ctx.stroke();

				//Right Marker
				ctx.textAlign="right";
				ctx.fillStyle=Right_Axis_Color;

				if (Mouse_Down_Flag==1)
				{
					if(R_limit==R_limit_min)
					{
						ctx.fillStyle=Alert_Color;
					}
				}

				ctx.font=object.font_size_uni_str(12)+" ZFont-bold";
				var max_Marker=max_R;
				var min_Marker=min_R;
				for (var i=0; i<=H_Lines; i++)
				{
					ctx.textBaseline="middle";
					if(i==0) ctx.textBaseline="top";
					if(i==H_Lines) ctx.textBaseline="bottom";
					var MARK=min_Marker+((H_Lines-i)/(H_Lines))*(max_Marker-min_Marker);
					ctx.fillText(format_F(MARK,1),WIDTH-side_spacing*ratio,HEIGHT_Banner+i*Grid_length);
				}
				//Right Mark lines
				ctx.strokeStyle=Right_Axis_Color;

				if (Mouse_Down_Flag==1)
				{
					if(R_limit==R_limit_min)
					{
						ctx.strokeStyle=Alert_Color;
					}
				}

				ctx.beginPath();
				ctx.lineWidth=Mark_line_wid;
				ctx.moveTo(WIDTH-Mark_line_wid/2,HEIGHT_Banner+0);
				ctx.lineTo(WIDTH-Mark_line_wid/2,HEIGHT_Banner+HEIGHT_Chart);
				ctx.stroke();
				for (var i=0; i<=H_Lines; i++)
				{
					ctx.beginPath();
					Padding_space=0;
					if(i==0) Padding_space=Mark_line_wid/2;
					if(i==H_Lines) Padding_space=-Mark_line_wid/2;
					ctx.lineWidth=Mark_line_wid;
					ctx.moveTo(WIDTH-Mark_line_wid,HEIGHT_Banner+i*Grid_length+Padding_space);
					ctx.lineTo(WIDTH-Mark_line_len-Mark_line_wid,HEIGHT_Banner+i*Grid_length+Padding_space);
					ctx.stroke();
					if(i<H_Lines)
					{
						for(var j=1;j<5;j++)
						{
							ctx.lineWidth=Math.floor(Mark_line_wid/2);
							ctx.beginPath();
							ctx.moveTo(WIDTH-Mark_line_wid,HEIGHT_Banner+i*Grid_length+j*Grid_length/5);
							ctx.lineTo(WIDTH-Mark_line_len/1.5-Mark_line_wid,HEIGHT_Banner+i*Grid_length+j*Grid_length/5);
							ctx.stroke();
						}
					}
				}
				ctx.stroke();

				//Buttom Marker
				ctx.fillStyle=Axis_Font_Color;
				ctx.font=object.font_size_uni_str(12)+" ZFont-regular";
				var max_Marker=L_limit;
				var min_Marker=R_limit;
				var Marker_Count=5;
				var height_axis=0;
				for (var i=0; i<=Marker_Count; i++)
				{
					height_axis=Math.floor(HEIGHT_Chart+HEIGHT_Container/10);
					ctx.textAlign="center";
					if(i==0) ctx.textAlign="left";
					if(i==Marker_Count) ctx.textAlign="right";
					ctx.textBaseline="top";
					var MARK=min_Marker+(1-i/(Marker_Count))*(max_Marker-min_Marker);
					if(Math.floor(MARK)<=0)
					{
						ctx.font=object.font_size_uni_str(12)+" ZFont-bold";
						ctx.fillText("NOW",i*WIDTH/Marker_Count,HEIGHT_Banner+height_axis);
						height_axis+=(HEIGHT_Container/10+object.font_size_uni(12));
						ctx.font=object.font_size_uni_str(8)+" ZFont-bold";
						ctx.fillText("Real Time",i*WIDTH/Marker_Count,HEIGHT_Banner+height_axis);
					}
					else
					{
						ctx.font=object.font_size_uni_str(12)+" ZFont-bold";
						ctx.fillText(Math.ceil(MARK-0.00000001).toString(),i*WIDTH/Marker_Count,HEIGHT_Banner+height_axis);
						height_axis+=(HEIGHT_Container/10+object.font_size_uni(12));
						ctx.font=object.font_size_uni_str(8)+" ZFont-bold";
						ctx.fillText(bottom_axis_unit,i*WIDTH/Marker_Count,HEIGHT_Banner+height_axis);
					}
				}
				ctx.restore();
			}

			object.graph_clear = function ()
			{				
				HEIGHT=HEIGHT_Banner+HEIGHT_Chart+HEIGHT_Container;
				chart.style.height=(Math.floor(HEIGHT/ratio)).toString()+"px";
				chart.width=WIDTH.toString();
				chart.height=HEIGHT.toString();
			}

			object.graph_gen = function ()
			{
				chart=document.getElementById(chart_ID);
				ctx=chart.getContext("2d");
				//ctx.save();

				object.graph_banner(ctx);
				//ctx.restore();

				object.graph_highlight(ctx);
				//ctx.restore();

				object.graph_grid_gen(ctx);
				//ctx.restore();

				object.graph_content_gen(ctx);
				//ctx.restore();

				object.graph_mouse_track(ctx);
				//ctx.restore();

				object.graph_marker_gen(ctx);
				//ctx.restore();

				if(Debug) object.commom_DBG();

				return ctx;
			}
		//------------------------------------------------------------
		//Inside Assistance Functions
			object.graph_mouse_track = function (ctx)
			{
				if(
					(
					( Mouse_Position_Flag==1 || Mouse_Position_Flag==5) 
					&& ( Mouse_Down_Flag==0 || Mouse_Down_Flag==1 || Mouse_Down_Flag==5 )
					|| (Mouse_Down_Flag==0 && (Mouse_Position_Flag==2 || Mouse_Position_Flag==3)))
				   )
				{
					object.graph_assistline(x);
				}
				if (Debug)
				{
					var Pedding=object.commom_DBG();
					var MARK="X"+x.toString()+" Y"+y.toString();
					ctx.fillText(MARK,WIDTH/2,Grid_length+Pedding);
					Pedding+=DBG_lineHeight;
				}
			}

			object.refresh = function ()
			{
				if(display)
				{
					if(Mouse_Position_Flag!=object.get_area_id(x,y))
					{
						org_x = x;
						org_y = y;
						org_L = L_limit;
						org_R = R_limit;
						org_max_L = max_L;
						org_min_L = min_L;
						org_max_R = max_R;
						org_min_R = min_R;
					}
					Mouse_Position_Flag=object.get_area_id(x,y)

					//Main Chart Area Drag (Move,Horizational)
					if(Mouse_Down_Flag==1 && Mouse_Position_Flag==1)
					{
						var distence=(org_x-x)*(org_R-org_L)/WIDTH;
						var New_L=Math.floor(org_L+distence);
						var New_R=Math.floor(org_R+distence);
						if(New_L>L_limit_max)
						{
							New_R-=(New_L-L_limit_max);
							New_L=L_limit_max;
						}
						if(New_R<R_limit_min)
						{
							New_L+=(R_limit_min-New_R);
							New_R=R_limit_min;
						}		
						if(New_L>L_limit_max) New_L=L_limit_max;
						L_limit=New_L;
						R_limit=New_R;
					}

					//Left Marker Area Drag (Move,Vertiacl)
					if(Mouse_Down_Flag==2 && Mouse_Position_Flag==2)
					{
						var distence=((org_max_L-org_min_L)*(y-org_y)/HEIGHT_Chart);
						var New_Max=org_max_L+distence;
						var New_Min=org_min_L+distence;
						max_L=New_Max;
						min_L=New_Min;
					}

					//Left Marker Area Drag (Scale,Vertiacl)
					if(Mouse_Down_Flag==2 && Mouse_Position_Flag==1)
					{
						var distence=((org_max_L-org_min_L)*(y-org_y)/HEIGHT_Chart);
						var New_Max=org_max_L+distence;
						var New_Min=org_min_L-distence;
						if (New_Max<New_Min)
						{
							var temp=New_Max;
							New_Max=New_Min;
							New_Min=temp;
						}
						max_L=New_Max;
						min_L=New_Min;
					}

					//Right Marker Area Drag (Move,Vertiacl)
					//_____________________________________
					if(Mouse_Down_Flag==3 && Mouse_Position_Flag==3)
					{
						var distence=((org_max_R-org_min_R)*(y-org_y)/HEIGHT_Chart);
						var New_Max=org_max_R+distence;
						var New_Min=org_min_R+distence;
						max_R=New_Max;
						min_R=New_Min;
					}

					//Right Marker Area Drag (Scale,Vertiacl)
					//_____________________________________
					if(Mouse_Down_Flag==3 && Mouse_Position_Flag==1)
					{
						var distence=((org_max_R-org_min_R)*(y-org_y)/HEIGHT_Chart);
						var New_Max=org_max_R+distence;
						var New_Min=org_min_R-distence;
						if (New_Max<New_Min)
						{
							var temp=New_Max;
							New_Max=New_Min;
							New_Min=temp;
						}
						max_R=New_Max;
						min_R=New_Min;
					}

					//Bottom Marker Area Drag (Scale,Horizational)
					//_____________________________________
					if(Mouse_Down_Flag==4 && (Mouse_Position_Flag==4 ||Mouse_Position_Flag==5 ||Mouse_Position_Flag==1))
					{
						var distence=Math.ceil((x-org_x)*ratio/(WIDTH/(L_limit-R_limit)));
						var New_L=org_L+distence;
						var New_R=org_R-distence;
						if (New_L>L_limit_max) New_L=L_limit_max;
						if (New_R<R_limit_min) New_R=R_limit_min;
						if (New_L<New_R)
						{
							var temp=New_L;
							New_L=New_R;
							New_R=temp;
						}
						L_limit=New_L;
						R_limit=New_R;
					}
					if (L_limit>L_limit_max) L_limit=L_limit_max;
					if (R_limit<R_limit_min) R_limit=R_limit_min;
					object.graph_clear();
					object.graph_gen();
				}
				else
				{
					chart.style.height="0px";
				}
			}
			object.font_size_uni_str = function (size_def)
			{
				return object.font_size_uni(size_def).toString()+"px";
			}

			object.font_size_uni = function (size_def)
			{
				return Math.ceil(size_def*ratio*Scale_Index);
			}

			object.get_area_id = function (ax,ay)
			{

				if ( ay>=(HEIGHT_Banner+HEIGHT_Chart-4) && ay<=(HEIGHT_Banner+HEIGHT_Chart+HEIGHT_Container) )
		   		{
		   			if(ay>(HEIGHT_Banner+HEIGHT_Chart+5))return 4;
		   			else return 5;
		   		}
				else if(ay<=HEIGHT_Banner+HEIGHT_Chart && ay>HEIGHT_Banner+Grid_length/6 && ax>0 && ax<WIDTH)
				{
					if(ax<=marker_WIDTH) return 2;
					else if(ax<=WIDTH-marker_WIDTH) return 1;
					else return 3;
				}
				return 0;

			}

			object.commom_DBG = function ()
			{

				var Pedding=0;
				ctx.fillStyle="#000";
				ctx.font=object.font_size_uni_str(12)+" ZFont-light";
				ctx.textAlign="center";
				ctx.textBaseline="top";

				var MARK="▶ In Debug Mode ◀";
				ctx.fillText(MARK,WIDTH/2,HEIGHT_Banner+Pedding);
				Pedding+=DBG_lineHeight;

				var MARK="  ratio "+format_F(ratio,1)+
						 "  Device "+format_F(Device,0)+
						 "  Scale_Index "+format_F(Scale_Index,1)+
						 "  BannerLH "+format_F(Banner_line_height,2);
				ctx.fillText(MARK,WIDTH/2,HEIGHT_Banner+Pedding);
				Pedding+=DBG_lineHeight;

				var MARK="  offsetLeft "+format_F(chart.offsetLeft,2)+
						 "  offsetTop "+format_F(chart.offsetTop,2);
				ctx.fillText(MARK,WIDTH/2,HEIGHT_Banner+Pedding);
				Pedding+=DBG_lineHeight;

				var MARK="  Html_Width "+document.getElementById(chart_ID).offsetWidth+
						 "  Html_Height "+document.getElementById(chart_ID).offsetHight;
				ctx.fillText(MARK,WIDTH/2,HEIGHT_Banner+Pedding);
				Pedding+=DBG_lineHeight;

				var MARK="  Width "+WIDTH.toString()+
						 "  Height "+HEIGHT_Chart.toString();
				ctx.fillText(MARK,WIDTH/2,HEIGHT_Banner+Pedding);
				Pedding+=DBG_lineHeight;

				var MARK="  HEIGHT "+format_F(HEIGHT,0)+
						 "  HEIGHT_Banner "+format_F(HEIGHT_Banner,0)+
						 "  HEIGHT_Chart "+format_F(HEIGHT_Chart,0)+
						 "  HEIGHT_Container "+format_F(HEIGHT_Container,0);
				ctx.fillText(MARK,WIDTH/2,HEIGHT_Banner+Pedding);
				Pedding+=DBG_lineHeight;

				var MARK="  L_limit_max "+format_F(L_limit_max,0)+
						 "  R_limit_min "+format_F(R_limit_min,0)+
						 "  marker_WIDTH "+format_F(marker_WIDTH,0)+
						 "  chart_ratio "+format_F(chart_ratio,4);
				ctx.fillText(MARK,WIDTH/2,HEIGHT_Banner+Pedding);
				Pedding+=DBG_lineHeight;

				var MARK="  max_L "+format_F(max_L,0)+
						 "  min_L "+format_F(min_L,0)+
						 "  max_R "+format_F(max_R,0)+
						 "  min_R "+format_F(min_R,0);
				ctx.fillText(MARK,WIDTH/2,HEIGHT_Banner+Pedding);
				Pedding+=DBG_lineHeight;


				var MARK="  L_limit "+format_F(L_limit,0)+
						 "  R_limit "+format_F(R_limit,0)+
						 "  H_Lines "+format_F(H_Lines,0)+
						 "  V_Lines "+format_F(V_Lines,0);
				ctx.fillText(MARK,WIDTH/2,HEIGHT_Banner+Pedding);
				Pedding+=DBG_lineHeight;

				var MARK="Mouse Down "+Mouse_Down_Flag.toString()+"  Mouse Pos "+Mouse_Position_Flag.toString();
				ctx.fillText(MARK,WIDTH/2,HEIGHT_Banner+Pedding);
				Pedding+=DBG_lineHeight;

				return Pedding;
			}

			object.DBG_addStr = function (str,Pedding)
			{
				var MARK=str;
				ctx.fillText(MARK,WIDTH/2,HEIGHT_Banner+Pedding);
				Pedding+=DBG_lineHeight;

				return Pedding;
			}

			object.RESET_ALL = function ()
			{		
				object.RESET();	
				max_L=Default_L_max[Device];
				min_L=Default_L_min[Device];
				max_R=Default_R_max[Device];
				min_R=Default_R_min[Device];
				L_limit=Default_L_limit[Device];
				R_limit=Default_R_limit[Device];
				object.refresh();
			}

			object.RESET = function ()
			{
				Device=0;

				if ( 
				navigator.userAgent.indexOf("iPhone")>0 
				|| navigator.userAgent.indexOf("UCWEB")>0 
				|| navigator.userAgent.indexOf("Android")>0 
				|| navigator.userAgent.indexOf("android")>0
				)Device=1;

				if ( 
				navigator.userAgent.indexOf("iPad")>0 
				)Device=3;

				if (navigator.userAgent.indexOf("iPhone")>0) 
					{
						try
						{
							if (window.orientation==90 || window.orientation==-90)
							{
								Device=2;
							}
						}
						catch(err)
						{
							;
						}
					}

				Scale_Index=		Default_Scale_Index[Device];
				L_limit_max=		Default_L_limit_max[Device];
				R_limit_min=		Default_R_limit_min[Device];
				DBG_lineHeight=		Default_DBG_lineHeight[Device]	*Scale_Index*ratio;
				marker_WIDTH=		Default_marker_WIDTH[Device]	*Scale_Index*ratio;
				H_Lines=			Default_H_Lines[Device];
				V_Lines=			Default_V_Lines[Device];
				Mark_line_len=		Default_Mark_line_len[Device]	*Scale_Index*ratio;
				Mark_line_wid=		Default_Mark_line_wid[Device]	*Scale_Index*ratio;
				side_spacing =		Default_side_spacing [Device]	*Scale_Index*ratio;
				golbal_line_width = Default_line_width[Device]		*Scale_Index*ratio;
				Banner_line_height =Default_HEIGHT_Banner[Device]	*Scale_Index*ratio;
				//Banner_line_height=HEIGHT_Banner;

				if (ChartDataPKG!=undefined && upd_timestamp!=undefined && upd_timestamp!=0)
				{
					var min_timestamp=upd_timestamp;
					if (ChartDataPKG.Data_L!=undefined)
						{
							//alert(ChartDataPKG.Data_L[0][1].length);
							for(var i=0;i<ChartDataPKG.Data_L.length;i++)
							{
								ts_cur_min=ChartDataPKG.Data_L[i][0][ChartDataPKG.Data_L[i][0].length-1];
								if(ts_cur_min<min_timestamp)
								{
									min_timestamp=ts_cur_min;
								}
							}
						}
					if (ChartDataPKG.Data_R!=undefined)
						{
							//alert(ChartDataPKG.Data_L[0][1].length);
							for(var i=0;i<ChartDataPKG.Data_R.length;i++)
							{
								ts_cur_min=ChartDataPKG.Data_R[i][0][ChartDataPKG.Data_R[i][0].length-1];
								if(ts_cur_min<min_timestamp)
								{
									min_timestamp=ts_cur_min;
								}
							}
						}
					//alert(ChartDataPKG.Data_R[0][0].length)
					//alert(min_timestamp)
					L_limit_max=Math.ceil((upd_timestamp-min_timestamp)/bottom_axis_ratio);
					//alert(L_limit_max)
				}
				if (L_limit>L_limit_max) L_limit=L_limit_max;
				if (R_limit<R_limit_min) R_limit=R_limit_min;

				chart_ratio=(H_Lines+0.5*Scale_Index)/V_Lines;

				WIDTH=parseInt(document.getElementById(chart_ID).offsetWidth)*ratio;
				HEIGHT=Math.floor(WIDTH*chart_ratio);

				HEIGHT_Chart=Math.floor(HEIGHT*H_Lines/(H_Lines+0.5*Scale_Index));
				HEIGHT_Container=40*ratio*Scale_Index;
				Grid_length=HEIGHT_Chart/H_Lines;
				HEIGHT=HEIGHT_Chart+HEIGHT_Container+HEIGHT_Banner;
				chart.style.height=(Math.floor(HEIGHT/ratio)).toString()+"px";
				chart.width=WIDTH.toString();
				chart.height=HEIGHT.toString();
				
				object.graph_gen();
			}
			object.RESET_ALL();
			ChartList.push(object);
			return object
		//------------------------------------------------------------
		}
};

//Outside Assistence Functions

	function position_ratio(left,right,val)
	{
		//alert("Ratio Position "+left+" "+right+" "+val);
		var res=(val-left)/(right-left);
		//alert("Ratio Position "+res);
		return res;
	}

	function ratio_position(left,right,ratio)
	{
		//alert("Ratio Position "+left+" "+right+" "+val);
		var res=left+ratio*(right-left);
		//alert("Ratio Position "+res);
		return res;
	}

	function find_value(ts_table,ts)
	{
		var pointer=1;
		var dist=ts_table[1]-ts;
		var bset_match_pointer=1;
		for (pointer=1;pointer<ts_table.length;pointer+=1)
		{
			if (Math.abs(ts_table[pointer]-ts)<dist)
			{
				dist=Math.abs(ts_table[pointer]-ts);
				bset_match_pointer=pointer;
			}
		}
		return bset_match_pointer;
	}

	function format_F(x,n)
	{
		var minus_flag=x>0?"":"-";
		x=x>0?x:-x;
		int_x=Math.floor(x);
		x-=int_x;
		for (var i=0;i<n;i++) x*=10;
		flo_x=Math.floor(x);
		if (n<=0) return minus_flag+int_x.toString();

		return minus_flag+int_x.toString()+"."+flo_x.toString();
	}

	function DBG_Switch()
	{
		Debug=!Debug;
		refresh_ALL();
	}

	document.write('<script src="style.js'+CacheStr()+'" type="text/javascript"></script>')

	function source_upd()
	{
		script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "ZButton.js"+CacheStr();
		//alert(CacheStr());
		document.body.appendChild(script);

		script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "data.js"+CacheStr();
		//alert(CacheStr());
		document.body.appendChild(script);
	}

	setTimeout(source_upd,1);