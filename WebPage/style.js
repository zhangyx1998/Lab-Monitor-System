var Default_Style= Object.create(ChartStyle);

var Enviornment_Status_Style= Object.create(ChartStyle);
	Enviornment_Status_Style.Default_Mark_line_len=	[5    ,5    ,5    ,5    ];
	Enviornment_Status_Style.Default_Mark_line_wid=	[2    ,2    ,2    ,2    ];
	Enviornment_Status_Style.Default_side_spacing=	[5    ,5    ,5    ,5    ];
	Enviornment_Status_Style.Default_line_width= 	[1    ,1    ,1    ,1    ];
	Enviornment_Status_Style.Default_DBG_lineHeight=[18   ,14   ,14   ,14   ];
	Enviornment_Status_Style.Default_marker_WIDTH=	[40   ,40   ,40   ,40   ];	
	Enviornment_Status_Style.Default_Scale_Index=	[1    ,2    ,1.5  ,1    ];  //Define the Scale Index of fonts
	Enviornment_Status_Style.Default_L_limit=		[240  ,120  ,240  ,120  ];	//Bottom Horizational Axis default display Range
	Enviornment_Status_Style.Default_R_limit=		[0    ,0    ,0    ,0    ];	//Bottom Horizational Axis default display Range
	Enviornment_Status_Style.Default_L_limit_max=	[26279,26279,26279,26279];	//Bottom Horizational Axis default Scale limit (Will Be ReCaculated Later)
	Enviornment_Status_Style.Default_R_limit_min=	[0    ,0    ,0    ,0    ];	//Bottom Horizational Axis default Scale limit (Will Be ReCaculated Later)
	Enviornment_Status_Style.Default_L_max=			[27   ,27   ,27   ,27   ];	//Left Vertical Axis default display Range **IMPORTANT**
	Enviornment_Status_Style.Default_L_min=			[20   ,20   ,20   ,20   ];	//Left Vertical Axis default display Range **IMPORTANT**
	Enviornment_Status_Style.Default_R_max=			[55   ,55   ,55   ,55   ];	//Right Vertical Axis default display Range **IMPORTANT**
	Enviornment_Status_Style.Default_R_min=			[30   ,30   ,30   ,30   ];	//Right Vertical Axis default display Range **IMPORTANT**
	Enviornment_Status_Style.Default_H_Lines=		[5    ,4    ,6    ,5    ];	//Number of horizational Grids **IMPORTANT**
	Enviornment_Status_Style.Default_V_Lines=		[20   ,10   ,15   ,20   ];	//Number of vertical Grids **IMPORTANT**
	Enviornment_Status_Style.HEIGHT_Banner=			[40   ,40   ,40   ,40   ];	//Top Banner Hight (Not Available Yet)
	Enviornment_Status_Style.On_Scale_Drag_Color=	"#CCCCCC";
	Enviornment_Status_Style.Assist_Line_Color=		"#00CACA";
	Enviornment_Status_Style.Assist_Line_Drag_Color="#00CACA";
	Enviornment_Status_Style.Assist_Font_Color=		"#999999";
	Enviornment_Status_Style.Axis_Font_Color=		"#666666";
	Enviornment_Status_Style.Grid_Color=			"#666666";
	Enviornment_Status_Style.Banner_Color= 			"#DDDDDD";//"#00AA88"
	Enviornment_Status_Style.Alert_Color= 			"#FF0000";
	Enviornment_Status_Style.bottom_axis_ratio= 	3600000;// 1 hour = 3600000 milliseconds
	Enviornment_Status_Style.bottom_axis_unit= 		"Hours Ago";
	Enviornment_Status_Style.Display_Banner= 		true; 		//Display Banner
	Enviornment_Status_Style.Move_right_on_refresh= false;		//the graph will automatically move to "now" on refresh if true
	Enviornment_Status_Style.HightOverRide= 		undefined;	//specify a ratio (Float) If you want to override default ratios
	Enviornment_Status_Style.reverse_bottom_axis= 	false;		//(Not Available For Adujstment Yet)
	Enviornment_Status_Style.reverse_L_axis= 		false;		//(Not Available For Adujstment Yet)
	Enviornment_Status_Style.reverse_R_axis= 		false;		//(Not Available For Adujstment Yet)
	Enviornment_Status_Style.dragg_able= 			true;		//(Not Available For Adujstment Yet)
	Enviornment_Status_Style.left_axis_scale= 		true;		//(Not Available For Adujstment Yet)
	Enviornment_Status_Style.right_axis_scale= 		true;		//(Not Available For Adujstment Yet)
	Enviornment_Status_Style.bottom_axis_scale= 	true;		//(Not Available For Adujstment Yet)
	Enviornment_Status_Style.left_data_assist_line=	true;		//(Not Available For Adujstment Yet)
	Enviornment_Status_Style.right_data_assist_line=true;		//(Not Available For Adujstment Yet)