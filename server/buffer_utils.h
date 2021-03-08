#pragma once
#define BUFFER_PUT(_IDX, _BSIZE_MAX)	\    //concatena il contenuto di _IDX (es. uart->rx) con _end, _size
  ++_IDX ## _end;					\                //risultato uart->rx_end; uart->rx_size;
  if (_IDX ## _end>=_BSIZE_MAX)				\    //++ somma di 1;
    _IDX ## _end=0;					\
  ++_IDX ## _size;

#define BUFFER_GET(_IDX, _BSIZE_MAX)	\
  ++_IDX ## _start;				\
  if (_IDX ## _start>=_BSIZE_MAX)		\
    _IDX ## _start =0;				\
  --_IDX ## _size;
