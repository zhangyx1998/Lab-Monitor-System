This Document Defines What Is Expected in the Log Table

#### SQL Log Format
|     Title    |  ID   |  MSG_Source  | MSG_Source_ID|   MSG_Type   |  MSG_Type_ID |   Priority   |    ERR_ID    |       MSG_Index     |     Stamp    |   Date_Time  |
|    Format    |  int  |    string    |      int     |    string    |      int     |      int     |      int     |        string       |      int     |   Date Time  |
|    Example   |   1   |    VERSION   |       0      |    CURRENT   |       1      |       0      |       0      |        V4.17        |       1      | XXXX-XX-XX   |
|    Example   |   2   |    VERSION   |       0      |    UPDATE    |       2      |       0      |       0      | From V4.16 to V4.17 |       1      | XXXX-XX-XX   |
|    Example   |   3   | Arduino_Board|       1      |    ERROR     |       0      |       0      |       0      | From V4.16 to V4.17 |       1      | XXXX-XX-XX   |

#### MSG_Source_ID List
|     Source     |Source String| Source_ID |      Database Authorization     |  Additional Note  |
|:--------------:|:-----------:|:---------:|:-------------------------------:|:-----------------:|
| Control_Service|     CTRL    |     0     |   Log:R/W/A   , Data: ReadONLY  | "DELETE" command will never be wirtten in the code, no access to change the data table, no worry about loss of data |
| Version_Control|   VERSION   |     0     |   Log:ADD_ONLY, Data: NONE      | This part of program is planned to be merged into Control_Service, so it has the same ID as CTRL |
| ARDUINO_IO     |  AIO_Board  |     1     |   Log:ADD_ONLY, Data: ADD_ONLY  ||
| ARDUINO_IO     |     AIO     |     2     |   Log:ADD_ONLY, Data: ADD_ONLY  ||
| Web_Page_Gen   |     WPG     |     3     |   Log:ADD_ONLY, Data: ReadONLY  ||

#### MSG_Type_ID List

Exception: whichever the source is, (TYPE_ID) 0 is ALWAYS defined as error messages.

|Source_ID|Source|MsgType_ID|         TYPE_Def        |    Short String    |
|:-------:|:----:|:--------:|:-----------------------:|:------------------:|
|    0    | CTRL |   0001   | Current Running Version |      CURRENT       |
|    0    | CTRL |   0002   | Version Update Log      |      UPDATE        |

#### ERROR_ID_List

Note that every part of the system has its unique ID, and all pre-defined errors of a program starts from 0001, we need to know both the Source_ID and the ERR_ID to locate the error. By doing this, we can call a unique function for that part of program, depending on source ID, and the unique function will be doing actual work to handle the error.

|Source_ID|Source|ERR_ID|        ERROR_Def        |          Action          |
|:-------:|:----:|:----:|:-----------------------:|:------------------------:|
|    0    | CTRL | 0001 |                         |        Undefined         |