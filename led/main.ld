SECTIONS
{
  . = 0x0;
  .text           :
  {
    *(.text .text.*)   
  }
  . = 0x10000000;
  .data           :
  {    
    *(.data .data.*)
  }  
  . = 0x11000000;
  .bss            :
  {    
   *(.bss .bss.* )
  }  
}
