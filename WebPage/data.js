var TH_Chart_Data_PKG1= Object.create(ChartDataPKG);
TH_Chart_Data_PKG1.Data_L_Name=["ARDUINO_IO_T","Board-Sensor-1","Board-Sensor-2","Board-Sensor-3","Board-Sensor-4","Board-Sensor-5","Board-Sensor-6","Board-Sensor-7"];
TH_Chart_Data_PKG1.Data_R_Name=["ARDUINO_IO_H","Board-Sensor-1","Board-Sensor-2","Board-Sensor-3","Board-Sensor-4","Board-Sensor-5","Board-Sensor-6","Board-Sensor-7"];
TH_Chart_Data_PKG1.Left_Axis_Name="TEMPERATURE";
TH_Chart_Data_PKG1.Right_Axis_Name="HUMIDITY";

TH_Chart_Data_PKG1.Left_Axis_Color			="#FF8822";
TH_Chart_Data_PKG1.Left_Axis_BKG_Color		="#FFD49F";
TH_Chart_Data_PKG1.Left_Axis_OnGrag_Color	="#FFBB66";
TH_Chart_Data_PKG1.Right_Axis_Color			="#0081C6";
TH_Chart_Data_PKG1.Right_Axis_BKG_Color		="#DDEEFF";
TH_Chart_Data_PKG1.Right_Axis_OnGrag_Color	="#BBDDFF";

TH_Chart_Data_PKG1.Data_L=
	[
		[
			[
				1,
		 	]
		 	,
		 	[
		 		2,
		 	]
		 	,
		 	[
		 		1,
		 	]
		 	,
		 	[
		 		1,
		 	]
		 	,
		 	[
		 		1,
		 	]
		 	,
		 	[
		 		1,
		 	]
		 	,
		 	[
		 		1,
		 	]
		 	,
		 	[
		 		1,
		 	]
		 	,
		 	[
		 		1,
		 	]
		 ]
	];
TH_Chart_Data_PKG1.Data_R=
	[
		[
			[
				1,
		 	]
		 	,
		 	[
		 		2,
		 	]
		 	,
		 	[
		 		1,
		 	]
		 	,
		 	[
		 		1,
		 	]
		 	,
		 	[
		 		1,
		 	]
		 	,
		 	[
		 		1,
		 	]
		 	,
		 	[
		 		1,
		 	]
		 	,
		 	[
		 		1,
		 	]
		 	,
		 	[
		 		1,
		 	]
		 ]
	];
Chart_1.update_data(TH_Chart_Data_PKG1);

function data_upd()
{
	Chart_1.update_data(TH_Chart_Data_PKG1);
}
setTimeout(data_upd,50);

var TH_Chart_Data_PKG2= Object.create(ChartDataPKG);
TH_Chart_Data_PKG2.Data_L_Name=[""];
TH_Chart_Data_PKG2.Data_R_Name=[""];
TH_Chart_Data_PKG2.Left_Axis_Name="N/A";
TH_Chart_Data_PKG2.Right_Axis_Name="N/A";

TH_Chart_Data_PKG2.Left_Axis_Color			="#B0B0B0";
TH_Chart_Data_PKG2.Left_Axis_BKG_Color		="#B0B0B0";
TH_Chart_Data_PKG2.Left_Axis_OnGrag_Color	="#B0B0B0";
TH_Chart_Data_PKG2.Right_Axis_Color			="#B0B0B0";
TH_Chart_Data_PKG2.Right_Axis_BKG_Color		="#B0B0B0";
TH_Chart_Data_PKG2.Right_Axis_OnGrag_Color	="#B0B0B0";