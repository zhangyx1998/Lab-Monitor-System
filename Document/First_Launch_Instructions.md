### First Launch Instructions

> This document describes what you should prepare for the first launch of the ATLAS Lab Monitor System.
> The document is compatiable for version V4.18 (And further V4.XX version).

`By Yuxuan Zhang`

#### Step 1
Setup The Database

* Install Mariadb (RECOMMENDED) or MySQL
	* Check if the above SQL is already installed by running: `$ mysql --version`
	* You can skip the rest of installation part if you get a message like this: `>>> mysql  Ver 15.1 Distrib 5.5.56-MariaDB, for Linux (x86_64) using readline 5.1`
	* Well, since you are still reading this part, you do not have SQL in your computer. Try '$ sudo yum install mysql' or 'sudo yum install mariadb' if you are using Linux, try '$ brew install mysql' if you are using OSX. Google for MySQL package otherwise.
* Configure SQL root Access
	* If you already have an SQL installed and probably you have already set a password for it.
	* Otherwise, you need superuser authorization to do the following steps.
	* Stop the database service: `$ sudo service mysql stop` (replace 'mysql' with 'mariadb' if necessary)
	* Release the root access for SQL: `mysqld_safe --skip-grant-table &`
	* Now start a new shell window, try to move fast
	* run:
	```
	mysql -u root
	UPDATE user SET Password=PASSWORD('newpassword') where USER='root';
	//create root user and update password
	DELETE FROM user WHERE user='';
	FLUSH PRIVILEGES;
	exit
	```
	* Remember to replace 'newpassword' with your own passcode, do not put in the comments.
	* Now restart the SQL service: `$ service mysql stop` and then: `$ service mysql start`
	* bingo!
* Create Databases and Tables
	* In order to make the mysql service run as expected, we need to setup desired database and datatables for it.
	* The names of the datatables are defined in the configuration file (config.sh) and you can change them if necessary. But the following commands will be using the default names.
	* Login to the database using root account: `mysql -u root -p`
	* run:
	```
	mysql/mariadb>
		create database ATLAS_Main;
	mysql>
		CREATE TABLE ARDUINO_IO (
		TS DOUBLE NOT NULL,
		ECC TINYINT default 0,
		Env_Temp double default 0,
		Env_Humidity double default 0,
		Last_Update DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		PRIMARY KEY (TS)
		);
	mariadb> 
		CREATE TABLE ARDUINO_IO (
		TS DOUBLE NOT NULL,
		ECC INT default 0,
		Env_Temp double default 0,
		Env_Humidity double default 0,
		Last_Update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		PRIMARY KEY (TS)
		);
	mysql/mariadb>
		CREATE TABLE Log (
		ID INT NOT NULL AUTO_INCREMENT,
		MSG_Source VARCHAR(20) default 'Unknown' NOT NULL,
		MSG_Type VARCHAR(20) default 'Unknown' NOT NULL,
		Priority INT default 0 NOT NULL,
		ERR_ID INT default 0 NOT NULL,
		MSG_Index VARCHAR(200),
		Stamp INT default 0 NOT NULL,
		Date_Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		PRIMARY KEY (ID)
		);
	mysql/mariadb>
		INSERT INTO Log (MSG_Source,MSG_Type,Priority,ERR_ID,MSG_Index,Stamp) VALUES('VERSION','Current_Version',0,0,'N/A',0);
	```
* Grant Usage for Programs
	```
	GRANT INSERT,UPDATE ON ATLAS_Main.* TO 'ArduinoIO'@'localhost' IDENTIFIED BY 'pxKr_AIO' WITH GRANT OPTION;
	FLUSH Privileges;
	GRANT SELECT,INSERT,UPDATE,DELETE ON ATLAS_Main.Log TO 'Log_Upd'@'localhost' IDENTIFIED BY 'pxKr_LOG' WITH GRANT OPTION;
	FLUSH Privileges;```

#### Step 2
Check python environment

#### Step 3
Adjust configurations

#### Step 4
Setup crontab missions

#### Step 5
Build a backup (Not available yet)

#### Step 6
Mirror the webpages to your web server