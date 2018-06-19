#!/bin/bash
#Author:YuxuanZhang
C_DIR="$( cd "$( dirname "$0" )" && pwd )"

source "$C_DIR"/config.sh

WPG_user='--user guest'
WPG_password='--password NA'
WPG_CHIP_Database='--Database chip'
WPG_CHIP_DefaultTable='--DefaultTable CHIP'
WPG_CHIP_InputTableExpect='--InputTableExpect <CHIP$ID/d@ID$Wafer/d@Wafer$col/d@col$row/d@row$Diced_LOC/cvt@Diced_LOC$Diced_DT@Diced_DT$Thickness/d@Thickness$Bumped/d@Bumped$Flip_to/cvt@Flip_to$Flip_DT@Flip_DT$Board/d@Board$Board_DT@Board_DT$Status/mvs@Status$Location/mvs@Location$Chip_Comment/cvt@Chip_Comment$Board_Comment/cvt@Board_Comment$>'
WPG_CHIP_file_stream='--file_stream $'${1}'/WebPage/chipdata.html@'${C_DIR}'/Raw_HTML/chipdata.html.zsc$'
CONFIG_WPG_CHIP="${CommonCONFIG} ${WPG_user} ${WPG_password} ${WPG_CHIP_Database} ${WPG_CHIP_DefaultTable}"
python $C_DIR'/'${WPG_name} ${CONFIG_WPG_CHIP} ${WPG_CHIP_file_stream}  ${WPG_CHIP_InputTableExpect} ${2}

#<CHIP
#     $ID/d@ID
#     $Wafer/d@Wafer
#     $col/d@col
#     $row/d@row
#     $Diced_LOC/cvt@Diced_LOC
#     $Diced_DT@Diced_DT
#     $Thickness/d@Thickness
#     $Bumped/d@Bumped
#     $Flip_to/cvt@Flip_to
#     $Flip_DT@Flip_DT
#     $Board/d@Board
#     $Board_DT@Board_DT
#     $Status/mvs@Status
#     $Location/mvs@Location
#     $Chip_Comment/cvt@Chip_Comment
#     $Board_Comment/cvt@Board_Comment
#$>
