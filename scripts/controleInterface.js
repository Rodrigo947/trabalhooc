//Assim que a página carrega abre imagem em svg
xhr = new XMLHttpRequest();
xhr.open("GET","imagem.svg",false);
xhr.onload = function(e) {
  document.getElementById("imagem")
    .appendChild(xhr.responseXML.documentElement);
}
xhr.send("");
//----

function desenhaPC(){
    $('#tabPC').html('')
    for (var i = 0; i < instrucoes.length; i++) {
        $('#tabPC').append('<tr><td id=instrucoes'+i+'>'+instrucoes[i]+'</td></tr>')
    }    
}

function desenhaRegistradores(){
    $('#tabReg').html('')
    var registradoresPresentes = []
    
    instrucoes.forEach(instrucao => {
        var opcode = retiraBits(31,26,instrucao)
        
        if(opcode != 2 && opcode != 3){ //Se for do tipo J não possui registrador
            if(opcode == 0){ // Instruções do tipo R tem 3 registradores
                var rsrtrd = []
                rsrtrd.push(retiraBits(25,21,instrucao))
                rsrtrd.push(retiraBits(20,16,instrucao))
                rsrtrd.push(retiraBits(15,11,instrucao)) 

                rsrtrd.forEach(reg => {
                    if(!registradoresPresentes.includes(reg))
                        registradoresPresentes.push(reg)
                });
            }
            else { //Instruções do tipo I tem 2 registradores
                var rsrt = []
                rsrt.push(retiraBits(25,21,instrucao))
                rsrt.push(retiraBits(20,16,instrucao))

                rsrt.forEach(reg => {
                    if(!registradoresPresentes.includes(reg))
                        registradoresPresentes.push(reg)
                });
            }
        }
    });

    registradoresPresentes.sort((a, b) => a - b)

    for (var i = 0; i < registradoresPresentes.length; i++) {
        $('#tabReg').append('<tr><td>'+registradores[registradoresPresentes[i]][0]+'</td><td id=reg'+registradoresPresentes[i]+'>'+registradores[i][1]+'</td></tr>')
    } 
}

function atualizaRegistrador(num){
    $('#reg'+num).html(registradores[num][1])
}


function lerComandos(){
    var input = document.getElementById("fileinput")
    var textarea = document.getElementById("textarea")
    
    if(input.files[0]!=null){
        var file = input.files[0]
        var fr = new FileReader()
        fr.readAsText(file)
        fr.onload = function () {
            var fileArr = fr.result.split('\n');
            
            fileArr.forEach(element => {
                instrucoes.push(parseInt(element,2))
            })
            desenhaPC()
            desenhaRegistradores()
        }
    }
    else {
        if(textarea.value != ''){
            var array = textarea.value.split('\n')
            array.forEach(element => {
                instrucoes.push(parseInt(element,2))
            })
            desenhaPC()
            desenhaRegistradores()
        }
        else{
            return false
        }
    }
    return true
}


function iniciar() {
    
    if(lerComandos()){
        $('#titulos').hide()
        $('#entradas').hide()
        $('#estados').show()
        $('#btnComecar').hide()
        $('#btnReiniciar').show()
        main()
    }
    
}

function reset(){
    instrucoes = []
    $('#titulos').show()
    $('#entradas').show()
    $('#estados').hide()
    $('#btnComecar').show()
    $('#btnReiniciar').hide()
}



