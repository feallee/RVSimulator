pushd %~dp0
del main.elf /q
del main.bin /q
riscv64-unknown-elf-gcc.exe -march=rv32i -mabi=ilp32 main.c -T main.ld -nostdlib -o main.elf
riscv64-unknown-elf-objcopy --dump-section .text=main.bin main.elf
explorer %~dp0
