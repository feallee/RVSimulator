CROSS_COMPILE = riscv64-unknown-elf-
CFLAGS = -c -nostdlib -march=rv32i -mabi=ilp32 -T main.ld
 
CC = ${CROSS_COMPILE}gcc
LD = ${CROSS_COMPILE}ld
OBJCOPY = ${CROSS_COMPILE}objcopy 
OBJDUMP = ${CROSS_COMPILE}objdump
 
all: main.bin
main.bin:     
    ${CC} ${CFLAGS} -o led\main.elf led\main.c       
    ${OBJCOPY} -Obinary -j .text led\main.elf led\main.bin
code: all
    @${OBJDUMP} -D -b binary led\main.bin -mriscv | less
 
clean:
    del /q led\*.o
	del /q led\*.bin