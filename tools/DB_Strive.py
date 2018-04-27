#!/usr/bin/env python
##
## Code By Yuxuan
## 

import MySQLdb
import sys

db = MySQLdb.connect('localhost', 'guest', '')
cursor=db.cursor()
cursor.execute("select * from ATLAS_Main.ARDUINO_IO;")
n=cursor.rowcount
if (n>0):
	print('In Progress')
	i=0
	target_file = open('result.txt', 'w')
	while(n>i):
		i=i+1
		line=cursor.fetchone()
		#print line
		TS=line[0]
		ECC=line[1]
		T=line[2]
		H=line[3]
		str_out=("%d" % TS)+(" %d" % ECC)+(" %.4f" % T)+(" %.4f" % H)+"\n"
		#print str_out
		target_file.write(str_out)
	target_file.close()
db.close()
print("Data strive completed, "+str(n)+" rows now in file.")