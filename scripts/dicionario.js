
function traduzirComando (){
    var instrucaoTraduzida
    var opcode = retiraBits(31, 26, instrucoes[posicaoPC]);
    var rs = retiraBits(25, 21, instrucoes[posicaoPC]);
    var rt = retiraBits(20, 16, instrucoes[posicaoPC]);
    var rd = retiraBits(15, 11, instrucoes[posicaoPC]);
    var sa = retiraBits(10, 6, instrucoes[posicaoPC]);
    var func = retiraBits(5, 0, instrucoes[posicaoPC]);
    var immediate = retiraBits(15, 0, instrucoes[posicaoPC]);
    var desvio = retiraBits(25, 0, instrucoes[posicaoPC]);
    
    if(opcode == 0){
        //Tipo R
        switch (func) {
            case 0: //sll
                instrucaoTraduzida = dicComandosR[func] + " "
                + registradores[rd][0] + ", "
                + registradores[rt][0] + ", "
                + sa
                break;
        
            case 8: //jr
                instrucaoTraduzida = dicComandosR[func] + " "
                + registradores[rs][0]
                break;
            
            default: //Tipo R qualquer
                instrucaoTraduzida = dicComandosR[func] + " "
                + registradores[rd][0] + ", "
                + registradores[rs][0] + ", "
                + registradores[rt][0]
                break;
        }

    }
    else{
        switch (opcode) {
            case 2: case 3: //tipo J
                instrucaoTraduzida = dicComandosIJ[opcode] + " " + desvio
                break;
            
            case 35: case 43:  //lw e sw
                instrucaoTraduzida = dicComandosIJ[opcode] + " "
                + registradores[rt][0] + ", "
                + immediate+"("+registradores[rs][0]+")"
                break;
            
            case 4: case 5:  //beq e bne
                instrucaoTraduzida = dicComandosIJ[opcode] + " "
                + registradores[rs][0] + ", "
                + registradores[rt][0] + ", "
                + immediate
                break;
        
            default:  //Tipo I qualquer
                instrucaoTraduzida = dicComandosIJ[opcode] + " "
                + registradores[rt][0] + ", "
                + registradores[rs][0] + ", "
                + immediate
                break;
        }
        
    }
        

    $('#instrucaoAtual').html(instrucaoTraduzida)
}

dicComandosR = {
    '32':'add',
    '34':'sub',
    '24':'mult',
    '26':'div',
    '36':'and',
    '37':'or',
    '42':'slt',
    '0':'sll',
    '8':'jr',
}

dicComandosIJ = {
    '8':'addi',
    '35':'lw',
    '43':'sw',
    '4':'beq',
    '5':'bne',
    '2':'j',
    '3':'jal'
}

registradores[0][0] = '$zero'
registradores[1][0] = '$at'
registradores[2][0] = '$v0'
registradores[3][0] = '$v1'
registradores[4][0] = '$a0'
registradores[5][0] = '$a1'
registradores[6][0] = '$a2'
registradores[7][0] = '$a3'
registradores[8][0] = '$t0'
registradores[9][0] = '$t1'
registradores[10][0] = '$t2'
registradores[11][0] = '$t3'
registradores[12][0] = '$t4'
registradores[13][0] = '$t5'
registradores[14][0] = '$t6'
registradores[15][0] = '$t7'
registradores[16][0] = '$s0'
registradores[17][0] = '$s1'
registradores[18][0] = '$s2'
registradores[19][0] = '$s3'
registradores[20][0] = '$s4'
registradores[21][0] = '$s5'
registradores[22][0] = '$s6'
registradores[23][0] = '$s7'
registradores[24][0] = '$t8'
registradores[25][0] = '$t9'
registradores[26][0] = '$k0'
registradores[27][0] = '$k1'
registradores[28][0] = '$gp'
registradores[29][0] = '$sp'
registradores[30][0] = '$fp'
registradores[31][0] = '$ra'
    


