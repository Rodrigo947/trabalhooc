//Assim que a página carrega abre imagem em svg
xhr = new XMLHttpRequest();
xhr.open("GET", "imagem.svg", false);
xhr.onload = function (e) {
  document
    .getElementById("imagem")
    .appendChild(xhr.responseXML.documentElement);
};
xhr.send("");
//----

function desenhaPC() {
  $("#tabPC").html("");
  for (var i = 0; i <= enderecoFinalInstrucoes; i += 4) {
    $("#tabPC").append(
      '<tr class="valorPC">' +
        '<td id="instrucoes' + i +'" >' +
          memoria_de_instrucoes.get(i) +
        "</td>" +
        "<td>" +
          decimal4hex(i) +
        "</td>" +
        "</tr>"
    );
  }
}

function desenhaRegistradores() {
  $("#tabReg").html("");
  var registradoresPresentes = [];

  for (let i = 0; i <= enderecoFinalInstrucoes; i += 4) {
    
    var opcode = retiraBits(31, 26, memoria_de_instrucoes.get(i));

    if (opcode != 2 && opcode != 3) {
      //Se for do tipo J não possui registrador
      if (opcode == 0) {
        // Instruções do tipo R tem 3 registradores
        var rsrtrd = [];
        rsrtrd.push(retiraBits(25, 21, memoria_de_instrucoes.get(i)));
        rsrtrd.push(retiraBits(20, 16, memoria_de_instrucoes.get(i)));
        rsrtrd.push(retiraBits(15, 11, memoria_de_instrucoes.get(i)));

        rsrtrd.forEach((reg) => {
          if (!registradoresPresentes.includes(reg))
            registradoresPresentes.push(reg);
        });
      } else {
        //Instruções do tipo I tem 2 registradores
        var rsrt = [];
        rsrt.push(retiraBits(25, 21, memoria_de_instrucoes.get(i)));
        rsrt.push(retiraBits(20, 16, memoria_de_instrucoes.get(i)));

        rsrt.forEach((reg) => {
          if (!registradoresPresentes.includes(reg))
            registradoresPresentes.push(reg);
        });
      }
    }
  }

  registradoresPresentes.sort((a, b) => a - b);

  for (var i = 0; i < registradoresPresentes.length; i++) {
    $("#tabReg").append(
      "<tr>" +
        "<td>" +dicRegistradores[registradoresPresentes[i]] +"</td>" +
        "<td id=reg" +registradoresPresentes[i]+' class="valorReg text-center">' + memoria_de_instrucoes.get(registradoresPresentes[i]*4) +
        "</td>" +
        "<td class='text-center'>"+ decimal4hex(registradoresPresentes[i]*4) + "</td>" +
        "</tr>"
    );
  }
}

function desenhaMemoriaDados() {

  $("#tabMem").html("");
  for (var i = 0; i <= 63; i ++) {
    $("#tabMem").append(
      '<tr>' +
        '<td id="mem'+i+'" class="valorMem text-center" >' +
          memoria_de_dados.get(i*4) +
        "</td>" +
        "<td class='text-center'>" +
          decimal4hex(i*4) +
        "</td>" +
        "</tr>"
    );
  }
}

function lerComandos() {
  iniciarVarGlobais()
  var input = document.getElementById("fileinput");
  var textarea = document.getElementById("textarea");
  if (input.files[0] != null) {
    var file = input.files[0];
    var fr = new FileReader();
    fr.readAsText(file);
    fr.onload = function () {
      var fileArr = fr.result.split("\n");

      fileArr.forEach((element) => {
        memoria_de_instrucoes.set(enderecoFinalInstrucoes, parseInt(element, 2));
        enderecoFinalInstrucoes += 4;
      })
      enderecoFinalInstrucoes -=4;
      
      desenhaPC()
      desenhaRegistradores()
      desenhaMemoriaDados()
      atualizarInterface()
      traduzirComando()
    }
  } else {
    if (textarea.value != "") {
      var array = textarea.value.split("\n");
      array.forEach((element) => {
        memoria_de_instrucoes.set(enderecoFinalInstrucoes, parseInt(element, 2));
        enderecoFinalInstrucoes += 4;
      });
      enderecoFinalInstrucoes -=4;
      
      desenhaPC()
      desenhaRegistradores()
      desenhaMemoriaDados()
      atualizarInterface()
      traduzirComando()
    } else {
      return false
    }
  }
  return true
}

function atualizarInterface() {
  //Atualizar instrução ativa
  $(".valorPC").each(function () {
    $(this).removeClass("instrucaoAtiva");
  });
  $("#instrucoes" + parseInt(pc))
    .parent()
    .addClass("instrucaoAtiva");

  //Atualizar tabela banco de registradores
  $(".valorReg").each(function () {
    id = $(this).attr("id").substring(3);
    $(this).html(banco_de_registradores.get(id*4));
  });

  //Atualizar de memória de dados
  $(".valorMem").each(function () {
    id = $(this).attr("id").substring(3);
    $(this).html(memoria_de_dados.get(id*4));
  });

}

function carregar() {
  iniciarVarGlobais()
  if (lerComandos()) {
    $("#titulos").hide()
    $("#entradas").hide()
    $("#estados").show()
    $("#btnCarregar").hide()
    $("#btns").show()
    $("tituloTabela2").html("Banco de Registradores")
  }
}

function reset() {
  iniciarVarGlobais()
  resetImagem()
  $("#titulos").show()
  $("#entradas").show()
  $("#estados").hide()
  $("#btnCarregar").show()
  $("#btns").hide()
}

function execucaoTotal() {

  while (pc <= enderecoFinalInstrucoes) 
    main();

  $(".valorPC").each(function () {
    $(this).removeClass("instrucaoAtiva")
  })
  traduzirComando();
  $("#instrucaoAtual").html("Finalizado")
}

function passoApasso() {

  if (pc <= enderecoFinalInstrucoes) {
    main();
    traduzirComando();
  } 
  else{
    $(".valorPC").each(function () {
      $(this).removeClass("instrucaoAtiva")
    })
  } 
}


function trocarTabelas(){
  if($('#divBancoReg').css('display') == 'none'){
    $("#tituloTabela2").html("Banco de Registradores")
    $("#divBancoReg").show()
    $("#divBancoMem").hide()
  }
  else{
    $("#tituloTabela2").html("Memória de Dados")
    $("#divBancoReg").hide()
    $("#divBancoMem").show()
  }

}



$('#fileinput').on("change",function(){
  if($(this).val()!='')
    $('#nomeDoArquivo').html($(this).val().substring(12))
  else
    $('#nomeDoArquivo').html('Escolha um arquivo')

})

function resetImagem() {
  Object.values(dicComandosR).forEach((element) =>{
    $("."+element).css("stroke","black")
  })
  Object.values(dicComandosIJ).forEach((element) =>{
    $("."+element).css("stroke","black")
  })
}

function trocarSinaisControleImg(){
  $('#RegDst').html(RegDst);
  $('#Jump').html(Jump);
  $('#Branch').html(Branch);
  $('#MemRead').html(MemRead);
  $('#MemtoReg').html(MemtoReg);
  $('#ALUOp').html(ALUOp);
  $('#MemWrite').html(MemWrite);
  $('#ALUSrc').html(ALUSrc);
  $('#RegWrite').html(RegWrite);
  $('#Bne').html(Bne);
}