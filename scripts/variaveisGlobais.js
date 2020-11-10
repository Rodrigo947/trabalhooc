function iniciarVarGlobais(){
    Memoria_RAM = new Memory()

    pc = 128 //As instruções sempre inciam do endereço 128 ou 0x000080
    enderecoFinalInstrucoes = 128
    
    //Banco de Registradores
    for (let i = 0; i < 32; i ++){ 
        Memoria_RAM.set(i*4,0)
    }

    //Separação de instrução por segmentos de bits
    opcode = 0     //[31-26]
    rs = 0         //[25-21]
    rt = 0         //[20-16]
    rd = 0         //[15-11]
    sa = 0         //[10-6]
    func = 0       //[5-0]
    immediate = 0  //[15-0]
    immediateJ = 0 //[25-0]

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

    //Outros sinais
    AluControl = 0
    Zero = 0
    
    //Resultados
    ReadData1 = 0
    ReadData2 = 0
    SignExtend = 0
    ALUResult = 0
    ReadData = 0    
    ShiftLeft2 = 0

}