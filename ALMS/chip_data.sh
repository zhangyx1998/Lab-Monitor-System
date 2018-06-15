#!/bin/bash
#Author:YuxuanZhang
C_DIR="$( cd "$( dirname "$0" )" && pwd )"

source "$C_DIR"/config.sh

WPG_host='--host localhost'
WPG_user='--user guest'
WPG_password='--password NA'
WPG_Database='--Database chip'
WPG_DefaultTable='--DefaultTable chip'
WPG_InputTableExpect='--InputTableExpect <chip$ID/d@ID$Wafer/d@Wafer$col/d@col$row/d@row$Board/d@Board$Status/mvs@Status$Location/mvs@Location$Flip_to/cvt@Flip_to$>'
WPG_file_stream='--file_stream $../Webpage/chipdata.html@Raw_HTML/chipdata.html.zsc$'
CONFIG_WPG_CHIP="${CommonCONFIG} ${WPG_host} ${WPG_user} ${WPG_password} ${WPG_Database} ${WPG_DefaultTable} ${WPG_InputTableExpect} ${WPG_file_stream}"
python $C_DIR'/'${WPG_name} ${CONFIG_WPG_CHIP} ${1}