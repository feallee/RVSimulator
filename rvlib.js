
class RV32I {
    constructor(name, romSize) {
        this.Name = name;
        this.Registers = new Uint32Array(32);
        this.Rom = new Uint8Array(romSize);
        this.PC = 0;
    }
    program(codeArray) {
       
        if (codeArray.length <= this.Rom.byteLength) {
            for (let i = 0; i < codeArray.length; i++) {
                this.Rom[i] = codeArray[i];
            }
            return true;
        }
        else {
            return false;
        }
    }
    fetch() {
        if (this.PC >= this.Rom.byteLength) {
            this.PC = 0;
        }
        const v = this.Rom[this.PC]*0x1000000 +this.Rom[this.PC+1]*0x10000+this.Rom[this.PC+2]*0x100+this.Rom[this.PC+3];
        this.PC += 4;        
        return v;
    }
    decode(code) {
        let obj = new Object();
        //R-Type & other
        obj.opcode = code & 0b00000000_00000000_00000000_01111111;
        obj.rd = (code & 0b00000000_00000000_00001111_10000000) >> 7;
        obj.fun3 = (code & 0b00000000_00000000_01110000_00000000) >> 12;
        obj.rs1 = (code & 0b00000000_00001111_10000000_00000000) >> 15;
        obj.rs2 = (code & 0b00000001_11110000_00000000_00000000) >> 20;
        obj.fun7 = (code & 0b11111110_00000000_00000000_00000000) >> 25;
        //I-type
        obj.immI = (code & 0b11111111_11110000_00000000_00000000) >> 20;//imm[11:0]
        //S-type
        obj.immS = ((code & 0b11111110_00000000_00000000_00000000) >> 20) | //imm[11:5]
            ((code & 0b00000000_00000000_00001111_10000000) >> 7);//imm[4:0]
        //B-type
        obj.immB = ((code & 0b10000000_00000000_00000000_00000000) >> 19) | //imm[12]           
            ((code & 0b01111110_00000000_00000000_00000000) >> 20) | //imm[10:5]            
            ((code & 0b00000000_00000000_00001111_00000000) >> 7) | //imm[4:1]           
            ((code & 0b00000000_00000000_00000000_10000000) << 4);//imm[11]
        //U-type
        obj.immU = code & 0b11111111_11111111_11110000_00000000;//imm[31:12];
        //J-type                               
        obj.immJ = ((code & 0b10000000_00000000_00000000_00000000) >> 11) | //imm[20]                      
            ((code & 0b01111111_11100000_00000000_00000000) >> 20) | //imm[10:1]           
            ((code & 0b00000000_00010000_00000000_00000000) >> 9) | //imm[11]                      
            (code & 0b00000000_00001111_11110000_00000000);//imm[19:12]
        return obj;
    }
    disassembly(obj) {//全部基础指令
        let line = "";
        switch (obj.opcode) {
            case 0b0110111:
                line = `lui x${obj.rd},${obj.immU >> 12}`;
                break;
            case 0b0010111:
                line = `auipc x${obj.rd},${obj.immU >> 12}`;
                break;
            case 0b1101111:
                line = `jal x${obj.rd},${obj.immJ}`;
                break;
            case 0b1100111:
                if (obj.fun3 == 0b000) {
                    line = `jalr x${obj.rd},x${obj.rs1},${obj.immI}`;
                }
                else {
                    line = "jalr ?"
                }
                break;
            case 0b1100011:
                if (obj.fun3 == 0b000) {
                    line = `beq x${obj.rs1},x${obj.rs2},${obj.immB}`;
                }
                else if (obj.fun3 == 0b001) {
                    line = `bne x${obj.rs1},x${obj.rs2},${obj.immB}`;
                }
                else if (obj.fun3 == 0b100) {
                    line = `blt x${obj.rs1},x${obj.rs2},${obj.immB}`;
                }
                else if (obj.fun3 == 0b101) {
                    line = `bge x${obj.rs1},x${obj.rs2},${obj.immB}`;
                }
                else if (obj.fun3 == 0b110) {
                    line = `bltu x${obj.rs1},x${obj.rs2},${obj.immB}`;
                }
                else if (obj.fun3 == 0b111) {
                    line = `bgeu x${obj.rs1},x${obj.rs2},${obj.immB}`;
                }
                else {
                    line = "b ?";
                }
                break;
            case 0b0000011:
                if (obj.fun3 == 0b000) {
                    line = `lb x${obj.rd},${obj.immI},x${obj.rs1}`;
                }
                else if (obj.fun3 == 0b001) {
                    line = `lh x${obj.rd},${obj.immI},x${obj.rs1}`;
                }
                else if (obj.fun3 == 0b010) {
                    line = `lw x${obj.rd},${obj.immI},x${obj.rs1}`;
                }
                else if (obj.fun3 == 0b100) {
                    line = `lbu x${obj.rd},${obj.immI},x${obj.rs1}`;
                }
                else if (obj.fun3 == 0b101) {
                    line = `lhu x${obj.rd},${obj.immI},x${obj.rs1}`;
                }
                else {
                    line = "l ?";
                }
                break;
            case 0b0100011:
                if (obj.fun3 == 0b000) {
                    line = `sb x${obj.rs2},${obj.immS},x${obj.rs1}`;
                }
                else if (obj.fun3 == 0b001) {
                    line = `sh x${obj.rs2},${obj.immS},x${obj.rs1}`;
                }
                else if (obj.fun3 == 0b010) {
                    line = `sw x${obj.rs2},${obj.immS},x${obj.rs1}`;
                }
                else {
                    line = "s ?";
                }
                break;
            case 0b0010011:
                if (obj.fun3 == 0b000) {
                    line = `addi x${obj.rd},x${obj.rs1},${obj.immI}`;
                }
                else if (obj.fun3 == 0b010) {
                    line = `slti x${obj.rd},x${obj.rs1},${obj.immI}`;
                }
                else if (obj.fun3 == 0b011) {
                    line = `sltiu x${obj.rd},x${obj.rs1},${obj.immI}`;
                }
                else if (obj.fun3 == 0b100) {
                    line = `xori x${obj.rd},x${obj.rs1},${obj.immI}`;
                }
                else if (obj.fun3 == 0b110) {
                    line = `ori x${obj.rd},x${obj.rs1},${obj.immI}`;
                }
                else if (obj.fun3 == 0b111) {
                    line = `andi x${obj.rd},x${obj.rs1},${obj.immI}`;
                }
                else if (obj.fun3 == 0b001 && obj.fun7 == 0b0000000) {
                    line = `slli x${obj.rd},x${obj.rs1},${obj.rs2}`;
                }
                else if (obj.fun3 == 0b101 && obj.fun7 == 0b0000000) {

                    line = `srli x${obj.rd},x${obj.rs1},${obj.rs2}`;
                }
                else if (obj.fun3 == 0b101 && obj.fun7 == 0b0100000) {
                    line = `srai x${obj.rd},x${obj.rs1},${obj.rs2}`;

                }
                else {
                    line = "logici ?";
                }
                break;
            case 0b0110011:
                if (obj.fun3 == 0b000 && obj.fun7 == 0b0000000) {
                    line = `add x${obj.rd},x${obj.rs1},x${obj.rs2}`;
                }
                else if (obj.fun3 == 0b000 && obj.fun7 == 0b0100000) {
                    line = `sub x${obj.rd},x${obj.rs1},x${obj.rs2}`;
                }
                else if (obj.fun3 == 0b001 && obj.fun7 == 0b0000000) {
                    line = `sll x${obj.rd},x${obj.rs1},x${obj.rs2}`;
                }
                else if (obj.fun3 == 0b010 && obj.fun7 == 0b0000000) {
                    line = `slt x${obj.rd},x${obj.rs1},x${obj.rs2}`;
                }
                else if (obj.fun3 == 0b011 && obj.fun7 == 0b0000000) {
                    line = `sltu x${obj.rd},x${obj.rs1},x${obj.rs2}`;
                }
                else if (obj.fun3 == 0b100 && obj.fun7 == 0b0000000) {
                    line = `xor x${obj.rd},x${obj.rs1},x${obj.rs2}`;
                }
                else if (obj.fun3 == 0b101 && obj.fun7 == 0b0000000) {
                    line = `srl x${obj.rd},x${obj.rs1},x${obj.rs2}`;
                }
                else if (obj.fun3 == 0b101 && obj.fun7 == 0b0100000) {
                    line = `sra x${obj.rd},x${obj.rs1},x${obj.rs2}`;
                }
                else if (obj.fun3 == 0b110 && obj.fun7 == 0b0000000) {
                    line = `or x${obj.rd},x${obj.rs1},x${obj.rs2}`;
                }
                else if (obj.fun3 == 0b111 && obj.fun7 == 0b0000000) {
                    line = `and x${obj.rd},x${obj.rs1},x${obj.rs2}`;
                }
                else {
                    line = "logic ?";
                }
                break;
            case 0b0001111:
                if (obj.rd == 0b00000 && obj.fun3 == 0b000 && obj.rs1 == 0b00000 && (obj.immI >>> 8) == 0b0000) {
                    line = `fence ${(obj.immI & 0b0000_11110000) >>> 4},x${obj.immI & 0b0000_00001111}`;//fence pred, succ
                }
                else if (obj.rd == 0b00000 && obj.fun3 == 0b001 && obj.rs1 == 0b00000 && obj.immI == 0b0000_00000000) {
                    line = `fence.i`;
                }
                else {
                    line = "fence ?";
                }
                break;
            case 0b1110011:
                if (obj.rd == 0b00000 && obj.fun3 == 0b000 && obj.rs1 == 0b00000 && obj.immI == 0b0000_00000000) {
                    line = "ecall";
                }
                else if (obj.rd == 0b00000 && obj.fun3 == 0b000 && obj.rs1 == 0b00000 && obj.immI == 0b0000_00000001) {
                    line = "ebreak";
                }
                else if (obj.fun3 == 0b001) {
                    line = `csrrw x${obj.rd},${obj.immI},x${obj.rs1}`;//csrrw rd, csr, rs1
                }
                else if (obj.fun3 == 0b010) {
                    line = `csrrs x${obj.rd},${obj.immI},x${obj.rs1}`;//csrrs rd, csr, rs1
                }
                else if (obj.fun3 == 0b011) {
                    line = `csrrc x${obj.rd},${obj.immI},x${obj.rs1}`;//csrrc rd, csr, rs1
                }
                else if (obj.fun3 == 0b101) {
                    line = `csrrwi ${obj.rd},${obj.immI},${obj.rs1}`;//csrrwi x0, csr, imm
                }
                else if (obj.fun3 == 0b110) {
                    line = `csrrsi ${obj.rd},${obj.immI},${obj.rs1}`;//csrrwi x0, csr, imm
                }
                else if (obj.fun3 == 0b111) {
                    line = `csrrci ${obj.rd},${obj.immI},${obj.rs1}`;//csrrwi x0, csr, imm
                }
                else {
                    line = "csr ?"
                }
                break;

            default:
                line = "? ?";
                break;
        }
        return line;
    }
    execute(obj) {
        switch (obj.opcode) {
            case 0b1100111:
                if (obj.fun3 == 0b000) {
                    //`jalr x${obj.rd},x${obj.rs1},${obj.immI}`;
                    if (obj.rd > 0) {
                        this.Registers[obj.rd] = this.PC;
                    }
                    this.PC = (this.Registers[obj.rs1] + obj.immI) & (~1);
                }
                break;
            case 0b0010011:
                if (obj.fun3 == 0b000) {
                    //`addi x${obj.rd},x${obj.rs1},${obj.immI}`;
                    this.Registers[obj.rd] = this.Registers[obj.rs1] + obj.immI;
                }
                break;
            //case 0b
            // 其它指令
            default:
                //异常指令
                break;
        }
    }
}