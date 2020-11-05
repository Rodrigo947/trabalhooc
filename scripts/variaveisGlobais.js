var instrucoes = []
var registradores= []
for (let i = 0; i < 32; i++) {
    registradores[i] = [];
    registradores[i][1] = 9;
}
//registradores[21][1] = 3;


pc = 0
posicaoPC = 0
ALUResult = 0
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

//Botei aqui como -1 para testar addi
sinalAluControl = -1

//Separação de instrução por segmentos de bits
opcode = 0
rt = 0
rs = 0
rd = 0
sa = 0
func = 0
signExtendAux = 0
immediate = 0
