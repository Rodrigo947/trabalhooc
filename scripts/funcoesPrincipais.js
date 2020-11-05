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
  //signExtendAux = retiraBits(15, 0, pc); comentei pra testar addi
  immediate=retiraBits(15, 0, pc);



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
    case 8: //addi
      RegDst = 0;
      Jump = 0;
      Branch = 0;
      MemRead = 0;
      MemtoReg = 0;
      ALUOp = 0; //nao tem
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
    RegDst = 0; //X 
    Jump = 0;
    Branch = 0;
    MemRead = 0;
    MemtoReg = 0; //X 
    ALUOp = 0;
    MEMWrite = 1;
    ALUSrc = 1;
    RegWrite = 0;
    break;

    case 4: //beq
      RegDst = 0; //Nao tenho certeza
      Jump = 0;
      Branch = 1;
      MemRead = 0;
      MemtoReg = 0; //Nao tenho certeza
      ALUOp = 1;
      MEMWrite = 0;
      ALUSrc = 0;
      RegWrite = 0;
      break;

    case 5: //bne
    //Necessarias mudanças no hardware ref: https://www.youtube.com/watch?v=SwvcWATBiHE
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
    //Necessarias mudanças no hardware para esse caso ref: https://www.youtube.com/watch?v=onJWhQAs-Jg
      break;
  }
}


function registers(writeData) {
  if(RegWrite == 1){
    if(RegDst == 0)
      registradores[rt][1] = writeData
      
    else
      registradores[rd][1] = writeData
  }
}

function signExtend() {}

function alu() {

  if (ALUSrc == 0) 
    operando2 = rt
  else //mais condições para operando2, nao coloquei porque são 5:35 da manhã KEKW ITU
    //operando2=signExtendAux Mudei para immediate pra teste do addi
    //operando2 = immediate
    operando2 = sa  //
    //NemEntra no AluControl

  if(opcode == 8) ALUResult = registradores[rs][1]+operando2

  //Se inicializar alucontrol = 0 ele sempre enta aqui por causa do AND
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
        ALUResult = registradores[rs][1] + registradores[operando2][1] 
      }
      break;

    //sub
    case 6:
      if(ALUOp==1){
        //implementaçãobeq
        ALUResult = 0
      }
      else ALUResult = registradores[rs][1] - registradores[operando2][1]
      break
      
    //mult
    case 24:
      ALUResult = registradores[rs][1] * registradores[operando2][1]
      break

    //div
    case 26:
      ALUResult = registradores[rs][1] / registradores[operando2][1]
      break

    //and
    case 0:
      //AddBitWise é diferente, ele confere os bits e retorna só os comuns, faz o exemplo como resultado com os bits: reg1 110110110 (438) com reg2 1100011101(797)
      // e a comparação sobra 100010100 (276)
      ALUResult = registradores[rs][1] & registradores[operando2][1]
      break

    //or
      case 1:
      //Compara se existe 1 em um dos registradores em sequencia.
      ALUResult = registradores[rs][1] | registradores[operando2][1]
      break
     
      case 7:
        //sll coloquei no mesmo case de slt pra facilitar mas nao tem sinalAluControl
        //Pelo teste tá funcionando com a instrução 00000000000010100100100100000000
        //Ele descola 4 bits, com registrador setado em 9 (0000 1001) depois da operação fica 144(1001 0000)
      if(func==0){
        ALUResult=registradores[rt][1] << sa
      }
      //slt
      //Se registrador 1 < registrador 2, retorna verdadeiro
      else if(registradores[rs][1] < registradores[operando2][1])
      ALUResult = 1
      else ALUResult = 0
      break
      
      //add 
      case 30:
      ALUResult = registradores[rs][1]+operando2
      break
      //case 8:
        //  ALUResult = registradores[rs][1]+operando2
          //break   
  }

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
        sinalAluControl = 7
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
      //case 8:
        //sinalAluControl = 8
        //break;
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
  pc = instrucoes[posicaoPC]
  instructionMemory()
  control()
  aluControl()
  alu()
  if(MemtoReg == 1)
    dataMemory(ALUResult)
  else
    registers(ALUResult)
  posicaoPC++
  atualizarInterface()
}

function execucaoTotal() {
  while(posicaoPC != instrucoes.length)
    main()
}

function passoApasso() {
  if(posicaoPC != instrucoes.length)
    main()
}