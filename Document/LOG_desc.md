### This Document Defines What Is Expected in the Log Table

#### SQL Log Format

|  ID   |   MSG_Source  | MSG_Source_ID|   MSG_Type   |  MSG_Type_ID |    ERR_ID    |       MSG_Index     |     Stamp    |   Date_Time  |
|:-----:|:-------------:|:------------:|:------------:|:------------:|:------------:|:-------------------:|:------------:|:------------:|
|  int  |    string     |      int     |    string    |      int     |      int     |        string       |      int     |   Date Time  |

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
|    0    |    CTRL   |  *0003   | Regular Inspection Log  |      INSPECT       |
|    0    |    CTRL   |  *0004   | Automatic Respond Taken |      OPERATE       |
|    1    | AIO_Board |   0001   | Message of expections   |        MSG         |
|    2    |    AIO    |   0001   | Message of expections   |        MSG         |
|    3    |    WPG    |   0001   | Message of expections   |        MSG         |

"Message of Exceptions" are those circumstances that occurs randomly, and will not cause fatal errors. In most cases, this type of messages only exist in Debug mode.

#### ERROR List

Note that every part of the system has its unique ID, and all pre-defined errors of a program starts from 0001, we need to know both the Source_ID and the ERR_ID to locate the error. By doing this, we can call a unique function for that part of program, depending on source ID, and the unique function will be doing actual work to handle the error.

|Source_ID|Source|ERR_ID|       Identical String      |       ERROR Define       |          Action          |
|:-------:|:----:|:----:|:---------------------------:|:------------------------ |:------------------------:|
|    0    | VER  | 0001 | <Version_Inspection_Failed> | Could Not Verify Version |        Undefined         |
|    0    | CTRL | 0001 |             NA              |            NA            |        Undefined         |
|    1    | AIO_B| 0001 |<Serial_Connection_Error>    |Serial_Port_Not_Responding(Abort)|        Undefined  |
|    1    | AIO_B| 0002 |<Serial_Input_Error>         |INVALID_Serial_INPUT      |        Undefined         |
|    1    | AIO_B| 0003 |<Invalid_Syntax>             |INVALID_String_Syntax     |        Undefined         |
|    2    | AIO  | 0001 |<Database_Initialization_Error>|Data_Base_Initialization_Failed(Abort)|        Undefined|
|    2    | AIO  | 0002 |<Database_Upload_Error>      |Failed_To_Commit_Command(Abort)|        Undefined    |
|    2    | AIO  | 0003 |<Configuration_Error>        |INVALID_Data_Record(PROCEED)|        Undefined       |
|    2    | AIO  | 0004 |<Configuration_Error>        |INVALID_Data_Tag(PROCEED) |        Undefined         |
|    3    | WPG  | 0001 |             NA              |            NA            |        Undefined         |

Above are all known errors that might occur in the current system.