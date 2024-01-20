@rem elfתhex/bin����
@rem objcopy -Obinary file.elf file.bin
@rem objcopy -Oihex   file.elf file.hex
@rem ��ת���е�һЩ���м�˵���ο���ganrui.cn��elfת����hex/bin�ļ�
@rem. 
@rem hexתbin����
@rem objcopy -Iihex -Obinary  file.hex file.bin
@rem binתhex����
@rem objcopy --change-address 0x8000000 -Ibinary -Oihex boot.bin  boot.hex 
@rem objcopy --change-address 0x8020000 -Ibinary -Oihex app.bin  app.hex 
@rem objcopy --change-address 0x8040000 -Ibinary -Oihex app.bin  backup.hex 
@rem �ϲ�hex����
@rem sed -e '$d' tmp/boot.hex   #ɾ�����ļ����һ�У���һ�б�־�ļ�������
@rem sed -e '$d' tmp/app.hex    #ɾ�����ļ����һ�У���һ�б�־�ļ�������
@rem cat tmp/boot.hex > all.hex    #�½�all.hex�ļ���д��boot.hex
@rem cat tmp/app.hex >> all.hex    #��all.hex�ļ���׷��app.hex
@rem cat tmp/backup.hex >> all.hex #��all.hex�ļ���׷��backup.hex
@rem arm-softfloat-linux-gnu-objdump-
@rem riscv64-unknown-elf-readelf main.elf -S

pushd %~dp0
del main.elf /q
del main.bin /q


@rem riscv64-unknown-elf-gcc main.c -c -march=rv32i -mabi=ilp32 -o main.o
@rem riscv64-unknown-elf-ld -melf32lriscv main.o -o main.elf 
@rem riscv64-unknown-elf-objcopy -O binary -j .text main.elf main.bin

@REM riscv64-unknown-elf-gcc main.c -mabi=ilp32 -march=rv32i -S -o main.s
@REM riscv64-unknown-elf-as main.s -mabi=ilp32 -march=rv32i -o main.o
@REM riscv64-unknown-elf-gcc func.c -mabi=ilp32 -march=rv32i -S -o func.s
@REM riscv64-unknown-elf-as func.s -mabi=ilp32 -march=rv32i -o func.o
@REM riscv64-unknown-elf-as init.s -mabi=ilp32 -march=rv32i -o init.o
@REM riscv64-unknown-elf-ld main.o func.o init.o -m elf32lriscv -o main.x

riscv64-unknown-elf-gcc main.c -mabi=ilp32 -march=rv32i -o main.s