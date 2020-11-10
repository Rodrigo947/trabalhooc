function retiraBits(final, inicial, instrucao) {
  var shiftEsquerda = 31 - final;
  var bits = (instrucao << shiftEsquerda) >>> 0;
  shiftDireita = 31 - (final - inicial);
  bits = bits >>> shiftDireita;
  return bits;
}

function instructionMemory() {
  instrucao = Memoria_RAM.get(pc)
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
      Jump = 0;
      Branch = 0;
      MemRead = 0;
      MemtoReg = 0;
      ALUOp = 2;
      MEMWrite = 0;
      ALUSrc = 0;
      RegWrite = 1;
      break;

    //Tipo I
    case 8: //addi
      RegDst = 0;
      Jump = 0;
      Branch = 0;
      MemRead = 0;
      MemtoReg = 0;
      ALUOp = 0; 
      MEMWrite = 0;
      ALUSrc = 1;
      RegWrite = 1;
      break;

    case 35: //lw
      RegDst = 1;
      Jump = 0;
      Branch = 0;
      MemRead = 1;
      MemtoReg = 1;
      ALUOp = 0;
      MEMWrite = 0;
      ALUSrc = 1;
      RegWrite = 1;
      break;
      
    case 43: //sw
      RegDst = 0; 
      Jump = 0;
      Branch = 0;
      MemRead = 0;
      MemtoReg = 0; 
      ALUOp = 0;
      MEMWrite = 1;
      ALUSrc = 1;
      RegWrite = 0;
      break;

    case 4: //beq
      RegDst = 0; 
      Jump = 0;
      Branch = 1;
      MemRead = 0;
      MemtoReg = 0; 
      ALUOp = 1;
      MEMWrite = 0;
      ALUSrc = 0;
      RegWrite = 0;
      break;

    case 5: //bne
      RegDst = 0;
      Jump = 0;
      Branch = 1;
      MemRead = 0;
      MemtoReg = 0; 
      ALUOp = 1;
      MEMWrite = 0;
      ALUSrc = 0;
      RegWrite = 0;
      break;

    //Tipo J
    case 2: //j
      RegDst = 0;
      Jump = 1; //Jump é o unico importante
      Branch = 0;
      MemRead = 0;
      MemtoReg = 0; 
      ALUOp = 0;
      MEMWrite = 0;
      ALUSrc = 0;
      RegWrite = 0;
      break;
    
    case 3: //jal
      RegDst = 2;
      Jump = 1; 
      Branch = 0;
      MemRead = 0;
      MemtoReg = 2; 
      ALUOp = 0;
      MEMWrite = 0;
      ALUSrc = 0;
      RegWrite = 1;
      break;
  }
}


function registers() {
  
  ReadData1 = Memoria_RAM.get(rs*4)
  ReadData2 = Memoria_RAM.get(rt*4)

  //Definindo o Write Data
  var WriteData = 0
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
    Memoria_RAM.set(WriteRegister*4,WriteData)
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
  if(ALUSrc == 0){
    operando2 = ReadData2
  }
  else{
    operando2 = immediate;
  }


  switch (AluControl) {
    
    case 2: //add, addi, LW, SW

      ALUResult = ReadData1 + operando2
  
      break;

    case 6: //sub
      if(ALUOp==1){
        //implementaçãobeq
        ALUResult = 0
      }
      else ALUResult = ReadData1 - operando2
      break
      
    case 3: //mult
      ALUResult = ReadData1 * operando2
      break

    case 4:  //div
      ALUResult = ReadData1 / operando2
      break

    case 0: //and
      //AddBitWise é diferente, ele confere os bits e retorna só os comuns, faz o exemplo como resultado com os bits: reg1 110110110 (438) com reg2 1100011101(797)
      // e a comparação sobra 100010100 (276)
      ALUResult = ReadData1 & operando2
      break

    
      case 1: //or
      //Compara se existe 1 em um dos registradores em sequencia.
      ALUResult = ReadData1 | operando2
      break
     
      case 7: //slt
      
      //Se registrador 1 < registrador 2, retorna verdadeiro
      if(ReadData1 < operando2)
      ALUResult = 1
      else ALUResult = 0
      break
      
      case 8:
        //Pelo teste tá funcionando com a instrução 00000000000010100100100100000000
        //Ele descola 4 bits, com registrador setado em 9 (0000 1001) depois da operação fica 144(1001 0000)
      if(func==0){
        ALUResult = ReadData1 << operando2
      }
      break;
      //add 
      case 30:
      ALUResult = ReadData1 + operando2
      break
      //case 8:
        //  ALUResult = registradores[rs][1]+ReadData2
          //break   
  }

}

function dataMemory() {}

function calcularPC(){
  pc += 1
  if(Jump == 0){

  }
  else {

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
  pc = pc+4
  atualizarInterface()
}

