#!/bin/bash
#Author:Yuxuan Zhang

Version="V5.00"

#-----------------------------------------------------
#------------------Global Arguments-------------------
#-----------------------------------------------------
CTRL_name="Control_Service.py"
AIO_name="Arduino_IO.py"
WPG_name="WebPage_Generator.py"

host='--host localhost' #The host of the current database
Database='--Database ATLAS_Main' #Current database
LogTable='--LogTable Log' #Name of the Log table
LogFile='--LogFile Error_Logs.txt' #Name of the Log File
LOGUser='--LOG_user Log_Upd' #UserName Specailly for Log_ADD
LOGPassword='--LOG_password pxKr_LOG' #Password Specailly for Log_ADD
CommonCONFIG="${host} ${Database} ${LogTable} ${LogFile} ${LOGUser} ${LOGPassword}"
#-----------------------------------------------------
#----------------VERSION_Ctrl Arguments---------------
#-----------------------------------------------------
CTRL_Note="--Note UpGrade_note.txt"
CONFIG_CTRL="${CommonCONFIG} ${CTRL_Note} --Version ${Version}"
#echo $CONFIG_VER
#-----------------------------------------------------
#------------------ARDUINO_IO Arguments---------------
#-----------------------------------------------------
AIO_port='--port /dev/ttyACM1'
AIO_baudrate='--baudrate 9600'
AIO_timeout='--timeout 1'
AIO_timestamp='--timestamp'
AIO_user='--user ArduinoIO'
AIO_password='--password pxKr_AIO'
AIO_Table='--Table ARDUINO_IO'
AIO_InputExpect='--InputExpect $T@Env_Temp$H@Env_Humidity$'
AIO_Debug=' '
CONFIG_AIO="${CommonCONFIG} ${AIO_port} ${AIO_baudrate} ${AIO_timeout} ${AIO_host} ${AIO_user} ${AIO_password} ${AIO_Database} ${AIO_Table} ${AIO_LogTable} ${AIO_LogFile} ${AIO_LOGUser} ${AIO_LOGPassword} ${AIO_InputExpect} ${AIO_timestamp}"
#echo $CONFIG_AIO
#-----------------------------------------------------
#-------------Web_Page_Generator Arguments------------
#-----------------------------------------------------
WPG_timestamp='--timestamp'
WPG_host='--host localhost'
WPG_user='--user guest'
WPG_password='--password NA'
WPG_Database='--Database ATLAS_Main'
WPG_DefaultTable='--DefaultTable ARDUINO_IO'
WPG_InputTableExpect='--InputTableExpect <ARDUINO_IO$TS/fake_ts@TS$ECC/d@ECC$ET/4f@Env_Temp$EH/4f@Env_Humidity$ET_D/4f@Env_Temp$EH_D/4f@Env_Humidity$DT/dt@Last_Update$DT_Str/str@Last_Update$><Log$ID/d@ID$MSG_Source@MSG_Source$MSG_Type/cvt@MSG_Type$Priority@Priority$ERR_ID@ERR_ID$MSG_Index/cvt@MSG_Index$Stamp@Stamp$Date_Time@Date_Time$>'
WPG_file_stream='--file_stream $/WebPage/index.html@/ALMS/Raw_HTML/index.html.zsc$/WebPage/data.js@/ALMS/Raw_HTML/data.js.zsc$'
CONFIG_WPG="${CommonCONFIG} ${WPG_host} ${WPG_user} ${WPG_password} ${WPG_Database} ${WPG_DefaultTable} ${WPG_InputTableExpect} ${WPG_file_stream} ${WPG_timestamp}"
#echo $CONFIG_WPG
#-----------------------------------------------------
#------------------Other Arguments--------------------
#-----------------------------------------------------

