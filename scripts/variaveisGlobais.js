var instrucoes = []
var registradores= []
for (let i = 0; i < 32; i++) {
    registradores[i] = [];
    registradores[i][1] = 1;
}
//registradores[19][1] = 3;

registradores[0][0] = '$zero'
registradores[1][0] = '$at'
registradores[2][0] = '$v0'
registradores[3][0] = '$v1'
registradores[4][0] = '$a0'
registradores[5][0] = '$a1'
registradores[6][0] = '$a2'
registradores[7][0] = '$a3'
registradores[8][0] = '$t0'
registradores[9][0] = '$t1'
registradores[10][0] = '$t2'
registradores[11][0] = '$t3'
registradores[12][0] = '$t4'
registradores[13][0] = '$t5'
registradores[14][0] = '$t6'
registradores[15][0] = '$t7'
registradores[16][0] = '$s0'
registradores[17][0] = '$s1'
registradores[18][0] = '$s2'
registradores[19][0] = '$s3'
registradores[20][0] = '$s4'
registradores[21][0] = '$s5'
registradores[22][0] = '$s6'
registradores[23][0] = '$s7'
registradores[24][0] = '$t8'
registradores[25][0] = '$t9'
registradores[26][0] = '$k0'
registradores[27][0] = '$k1'
registradores[28][0] = '$gp'
registradores[29][0] = '$sp'
registradores[30][0] = '$fp'
registradores[31][0] = '$ra'

pc = 0
posicaoPC = 0;
//Sinais de Controle
RegDst = 0
Jump = 0
Branch = 0
MemRead = 0
MemtoReg = 0
ALUOp = 0
MEMWrite = 0
ALUSrc = 0
RegWrite = 0
sinalAluControl = 0

//Separação de instrução por segmentos de bits
opcode = 0
rt = 0
rs = 0
rd = 0
sa = 0
func = 0
signExtendAux = 0
