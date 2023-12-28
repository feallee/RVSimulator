/*
See:https://sourceware.org/binutils/docs/ld/
*/
SECTIONS
{
  . = 0x00000000;    
  .text : { *(.text) }
  . = 0x10000000;
  .data : { *(.data)}
  .bss : { *(.bss) }  
}
