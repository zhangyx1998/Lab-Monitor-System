import sys
import time
import argparse
import MySQLdb
import random
from datetime import datetime
Debug=False
Display_Detail=False
DefaultTable=''
Err_exit_str="![In_Web_Page_Generator_Err_exit_request]!"
#Input Expect: $T@Env_Temp$H@Env_Humidity$
#CMD Expect: #*<table$ARDIONO_IO>TS$00101001*# (Specific Values)
#CMD Expect: #*!intv$60*##*<table$ARDIONO_IO>TS$0*# (General Values, repeating at an interval of 60)
#CMD EXPECT: #*!LineMerge$1*##*!LineMerge$0*# (Merge Line And Process Them Together, new pre_set_values in the same set will overwrite the old ones)
class DB_Key:
	def __init__(self, host='', ID='', PW='', DB=''):
		self.host=host
		self.ID=ID
		if PW=='#NA': PW=''
		self.PW=PW
		self.DB=DB
Login_key=DB_Key()

class DB_Struct:
	def __init__(self,name='',InputExpect=''):
		self.tableName=name
		self.col_Count=0 		#COL
		self.line_Count=0 		#Lines of raw data
		self.col_NAME=[] 		#Database Col Name
		self.col_TAG_NAME=[] 	#RAW Webpage Tag Name
		self.col_TYPE=[] 		#Datatype (d:int f:float n:notspecified)
		self.RAW=[]		 		#Data from Database will be stored here

		while InputExpect.count('$')>1:
			InputExpect=InputExpect[InputExpect.find('$')+1:]
			Buf_WP=InputExpect[:InputExpect.find('@')]
			if(Buf_WP.count('/')>0):
				Buf_TP=Buf_WP[Buf_WP.find('/')+1:]
				Buf_WP=Buf_WP[:Buf_WP.find('/')]
			else: Buf_TP='n'
			InputExpect=InputExpect[InputExpect.find('@')+1:]
			Buf_DB=InputExpect[:InputExpect.find('$')]
			Buf_TH='NA'
			if(Buf_DB.count('%')>0):
				Buf_TH=Buf_DB[Buf_DB.find('%')+1:]
				Buf_DB=Buf_DB[:Buf_DB.find('%')]
			InputExpect=InputExpect[InputExpect.find('$'):]

			self.col_NAME.append(Buf_DB)
			self.col_TAG_NAME.append(Buf_WP)
			self.col_TYPE.append(Buf_TP)
			self.col_Count+=1

		if self.col_Count>0:
			db=MySQLdb.connect(Login_key.host,Login_key.ID,Login_key.PW)
			cursor=db.cursor()
			cursor.execute("use "+Login_key.DB)
			SQL_CMD="SELECT "
			n=0
			while n<self.col_Count:
				SQL_CMD+=self.col_NAME[n]
				SQL_CMD+=','
				n+=1
			SQL_CMD=SQL_CMD[:-1]
			SQL_CMD+=' FROM '
			SQL_CMD+=self.tableName
			SQL_CMD+=' ORDER BY '+self.col_NAME[0]+' DESC;'
			if (Debug and Display_Detail): print "------  "+SQL_CMD
			cursor.execute(SQL_CMD)
			n=0
			for row in cursor:
				self.RAW.append(row)
				if (Debug and False): print RAW[n]
				n+=1
			self.line_Count=n
			db.close()
		if (Debug and Display_Detail):
			print '------  On create table profile: '+self.tableName+' %d columns' % self.col_Count + ' %d rows' % self.line_Count
			print self.col_NAME
			print self.col_TAG_NAME
			print self.col_TYPE

	def identify(self,tag):
		if (Debug and Display_Detail): print self.tableName+" identify >> "+tag
		flag=0
		while flag<self.col_Count:
			if self.col_TAG_NAME[flag]==tag:
				return flag
			flag+=1
		return -1

	def cvt(t_str):
		t_str=t_str.replace('<','&lt')
		t_str=t_str.replace('>','&gt')
		t_str=t_str.replace('&','&amp')
		t_str=t_str.replace('"','&quot')
		t_str=t_str.replace("'",'&apos')
		#while t_str.count('<br><br>')>0 : t_str.replace('<br><br>','<br>')
		return t_str

	def intp(self,CMD,index):
	#Below are TAG with argument index
		if CMD.count('$')==1:
			#print "intp in "+self.tableName+" index = %d"%index
			Value_ID=self.identify(CMD[:CMD.find('$')])
			if (CMD[CMD.find('$')+1:].count('-')==0):
				Line_ID=to_num(CMD[CMD.find('$')+1:])+index
			else:
				Line_ID=self.line_Count+to_num(CMD[CMD.find('$')+1:])-index-1

			if (Debug and Display_Detail):
				print "------  ------  In Final Intp: "+self.tableName+" %d "%Value_ID+"%d"%Line_ID
				if Value_ID==-1: print '------  "Error Invaild_Argument: '+CMD[:CMD.find('$')]+'"'
				else: 
					if Line_ID>=self.line_Count: print '------  "Error Time Exceed Maximum: '+"%d"%Line_ID+'"'
					else:
						if self.col_TYPE[Value_ID]=='n': print '------  ------'+str(self.RAW[Line_ID][Value_ID])
						if self.col_TYPE[Value_ID]=='d': print '------  ------'+"%d" % self.RAW[Line_ID][Value_ID]
						if self.col_TYPE[Value_ID]=='f': print '------  ------'+"%.f" % self.RAW[Line_ID][Value_ID]
						if self.col_TYPE[Value_ID]=='1f': print '------  ------'+"%.1f" % self.RAW[Line_ID][Value_ID]
						if self.col_TYPE[Value_ID]=='2f': print '------  ------'+"%.2f" % self.RAW[Line_ID][Value_ID]
						if self.col_TYPE[Value_ID]=='3f': print '------  ------'+"%.3f" % self.RAW[Line_ID][Value_ID]
						if self.col_TYPE[Value_ID]=='4f': print '------  ------'+"%.4f" % self.RAW[Line_ID][Value_ID]
						if self.col_TYPE[Value_ID]=='dt': print '------  ------'+unicode(self.RAW[Line_ID][Value_ID])
						if self.col_TYPE[Value_ID]=='str': print '------  ------'+'"'+unicode(self.RAW[Line_ID][Value_ID])+'"'
						if self.col_TYPE[Value_ID]=='cvt': print '------  ------'+self.RAW[Line_ID][Value_ID]
						if self.col_TYPE[Value_ID]=='fake_ts': print "%d" % ((self.RAW[Line_ID][Value_ID]) if(self.RAW[Line_ID][Value_ID]>1523600000000) else (self.RAW[Line_ID][Value_ID]+350880224-60000))


			if Value_ID==-1: return Err_exit_str+'"Error Invaild_Argument: '+CMD[:CMD.find('$')]+'"'
			if Line_ID>=self.line_Count: return Err_exit_str+'"Error Time Exceed Maximum: '+"%d"%Line_ID+'"'
			if Line_ID<0: return Err_exit_str
			if self.col_TYPE[Value_ID]=='n': return str(self.RAW[Line_ID][Value_ID])
			if self.col_TYPE[Value_ID]=='d': return "%d" % self.RAW[Line_ID][Value_ID]
			if self.col_TYPE[Value_ID]=='f': return "%.f" % self.RAW[Line_ID][Value_ID]
			if self.col_TYPE[Value_ID]=='1f': return "%.1f" % self.RAW[Line_ID][Value_ID]
			if self.col_TYPE[Value_ID]=='2f': return "%.2f" % self.RAW[Line_ID][Value_ID]
			if self.col_TYPE[Value_ID]=='3f': return "%.3f" % self.RAW[Line_ID][Value_ID]
			if self.col_TYPE[Value_ID]=='4f': return "%.4f" % self.RAW[Line_ID][Value_ID]
			if self.col_TYPE[Value_ID]=='dt': return unicode(self.RAW[Line_ID][Value_ID])
			if self.col_TYPE[Value_ID]=='str': return '"'+unicode(self.RAW[Line_ID][Value_ID])+'"'
			if self.col_TYPE[Value_ID]=='cvt':
				t_str=self.RAW[Line_ID][Value_ID]
				t_str=t_str.replace('&','&amp;')
				t_str=t_str.replace('<','&lt;')
				t_str=t_str.replace('>>','&ggt;')
				t_str=t_str.replace('>','&gt;')
				t_str=t_str.replace('&gt;','&gt;<br>')
				t_str=t_str.replace('&ggt;','&gt;&gt;')
				t_str=t_str.replace('"','&quot;')
				t_str=t_str.replace("'",'&apos;')
				t_str=t_str.replace('#','<br>')
				if(t_str[len(t_str)-3:]=='<br>'):t_str=t_str[len(t_str)-3:]
				while (t_str.count('<br><br>')>0) : t_str=t_str.replace('<br><br>','<br>')
				t_str=t_str.replace('$FAKE$ ','')
				return t_str
			if self.col_TYPE[Value_ID]=='fake_ts': 
				return "%d" % ((self.RAW[Line_ID][Value_ID]) if(self.RAW[Line_ID][Value_ID]>1523600000000) else (self.RAW[Line_ID][Value_ID]+350880224-60000))
		if (Debug and Display_Detail):
			print "------  ------ ERROR In Final Intp: "+self.tableName		
		return Err_exit_str+'Unkonwn Error'

Data=[]
Table_Count=0

def c2i(buf):
	"""
	This function converts character digits to real number
	"""
	if (buf=='1'): return 1
	if (buf=='2'): return 2
	if (buf=='3'): return 3
	if (buf=='4'): return 4
	if (buf=='5'): return 5
	if (buf=='6'): return 6
	if (buf=='7'): return 7
	if (buf=='8'): return 8
	if (buf=='9'): return 9
	return 0

def to_num(r_str):
	"""
	This function converts string to integer
	"""
	int_flag=1;
	if (Debug and Display_Detail): print("------  To_num >> "+r_str)
	while r_str.count(' ')>0 :
		r_str=r_str[:r_str.find(' ')]+r_str[r_str.find(' ')+1:]
	pow_L=10
	pow_R=0.1
	num=0
	num_R=0
	str_L=r_str
	str_R=''
	if(r_str.count('.')>0):
		int_flag=0
		str_L=r_str[:r_str.find('.')]
		str_R=r_str[r_str.find('.')+1:]
	while(str_L!=''):
		buf=str_L[0]
		str_L=str_L[1:]
		num*=pow_L
		num+=c2i(buf)
	flag=1
	while(str_R!=''):
		buf=str_R[0]
		str_R=str_R[1:]
		num_R*=pow_L
		flag*=pow_R
		num_R+=c2i(buf)
	if int_flag==0: num+=num_R*flag
	else: num=int(num)
	return num

def identify_table(table_tag):
	"""
	This function will find corresponding table in the registeration table,
	and return its flag(int)
	"""
	flag=0
	while flag<Table_Count:
		if Data[flag].tableName==table_tag:
			return flag
		flag+=1
	return -1

def intp(CMD,index,row_count):
	"""
	This function will break down the Command(CMD), and execute them one by another
	"""
	#print "intp in root index = %d"%index
	if (Debug and Display_Detail): print "------  INTP >> "+CMD+" INTV %06d" % index
	if CMD=='CURRENT_TIMESTAMP':
		return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
	if CMD=='General_Status':
		if (Debug and Display_Detail): return "DEBUG"
		return "NORMAL"
	if CMD=='row_count':
		return str(row_count)
	if CMD.count('RANDOM$')>0:
		amp=to_num(CMD[CMD.find('$')+1:])
		return ("%.4f"%(amp*(random.random()-0.5)))
	CMD_table=DefaultTable
	if(CMD.count("<table$")==1):
		Buf_str=CMD[:CMD.find('<table$')]
		CMD=CMD[CMD.find('<table$')+7:]
		CMD_table=CMD[:CMD.find('>')]
		CMD=Buf_str+CMD[CMD.find('>')+1:]
	Table_ID=identify_table(CMD_table)
	if (Debug and Display_Detail): print "------  Identify >> "+CMD_table+" TaleID %d"%Table_ID
	if (Debug and Display_Detail): print "------  de_Table >>"+CMD + " INTV %06d" % index
	if (Debug and Display_Detail):
		print "------  using table: "+CMD_table
		print "------  Table_ID=%d" % Table_ID
	#Above are special commands
	if Table_ID>=0: return Data[Table_ID].intp(CMD,index)
	else: return Err_exit_str+'Error No Such Table: '+ CMD_table

def generate(InputTableExpect,file_stream,Path):
	"""
	This is the main function.
	This function eats in a list of files awaiting translation,
		along with a list of tables where data come from.
	And it spits out a bunch of file that contains desired inforamtion.
	"""
	global Table_Count
	global Data
	while (InputTableExpect.count('<')>0 and InputTableExpect.count('>')>0):
		InputExpect=InputTableExpect[InputTableExpect.find('<')+1:InputTableExpect.find('>')]
		InputTableExpect=InputTableExpect[InputTableExpect.find('>')+1:]
		if (Debug and Display_Detail): print InputExpect[:InputExpect.find('$')]
		if (Debug and Display_Detail): print InputExpect[InputExpect.find('$'):]
		new_table= DB_Struct(InputExpect[:InputExpect.find('$')],InputExpect[InputExpect.find('$'):])
		Data.append(new_table)
		Table_Count+=1
	if (Debug and Display_Detail):
		print "Import succeed, %d tables included" % Table_Count
		#sys.exit(0)
	#Interpretation of InputExpect Completed
	#All needed data now stored in "Data[]"

	while file_stream.count('$')>1:
		File_Open_Flag=1
		target_file=file_stream[file_stream.find('$')+1:file_stream.find('@')]
		file_stream=file_stream[file_stream.find('@'):]
		raw_file=file_stream[file_stream.find('@')+1:file_stream.find('$')]
		file_stream=file_stream[file_stream.find('$'):]
		try:
			RAW_File=open(Path+raw_file,'r')
		except:
			print "Unable to find file: "+raw_file
			File_Open_Flag=0
		try:
			TARGET_File=open(Path+target_file,'w')
		except:
			print "Unable to write file: "+Path+target_file
			File_Open_Flag=0
		if (File_Open_Flag==1):
			eof_flag=0
			while True:
				intv=0
				max_index=0
				max_rows=0
				LineMerge=0
				line=RAW_File.readline()
				if (line==None or line==''):
					break
				else:
					if Debug: print "%06d| "%eof_flag+line.replace('\n','')
					while line.count('#*!')>0:
						buf=line[:line.find('#*!')]
						line=line[line.find('#*!'):]
						tag=line[line.find('#*!')+3:line.find('$')]
						val=to_num(line[line.find('$')+1:line.find('*#')])
						line=buf+line[line.find('*#')+2:]
						if tag=='intv': intv=val
						if tag=='max_index': max_index=val
						if tag=='max_rows': max_rows=val
						if tag=='LineMerge': LineMerge=val
					while (LineMerge!=0):
						New_Line=RAW_File.readline()
						Line_spacer=''
						if (New_Line=='') : LineMerge=0
						else:
							while New_Line.count('#*!')>0:
									buf=New_Line[:New_Line.find('#*!')]
									New_Line=New_Line[New_Line.find('#*!'):]
									tag=New_Line[New_Line.find('#*!')+3:New_Line.find('$')]
									val=to_num(New_Line[New_Line.find('$')+1:New_Line.find('*#')])
									New_Line=buf+New_Line[New_Line.find('*#')+2:]
									if tag=='intv': intv=val
									if tag=='max_index': max_index=val
									if tag=='max_rows': max_rows=val
									if tag=='LineMerge': LineMerge=val
							line=line+Line_spacer+New_Line
					flag=True
					index=0
					row_count=0
					first_row=eof_flag+1
					while (flag):
						falg=True
						line_buf=line
						while(line.count('#*')>0 and line.count('*#')>0):
							replace_str=intp(line[line.find('#*')+2:line.find("*#")],index,row_count)
							if replace_str.count(Err_exit_str)>0: flag=False
							line=line[:line.find('#*')]+replace_str+line[line.find('*#')+2:]
						#print "ROOT index = %d" % index +" intv = %d" % intv + " lines = %d" % eof_flag
						index+=intv
						row_count+=1
						if(max_index>0 and index>max_index): flag=False
						if(max_rows>0 and row_count>max_rows): flag=False
						if flag:
							TARGET_File.write(line)
							eof_flag+=1
							if(Debug and (eof_flag>first_row)):
								print "%06d|*"%eof_flag+line.replace('\n','')
							line=line_buf
						if intv==0: flag=False
						if eof_flag>1000000: sys.exit(0)
			RAW_File.close()
			TARGET_File.close()
			#print "Interpuation Succeeded, %d lines proccessed" % eof_flag + " " + raw_file + " " +target_file

if __name__ == '__main__':
    
	parser = argparse.ArgumentParser(description='Read serial data and record temperature data.', usage='%(prog)s [options]', formatter_class=argparse.ArgumentDefaultsHelpFormatter)
	parser.add_argument('--timestamp',      type=float,           default=0,      help='timestamp')
	parser.add_argument('--Path',           default='',  help='Current File System Path')
	parser.add_argument('--host',           default='localhost',  help='Database Host')  
	parser.add_argument('--user',           default='guest', help='Database username')
	parser.add_argument('--password',       default='',   help='Database password')
	parser.add_argument('--Database',       default='ATLAS_Main', help='Name of Database')
	parser.add_argument('--DefaultTable',       default='ARDUINO_IO', help='')
	parser.add_argument('--InputTableExpect',    default='<ARDUINO_IO$TS/d@TS$ECC/d@ECC$ET/4f@Env_Temp$EH/4f@Env_Humidity$ET_D/4f@Env_Temp$EH_D/4f@Env_Humidity$DT/dt@Last_Update$DT_Str/str@Last_Update$><Log$ID/d@ID$MSG_Source@MSG_Source$MSG_Type/cvt@MSG_Type$Priority@Priority$ERR_ID@ERR_ID$MSG_Index/cvt@MSG_Index$Stamp@Stamp$Date_Time@Date_Time$>',help='See Readme')
	parser.add_argument('--file_stream',    default='$index.html@Raw_HTML/index.html.zsc$data.js@Raw_HTML/data.js.zsc$',help='I/O File name')
	parser.add_argument('--Debug',          default=False,        action='store_true', help='Do not print to screen.')
	args = parser.parse_args(sys.argv[1:])
	DefaultTable=args.DefaultTable
	Debug=args.Debug
	Debug=False;
	Login_key=DB_Key(args.host,args.user,args.password,args.Database)
	generate(args.InputTableExpect,args.file_stream,args.Path)
	sys.exit(0)