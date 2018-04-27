#!/bin/bash
#Author:Yuxuan Zhang

Version="V4.03"

#-----------------------------------------------------
#------------------Global Arguments-------------------
#-----------------------------------------------------
VER_name="Version_Control.py"
AIO_name="Arduino_IO_${Version}.py"
WPG_name="WebPage_Generator_${Version}.py"
#-----------------------------------------------------
#----------------VERSION_Ctrl Arguments---------------
#-----------------------------------------------------
VER_host='--host localhost'
VER_Database='--Database ATLAS_Main'
VER_LogTable='--LogTable Log'
VER_LogFile='--LogFile VER_Errors.txt'
VER_LOGUser='--LOG_user Log_Upd'
VER_LOGPassword='--LOG_password pxKr_LOG'
CONFIG_VER="${VER_host} ${VER_Database} ${VER_LogTable} ${VER_LogFile} ${VER_LOGUser} ${VER_LOGPassword} --Version ${Version}"
#echo $CONFIG_VER
#-----------------------------------------------------
#------------------ARDUINO_IO Arguments---------------
#-----------------------------------------------------
AIO_port='--port /dev/ttyACM1'
AIO_baudrate='--baudrate 9600'
AIO_timeout='--timeout 1'
AIO_timestamp='--timestamp'
AIO_host='--host localhost'
AIO_user='--user ArduinoIO'
AIO_password='--password pxKr_AIO'
AIO_Database='--Database ATLAS_Main'
AIO_Table='--Table ARDUINO_IO'
AIO_InputExpect='--InputExpect $T@Env_Temp$H@Env_Humidity$'
AIO_Debug=' '
CONFIG_AIO="${AIO_port} ${AIO_baudrate} ${AIO_timeout} ${AIO_host} ${AIO_user} ${AIO_password} ${AIO_Database} ${AIO_Table} ${AIO_LogTable} ${AIO_LogFile} ${AIO_InputExpect} ${AIO_timestamp}"
#echo $CONFIG_AIO
#-----------------------------------------------------
#-------------Web_Page_Generator Arguments------------
#-----------------------------------------------------
WPG_timestamp='--timestamp'
WPG_host='--host localhost'
WPG_user='--user guest'
WPG_password='--password #NA'
WPG_Database='--Database ATLAS_Main'
WPG_DefaultTable='--DefaultTable ARDUINO_IO'
WPG_InputTableExpect='--InputTableExpect <ARDUINO_IO$TS/d@TS$ECC/d@ECC$ET/4f@Env_Temp$EH/4f@Env_Humidity$ET_D/4f@Env_Temp$EH_D/4f@Env_Humidity$DT/dt@Last_Update$DT_Str/str@Last_Update$><Log$ID/d@ID$MSG_Source@MSG_Source$MSG_Type/cvt@MSG_Type$Priority@Priority$ERR_ID@ERR_ID$MSG_Index/cvt@MSG_Index$Stamp@Stamp$Date_Time@Date_Time$>'
WPG_file_stream='--file_stream $/WebPage/index.html@/Source/'$Version'/Raw_HTML/index.html.zsc$/WebPage/ZChart.js@/Source/'$Version'/Raw_HTML/ZChart.js.zsc$/WebPage/style.js@/Source/'$Version'/Raw_HTML/style.js.zsc$/WebPage/data.js@/Source/'$Version'/Raw_HTML/data.js.zsc$/WebPage/ZButton.js@/Source/'$Version'/Raw_HTML/ZButton.js.zsc$'
CONFIG_WPG="${WPG_host} ${WPG_user} ${WPG_password} ${WPG_Database} ${WPG_DefaultTable} ${WPG_InputTableExpect} ${WPG_file_stream} ${WPG_timestamp}"
#echo $CONFIG_WPG
#-----------------------------------------------------
#------------------Other Arguments--------------------
#-----------------------------------------------------

