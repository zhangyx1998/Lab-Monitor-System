#### How to upload .ino file to your Arduino
This document explains the necessary steps to upload your code onto an Arduino board.

* Make sure to have Arduino IDE ready on your computer.
  * Arduino IDE is the software we usually use to write/debug/upload code for Arduino.
  * You can go to [Arduino official download website](https://www.arduino.cc/en/Main/software) and download the IDE corresponding to your operating system.

* Configure your IDE settings to ensure a safe upload.
  * There are mainly three configurations that you may need to change before uplaoding.
  * Before configuring, **Do NOT forget to connect your Arduino board to your computer!**
  * First, the board type. (go to: `Tools >> Board:...`) Usually, the board type is printed on the board. If you are not sure which kind of board you are using, just google it.
  * Then, check the Port. (go to:`Tools >> Port:...`) In most cases, the IDE will automatically configure it for you, and it will even tell you which kind of Arduino Board is currently connected to your computer. But just in case you connected more than one serial device to your computer, or the IDE made some mistakes, you should always check it before hit the upload button.
  * Finally, the ISP (Programmer). (go to:`Tools >> Programmer`) In most cases, just use "AVRISP mkII", which is the default ISP, it works fine.

* Check if you have library "wire.h" installed on your computer.
  * go to: `Sketch >> Include Library` find section "Arduino Libraries".
  * In section "Arduino Libraries", try to find record named "Wire".
  * If you found it, you're all set, skip to the final step.
  * If not, go to: `Sketch >> Include Library >> Manage Libraries`
  * Search for "Wire".
  * Find library named "Wire", click "install"

* Upload
  * If you made any change to the code, you can always hit the round-shaped "Check" button on the top left on the window. This will compile your code and alert you if any errors are found.
  * To upload, hit the second round-shaped button on the top left of the window, which is an arrow. Before doing this, always check the configurations mentioned above!
  * Wish you success!

P.S. what to expect if the upload is successful:
* You will find the last to logs of the console is white-colored and looks like this:
  * `Sketch uses xxxx bytes (xx%) of program storage space. Maximun is xxxxx bytes.`
  * `Global variables use xxxx bytes (xx%) of dynamic memory, leaving xxxx bytes for lical variables. Maximum is xxxx bytes`

#### How to test the board is functioning normally:

* Nevigate to: `Tools >> Serial Monitor` (Or use keyboard shortcut: `Ctrl-Shift-M`)
* Input `<DATA>`, do not forget to press `ENTER`.
* The expected output looks like: `<$H%12.3456$H%65.4321$>`
* Error messages lives in a pair of pond signs, contact me if you saw any.