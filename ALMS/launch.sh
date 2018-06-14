#!/bin/bash
#Author:YuxuanZhang
C_DIR="$( cd "$( dirname "$0" )" && pwd )"
source "$C_DIR"/config.sh

TS_DT=`date "+%Y-%m-%d %H:%M:%S"`
TS_SC=`date -d "$TS_DT" +%s`
TS_MS=`date "+%N"`
TS_MS=${TS_MS#0}
TS_MS=${TS_MS#0}
TS_MS=${TS_MS#0}
TS_MS=${TS_MS#0}
TS_MS=${TS_MS#0}
TS_MS=${TS_MS#0}
TS=$[${TS_SC}*1000+TS_MS/1000000]



echo $C_DIR'/'${AIO_name} ${CONFIG_AIO} $TS '--Path' $1 $2
echo $C_DIR'/'${WPG_name} ${CONFIG_WPG} $TS '--Path' $1 $2
echo $C_DIR'/'${CTRL_name} ${CONFIG_CTRL} '--Path' ${C_DIR} $2