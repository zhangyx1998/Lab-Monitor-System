### This Document Defines What Is Expected in the Log Table

#### SQL Log Format (New)

|  ID   |  Time_Stamp  |   Source_ID  |    Type_ID   |    ERR_ID    |       MSG_Index     |     Stamp    |   Date_Time  |
|:-----:|:------------:|:------------:|:------------:|:------------:|:-------------------:|:------------:|:------------:|
|  int  |      int     |      int     |      int     |      int     |        string       |      int     |   Date Time  |

#### MSG Source List

|     Source     |Source String| Source_ID |      Database Authorization     |  Additional Note  |
|:--------------:|:-----------:|:---------:|:-------------------------------:|:-----------------:|
| Control_Service|     CTRL    |     0     |   Log:R/W/A   , Data:ReadONLY   | "DELETE" command will never be wirtten in the code, no access to change the data table, no worry about loss of data |
| Version_Control|   VERSION   |     0     |   Log:ADD_ONLY, Data:NONE       | This part of program is planned to be merged into Control_Service, so it has the same ID as CTRL |
| ARDUINO_IO     |  AIO_Board  |     1     |   Log:ADD_ONLY, Data:ADD_ONLY   ||
| ARDUINO_IO     |     AIO     |     2     |   Log:ADD_ONLY, Data:ADD_ONLY   ||
| Web_Page_Gen   |     WPG     |     3     |   Log:ADD_ONLY, Data:ReadONLY   ||

#### MSG Type List

Exception: whichever the source is, (TYPE_ID) **0** is ALWAYS defined as error messages. When and only when MSG_Type_ID=0, ERR_ID is non-zero.
In case ERR_ID=0 and MSG_Type_ID!=0, ERR_ID will be negelected, unless otherwise defined (But using ERR_ID to do other things is not recommended).

|Source_ID|   Source  |MsgType_ID|         TYPE_Def        |    Short String    |
|:-------:|:---------:|:--------:|:-----------------------:|:------------------:|
|    0    |  VERSION  |   0001   | Current Running Version |      CURRENT       |
|    0    |  VERSION  |   0002   | Version Update Log      |      UPDATE        |
|    0    |  VERSION  |   0003   | Version Update Note     |      Note          |
|    0    |    CTRL   |  *0004   | Regular Inspection Log  |      INSPECT       |
|    0    |    CTRL   |  *0005   | Automatic Respond Taken |      OPERATE       |
|    1    | AIO_Board |   0001   | Message of expections   |        MSG         |
|    2    |    AIO    |   0001   | Message of expections   |        MSG         |
|    3    |    WPG    |   0001   | Message of expections   |        MSG         |

"Message of Exceptions" are those circumstances that occurs randomly, and will not cause fatal errors. In most cases, this type of messages only exist in Debug mode.

#### ERROR List

Note that every part of the system has its unique ID, and all pre-defined errors of a program starts from 0001, we need to know both the Source_ID and the ERR_ID to locate the error. By doing this, we can call a unique function for that part of program, depending on source ID, and the unique function will be doing actual work to handle the error.

|Source_ID|Source|ERR_ID|       Identical String      |       ERROR Define       |          Action          |
|:-------:|:----:|:----:|:---------------------------:|:------------------------ |:------------------------:|
|    0    | CTRL | 0001 |<Version_Inspection_Failed>  | Could Not Verify Version |        Undefined         |
|    1    | AIO_B| 0001 |<Serial_Connection_Error>    |Serial_Port_Not_Responding(Abort)|        Undefined  |
|    1    | AIO_B| 0002 |<Serial_Input_Error>         |INVALID_Serial_INPUT      |        Undefined         |
|    1    | AIO_B| 0003 |<Invalid_Syntax>             |INVALID_String_Syntax     |        Undefined         |
|    2    | AIO  | 0001 |<Database_Initialization_Error>|Data_Base_Initialization_Failed(Abort)|        Undefined|
|    2    | AIO  | 0002 |<Database_Upload_Error>      |Failed_To_Commit_Command(Abort)|        Undefined    |
|    2    | AIO  | 0003 |<Configuration_Error>        |INVALID_Data_Record(PROCEED)|        Undefined       |
|    2    | AIO  | 0004 |<Configuration_Error>        |INVALID_Data_Tag(PROCEED) |        Undefined         |
|    3    | WPG  | 0001 |             NA              |            NA            |        Undefined         |

Above are all known errors that might occur in the current system.

#### Version Update Command

ALTER TABLE ATLAS_Main.Log ADD TS INT DEFAULT 0 AFTER ID;

ALTER TABLE ATLAS_Main.Log ADD Source_ID INT AFTER TS;

ALTER TABLE ATLAS_Main.Log ADD Type_ID INT AFTER Source_ID;

UPDATE ATLAS_Main.Log SET Source_ID=0 WHERE MSG_Source="CTRL";

UPDATE ATLAS_Main.Log SET Source_ID=0 WHERE MSG_Source="VERSION";

UPDATE ATLAS_Main.Log SET Source_ID=1 WHERE MSG_Source="Arduino_Board";

UPDATE ATLAS_Main.Log SET Source_ID=2 WHERE MSG_Source="Arduino_IO";

UPDATE ATLAS_Main.Log SET Type_ID=0 WHERE MSG_Type="ERROR";

UPDATE ATLAS_Main.Log SET Type_ID=1 WHERE Source_ID=0 AND MSG_Type="CURRENT";

UPDATE ATLAS_Main.Log SET Type_ID=2 WHERE Source_ID=0 AND MSG_Type="UPDATE";

UPDATE ATLAS_Main.Log SET Type_ID=3 WHERE Source_ID=0 AND MSG_Type="Note";

UPDATE ATLAS_Main.Log SET Type_ID=1 WHERE Source_ID=1 AND MSG_Type="MSG";

UPDATE ATLAS_Main.Log SET Type_ID=1 WHERE Source_ID=2 AND MSG_Type="MSG";

UPDATE ATLAS_Main.Log SET ERR_ID=1 WHERE Type_ID=0 AND MSG_Index LIKE "%<Version_Inspection_Failed>%";

UPDATE ATLAS_Main.Log SET ERR_ID=1 WHERE Type_ID=0 AND MSG_Index LIKE "%<Serial_Connection_Error>%";

UPDATE ATLAS_Main.Log SET ERR_ID=2 WHERE Type_ID=0 AND MSG_Index LIKE "%<Serial_Input_Error>%";

UPDATE ATLAS_Main.Log SET ERR_ID=3 WHERE Type_ID=0 AND MSG_Index LIKE "%<Invalid_Syntax>%";

UPDATE ATLAS_Main.Log SET ERR_ID=1 WHERE Type_ID=0 AND MSG_Index LIKE "%<Database_Initialization_Error>%";

UPDATE ATLAS_Main.Log SET ERR_ID=2 WHERE Type_ID=0 AND MSG_Index LIKE "%<Database_Upload_Error>%";

UPDATE ATLAS_Main.Log SET ERR_ID=3 WHERE Type_ID=0 AND MSG_Index LIKE "%<Configuration_Error>%";

UPDATE ATLAS_Main.Log SET ERR_ID=4 WHERE Type_ID=0 AND MSG_Index LIKE "%<Configuration_Error>%";

**After Transformation**

ALTER TABLE ATLAS_Main.Log DROP COLUMN MSG_Source;

ALTER TABLE ATLAS_Main.Log DROP COLUMN MSG_Type;

ALTER TABLE ATLAS_Main.Log DROP COLUMN Priority;
