#!/bin/bash
#Author:YuxuanZhang
C_DIR="$( cd "$( dirname "$0" )" && pwd )"
#echo $C_DIR
source "$C_DIR"/config.sh
TS_DT=`date "+%Y-%m-%d %H:%M:%S"`
#echo $TS_DT
TS_SC=`date -d "$TS_DT" +%s`
#echo $TS_SC
TS_MS=`date "+%N"`
TS_MS=${TS_MS#0}
TS_MS=${TS_MS#0}
TS_MS=${TS_MS#0}
TS_MS=${TS_MS#0}
TS_MS=${TS_MS#0}
TS_MS=${TS_MS#0}
#echo $TS_MS
TS=$[${TS_SC}*1000+TS_MS/1000000]
#echo $TS
#echo $AIO_timestamp
#echo $C_DIR'/'$AIO_path'_'$Version'.py' $CONFIG_AIO $TS $1
#echo $C_DIR'/'$WPG_path'_'$Version'.py' $CONFIG_WPG $1
#echo "python ${C_DIR}/${VER_name} ${CONFIG_VER} ${2}"
#echo "python $C_DIR/${AIO_name} ${CONFIG_AIO} ${TS} --Path ${1} ${2}"
#echo "python ${C_DIR}/${WPG_Name} ${CONFIG_WPG} ${TS} --Path ${1} ${2}"
python $C_DIR'/'${VER_name} ${CONFIG_VER} ${2}
python $C_DIR'/'${AIO_name} ${CONFIG_AIO} $TS '--Path' $1 $2
python $C_DIR'/'${WPG_name} ${CONFIG_WPG} $TS '--Path' $1 $2