#!/usr/bin/env python
##
## Code By Yuxuan
## 

import MySQLdb
import sys
import time,sys

debug=False
#debug=True

def c2i(buf):
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
	if debug: print("to_num >> "+r_str)
	while r_str.count(' ')>0 :
		r_str=r_str[:r_str.find(' ')]+r_str[r_str.find(' ')+1:]
	if debug: print("to_num >> "+r_str+" DE_Space")
	pow_L=10
	pow_R=0.1
	num=0
	num_R=0
	str_L=r_str
	str_R=''
	if(r_str.count('.')>0):
		str_L=r_str[:r_str.find('.')]
		str_R=r_str[r_str.find('.')+1:]
	if debug: print("to_num >> "+str_L+" LS")
	while(str_L!=''):
		buf=str_L[0]
		str_L=str_L[1:]
		num*=pow_L
		num+=c2i(buf)
	flag=1
	if debug: print("to_num >> "+str_R+" RS")
	while(str_R!=''):
		buf=str_R[0]
		str_R=str_R[1:]
		num_R*=pow_L
		flag*=pow_R
		num_R+=c2i(buf)
	if num_R!=0: num+=num_R*flag
	return num
	
def get_key_secure(show_str):
    import sys
    sys.stdout.write(show_str)
    if sys.platform[:3] == 'win':
        import msvcrt
        def getkey():
            key = msvcrt.getch()
            return key
    elif (sys.platform[:3] == 'lin' or sys.platform[:3] == 'dar'):
        import termios, sys, os
        TERMIOS = termios
     
        def getkey():
            fd = sys.stdin.fileno()
            old = termios.tcgetattr(fd)
            new = termios.tcgetattr(fd)
            new[3] = new[3] & ~TERMIOS.ICANON & ~TERMIOS.ECHO
            new[6][TERMIOS.VMIN] = 1
            new[6][TERMIOS.VTIME] = 0
            termios.tcsetattr(fd, TERMIOS.TCSANOW, new)
            c = None
            try:
                c = os.read(fd, 1)
            finally:
                termios.tcsetattr(fd, TERMIOS.TCSAFLUSH, old)
            return c.decode()
    k=''
    while True:
        buf_char=getkey()
        if (buf_char!='\n' and buf_char!='\r'):
            if (buf_char=='\b'):
                if(len(k)>0): sys.stdout.write('\b')
            else:
                k = k+buf_char
                sys.stdout.write('*')
        else:
            sys.stdout.write('\n')
            break
    return k

#print sys.platform
print("WARNING: You are trying to insert data into a database!")
HOST=raw_input("Host: ")
ID=raw_input("User: ")
PW=get_key_secure("Password: ")
db = MySQLdb.connect(HOST, ID, PW)
cursor=db.cursor()
cursor.execute("use ATLAS_Main;")
#n=cursor.rowcount
print('In Progress')
i=0
target_file = open('result.txt', 'r')
line=target_file.readline()
n=0
flag=1
while(line!=None and flag==1):
	#line=line[:-1]
	if debug:
		org_line=line[:-1]
	TS=to_num(line[:line.find(' ')])
	line=line[line.find(' ')+1:]
	ECC=to_num(line[:line.find(' ')])
	line=line[line.find(' ')+1:]
	Env_Temp=to_num(line[:line.find(' ')])
	line=line[line.find(' ')+1:]
	Env_Humidity=to_num(line[:line.find(' ')])
	SQL_CMD="INSERT INTO ARDUINO_IO (TS,ECC,Env_Temp,Env_Humidity) VALUES(%(TS)d,%(ECC)d,%(Env_Temp).4f,%(Env_Humidity).4f)" % {"TS":TS,"ECC":ECC,"Env_Temp":Env_Temp,"Env_Humidity":Env_Humidity}
	print SQL_CMD
	if TS!=0: cursor.execute(SQL_CMD)
	else: flag=0
	if debug: 
		print("ORG >> "+org_line)
		print("INT >> %d" % TS + " %d" % ECC + " %.4f" % Env_Temp + " %.4f" % Env_Humidity)
	n+=1
	line=target_file.readline()
	#print str_out
	#target_file.write(str_out)
target_file.close()
db.commit()
db.close()
print("Data upload completed, "+"%d" % n+" rows now in file.")