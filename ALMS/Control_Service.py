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
source_string="CTRL"
source_ID=0

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
  #try:
  if Debug:
      Log_ADD(
              "Debug MSG",
              'Version_Control >> Connecting to Database using '+L_Key.Host+' '+L_Key.ID+' '+L_Key.PW+' '+L_Key.DB,
              "CTRL")
  db=MySQLdb.connect(L_Key.Host, L_Key.ID, L_Key.PW)
  cursor = db.cursor()
  SQL_CMD="use "+L_Key.DB
  cursor.execute(SQL_CMD)
  cursor.execute("SELECT MSG_Index From Log WHERE MSG_Source='VERSION' and MSG_Type='CURRENT'")
  line = cursor.fetchone()
  db.close()
  prev_version=line[0]
  if (version!=prev_version):
    if (prev_version.count('V')>0):
      Log_ADD(
              "UPDATE",
              'From '+prev_version+' To '+version,
              "CTRL")
      SQL_CMD="UPDATE "+log_table+" SET MSG_Index='"+version+"' WHERE MSG_Type='CURRENT'"
      #print SQL_CMD
      db=MySQLdb.connect(L_Key.Host, L_Key.ID, L_Key.PW)
      cursor = db.cursor()
      cursor.execute(SQL_CMD)
      db.commit()
      db.close()
    else:
      Log_ADD(
              "UPDATE",
              'First Launch: '+version,
              "CTRL")
      SQL_CMD="UPDATE "+log_table+" SET MSG_Index='"+version+"' WHERE MSG_Type='CURRENT'"
      #print SQL_CMD
      db=MySQLdb.connect(L_Key.Host, L_Key.ID, L_Key.PW)
      cursor = db.cursor()
      cursor.execute(SQL_CMD)
      db.commit()
      db.close()
    try:
      if (note_file_route!=''):
        note_file=open(note_file_route,'r')
        content=note_file.read()
        Log_ADD(
                "Note",
                version+" Upgrade Note:\n"+content.replace("\n"," "),
                "CTRL")
    except:
      Log_ADD(
              "ERROR",
              "<Log_File_Not_Exist>",
              "CTRL")

  if Debug:
    if (version!=prev_version):
      Log_ADD(
                "Debug MSG",
                'Version_Control >> Update Detected : ' + version + ' (Prev)' + prev_version,
                "CTRL")
    else:
      Log_ADD(
                "Debug MSG",
                'Version_Control >> Current_Version : ' + version,
                "CTRL")
  #except:
  #  Log_ADD(
  #    "MSG",
  #    "<Version_Inspection_Failed> Could Not Verify Version",
  #    "CTRL")#id=0001
  #  sys.exit(0)

def Err_Identify(msg_string):
  msg_string=msg_string[msg_string.find('<'):msg_string.find('>')+1]
  if(msg_string.lower()=='<Version_Inspection_Failed>'.lower()): return 1
  if(msg_string.lower()=='<Serial_Connection_Error>'.lower()): return 1
  if(msg_string.lower()=='<Serial_Input_Error>'.lower()): return 2
  if(msg_string.lower()=='<Invalid_Syntax>'.lower()): return 3
  if(msg_string.lower()=='<Database_Initialization_Error>'.lower()): return 1
  if(msg_string.lower()=='<Database_Upload_Error>'.lower()): return 2
  if(msg_string.lower()=='<Configuration_Error>'.lower()): return 3
  return 0

def Type_Identify(msg_string):
  if(msg_string.lower().count('Debug'.lower())>0 or msg_string.lower().count('Fake'.lower())>0): return -1
  if(msg_string.lower()=='ERROR'.lower()): return 0
  if(msg_string.lower()=='CURRENT'.lower()): return 1
  if(msg_string.lower()=='UPDATE'.lower()): return 2
  if(msg_string.lower()=='Note'.lower()): return 3
  if(msg_string.lower()=='INSPECT'.lower()): return 4
  if(msg_string.lower()=='OPERATE'.lower()): return 5
  if(msg_string.lower()=='MSG'.lower()): return 1
  return 0

def Source_Identify(msg_string):
  if(msg_string.lower()=='CTRL'.lower()): return 0
  if(msg_string.lower()=='VERSION'.lower()): return 0
  if(msg_string.lower()=='AIO_Board'.lower()): return 1
  if(msg_string.lower()=='AIO'.lower()): return 2
  if(msg_string.lower()=='Arduino_IO'.lower()): return 2
  if(msg_string.lower()=='WPG'.lower()): return 3
  return 0

def Log_ADD(msg_type,msg_string,msg_source):
  msg_string=msg_string.replace('\n',' ')
  msg_string=msg_string.replace('\r',' ')
  source_ID=Source_Identify(msg_source)
  type_ID=Type_Identify(msg_type)
  error_ID=Err_Identify(msg_string)
  if Show_All_Possible_Error:
    msg_type="$FAKE$ "+msg_type
  if Debug:
    print(msg_source+' >> ' + msg_type + ' >> ' + msg_string)
    msg_type="Debug "+msg_type
  try:
    if(log_file_route!=''): 
      try:
        err_out = open(log_file_route, 'a')
      except:
        err_out = open(log_file_route, 'w')
      err_out.write(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())+' '+msg_type+' '+msg_string+'\n')
      err_out.close()
  except:
    log_file_route=''
    #Do Nothing
  if(log_table!='' or True):
    try:
      #if Debug: print("LOG_Service >> Debug >> Connecting to Database using "+L_Key.Host+' '+L_Key.ID+' '+L_Key.PW+' '+L_Key.DB)
      db=MySQLdb.connect(L_Key.Host, L_Key.ID, L_Key.PW)
      cursor = db.cursor()
      SQL_CMD="use "+L_Key.DB
      cursor.execute(SQL_CMD)
    except:
      return 0
    stamp=0 #To be modified
    INSERT_CMD=( "INSERT INTO "+log_table
               + " (Source_ID, MSG_Source, Type_ID, MSG_Type, ERR_ID, MSG_Index) VALUES("
               + '%d' % source_ID  + ", "
               + "'"  + msg_source + "',"
               + '%d' % type_ID    + ", "
               + "'"  + msg_type   + "',"
               + '%d' % error_ID   + ", "
               + "'"  + msg_string + "' " + ");")
    #print(INSERT_CMD)
    cursor.execute(INSERT_CMD)
    db.commit()
    db.close()
 
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
  if(args.Note!='NA'): note_file_route=args.Path+'/'+args.Note
  L_Key=Log_In_Key(args.host,args.LOG_user,args.LOG_password,args.Database)

  version_control()
  sys.exit(0)