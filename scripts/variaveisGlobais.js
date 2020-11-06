memoria_de_instrucoes = new Memory()
memoria_de_dados = new Memory()
banco_de_registradores = []

//registradores[21][1] = 3;

pc = 100
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


function iniciarVarGlobais(){
    memoria_de_instrucoes.memoria = {}
    memoria_de_dados.memoria = {}
    banco_de_registradores = []
    for (let i = 0; i < 32; i++){ 
        banco_de_registradores.push(new Memory())
        banco_de_registradores[i].set(0*4,1)
    }
    
    //registradores[21][1] = 3;

    pc = 100
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
}