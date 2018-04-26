#!/usr/bin/env python
##
## Code By Yuxuan
## 

version="V1.01"

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

log_file_route=''
log_table=''

class Log_In_Key():
  Host='NA'
  ID='NA'
  PW='NA'
  DB='NA'
  def __init__(self, Host, ID, PW, DB):
      self.Host = Host
      self.ID = ID
      self.PW = PW
      self.DB = DB
L_Key=Log_In_Key('NA','NA','NA','NA')

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
      report_MSG("Exception",'Incorrect syntax from Arduino: "'+value_str[0]+'"" not expected',1,0,"Arduino_Board")
    else:
      _pow=1;
      value_str=value_str[1:]
      while(len(value_str)>0 and value_str[0]>='0' and value_str[0]<='9'):
        _pow*=0.1
        self.val+=_pow*char_to_int(value_str[0])
        value_str=value_str[1:]
      if(len(value_str)>0):
        report_MSG("Exception",'Incorrect syntax from Arduino: "'+value_str+'"" not expected',1,0,"Arduino_Board")

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

def report_MSG(msg_type,msg_string,error_ID=0,error_priority=0,msg_source="Arduino_IO"):
  if Debug:
    print('ERROR_MSG >> ' + msg_type + ' ' + msg_string)
  if(log_file_route!=''): 
    try:
      err_out = open(log_file_route, 'a')
    except:
      err_out = open(log_file_route, 'w')
    err_out.write(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())+' '+msg_type+' '+msg_string+'\n')
    err_out.close()
  if(log_table!=''):
    try:
      if Debug: print("MSG >> Connecting to Database using "+L_Key.Host+' '+L_Key.ID+' '+L_Key.PW+' '+L_Key.DB)
      db=MySQLdb.connect(L_Key.Host, L_Key.ID, L_Key.PW)
      cursor = db.cursor()
      SQL_CMD="use "+L_Key.DB
      cursor.execute(SQL_CMD)
    except:
      return 0
    stamp=0
    if (error_priority!=0): stamp=1
    INSERT_CMD="INSERT INTO "+log_table+" (MSG_Source, MSG_Type, Priority, ERR_ID, MSG_Index, Stamp) VALUES('"+msg_source+"','"+msg_type+"',"+ '%d' % error_priority+","+ '%d' % error_ID+",'"+msg_string+"',"+ '%d' % stamp+");"
    cursor.execute(INSERT_CMD)
    db.commit()
    db.close()
    #not an online feature 

def fetch_data(Port, baudrate, time_out, timestamp, Host, User, Password, Database, Table, InputExpect):
  #Start Database Connection
  if Debug: print('Debug_MSG >> In Debug Mode')
  version_control()
  try:
    if Debug: print('Debug_MSG >> Connecting to Database using Host:'+Host+' User:'+User+' Password:'+Password)
    db = MySQLdb.connect(Host, User, Password)
  except:
    report_MSG("ERROR","Data_Base_Initialization_Failed",1,2,"Arduino_IO");
    sys.exit(1)
  try:
    cursor = db.cursor()
    cursor.execute("use "+Database)
    INSERT_CMD="INSERT INTO "+Table+" (TS,ECC) VALUES("+'%d' % timestamp+",0b00000011);"
    if(Debug): print('MySQL_CMD >> '+INSERT_CMD)
    cursor.execute(INSERT_CMD)
    db.commit()
  except:
    report_MSG("ERROR","Data_Base_Insertation_Failed",1,2,"Arduino_IO");
    sys.exit(1)
  if Debug: print('Debug_MSG >> Database Connection Normal')
  #Start Serial Connection
  if Debug: serial_port = serial.Serial(Port, baudrate, timeout=time_out)
  else:
    try:
      serial_port = serial.Serial(Port, baudrate, timeout=time_out)
    except serial.serialutil.SerialException:
      report_MSG("ERROR",'Serial_Port '+Port+' Not_Responding;',1,2,"Arduino_IO");
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
      report_MSG("Exception",RAW_Data_str[:RAW_Data_str.find('#')],0,1,"Arduino_Board")
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
    report_MSG("ERROR",'INVALID_Serial_INPUT:'+RAW_Data_str,1,0,"Arduino_IO")
    sys.exit(1)
  while(RAW_Data_str.find('#')!=-1):
    err_str=RAW_Data_str[RAW_Data_str.find('#')+1:]
    err_str=err_str[:err_str.find('#')]
    report_MSG("Exception",err_str,1,0,"Arduino_Board")
    temp_str=RAW_Data_str[:RAW_Data_str.find('#')]
    RAW_Data_str=RAW_Data_str[RAW_Data_str.find('#')+1:]
    RAW_Data_str=RAW_Data_str[RAW_Data_str.find('#')+1:]
    RAW_Data_str=temp_str+RAW_Data_str
  #Pick out values
  if (RAW_Data_str.count('<')!=1 or RAW_Data_str.count('>')!=1):
    report_MSG("ERROR",'INVALID_Serial_INPUT:'+RAW_Data_str,1,1,"Arduino_IO")
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
      report_MSG("ERROR",'INVALID_Data_Record: '+Current_Data_str+' (PROCEED)',1,0)
    else:
      DATA.set_flag(Current_Data_str[:Current_Data_str.find('%')])
      DATA.convert_float(Current_Data_str[Current_Data_str.find('%')+1:])
      DATA.find_table_name(InputExpect)
      if(DATA.table_name==''):
        report_MSG("ERROR",'INVALID_Data_TAG: '+Current_Data_str[:Current_Data_str.find('%')]+' (PROCEED)',1,0,"Arduino_IO")
      else:
        Data_CMD="UPDATE "+Table+" SET "+DATA.table_name+"="+'%.4f' % DATA.val+" WHERE TS=" + '%d' % timestamp + ';'
        if Debug:
          print("MySQL_CMD >> "+Data_CMD)
        try:
          cursor.execute(Data_CMD)
          db.commit()
        except:
          report_MSG("Exception",'Data_Update_Failed_USING: '+Data_CMD+' (PROCEED)',1,1,"Arduino_IO")
  if Debug:
    RAW_Data_str=''
    timeout_count=0
    while(RAW_Data_str=='' and timeout_count<10):
      serial_port.writelines("<DEBUG_OFF>")
      time.sleep(0.1)
      RAW_Data_str=serial_port.readline()
      timeout_count+=1
    Data_CMD="UPDATE "+Table+" SET ECC="+str(0b11000000)+" WHERE TS=" + '%d' % timestamp + ';'
  else:
    Data_CMD="UPDATE "+Table+" SET ECC="+str(0b00000000)+" WHERE TS=" + '%d' % timestamp + ';'
  if Debug: print("Debug_MSG >> Final ECC Changed to "+str(0b11000000))
  cursor.execute(Data_CMD)
  db.commit()
  db.close()
    
if __name__ == '__main__':
    
  parser = argparse.ArgumentParser(description='Read serial data and record temperature data.', usage='%(prog)s [options]', formatter_class=argparse.ArgumentDefaultsHelpFormatter)
  parser.add_argument('--port',           default='',   help='input serial port')
  parser.add_argument('--baudrate',       type=int,             default=0,   help='baud rate')
  parser.add_argument('--timeout',        type=float,           default=0,    help='timeout for serial reading [s]')
  parser.add_argument('--timestamp',      type=float,           default=0,      help='timestamp')
  parser.add_argument('--host',           default='',  help='Database Host')  
  parser.add_argument('--user',           default='', help='Database username')
  parser.add_argument('--password',       default='',   help='Database password')
  parser.add_argument('--LOG_user',           default='Log_Upd', help='Database LOG username')
  parser.add_argument('--LOG_password',       default='pxKr_LOG',   help='Database LOG password')
  parser.add_argument('--Database',       default='', help='Name of Database')
  parser.add_argument('--Table',          default='', help='Name of Target Table')
  parser.add_argument('--LogTable',     default='',         help='Target Error Table')
  parser.add_argument('--LogFile',      default='.txt',      help='Target Error TXT file')
  parser.add_argument('--InputExpect',    default='',help='Sign of datatype and corresponding column name')
  parser.add_argument('--Debug',          default=False,        action='store_true', help='Do not print to screen.')
  
  args = parser.parse_args(sys.argv[1:])
  Debug=args.Debug
  log_file_route=args.LogFile
  log_table=args.LogTable
  L_Key=Log_In_Key(args.host,args.LOG_user,args.LOG_password,args.Database)
  if args.timestamp==0: args.timestamp=(int)(time.time()*1000)
  fetch_data(args.port, args.baudrate, float(args.timeout), args.timestamp, args.host, args.user, args.password, args.Database, args.Table, args.InputExpect)
  sys.exit(0)
  
