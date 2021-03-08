int eeprom_get_size();

void eeprom_read(void *dest_);

void eeprom_write(char* buf);

//return name_device_size
int eeprom_get_name(char* buf, char* name_device);
