#!/bin/bash
#Author:YuxuanZhang
C_DIR="$( cd "$( dirname "$0" )" && pwd )"
CMD="${C_DIR}/ALMS/launch.sh ${C_DIR} $1"
#echo $CMD
$CMD
