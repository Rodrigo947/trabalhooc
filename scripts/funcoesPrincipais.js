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
      break;
    //sw
    case 43:
      break;
    //beq
    case 4:
      break;
    //bne
    case 5:
      break;

    //Tipo J
    //j
    case 2:
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
    //add
    case 2:
      resultado = registradores[rs][1] + registradores[operando2][1]
      break;
  }

  if(MemtoReg == 1)
    dataMemory(resultado)
  
  else
    registers(resultado)

}

function aluControl() {
  if (ALUOp == 2) {
    switch (func) {
      //add
      case 32:
        sinalAluControl = 2

      break;
      case 34:
        break;
      case 24:
        break;
      case 26:
        break;
      case 36:
        break;
      case 37:
        break;
      case 42:
        break;
      case 0:
        break;
      case 8:
        break;
    }
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
