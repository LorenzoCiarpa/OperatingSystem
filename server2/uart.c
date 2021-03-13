#include "uart.h"
#include "buffer_utils.h"
#include "serial.h"
#include <avr/io.h>
#include <avr/interrupt.h>
#include <string.h>
#include <util/atomic.h>


void usart_init(void);
char usart_getchar( void );
void usart_putchar( char data );
void usart_pstr (char *s);
unsigned char usart_kbhit(void);
int usart_putchar_printf(char var, FILE *stream);


#define F_CPU 16000000UL
#define BAUD 9600
#define MYUBRR (F_CPU/16/BAUD-1)

/*
void setBaud9600(void) {
//#define BAUD 9600
#include <util/setbaud.h>
  UBRR0H = (uint8_t)(MYUBRR>>8);
  UBRR0L = (uint8_t)(MYUBRR);

#ifdef USE_2X
  UCSR0A |= (1<<U2X0);
#endif
#undef BAUD

}

void setBaud57600(void) {
#define BAUD 57600
#include <util/setbaud.h>
  UBRR0H = UBRRH_VALUE;
  UBRR0L = UBRRL_VALUE;


#ifdef USE_2X
  UCSR0A |= (1<<U2X0);
#endif
#undef BAUD

}

void setBaud115200(void) {
#define BAUD 115200
#include <util/setbaud.h>
  UBRR0H = UBRRH_VALUE;
  UBRR0L = UBRRL_VALUE;


#ifdef USE_2X
  UCSR0A |= (1<<U2X0);
#endif
#undef BAUD

}
*/

#define UART_BUFFER_SIZE 256

typedef struct UART {
  int tx_buffer[UART_BUFFER_SIZE];
  volatile uint8_t tx_start;
  volatile uint8_t tx_end;
  volatile uint8_t tx_size;

  int rx_buffer[UART_BUFFER_SIZE];
  volatile uint8_t rx_start;
  volatile uint8_t rx_end;
  volatile uint8_t rx_size;

  int baud;
  int uart_num; // hardware uart;
} UART;

static UART uart_0;

struct UART* UART_init(const char* device __attribute__((unused)), uint32_t baud) {
  UART* uart=&uart_0;
  uart->uart_num=0;

/*
  switch(baud){
    case 9600: setBaud9600(); break;
    //case 57600: setBaud57600(); break;
    //case 115200: setBaud115200(); break;
    default: return 0;
  }
*/
  uart->tx_start=0;
  uart->tx_end=0;
  uart->tx_size=0;
  uart->rx_start=0;
  uart->rx_end=0;
  uart->rx_size=0;

  UBRR0H = (uint8_t)(MYUBRR>>8);
  UBRR0L = (uint8_t)(MYUBRR);

  UCSR0C = _BV(UCSZ01) | _BV(UCSZ00); /* 8-bit data */
  UCSR0B = _BV(RXEN0) | _BV(TXEN0) | _BV(RXCIE0);   /* Enable RX and TX */


  sei();
  return &uart_0;
}

// returns the free space in the buffer
int UART_rxbufferSize(struct UART* uart __attribute__((unused))) {
  return UART_BUFFER_SIZE;
}

// returns the free occupied space in the buffer
int  UART_txBufferSize(struct UART* uart __attribute__((unused))) {
  return UART_BUFFER_SIZE;
}

// number of chars in rx buffer
int UART_rxBufferFull(UART* uart) {
  return uart->rx_size;
}

// number of chars in rx buffer
int UART_txBufferFull(UART* uart) {
  return uart->tx_size;
}

// number of free chars in tx buffer
int UART_txBufferFree(UART* uart){
  return UART_BUFFER_SIZE-uart->tx_size;
}

/* ATOMIC_BLOCK RENDE IL CONTENUTO NON BLOCCABILE DA INTERRUPUT */

void UART_putChar(struct UART* uart, uint8_t c) {
  // loops until there is some space in the buffer
  while (uart->tx_size>=UART_BUFFER_SIZE);
  ATOMIC_BLOCK(ATOMIC_FORCEON){
    uart->tx_buffer[uart->tx_end]=c;
    BUFFER_PUT(uart->tx, UART_BUFFER_SIZE);
  }
  UCSR0B |= (1<<UDRIE0); // enable transmit interrupt, qui parte la ISR fino a che il buffer svuotato
}

uint8_t UART_getChar(struct UART* uart){
  while(uart->rx_size==0);
  uint8_t c;
  ATOMIC_BLOCK(ATOMIC_FORCEON){
    c=uart->rx_buffer[uart->rx_start];
    BUFFER_GET(uart->rx, UART_BUFFER_SIZE);
  }
  return c;
}



ISR(USART0_RX_vect) {
  uint8_t c=UDR0;
  if (uart_0.rx_size<UART_BUFFER_SIZE){
    uart_0.rx_buffer[uart_0.rx_end] = c;
    BUFFER_PUT(uart_0.rx, UART_BUFFER_SIZE);
  }
}

ISR(USART0_UDRE_vect){
  if (! uart_0.tx_size){
    UCSR0B &= ~(1<<UDRIE0);
  } else {

    UDR0 = uart_0.tx_buffer[uart_0.tx_start];
    BUFFER_GET(uart_0.tx, UART_BUFFER_SIZE);
  }
}

void usart_init(void){
  UCSR1B |= (1 << RXEN1) | (1 << TXEN1);				/* Enable USART transmitter and receiver */
	UCSR1C |= (1 << UCSZ10) | (1 << UCSZ11);	/* Write USCRC for 8 bit data and 1 stop bit */
	UBRR1L = MYUBRR;							/* Load UBRRL with lower 8 bit of prescale value */
	UBRR1H = (MYUBRR >> 8);					/* Load UBRRH with upper 8 bit of prescale value */
}

void usart_putchar(char data) {
    // Wait for empty transmit buffer
    while ( !(UCSR1A & (_BV(UDRE1))) );
    // Start transmission
    UDR1 = data;

}

char usart_getchar(void) {
    // Wait for incoming data
    while ( !(UCSR1A & (_BV(RXC1))) );
    // Return the data
    return UDR1;
}

void usart_pstr(char *s) {
    // loop through entire string
    //cli();
    while (*s) {
        usart_putchar(*s);
        s++;
    }
    //sei();
}

uint8_t usart_getString(uint8_t* buf){
    uint8_t* b0=buf; //beginning of buffer
    while(1){
    uint8_t c=usart_getchar();
    usart_putchar(c);
    if(c=='\n'||c=='\r' || c=='w'){
      *buf=0;
      ++buf;
      return buf-b0;
    }

    // reading a 0 terminates the string
    if (c==0) return buf-b0;
    // reading a \n or a \r return results
    // in forcedly terminating the string
    *buf=c;
    ++buf;
  }
}

/*
void usart_init(void){
  UBRR0H = (uint8_t)(MYUBRR>>8);
  UBRR0L = (uint8_t)(MYUBRR);

  UCSR0C = _BV(UCSZ01) | _BV(UCSZ00);
  UCSR0B = _BV(RXEN0) | _BV(TXEN0) | _BV(RXCIE0);
}

void usart_putchar(char data) {
    // Wait for empty transmit buffer
    while ( !(UCSR0A & (_BV(UDRE0))) );
    // Start transmission
    UDR0 = data;

}

char usart_getchar(void) {
    // Wait for incoming data
    while ( !(UCSR0A & (_BV(RXC0))) );
    // Return the data
    return UDR0;
}

void usart_pstr(char *s) {
    // loop through entire string
    cli();
    while (*s) {
        usart_putchar(*s);
        s++;
    }
    sei();
}

uint8_t usart_getString(uint8_t* buf){
    uint8_t* b0=buf; //beginning of buffer
    while(1){
    uint8_t c=usart_getchar();
    if(c=='\n'||c=='\r'){
      *buf=0;
      ++buf;
      return buf-b0;
    }

    // reading a 0 terminates the string
    if (c==0) return buf-b0;
    // reading a \n or a \r return results
    // in forcedly terminating the string
    *buf=c;
    ++buf;
  }
}
*/
