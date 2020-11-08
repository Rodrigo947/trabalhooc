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
  for (var i = 128; i <= enderecoFinalInstrucoes; i += 4) {
    $("#tabPC").append(
      '<tr class="valorPC">' +
        '<td id="instrucoes' + i +'" >' +
          Memoria_RAM.get(i) +
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

  for (let i = 128; i <= enderecoFinalInstrucoes; i += 4) {
    
    var opcode = retiraBits(31, 26, Memoria_RAM.get(i));

    if (opcode != 2 && opcode != 3) {
      //Se for do tipo J não possui registrador
      if (opcode == 0) {
        // Instruções do tipo R tem 3 registradores
        var rsrtrd = [];
        rsrtrd.push(retiraBits(25, 21, Memoria_RAM.get(i)));
        rsrtrd.push(retiraBits(20, 16, Memoria_RAM.get(i)));
        rsrtrd.push(retiraBits(15, 11, Memoria_RAM.get(i)));

        rsrtrd.forEach((reg) => {
          if (!registradoresPresentes.includes(reg))
            registradoresPresentes.push(reg);
        });
      } else {
        //Instruções do tipo I tem 2 registradores
        var rsrt = [];
        rsrt.push(retiraBits(25, 21, Memoria_RAM.get(i)));
        rsrt.push(retiraBits(20, 16, Memoria_RAM.get(i)));

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
        "<td id=reg" +registradoresPresentes[i]+' class="valorReg text-center">' + Memoria_RAM.get(registradoresPresentes[i]*4) +
        "</td>" +
        "<td class='text-center'>"+ decimal4hex(registradoresPresentes[i]*4) + "</td>" +
        "</tr>"
    );
  }
}
quantidade = 0;
function desenhaMemoria() {
  
  $("#tabMem").html("");
  
  for (var i = enderecoFinalInstrucoes+4; i <= enderecoFinalInstrucoes+(256*4); i += 4) {
    quantidade++;
    Memoria_RAM.set(i,quantidade)
    $("#tabMem").append(
      '<tr>' +
        '<td id=mem"'+i+'" class="valorMem text-center" >' +
          Memoria_RAM.get(i) +
        "</td>" +
        "<td class='text-center'>" +
          decimal4hex(i) +
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
        Memoria_RAM.set(enderecoFinalInstrucoes, parseInt(element, 2));
        enderecoFinalInstrucoes += 4;
      })
      enderecoFinalInstrucoes -=4;
      
      desenhaPC()
      desenhaRegistradores()
      desenhaMemoria()
      atualizarInterface()
      traduzirComando()
    }
  } else {
    if (textarea.value != "") {
      var array = textarea.value.split("\n");
      array.forEach((element) => {
        Memoria_RAM.set(enderecoFinalInstrucoes, parseInt(element, 2));
        enderecoFinalInstrucoes += 4;
      });
      enderecoFinalInstrucoes -=4;
      
      desenhaPC()
      desenhaRegistradores()
      desenhaMemoria()
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
    $(this).html(Memoria_RAM.get(id*4));
  });

  //Atualizar de memória de dados
  $(".valorMem").each(function () {
    id = $(this).attr("id").substring(3);
    $(this).html(Memoria_RAM.get(id));
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
  $("#instrucaoAtual").html("Finalizado")
}

function passoApasso() {

  if (pc <= enderecoFinalInstrucoes) {
    main();
    if(pc <= enderecoFinalInstrucoes)
      traduzirComando();
    else{
      $("#instrucaoAtual").html("Finalizado")
      $(".valorPC").each(function () {
        $(this).removeClass("instrucaoAtiva")
      })
    } 
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