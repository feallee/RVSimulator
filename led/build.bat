del main.elf /q
del main.bin /q
riscv64-unknown-elf-gcc.exe -march=rv32i -mabi=ilp32 main.c -T main.ld --entry=main -nostdlib -o main.elf
riscv64-unknown-elf-objcopy --dump-section .text=main.bin main.elf
@rem riscv64-unknown-elf-objcopy -O binary main.elf main.bin