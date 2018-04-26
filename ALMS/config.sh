#!/bin/bash
#Author:Yuxuan Zhang

Version="V2.00"

#-----------------------------------------------------
#------------------Global Arguments-------------------
#-----------------------------------------------------
AIO_name="Arduino_IO.py"
WPG_name="WebPage_Generator.py"
AIO_path="Source/Arduino_IO/${AIO_name}"
WPG_path="Source/WebPage_Generator/${WPG_name}"
CTL_path="Not_Specified"
#-----------------------------------------------------
#------------------ARDUINO_IO Arguments---------------
#-----------------------------------------------------
AIO_port='--port /dev/ttyACM1' #ARGS>1
AIO_baudrate='--baudrate 9600'  #ARGS>2
AIO_timeout='--timeout 1' #ARGS>3
AIO_timestamp='--timestamp' #ARGS>4 #Do not worry, the stamp will be given later
AIO_host='--host localhost' #ARGS>5
AIO_user='--user ArduinoIO' #ARGS>6
AIO_password='--password pxKr_AIO' #ARGS>7
AIO_Database='--Database ATLAS_Main' #ARGS>8
AIO_Table='--Table ARDUINO_IO' #ARGS>9
AIO_LogTable='--LogTable Log' #ARGS>10
AIO_LogFile='--LogFile AIO_Errors.txt' #ARGS>11
AIO_InputExpect='--InputExpect $T@Env_Temp$H@Env_Humidity$' #ARGS>12
AIO_Debug=' ' #ARGS>13
CONFIG_AIO="${AIO_port} ${AIO_baudrate} ${AIO_timeout} ${AIO_host} ${AIO_user} ${AIO_password} ${AIO_Database} ${AIO_Table} ${AIO_LogTable} ${AIO_LogFile} ${AIO_InputExpect} ${AIO_timestamp}"
#echo $CONFIG_AIO
#-----------------------------------------------------
#-------------Web_Page_Generator Arguments------------
#-----------------------------------------------------
WPG_timestamp='--timestamp' #ARGS>4 #Do not worry, the stamp will be given later
WPG_host='--host localhost'
WPG_user='--user guest'
WPG_password='--password #NA'
WPG_Database='--Database ATLAS_Main'
WPG_DefaultTable='--DefaultTable ARDUINO_IO'
WPG_InputTableExpect='--InputTableExpect <ARDUINO_IO$TS/d@TS$ECC/d@ECC$ET/4f@Env_Temp$EH/4f@Env_Humidity$ET_D/4f@Env_Temp$EH_D/4f@Env_Humidity$DT/dt@Last_Update$DT_Str/str@Last_Update$><Log$ID/d@ID$MSG_Source@MSG_Source$MSG_Type/cvt@MSG_Type$Priority@Priority$ERR_ID@ERR_ID$MSG_Index/cvt@MSG_Index$Stamp@Stamp$Date_Time@Date_Time$>'
WPG_file_stream='--file_stream $/WebPage/index.html@/Source/Raw_HTML/'$Version'/RAW_index.html$'
CONFIG_WPG="${WPG_host} ${WPG_user} ${WPG_password} ${WPG_Database} ${WPG_DefaultTable} ${WPG_InputTableExpect} ${WPG_file_stream} ${WPG_timestamp}"
#echo $CONFIG_WPG
#-----------------------------------------------------
#------------------Other Arguments--------------------
#-----------------------------------------------------

