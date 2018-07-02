#!/usr/bin/env python
##
## Code By Yuxuan
## 

import sys
import argparse
import serial
import time
import signal
import MySQLdb
from array import array
from datetime import datetime
from time import sleep

import Control_Service
from Control_Service import Log_ADD
from Control_Service import Log_In_Key

Debug=False
Show_All_Possible_Error=False
# || Show_All_Possible_Error

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
      Log_ADD("Exception",'<Invalid_Syntax>#'+value_str+'#',"Arduino_Board")
    else:
      _pow=1;
      value_str=value_str[1:]
      while(len(value_str)>0 and value_str[0]>='0' and value_str[0]<='9'):
        _pow*=0.1
        self.val+=_pow*char_to_int(value_str[0])
        value_str=value_str[1:]
      if(len(value_str)>0):
        Log_ADD("ERROR",'<Invalid_Syntax>#'+value_str+'#',"Arduino_Board")
    self.val*=minus_sign_flag;

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
  return 0

def fetch_data(Port, baudrate, time_out, timestamp, Host, User, Password, Database, Table, InputExpect):
  #Start Database Connection
  if Debug:
    Log_ADD(
            "MSG",
            'Debug_Mode_Activated',
            "Arduino_IO")
  try:
    if Debug:
      Log_ADD(
              "MSG",
              'Connecting to Database using Host:'+Host+' User:'+User+' Password:'+Password,
              "Arduino_IO")
    db = MySQLdb.connect(Host, User, Password)
    if Show_All_Possible_Error: raise Exception("Not a real Exception")
  except:
    Log_ADD(
            "ERROR",
            "<Database_Initialization_Error>Data_Base_Initialization_Failed#"+Host+" "+User+" "+Password + "#(Abort)",
            "Arduino_IO");
    #msg_type,msg_string,error_ID=0,priority=0,msg_source
    if(Show_All_Possible_Error==False):sys.exit(1)
  try:
    cursor = db.cursor()
    cursor.execute("use "+Database)
    INSERT_CMD="INSERT INTO "+Table+" (TS,ECC) VALUES("+'%d' % timestamp+",%d" % 0b00000011+");"
    if Debug:
      Log_ADD(
              "MSG",
              'MySQL_CMD >> '+INSERT_CMD,
              "Arduino_IO");
    cursor.execute(INSERT_CMD)
    db.commit()
    if Show_All_Possible_Error: raise Exception("Not a real Exception")
  except:
    Log_ADD(
            "ERROR",
            "<Database_Upload_Error>Failed_To_Commit_CMD#"+INSERT_CMD+"#(Abort)",
            "Arduino_IO");
    #msg_type,msg_string,error_ID=0,priority=0,msg_source
    if(Show_All_Possible_Error==False):sys.exit(1)
  if Debug:  
    Log_ADD(
            "MSG",
            "Database_Connection_Normal",
            "Arduino_IO")
  #Start Serial Connection
  try:
    serial_port = serial.Serial(Port, baudrate, timeout=time_out)
    if Show_All_Possible_Error: raise Exception("Not a real Exception")
  except:
    Log_ADD(
            "ERROR",
            '<Serial_Connection_Error>Serial_Port_Not_Responding#'+Port+'#(Abort)',
            "Arduino_Board")
    #msg_type,msg_string,error_ID=0,priority=0,msg_source
    if(Show_All_Possible_Error==False):sys.exit(1)
  if Debug:
    Log_ADD(
            "MSG",
            "Serial_Connection_Normal",
            "Arduino_IO")
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
      Log_ADD(
              "MSG",
              RAW_Data_str[:RAW_Data_str.find('#')],
              "Arduino_Board")
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
    Log_ADD(
            "MSG",
            RAW_Data_str,
            "Arduino_Board")
    #print('Now replaced by: '+DBG_str)
    #RAW_Data_str=DBG_str
  if (RAW_Data_str.count('#')%2==1 or Show_All_Possible_Error):
    Log_ADD(
            "ERROR",
            '<Serial_Input_Error>INVALID_Serial_INPUT#'+RAW_Data_str+'#(Ignore)',
            "Arduino_Board")
    #msg_type,msg_string,error_ID=0,priority=0,msg_source
    if(Show_All_Possible_Error==False):sys.exit(1)
  while(RAW_Data_str.find('#')!=-1):
    err_str=RAW_Data_str[RAW_Data_str.find('#')+1:]
    err_str=err_str[:err_str.find('#')]
    Log_ADD(
            "ERROR",
            err_str+"(PROCEED)",
            "Arduino_Board")
    #msg_type,msg_string,error_ID=0,priority=0,msg_source
    temp_str=RAW_Data_str[:RAW_Data_str.find('#')]
    RAW_Data_str=RAW_Data_str[RAW_Data_str.find('#')+1:]
    RAW_Data_str=RAW_Data_str[RAW_Data_str.find('#')+1:]
    RAW_Data_str=temp_str+RAW_Data_str
  #Pick out values
  if (RAW_Data_str.count('<')!=1 or RAW_Data_str.count('>')!=1 or Show_All_Possible_Error):
    Log_ADD(
            "ERROR",
            '<Serial_Input_Error>INVALID_Serial_INPUT#'+RAW_Data_str+'#(Ignore)',
            "Arduino_Board")
    #msg_type,msg_string,error_ID=0,priority=0,msg_source
    if(Show_All_Possible_Error==False):sys.exit(1)
  RAW_Data_str=RAW_Data_str[RAW_Data_str.find('<')+1:]
  RAW_Data_str=RAW_Data_str[:RAW_Data_str.find('>')]
  if Debug:
    Log_ADD(
              "MSG",
              "NOW HANDELING : "+RAW_Data_str,
              "Arduino_IO")
  while(RAW_Data_str.count('$')>1):
    DATA=data_unit()
    RAW_Data_str=RAW_Data_str[RAW_Data_str.find('$')+1:]
    Current_Data_str=RAW_Data_str[:RAW_Data_str.find('$')]
    RAW_Data_str=RAW_Data_str[RAW_Data_str.find('$'):]
    if Debug:
      Log_ADD(
                "MSG",
                "NOW HANDELING : "+RAW_Data_str,
                "Arduino_IO")
    if(Current_Data_str.count('%')!=1 or Show_All_Possible_Error):
      Log_ADD(
              "ERROR",
              '<Configuration_Error>INVALID_Data_Record#'+Current_Data_str+'#(PROCEED)',
               "Arduino_IO")
      #msg_type,msg_string,error_ID=0,priority=0,msg_source
    if(Current_Data_str.count('%')==1):#else:
      DATA.set_flag(Current_Data_str[:Current_Data_str.find('%')])
      DATA.convert_float(Current_Data_str[Current_Data_str.find('%')+1:])
      DATA.find_table_name(InputExpect)
      if(DATA.table_name=='' or Show_All_Possible_Error):
        Log_ADD(
                "ERROR",
                '<Configuration_Error>INVALID_Data_Tag#'+Current_Data_str[:Current_Data_str.find('%')]+'#(PROCEED)',
                "Arduino_IO")
        #msg_type,msg_string,error_ID=0,priority=0,msg_source
      if (DATA.table_name!=''):#else:
        Data_CMD="UPDATE "+Table+" SET "+DATA.table_name+"="+'%.4f' % DATA.val+" WHERE TS=" + '%d' % timestamp + ';'
        if Debug:
          Log_ADD(
                  "MSG",
                  "MySQL_CMD >> "+Data_CMD,
                  "Ardiono_IO")
        try:
          cursor.execute(Data_CMD)
          db.commit()
          if Show_All_Possible_Error: raise Exception("Not a real Exception")
        except:
          Log_ADD(
                  "ERROR",
                  '<Database_Upload_Error>Failed_To_Commit_CMD#'+Data_CMD+'#(PROCEED)',
                  "Database")
          #msg_type,msg_string,error_ID=0,priority=0,msg_source
  Final_ECC=0b00000000
  if Debug: Final_ECC=0b11000000
  if Show_All_Possible_Error: Final_ECC=0b11000000
  Data_CMD="UPDATE "+Table+" SET ECC="+str(Final_ECC)+" WHERE TS=" + '%d' % timestamp + ';'
  if Debug:
    RAW_Data_str=''
    timeout_count=0
    while(RAW_Data_str=='' and timeout_count<10):
      serial_port.writelines("<DEBUG_OFF>")
      time.sleep(0.1)
      RAW_Data_str=serial_port.readline()
      timeout_count+=1
      Log_ADD(
                "MSG",
                "Final_ECC_Changed_To "+str(Final_ECC),
                "Arduino_IO")
  cursor.execute(Data_CMD)
  db.commit()
  db.close()
  if Debug:
    Log_ADD(
      "MSG",
      "Debug_Run_Successed TS%d"%timestamp,
      "Ardiono_IO")
    
if __name__ == '__main__':
    
  parser = argparse.ArgumentParser(description='Read serial data and record temperature data.', usage='%(prog)s [options]', formatter_class=argparse.ArgumentDefaultsHelpFormatter)
  parser.add_argument('--Path',      default='', help='Current File System Path')
  parser.add_argument('--port',      default='/dev/ttyACM1',  help='input serial port')
  parser.add_argument('--baudrate',    type=int,       default=9600,  help='baud rate')
  parser.add_argument('--timeout',        type=float,      default=1,    help='timeout for serial reading [s]')
  parser.add_argument('--timestamp',      type=float,      default=0,      help='timestamp')
  parser.add_argument('--host',      default='localhost',  help='Database Host') 
  parser.add_argument('--user',      default='ArduinoIO', help='Database username')
  parser.add_argument('--password',    default='pxKr_AIO',  help='Database password')
  parser.add_argument('--Database',    default='ATLAS_Main', help='Name of Database')
  parser.add_argument('--Table',          default='ARDUINO_IO', help='Name of Target Table')
  parser.add_argument('--InputExpect',    default='$T@Env_Temp$H@Env_Humidity$',help='Sign of datatype and corresponding column name')

  parser.add_argument('--LogTable',     default='Log',         help='Target Error Table')
  parser.add_argument('--LogFile',      default='AIO_Logs.txt',      help='Target Version Control TXT file')
  parser.add_argument('--LOG_user',           default='Log_Upd', help='Database LOG username')
  parser.add_argument('--LOG_password',       default='pxKr_LOG',   help='Database LOG password')
  parser.add_argument('--Debug',          default=False,        action='store_true', help='Do not print to screen.')
  
  parser.add_argument('--Show_All_Possible_Error',          default=False,        action='store_true', help='Do not print to screen.')
  
  args = parser.parse_args(sys.argv[1:])
  Debug=args.Debug

  Show_All_Possible_Error=args.Show_All_Possible_Error

  Control_Service.Debug=Debug
  Control_Service.log_table=args.LogTable
  Control_Service.log_file_route=args.LogFile
  Control_Service.L_Key=Log_In_Key(args.host,args.LOG_user,args.LOG_password,args.Database)

  if args.timestamp==0: args.timestamp=(int)(time.time()*1000)
  fetch_data(args.port, args.baudrate, float(args.timeout), args.timestamp, args.host, args.user, args.password, args.Database, args.Table, args.InputExpect)
  sys.exit(0)
  
