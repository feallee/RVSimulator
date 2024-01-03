/*
See:https://sourceware.org/binutils/docs/ld/
*/

MEMORY
{
  ROM : ORIGIN = 0x00000000, LENGTH = 1K
  RAM : ORIGIN = 0x00000400, LENGTH = 1K
}

SECTIONS
{  
  .text :
  { 
    *(.text)
    *(.rodata)  
  } >ROM   
  .data :
  { 
    *(.data)           
    *(.sdata)           
  } >RAM
}
