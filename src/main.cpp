#include <Arduino.h>

void setup() {
  pinMode(A0, INPUT);
  Serial.begin(9600);
  Serial.println("begin");
}

void loop() {
  int BPM = analogRead(A0) / 10;
  Serial.println(BPM);
  delay(1000);
}