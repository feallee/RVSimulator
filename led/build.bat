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


pushd %~dp0
del main.elf /q
del main.bin /q
riscv64-unknown-elf-gcc -march=rv32i -mabi=ilp32 -nostdlib -s main.c -T main.ld -o main.elf 
@rem riscv64-unknown-elf-objcopy --dump-section .text=main.bin main.elf
riscv64-unknown-elf-objcopy -Obinary -j .text main.elf main.bin
explorer %~dp0
