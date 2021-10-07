const int BUFFER_SIZE = 50;
byte buf[BUFFER_SIZE];
byte tail = 0xD;
byte header3 = 0x23;
byte header2 = 0xFF;
int rlen;
String data_serial;

int data1=0;
int data2=100;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600); // opens serial port, sets data rate to 9600 bps
}

void soal1(){
  Serial.println("Soal 1: ");
  Serial.print("Counter1 = ");
  Serial.println(buf[0], BIN);
  Serial.print("Counter2 = ");
  Serial.println(buf[1], BIN);
  Serial.print("Counter3 = ");
  Serial.println(buf[2], BIN);
  Serial.print("Tail = ");
  Serial.println(buf[3], BIN);
}

void soal2(){
  Serial.println("Soal 2: ");
  Serial.print("Header = ");
  Serial.println(buf[0], BIN);
  Serial.print("Counter1 = ");
  Serial.println(buf[1], BIN);
  Serial.print("Counter2 = ");
  Serial.println(buf[2], BIN);
  Serial.print("Counter3 = ");  
  Serial.println(buf[3], BIN);  
}

void soal3(){
  Serial.println("Soal 3: ");
  char data[3];
  int i=0;
  int i2=1;  
  Serial.print("Byte 1 = ");
  Serial.println((char)buf[0]);
  for (int i = 0; i < 3; i++) {
    data[i] = (char)buf[i2];
    i2++;
  }
  Serial.print("Byte 2-4 = ");
  Serial.println(data);
  for (int i = 0; i < 3; i++) {
    data[i] = (char)buf[i2];
    i2++;
  }
  Serial.print("Byte 5-7 = ");
  Serial.println(data);  
  for (int i = 0; i < 3; i++) {
    data[i] = (char)buf[i2];
    i2++;
  }
  Serial.print("Byte 8-10 = ");
  Serial.println(data);    
}

void soal4(){
  Serial.println("Soal 4: ");
  String data;
  int loc1;
  int loc2;
  int loc3;
  int loc4;
  for (int i = 0; i < rlen; i++) {
    data += (char)buf[i];
  }
  loc1 = data.indexOf(','); //finds location of first ,
  Serial.print("Counter1 = ");
  Serial.println(data.substring(0, loc1)); //captures first data String
  loc2 = data.indexOf(',', loc1+1 ); //finds location of second ,
  Serial.print("Counter2 = ");
  Serial.println(data.substring(loc1+1, loc2)); //captures second data String
  Serial.print("Counter3 = ");
  Serial.println(data.substring(loc2+1, data.length()-1)); //captures third data String
  Serial.print("Tail = ");
  Serial.println(buf[rlen-1]);  
}

void soal5(){
  data_serial = String((char*)buf);
  if(data1 == 100) data1=0;
  if(data2 == 200) data2=100;
  if(data_serial == "Data1?")
  {
    Serial.print("Data1 = ");
    Serial.println(data1);
    data1++;
  }
  if(data_serial == "Data2?")
  {
    Serial.print("Data2 = ");
    Serial.println(data2);
    data2++;
  }
}

void loop() {
  // put your main code here, to run repeatedly:
  
  
  if (Serial.available() > 0) {
    rlen = Serial.readBytes(buf, BUFFER_SIZE);
    if (buf[3] == tail) {
      soal1();    
    } else if (buf[0] == header2) {
      soal2();
    } else if (buf[0] == header3){
      soal3();
    } else if (buf[rlen-1] == tail) {
      soal4();
    } else {
      soal5();
    }
  }
}
