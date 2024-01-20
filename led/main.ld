/*
See:
https://blog.csdn.net/qq_38113006/article/details/113143514
See:https://sourceware.org/binutils/docs/ld/
*/
OUTPUT_ARCH("riscv")
OUTPUT_FORMAT("elf32-littleriscv")
ENTRY(_start)

MEMORY
{
    FLASH (rx)  : ORIGIN = 0x10000000, LENGTH = 16K
    RAM (xrw)   : ORIGIN = 0x20000000, LENGTH = 4K
}

SECTIONS {

    .text      :
    {
        . = ALIGN(4);
        *start.o (.text)
        *main.o (.text)
        *(.text .text*)
    } > FLASH

    .rodata :
    {
        . = ALIGN(4);
        *(.rodata .rodata*)         /* .rodata sections (constants, strings, etc.) */
        . = ALIGN(4);
    } >FLASH

    _sidata = LOADADDR(.data);  /* 获取data段的起始加载地址 */
    .data : 
    {
        . = ALIGN(4);
        _sdata = .;        /* 获取data段的起始链接地址 */
        *(.data .data*)           /* .data sections */
        . = ALIGN(4);
        _edata = .;        /* 获取data段的结束链接地址 */
    } >RAM AT > FLASH

    . = ALIGN(4);
    .bss :
    {
        _sbss = .;         /* 获取bss段的起始链接地址 */ 
        *(.bss .bss*)
        . = ALIGN(4);
        _ebss = .;         /* 获取bss段的结束链接地址 */
    } >RAM
}
