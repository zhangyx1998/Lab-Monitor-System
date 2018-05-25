//This code is compatible to work with Version V1.01 System.
//Author Yuxuan Zhang
//MARCH 2018
#include <Wire.h> 

int debug_flag=0;
byte fetch_humidity_temperature(unsigned int *p_Humidity, unsigned int *p_Temperature);
void print_float(float f, int num_digits);

#define TRUE 1
#define FALSE 0



void setup(void)
{
   Serial.begin(9600);
   Wire.begin();
   pinMode(4, OUTPUT);
   digitalWrite(4, HIGH); // this turns on the HIH3610
   delay(100);
   //Serial.println("zhangyx");
}

/*
 * <DATA> len=4; action=print_H_T_Data;
 * <HELP> len=4; action=show_all_commands;
 * <DEBUG> len=5; action=turn_on/off_debug_mode;
 * <DEBUG_ON> len=8; action=turn_on/off_debug_mode;
 * <DEBUG_OFF> len=9; action=turn_on/off_debug_mode;
 * <ALARM_ON> len=8; action=Turn_ON_Alarm;
 * <ALARM_OFF> len=9; action=Turn_OFF_Alarm;
 * <DEBUG_STATUS> len=12; action=Return_DEBUG_STATUS;
 */

int str_comp(int len, char* str_1, char* str_2)
{
  int i=0,flag=1;
  for(i=0;i<len;i++)
  {
    if(*(str_1+i)!=*(str_2+i)) flag=0;
  }
  return flag;
}

void cmd_interpurate(int C_len, char * C_str)
{
  if(debug_flag)
  {
    Serial.print("#Command received: ");
    for (int i=0;i<C_len;i++)
    {
      Serial.print(*(C_str+i));
    }
    Serial.print("#");
  }
  switch (C_len)
  {
    case 4: if(str_comp(C_len, C_str, "DATA"))
            {
              DATA();
              break;
            }
            if(str_comp(C_len, C_str, "HELP"))
            {
              Serial.print("#<DATA>--H&T_data_request#\n");
              Serial.print("#<HELP>--Show_all_commands#\n");
              Serial.print("#<DEBUG>--Turn_ON/OFF_Debug_mode#\n");
              Serial.print("#<DEBUG_ON>--Turn_ON/OFF_Debug_mode#\n");
              Serial.print("#<DEBUG_OFF>--Turn_ON/OFF_Debug_mode#\n");
              Serial.print("#<DEBUG_STATUS>--Return_DEBUG_STATUS#\n");
              Serial.print("#<ALARM_ON>--Turn_ON_Alarm#\n");
              Serial.print("#<ALARM_OFF>--Turn_OFF_Alarm#\n");
              Serial.print("#EACH COMMAND LIVES IN '<>'#");
              break;
            }
    case 5: if(str_comp(C_len, C_str, "DEBUG"))
            {
              debug_flag=debug_flag==0?1:0;
              Serial.print("#Debug_mode_");
              if(debug_flag) Serial.print("ACTIVE#");
              else Serial.print("NEGATIVE#");
              break;
            }
    case 8: if(str_comp(C_len, C_str, "ALARM_ON"))
            {
              Serial.print("#ALARM_ON ~ALARM_NOT_CURRENTLY_AVAILABLE#");
              break;
            }
            if(str_comp(C_len, C_str, "DEBUG_ON"))
            {
              debug_flag=1;
              Serial.print("#Debug_mode_");
              if(debug_flag) Serial.print("ACTIVE#");
              else Serial.print("NEGATIVE#");
              break;
            }
    case 9: if(str_comp(C_len, C_str, "ALARM_OFF"))
            {
              Serial.print("#ALARM_OFF ~ALARM_NOT_CURRENTLY_AVAILABLE#");
              break;
            }
            if(str_comp(C_len, C_str, "DEBUG_OFF"))
            {
              if(debug_flag==1)Serial.print("#Debug_mode_NEGATIVE#");
              debug_flag=0;
              break;
            }
    case 12:if(str_comp(C_len, C_str, "DEBUG_STATUS"))
            {
              if(debug_flag==1)Serial.print("#Debug_mode_ACTIVE#");
              else Serial.print("#Debug_mode_NEGATIVE#");
              break;
            }
    default: Serial.print("#Invalid command#");
            break;
    
  }
}

void loop(void)
{
   char C_Buffer;
   char CMD_str[100];
   int CMD_len;
   while(1)
   {
      if(debug_flag)
      {
        Serial.print("#In Debug Mode: Ready to receive#");
      }
      while(Serial.available()==0){;}
      delay(100);
      C_Buffer=' ';
      CMD_len=0;
      while(C_Buffer!='<') C_Buffer=Serial.read();
      while(C_Buffer!='>') 
      {
        C_Buffer=Serial.read();
        if(C_Buffer!='>')
        {
          if(C_Buffer>='a' && C_Buffer<='z') C_Buffer+='A'-'a';
          if(C_Buffer!=' ')CMD_str[CMD_len]=C_Buffer;
          CMD_len++;
        }
      }
      cmd_interpurate(CMD_len,CMD_str);
      Serial.println();
   }
}

void DATA()
{
    byte _status;
    unsigned int H_dat, T_dat;
    float RH, T_C;
    _status = fetch_humidity_temperature(&H_dat, &T_dat);
    switch(_status)
    {
        case 0:  //Serial.println("Hum.   Temp.");//Normal.
                 break;
        case 1:  Serial.print("#Stale Data.");
                 break;
        case 2:  Serial.print("#In command mode.");
                 break;
        default: Serial.print("#Diagnostic."); 
                 break; 
    }       
    
    Serial.print("<"); //Data transmission Start
    
    RH = (float) H_dat * 6.10e-3;
    T_C = (float) T_dat * 1.007e-2 - 40.0;
    
    Serial.print("$H%");
    print_float(RH, 4);
    Serial.print("$T%");
    print_float(T_C, 4);
    Serial.print("$>");
    if(_status!=0)Serial.print("#");
}

byte fetch_humidity_temperature(unsigned int *p_H_dat, unsigned int *p_T_dat)
{
      byte address, Hum_H, Hum_L, Temp_H, Temp_L, _status;
      unsigned int H_dat, T_dat;
      address = 0x27;;
      Wire.beginTransmission(address); 
      Wire.endTransmission();
      delay(100);
      
      Wire.requestFrom((int)address, (int) 4);
      Hum_H = Wire.read();
      Hum_L = Wire.read();
      Temp_H = Wire.read();
      Temp_L = Wire.read();
      Wire.endTransmission();
      
      _status = (Hum_H >> 6) & 0x03;
      Hum_H = Hum_H & 0x3f;
      H_dat = (((unsigned int)Hum_H) << 8) | Hum_L;
      T_dat = (((unsigned int)Temp_H) << 8) | Temp_L;
      T_dat = T_dat / 4;
      *p_H_dat = H_dat;
      *p_T_dat = T_dat;
      return(_status);
}
   
void print_float(float f, int num_digits)
{
    int f_int;
    int pows_of_ten[5] = {1, 10, 100, 1000, 10000};
    int multiplier, whole, fract, d, n;

    multiplier = pows_of_ten[num_digits];
    if (f < 0.0)
    {
        f = -f;
        Serial.print("-");
    }
    whole = (int) f;
    fract = (int) (multiplier * (f - (float)whole));

    Serial.print(whole);
    Serial.print(".");

    for (n=num_digits-1; n>=0; n--) // print each digit with no leading zero suppression
    {
         d = fract / pows_of_ten[n];
         Serial.print(d);
         fract = fract % pows_of_ten[n];
    }
}   
