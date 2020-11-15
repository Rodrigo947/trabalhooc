function iniciarVarGlobais(){
    memoria_de_instrucoes = new Memory()
    banco_de_registradores = new Memory()
    memoria_de_dados = new Memory()

    pc = 0 //As instruções sempre inciam do endereço 128 ou 0x000080
    enderecoFinalInstrucoes = 0
    
    //Banco de Registradores
    for (let i = 0; i <= 31; i ++){ 
        banco_de_registradores.set(i*4,0)
    }
    //Memoria de dados
    for (let i = 0; i <= 63; i ++){ 
        memoria_de_dados.set(i*4,i*2)
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
    MemWrite = 0
    ALUSrc = 0
    RegWrite = 0
    Bne = 0

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