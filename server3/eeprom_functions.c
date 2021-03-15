#include <avr/eeprom.h>
#include "uart.h"
#include "buffer_utils.h"
#include <avr/io.h>
#include <avr/interrupt.h>
#include <string.h>
#include <util/atomic.h>


uint16_t eeprom_get_size(){
  uint16_t ByteOfData;
  eeprom_busy_wait();
  ByteOfData = eeprom_read_word(( uint16_t *) 0);
  if(ByteOfData != NULL && ByteOfData > 0){
    return ByteOfData;
  }
  return 0;
}


void eeprom_read(void *dest_){
  uint16_t size = eeprom_get_size();
  if(size > EEPROM_MAX_SIZE) return;

  uint16_t idx = 2;
  uint8_t *dest = dest_
  while(idx < size){
    eeprom_busy_wait();
    *dest=eeprom_read_byte((uint8_t*)idx);
     ++idx;
     ++dest;
  }
}

void eeprom_write(char* buf){
  uint16_t idx = eeprom_get_size();
  uint16_t buf_size = strlen(buf);
  uint16_t end = idx + buf_size;
  if(end > EEPROM_MAX_SIZE) return;

  while(idx<end){
    eeprom_busy_wait();
    eeprom_write_byte((uint8_t*)idx, *buf);
    ++buf;
    ++idx;
  }
}

int eeprom_get_name(char* eeprom_buffer, char* name_device){
  int name_size=0;
  while(*eeprom_buffer != ';'){
    *name_device = *eeprom_buffer;
    ++name_device;
    ++eeprom_buffer;
    ++name_size;
  }
  *name_device='\0';
}
