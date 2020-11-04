function retiraBits(final, inicial, instrucao) {
  var shiftEsquerda = 31 - final;
  var bits = (instrucao << shiftEsquerda) >>> 0;
  shiftDireita = 31 - (final - inicial);
  bits = bits >>> shiftDireita;
  return bits;
}

function instructionMemory() {
  opcode = retiraBits(31, 26, pc);
  rs = retiraBits(25, 21, pc);
  rt = retiraBits(20, 16, pc);
  rd = retiraBits(15, 11, pc);
  sa = retiraBits(10, 6, pc);
  func = retiraBits(5, 0, pc);
  signExtendAux = retiraBits(15, 0, pc);

  control();
  aluControl();
  alu();
  //signExtend();
  
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
    //addi
    case 8:
      break;
    //lw
    case 35:
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
    //sw
    case 43:
      break;
    //beq
    case 4:
      RegDst = 1; //Nao tenho certeza
      Jump = 0;
      Branch = 1;
      MemRead = 0;
      MemtoReg = 1; //Nao tenho certeza
      ALUOp = 1;
      MEMWrite = 0;
      ALUSrc = 0;
      RegWrite = 0;
      break;
    //bne
    case 5:
      break;

    //Tipo J
    //j
    case 2:
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
    //jal
    case 3:
      break;
  }
}


function registers(writeData) {
  if(RegWrite == 1){
    if(RegDst == 0){
      registradores[rt][1] = writeData
      atualizaRegistrador(rt)
    }
    else{
      registradores[rd][1] = writeData
      atualizaRegistrador(rd)
    }
  }
}

function signExtend() {}

function alu() {
  var resultado

  if (ALUSrc == 0) 
    operando2 = rt
  else
    operando2 = signExtendAux
  switch (sinalAluControl) {
    //add LW SW
    case 2:
      if(ALUOp == 0 && opcode == 35){
        //implementaçãoLW
      }
      if(ALUOp == 0 && opcode == 43){
        //implementaçãoSW
      }
      else {
      resultado = registradores[rs][1] + registradores[operando2][1] 
      }
      break;

    //sub
    case 6:
      if(ALUOp==1){
        //implementaçãobeq
      }
      else resultado = registradores[rs][1] - registradores[operando2][1]
      break
      
    //mult
    case 24:
      resultado = registradores[rs][1] * registradores[operando2][1]
      break
    //div
    case 26:
      resultado = registradores[rs][1] / registradores[operando2][1]
      break
    //and
    case 0:
      //AddBitWise é diferente, ele confere os bits e retorna só os comuns, faz o exemplo como resultado com os bits: reg1 110110110 (438) com reg2 1100011101(797)
      // e a comparação sobra 100010100 (276)
      resultado = registradores[rs][1] & registradores[operando2][1]
      break
    //or
      case 1:
      //Compara se existe 1 em um dos registradores em sequencia.
      resultado = registradores[rs][1] | registradores[operando2][1]
      break
    //slt
      case 7:
      //Se registrador 1 < registrador 2, retorna verdadeiro
      if(registradores[rs][1] < registradores[operando2][1])
      resultado = 1
      else resultado = 0
      break
  }

  if(MemtoReg == 1)
    dataMemory(resultado)
  
  else
    registers(resultado)

}

function aluControl() {
  //tipoR
  if (ALUOp == 2) {
    switch (func) {
      //add
      case 32:
        sinalAluControl = 2
      break;
      //sub
      case 34:
        sinalAluControl = 6
        break;
      //mult
      case 24:
        sinalAluControl = 24
        break;
      //div
      case 26:
        sinalAluControl = 26
        break;
      //and
      case 36:
        sinalAluControl = 0
        break;
      //or
      case 37:
        sinalAluControl = 1
        break;
      //slt
      case 42:
        sinalAluControl = 7
        break;
      case 0:
        break;
      case 8:
        break;
    }
  }


  //TipoI
  //lw sw
  if(ALUOp == 0){
    switch (opcode){
      //lw
      case 35:
        sinalAluControl = 2
        break
      case 43:
        sinalAluControl = 2
        break
    }
  }
  if(ALUOp == 1){
    //beq
    sinalAluControl = 6
  }

  //TipoJ
  //j
  if(opcode == 2){
    //Implementação J
  }

}

function dataMemory() {}

function calcularPC(){
  posicaoPC += 1
  if(Jump == 0){

  }
  else {

  }
}

function main() {

  //while(posicaoPC != instrucoes.length()){
    pc = instrucoes[posicaoPC]
    instructionMemory()


  //}
  
}
