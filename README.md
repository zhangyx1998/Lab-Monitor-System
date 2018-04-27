# ALMS - ATLAS Lab Monitor System
###### By Yuxuan Zhang

## Project Description

>This project, generally speaking, is intended for monitoring the experiment environment (specifically:temperature and hunidity in a closed environment), and make the environment data available though internet.
>
>We use an Arduino board with one (or more) HIH-6130 sensor attached on it, to upload data to a linux PC. The arduino source code Arduino_IO_board.ino and the python source code Arduino_IO_Build.py are available in this folder.
>
>To run the project, you need MySQL/Mariadb ready on your computer, and setup a database named "ATLAS_Main". Also, refer to SQL_Desc.txt for detailed command on how to setup specific tables, and how to GRANT usage to the python code.
>
>Finally, to make everything run automatically, insert the path of launch.sh to the crontab in Linux system using following commands:
>```
>crontab -e #You will see the vi interface after pressing "Enter"
>press key "i"
>insert:"* * * * * [path]/launch.sh"
>press "esc"
>put in ":wq", "Enter"
>```
>All Done!

Notice: all source codes should be arranged exactly the same as what it was if you want to launch it normally. And if you use different serial port for arduino, or you make a different MySQL configuration, please change the settings at config.sh

***

## Upgrade Notes

#### V4.11

+ Performance Enhancement
+ Stability Improvement

***

#### V4.10

+ Webpage Restructure. Data Blocks Added to the page.

***

#### V4.09

+ Appearence Improvement.

***

#### V4.08

+ Font Face Unite.

***

#### V4.07

+ Appearence Improvement.

***

#### V4.06

+ Appearance Improvement (Half-shown lines are now half-transparent)

***

#### V4.05

+ Fixed Font Size Problems in Linux System.(HTML page)

***

#### V4.04

+ Minor Bug Fix
+ Add API "Onfocus" to ZChart: `chartobject.onfocus=function(onfocus_timestamp,this_object){;}`
+ Using API "Onfocus" to highlight the lines selected. (UX Improvement)

***

#### V4.03

+ Minor Bug Fix
+ You can now highlight a specific line by floating your mouse on its corresponding button. (ZChart Feature Upgrade using ZButton API)

***

#### V4.02

+ Logic problem emergency fix.

***

#### V4.01

+ Color Composition Adjustment. UX design upgrade.

***

#### V4.00

+ Modulize of the webpage has been completed, and the performance of the webpage has been dramatically improved thanks to "Step-by-step" loading strategy. Code reusability has also been grately improved.

***

#### V3.02

+ ZButton.js is now ready! This is a plugin that can insert buttons easily into canvas objects, and have intractive API to communicate with.

+ By using ZButton.js, we can now easily create clickable banners and control the display of every single data set.

***

#### V3.01

+ Minor bug fix and performance improvement.

***

#### V3.00

+ All raw html files are renamed to .html.zsc.

***

#### V2.01

+ Version_Control(VER) is separated from Arduino_IO(AIO). Version_Control Service will automatically add log to LOG table should any upgrade be detected.

***

#### V2.00

+ The WebPage is now ready to use. The data from ARDUINO will be automatically refreshed every 1 minute. And the demo website is now online, available at "yuxuanzhang.net". We use ssh to mirror the contents of the website so that the server syncs everything on the target folder of the lab computer.

***

#### V1.01

+ Bug fix.
>	Timestamp string interpuration error. E.g. timestamp starting with "08" was mistakenly interpurated as Octal.
+ Log system is now made online.
```
Desc:
Table Name: "Log"
Cols: MSG_Source | MSG_Type | Priority | ERR_ID  | MSG_Index | Stamp   | Date_Time
Type: String     | String   | Integer  | Integer | String    | integer | Auto_Update_DateTime
Description:
	MSG_Source could be:
		Default "Unknown"
		ARDUINO_Board
		ARDUINO_IO
		Control_Service
		Web_Server Browser
		Version
		E.T.C.
	MSG_Type includes:
		Default "Unknown"
		Current_Version
		Version_Update
		Operation_Log
		Error_Log
		Env_Warning
			Msg
	Priority:
		0 -- Commom messages
		1 -- Automatic interpuration needed (This problem might can be solved by the system itself)
		2 -- Mannual interpuration needed (This problem cannot be automatically handeled)
		3 -- IMMEDIATE Mannual interpuation needed (E.g. Tempurature is too high/Serial not responding)
	ERR_ID:
		Default "0"
		Each known Error have an unique ID. See the chart below for detailed list. The ID is for the control service to try to take corresponding actions to correct it.
		If the message is not an error, its ID will be "0"
	Stamp:
		Default "0"
		If the message contains an error or a command from web server that needs to be taken care of, the value will be "1" until it is taken care of by control service or manually. (The control service can therefore search for logs whose stamp is 1, and take action on it, and finally change it back to 0)
	Date_Time:
		Auto_Update, intended for manual check.
	mysql> desc Log;
		+------------+--------------+------+-----+-------------------+-----------------------------+
		| Field      | Type         | Null | Key | Default           | Extra                       |
		+------------+--------------+------+-----+-------------------+-----------------------------+
		| MSG_Source | varchar(20)  | NO   |     | Unknown           |                             |
		| MSG_Type   | varchar(20)  | NO   |     | Unknown           |                             |
		| Priority   | int(11)      | NO   |     | 0                 |                             |
		| ERR_ID     | int(11)      | NO   |     | 0                 |                             |
		| MSG_Index  | varchar(200) | YES  |     | NULL              |                             |
		| Stamp      | int(11)      | NO   |     | 0                 |                             |
		| Date_Time  | timestamp    | NO   | PRI | CURRENT_TIMESTAMP | on update CURRENT_TIMESTAMP |
		+------------+--------------+------+-----+-------------------+-----------------------------+
	To_Be_ADDED:
		timestamp
		source L/R
		path
```
+ Version Control is now available:
>	By introducing this feature, we do not need to delete the old version everytime we upgrade it. Source code of all versions are stored in the folder, and if we want to roll back, we need only to change the key hardcoded in config.sh. Upon the first running of a new version, a log will be automatically inserted to the log table, so we can keep track on version changes.
>	List_of_errors:
>	1 Unspecified Errors

***
