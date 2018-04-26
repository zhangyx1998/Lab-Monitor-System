#!/usr/bin/env python
##
## Code By Yuxuan
## 
version="V1.00"

import sys
import argparse
import serial
import time
import signal
import MySQLdb
from array import array
from datetime import datetime
from time import sleep

Debug=False

err_file_route=''
err_table=''
err_level=['MESSAGE','EXCEPTION','ERROR(L1)','ERROR(L2)','ERROR(L3)','BREAKDOWN']
err_level=['DEBUG','INFO','WARNING','ERROR','FATAL']


class data_unit:
  flag=''
  val=0.0
  table_name=''
  def set_flag(self,def_flag):
    self.flag=def_flag
  def find_table_name(self,InputExpect_str):
    p_str=InputExpect_str.find('$'+self.flag+'@')
    if (self.flag!='' and p_str!=-1): 
      Target_str=InputExpect_str[p_str+len(self.flag)+2:]
      Target_str=Target_str[:Target_str.find('$')]
      self.table_name=Target_str
  def convert_float(self,value_str):
    minus_sign_flag=1
    if(value_str[0]=='-'):
      minus_sign_flag=-1
      value_str=value_str[1:]
    while(len(value_str)>0 and value_str[0]>='0' and value_str[0]<='9'):
      self.val*=10
      self.val+=char_to_int(value_str[0])
      value_str=value_str[1:]
    if(value_str[0]!='.'):
      report_MSG(2,'Incorrect syntax from Arduino: "'+value_str[0]+'"" not expected')
    else:
      _pow=1;
      value_str=value_str[1:]
      while(len(value_str)>0 and value_str[0]>='0' and value_str[0]<='9'):
        _pow*=0.1
        self.val+=_pow*char_to_int(value_str[0])
        value_str=value_str[1:]
      if(len(value_str)>0):
        report_MSG(2,'Incorrect syntax from Arduino: "'+value_str+'"" not expected')

def char_to_int(buff):
  if buff=='0': return 0
  if buff=='1': return 1
  if buff=='2': return 2
  if buff=='3': return 3
  if buff=='4': return 4
  if buff=='5': return 5
  if buff=='6': return 6
  if buff=='7': return 7
  if buff=='8': return 8
  if buff=='9': return 9

def report_MSG(error_level,error_string):
  if Debug:
    print('ERROR_MSG >> level'+'%.f' % error_level + ' ' + error_string)
  if(err_file_route!=''): 
    try:
      err_out = open(err_file_route, 'a')
    except:
      err_out = open(err_file_route, 'w')
    err_out.write(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())+' '+err_level[error_level-1]+' '+error_string+'\n')
    err_out.close()
  #if(err_table!=''):
    #not an online feature 

def version_control():
  #try:
  if Debug:
      Log_ADD(
              "MSG",
              'Version_Control >> Connecting to Database using '+L_Key.Host+' '+L_Key.ID+' '+L_Key.PW+' '+L_Key.DB,
              "Arduino_IO")
  db=MySQLdb.connect(L_Key.Host, L_Key.ID, L_Key.PW)
  cursor = db.cursor()
  SQL_CMD="use "+L_Key.DB
  cursor.execute(SQL_CMD)
  cursor.execute("SELECT MSG_Index From Log WHERE MSG_Source='VERSION' and MSG_Type='CURRENT'")
  line = cursor.fetchone()
  prev_version=line[0]
  if (version!=prev_version):
    if (prev_version.count('V')>0):
      SQL_CMD="INSERT INTO "+log_table+" (MSG_Source, MSG_Type, MSG_Index) VALUES('VERSION', 'UPDATE','From "+prev_version+" To "+version+"');"
      cursor.execute(SQL_CMD)
      SQL_CMD="UPDATE "+log_table+" SET MSG_Index='"+version+"' WHERE MSG_Type='CURRENT'"
      #print SQL_CMD
      cursor.execute(SQL_CMD)
    else:
      SQL_CMD="INSERT INTO "+log_table+" (MSG_Source, MSG_Type, MSG_Index) VALUES('VERSION', 'UPDATE','First Launch: "+version+"');"
      cursor.execute(SQL_CMD)
      SQL_CMD="UPDATE "+log_table+" SET MSG_Index='"+version+"' WHERE MSG_Type='CURRENT'"
      #print SQL_CMD
      cursor.execute(SQL_CMD)  db.commit()
  db.close()  

  if Debug:
    if (version!=prev_version):
      Log_ADD(
                "MSG",
                'Version_Control >> Update Detected : ' + version + ' (Prev)' + prev_version,
                "Arduino_IO")
    else:
      Log_ADD(
                "MSG",
                'Version_Control >> Current_Version : ' + version,
                "Arduino_IO")
  #except:
  #  Log_ADD("ERROR","Could Not Verify Version",1,2,"Arduino_IO")
  #  sys.exit(0)

def fetch_data(Port, baudrate, time_out, timestamp, Host, User, Password, Database, Table, InputExpect):
  #Start Database Connection
  if Debug: print('Debug_MSG >> In Debug Mode')
  try:
    if Debug: print('Debug_MSG >> Connecting to Database using Host:'+Host+' User:'+User+' Password:'+Password)
    db = MySQLdb.connect(Host, User, Password)
  except:
    report_MSG(3,"Data_Base_Initialization_Failed");
    sys.exit(1)
  try:
    cursor = db.cursor()
    cursor.execute("use "+Database)
    INSERT_CMD="INSERT INTO "+Table+" (TS,ECC) VALUES("+'%d' % timestamp+",0b00000000)"
    if(Debug): print('MySQL_CMD >> '+INSERT_CMD)
    cursor.execute(INSERT_CMD)
    db.commit()
  except:
    report_MSG(3,"Data_Base_Insertation_Failed");
    sys.exit(1)
  if Debug: print('Debug_MSG >> Database Connection Normal')
  #Start Serial Connection
  if Debug: serial_port = serial.Serial(Port, baudrate, timeout=time_out)
  else:
    try:
      serial_port = serial.Serial(Port, baudrate, timeout=time_out)
    except serial.serialutil.SerialException:
      report_MSG(3,'Serial_Port '+Port+' Not_Responding;');
      sys.exit(1)
  if Debug: print('Debug_MSG >> Serial Connection Normal')
  #Fetch RAW
  if Debug:
    RAW_Data_str=''
    timeout_count=0
    while(RAW_Data_str=='' and timeout_count<10):
      serial_port.writelines("<DEBUG_ON>")
      time.sleep(0.1)
      RAW_Data_str=serial_port.readline()
      timeout_count+=1
    while(RAW_Data_str!='' and RAW_Data_str.count('#')>=2):
      RAW_Data_str=RAW_Data_str[RAW_Data_str.find('#')+1:]
      report_MSG(1,"From_ARDUINO_Board:"+RAW_Data_str[:RAW_Data_str.find('#')])
      RAW_Data_str=RAW_Data_str[RAW_Data_str.find('#'):]
  RAW_Data_str=''
  timeout_count=0
  while(RAW_Data_str=='' and timeout_count<10):
    serial_port.writelines("<DATA>")
    time.sleep(0.1)
    RAW_Data_str=serial_port.readline()
    timeout_count+=1  
  #Pick out error messages
  if Debug:
    print("Arduino_MSG >> "+RAW_Data_str)
    #print('Now replaced by: '+DBG_str)
    #RAW_Data_str=DBG_str
  if RAW_Data_str.count('#')%2==1:
    report_MSG(2,'INVALID_Serial_INPUT:'+RAW_Data_str)
    sys.exit(1)
  while(RAW_Data_str.find('#')!=-1):
    err_str=RAW_Data_str[RAW_Data_str.find('#')+1:]
    err_str=err_str[:err_str.find('#')]
    report_MSG(2,err_str)
    temp_str=RAW_Data_str[:RAW_Data_str.find('#')]
    RAW_Data_str=RAW_Data_str[RAW_Data_str.find('#')+1:]
    RAW_Data_str=RAW_Data_str[RAW_Data_str.find('#')+1:]
    RAW_Data_str=temp_str+RAW_Data_str
  #Pick out values
  if (RAW_Data_str.count('<')!=1 or RAW_Data_str.count('>')!=1):
    report_MSG(2,'INVALID_Serial_INPUT:'+RAW_Data_str)
    sys.exit(1)
  RAW_Data_str=RAW_Data_str[RAW_Data_str.find('<')+1:]
  RAW_Data_str=RAW_Data_str[:RAW_Data_str.find('>')]
  if Debug:print('Debug_MSG >> '+RAW_Data_str)
  while(RAW_Data_str.count('$')>1):
    DATA=data_unit()
    RAW_Data_str=RAW_Data_str[RAW_Data_str.find('$')+1:]
    Current_Data_str=RAW_Data_str[:RAW_Data_str.find('$')]
    RAW_Data_str=RAW_Data_str[RAW_Data_str.find('$'):]
    if Debug:print('Debug_MSG >> '+RAW_Data_str)
    if(Current_Data_str.count('%')!=1):
      report_MSG(2,'INVALID_Data_Record: '+Current_Data_str+' (PROCEED)')
    else:
      DATA.set_flag(Current_Data_str[:Current_Data_str.find('%')])
      DATA.convert_float(Current_Data_str[Current_Data_str.find('%')+1:])
      DATA.find_table_name(InputExpect)
      if(DATA.table_name==''):
        report_MSG(2,'INVALID_Data_TAG: '+Current_Data_str[:Current_Data_str.find('%')]+' (PROCEED)')
      else:
        Data_CMD="UPDATE "+Table+" SET "+DATA.table_name+"="+'%.4f' % DATA.val+" WHERE TS=" + '%.2f' % timestamp + ';'
        if Debug:
          print("MySQL_CMD >> "+Data_CMD)
        try:
          cursor.execute(Data_CMD)
          db.commit()
        except:
          report_MSG(2,'Data_Update_Failed_USING: '+Data_CMD+' (PROCEED)')
  if Debug:
    RAW_Data_str=''
    timeout_count=0
    while(RAW_Data_str=='' and timeout_count<10):
      serial_port.writelines("<DEBUG_OFF>")
      time.sleep(0.1)
      RAW_Data_str=serial_port.readline()
      timeout_count+=1
    
if __name__ == '__main__':
    
  parser = argparse.ArgumentParser(description='Read serial data and record temperature data.', usage='%(prog)s [options]', formatter_class=argparse.ArgumentDefaultsHelpFormatter)
  parser.add_argument('--port',           default='',   help='input serial port')
  parser.add_argument('--baudrate',       type=int,             default=0,   help='baud rate')
  parser.add_argument('--timeout',        type=float,           default=0,    help='timeout for serial reading [s]')
  parser.add_argument('--timestamp',      type=float,           default=0,      help='timestamp')
  parser.add_argument('--host',           default='',  help='Database Host')  
  parser.add_argument('--user',           default='', help='Database username')
  parser.add_argument('--password',       default='',   help='Database password')
  parser.add_argument('--Database',       default='', help='Name of Database')
  parser.add_argument('--Table',          default='', help='Name of Target Table')
  parser.add_argument('--ErrorTable',     default='',         help='Target Error Table')
  parser.add_argument('--ErrorFile',      default='.txt',      help='Target Error TXT file')
  parser.add_argument('--InputExpect',    default='',help='Sign of datatype and corresponding column name')
  parser.add_argument('--Debug',          default=False,        action='store_true', help='Do not print to screen.')
  
  args = parser.parse_args(sys.argv[1:])
  Debug=args.Debug
  err_file_route=args.ErrorFile
  err_table=args.ErrorTable
  if args.timestamp==0: args.timestamp=(int)(time.time()*1000)
  fetch_data(args.port, args.baudrate, float(args.timeout), args.timestamp, args.host, args.user, args.password, args.Database, args.Table, args.InputExpect)
  sys.exit(0)
  
