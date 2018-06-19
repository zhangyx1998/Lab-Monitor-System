#!/bin/bash
#Author:YuxuanZhang
C_DIR="$( cd "$( dirname "$0" )" && pwd )"
CMD="${C_DIR}/ALMS/chip_data.sh ${C_DIR} $1"
#echo $CMD
$CMD