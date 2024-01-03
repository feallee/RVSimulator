@rem elf转hex/bin方法
@rem objcopy -Obinary file.elf file.bin
@rem objcopy -Oihex   file.elf file.hex
@rem 此转换中的一些特列及说明参考：ganrui.cn：elf转换成hex/bin文件
@rem. 
@rem hex转bin方法
@rem objcopy -Iihex -Obinary  file.hex file.bin
@rem bin转hex方法
@rem objcopy --change-address 0x8000000 -Ibinary -Oihex boot.bin  boot.hex 
@rem objcopy --change-address 0x8020000 -Ibinary -Oihex app.bin  app.hex 
@rem objcopy --change-address 0x8040000 -Ibinary -Oihex app.bin  backup.hex 
@rem 合并hex方法
@rem sed -e '$d' tmp/boot.hex   #删除此文件最后一行（这一行标志文件结束）
@rem sed -e '$d' tmp/app.hex    #删除此文件最后一行（这一行标志文件结束）
@rem cat tmp/boot.hex > all.hex    #新建all.hex文件并写入boot.hex
@rem cat tmp/app.hex >> all.hex    #在all.hex文件后追加app.hex
@rem cat tmp/backup.hex >> all.hex #在all.hex文件后追加backup.hex


pushd %~dp0
del main.elf /q
del main.bin /q
riscv64-unknown-elf-gcc -march=rv32i -mabi=ilp32 -nostdlib -s main.c -T main.ld -o main.elf 
@rem riscv64-unknown-elf-objcopy --dump-section .text=main.bin main.elf
riscv64-unknown-elf-objcopy -Obinary -j .text main.elf main.bin
explorer %~dp0
