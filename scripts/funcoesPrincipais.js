function retiraBits(final, inicial, instrucao) {
  var shiftEsquerda = 31 - final;
  var bits = (instrucao << shiftEsquerda) >>> 0;
  shiftDireita = 31 - (final - inicial);
  bits = bits >>> shiftDireita;
  return bits;
}


function instructionMemory() {
  instrucao = memoria_de_instrucoes.get(pc)
  opcode = retiraBits(31, 26, instrucao);
  rs = retiraBits(25, 21, instrucao);
  rt = retiraBits(20, 16, instrucao);
  rd = retiraBits(15, 11, instrucao);
  sa = retiraBits(10, 6, instrucao);
  func = retiraBits(5, 0, instrucao);
  immediate = retiraBits(15, 0, instrucao);
  immediateJ = retiraBits(25, 0, instrucao);

}

function control() {
  switch (opcode) {
    // Tipo R
    case 0:
      RegDst = 1;
      Jump = (func == 8) ? 2 : 0;
      Branch = 0;
      MemRead = 0;
      MemtoReg = 0;
      ALUOp = 2;
      MemWrite = 0;
      ALUSrc = 0;
      RegWrite = 1;
      Bne = 0;
      break;

    //Tipo I
    case 8: //addi
      RegDst = 0;
      Jump = 0;
      Branch = 0;
      MemRead = 0;
      MemtoReg = 0;
      ALUOp = 0; 
      MemWrite = 0;
      ALUSrc = 1;
      RegWrite = 1;
      Bne = 0;
      break;

    case 35: //lw
      RegDst = 0;
      Jump = 0;
      Branch = 0;
      MemRead = 1;
      MemtoReg = 1;
      ALUOp = 0;
      MemWrite = 0;
      ALUSrc = 1;
      RegWrite = 1;
      Bne = 0;
      break;
      
    case 43: //sw
      RegDst = 0; 
      Jump = 0;
      Branch = 0;
      MemRead = 0;
      MemtoReg = 0; 
      ALUOp = 0;
      MemWrite = 1;
      ALUSrc = 1;
      RegWrite = 0;
      Bne = 0;
      break;

    case 4: //beq
      RegDst = 0; 
      Jump = 0;
      Branch = 1;
      MemRead = 0;
      MemtoReg = 0; 
      ALUOp = 1;
      MemWrite = 0;
      ALUSrc = 0;
      RegWrite = 0;
      Bne = 0;
      break;

    case 5: //bne
      RegDst = 0;
      Jump = 0;
      Branch = 0;
      MemRead = 0;
      MemtoReg = 0; 
      ALUOp = 1;
      MemWrite = 0;
      ALUSrc = 0;
      RegWrite = 0;
      Bne = 1;
      break;

    //Tipo J
    case 2: //j
      RegDst = 0;
      Jump = 1; 
      Branch = 0;
      MemRead = 0;
      MemtoReg = 0; 
      ALUOp = 0;
      MemWrite = 0;
      ALUSrc = 0;
      RegWrite = 0;
      Bne = 0;
      break;
    
    case 3: //jal
      RegDst = 2;
      Jump = 1; 
      Branch = 0;
      MemRead = 0;
      MemtoReg = 2; 
      ALUOp = 0;
      MemWrite = 0;
      ALUSrc = 0;
      RegWrite = 1;
      Bne = 0;
      break;
  }
  
}


function registers() {
  
  ReadData1 = banco_de_registradores.get(rs*4)
  ReadData2 = banco_de_registradores.get(rt*4)


  //Definindo o Write Data  
  var WriteData = 0
  //MUX antes do Data Memory
  switch (MemtoReg) {
    case 0:
      WriteData = ALUResult
      break;
    
    case 1:
      WriteData = ReadData
      break;
    
    case 2:
      WriteData = pc + 4 
      break;
  }

  //Definindo o Write Register
  if(RegWrite == 1){
    var WriteRegister = 0
    //MUX depois do Registers
    switch (RegDst) {
      case 0:
        WriteRegister = rt
        break;
      
      case 1:
        WriteRegister = rd
        break;
      
      case 2:
        WriteRegister = 31
        break;
    }
    if(WriteRegister != 0)
      banco_de_registradores.set(WriteRegister*4,WriteData)
  }


}

function signExtend() {
  var binario = immediate.toString(2)

  while(binario.length < 32)
    binario = '0'+ binario
  
  SignExtend = parseInt(binario,2);
}

function aluControl() {
  //tipoR
  if (ALUOp == 2) { 
    switch (func) {
      
      case 32: //add
        AluControl = 2
      break;
      
      case 34: //sub
        AluControl = 6
        break;
      
      case 24: //mult
        AluControl = 3
        break;
      
      case 26: //div
        AluControl = 4
        break;
      
      case 36: //and
        AluControl = 0
        break;
       
      case 37: //or
        AluControl = 1
        break;
      
      case 42: //slt
        AluControl = 7
        break;
      
      case 0: //sll
        AluControl = 8
        break;
    }
    return 0
  }

  //TipoI
  //lw, sw ,addi
  if(ALUOp == 0){
    AluControl = 2
    return 0
  }

  //beq, bne
  if(ALUOp == 1){
    AluControl = 6
    return 0
  }

}

function alu() {
  //MUX antes da ALU
  if(ALUSrc == 0){
    operando2 = ReadData2
  }
  else{
    operando2 = immediate;
  }
  //------

  switch (AluControl) {
    
    case 2: //add
      ALUResult = ReadData1 + operando2
      break;

    case 6: //sub
      ALUResult = ReadData1 - operando2
      break
      
    case 3: //mult
      ALUResult = ReadData1 * operando2
      break

    case 4: //div
      ALUResult = ReadData1 / operando2
      break

    case 0: //and
      ALUResult = ReadData1 & operando2
      break

    case 1: //or
      ALUResult = ReadData1 | operando2
      break
     
    case 7: //slt
      ALUResult = ReadData1 < operando2 ? 1 : 0
      break
      
    case 8: //sll
      ALUResult = operando2 << sa
      break;
  }

  if(ALUResult == 0)
    Zero = 1
  else 
    Zero = 0

}

function dataMemory() {
  var Address = ALUResult
  var WriteData = ReadData2
  if(MemWrite) //sw
    memoria_de_dados.set(Address*4,WriteData)
  if(MemtoReg) //lw
    ReadData = memoria_de_dados.get(Address*4)
}

function atualizaPC(){
  pc += 4
  //MUX superior mais a direita
  switch (Jump) {  
    case 0: 
      //MUX superior a esquerda
      if(Branch && Zero) //beq
        pc = pc + (SignExtend << 2) >>> 0
      if(Bne && !Zero) //bne
        pc = pc + (SignExtend << 2) >>> 0
      break;

    case 1: // Jal, J
      immediateJ = (immediateJ << 2) >>> 0
      pc = (pc >> 28) | immediateJ
      break;
    
    case 2: //Jr
      pc = ReadData1
      break;
  }
}



function main() {
  instructionMemory()
  control()
  registers()
  signExtend()
  aluControl()
  alu()
  dataMemory()
  registers()
  atualizaPC()
  atualizarInterface()
}

