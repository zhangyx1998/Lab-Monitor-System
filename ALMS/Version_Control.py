#!/usr/bin/env python
##
## Code By Yuxuan
## 


import sys
import argparse
import time
import MySQLdb
from datetime import datetime

Debug=False
Show_All_Possible_Error=False

log_file_route=''
log_table=''
note_file_route=''

version="NA"

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

def version_control():
  try:
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
        cursor.execute(SQL_CMD)
      if (note_file_route!=''):
        try:
          note_file=open(note_file_route,'r')
          content=note_file.read()
          SQL_CMD="INSERT INTO "+log_table+" (MSG_Source, MSG_Type, MSG_Index) VALUES('VERSION', 'Note','"+version+" Upgrade Note:\n"+content.replace("\n"," ")+"');"
          cursor.execute(SQL_CMD)
        except:
          print("Log_file_not_exist")
    db.commit()
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
  except:
    Log_ADD(
      "ERROR",
      "<Version_Inspection_Failed>Could Not Verify Version",
      "VER_Ctrl")#id=0001
    sys.exit(0)

def Err_Identify(msg_string):
  return 0

def Error_priority(msg_string):
  return 0

def Log_ADD(msg_type,msg_string,msg_source="VER_Ctrl"):
  msg_string=msg_string.replace('\n',' ')
  msg_string=msg_string.replace('\r',' ')
  error_ID=Err_Identify(msg_string)
  error_priority=Error_priority(msg_string)
  if Show_All_Possible_Error:
    msg_type="$FAKE$ "+msg_type
  if Debug:
    print(msg_source+' >> ' + msg_type + ' >> ' + msg_string)
    msg_type="Debug "+msg_type
  if(log_file_route!=''): 
    try:
      err_out = open(log_file_route, 'a')
    except:
      err_out = open(log_file_route, 'w')
    err_out.write(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())+' '+msg_type+' '+msg_string+'\n')
    err_out.close()
  if(log_table!=''):
    try:
      #if Debug: print("LOG_Service >> Debug >> Connecting to Database using "+L_Key.Host+' '+L_Key.ID+' '+L_Key.PW+' '+L_Key.DB)
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
 
if __name__ == '__main__':
    
  parser = argparse.ArgumentParser(description='Read serial data and record temperature data.', usage='%(prog)s [options]', formatter_class=argparse.ArgumentDefaultsHelpFormatter)
  parser.add_argument('--Path',           default='NA', help='UpGrade_note_file_Path')
  parser.add_argument('--Note',           default='NA', help='UpGrade_note')
  parser.add_argument('--Version',           default='NA', help='Version')
  parser.add_argument('--host',           default='localhost', help='Database LOG username')
  parser.add_argument('--LOG_user',           default='Log_Upd', help='Database LOG username')
  parser.add_argument('--LOG_password',       default='pxKr_LOG',   help='Database LOG password')
  parser.add_argument('--Database',       default='ATLAS_Main', help='Name of Database')
  parser.add_argument('--LogTable',     default='Log',         help='Target Error Table')
  parser.add_argument('--LogFile',      default='VER_Logs.txt',      help='Target Version Control TXT file')
  parser.add_argument('--Debug',          default=False,        action='store_true', help='Do not print to screen.')
  parser.add_argument('--Show_All_Possible_Error',          default=False,        action='store_true', help='Do not print to screen.')
  args = parser.parse_args(sys.argv[1:])
  version=args.Version
  Debug=args.Debug
  Show_All_Possible_Error=args.Show_All_Possible_Error
  log_file_route=args.LogFile
  log_table=args.LogTable
  note_file_route=args.Path+'/'+args.Note

  L_Key=Log_In_Key(args.host,args.LOG_user,args.LOG_password,args.Database)
  version_control()
  sys.exit(0)
  
