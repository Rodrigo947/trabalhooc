function traduzirComando() {
  var instrucaoTraduzida;
  var opcode = retiraBits(31, 26, memoria_de_instrucoes.get(pc));
  var rs = retiraBits(25, 21, memoria_de_instrucoes.get(pc));
  var rt = retiraBits(20, 16, memoria_de_instrucoes.get(pc));
  var rd = retiraBits(15, 11, memoria_de_instrucoes.get(pc));
  var sa = retiraBits(10, 6, memoria_de_instrucoes.get(pc));
  var func = retiraBits(5, 0, memoria_de_instrucoes.get(pc));
  var immediate = retiraBits(15, 0, memoria_de_instrucoes.get(pc));
  var desvio = retiraBits(25, 0, memoria_de_instrucoes.get(pc));

  if (opcode == 0) {
    //Tipo R
    switch (func) {
      case 0: //sll
        instrucaoTraduzida =
          dicComandosR[func] +
          " " +
          dicRegistradores[rd] +
          ", " +
          dicRegistradores[rt] +
          ", " +
          sa;
        break;

      case 8: //jr
        instrucaoTraduzida = dicComandosR[func] + " " + dicRegistradores[rs];
        break;

      default:
        //Tipo R qualquer
        instrucaoTraduzida =
          dicComandosR[func] +
          " " +
          dicRegistradores[rd] +
          ", " +
          dicRegistradores[rs] +
          ", " +
          dicRegistradores[rt];
        break;
    }
  } else {
    switch (opcode) {
      case 2:
      case 3: //tipo J
        instrucaoTraduzida = dicComandosIJ[opcode] + " " + desvio;
        break;

      case 35:
      case 43: //lw e sw
        instrucaoTraduzida =
          dicComandosIJ[opcode] +
          " " +
          dicRegistradores[rt] +
          ", " +
          immediate +
          "(" +
          dicRegistradores[rs] +
          ")";
        break;

      case 4:
      case 5: //beq e bne
        instrucaoTraduzida =
          dicComandosIJ[opcode] +
          " " +
          dicRegistradores[rs] +
          ", " +
          dicRegistradores[rt] +
          ", " +
          immediate;
        break;

      default:
        //Tipo I qualquer
        instrucaoTraduzida =
          dicComandosIJ[opcode] +
          " " +
          dicRegistradores[rt] +
          ", " +
          dicRegistradores[rs] +
          ", " +
          immediate;
        break;
    }
  }

  $("#instrucaoAtual").html(instrucaoTraduzida);
}

function decimal4hex(num){
  hex = num.toString(16)
  while(hex.length < 6)
      hex = '0'+hex
  hex = '0x'+hex
  return hex
}

dicComandosR = {
  32: "add",
  34: "sub",
  24: "mult",
  26: "div",
  36: "and",
  37: "or",
  42: "slt",
  0: "sll",
  8: "jr",
};

dicComandosIJ = {
  8: "addi",
  35: "lw",
  43: "sw",
  4: "beq",
  5: "bne",
  2: "j",
  3: "jal",
};

dicRegistradores = {
  0: "$zero",
  1: "$at",
  2: "$v0",
  3: "$v1",
  4: "$a0",
  5: "$a1",
  6: "$a2",
  7: "$a3",
  8: "$t0",
  9: "$t1",
  10: "$t2",
  11: "$t3",
  12: "$t4",
  13: "$t5",
  14: "$t6",
  15: "$t7",
  16: "$s0",
  17: "$s1",
  18: "$s2",
  19: "$s3",
  20: "$s4",
  21: "$s5",
  22: "$s6",
  23: "$s7",
  24: "$t8",
  25: "$t9",
  26: "$k0",
  27: "$k1",
  28: "$gp",
  29: "$sp",
  30: "$fp",
  31: "$ra",
};
