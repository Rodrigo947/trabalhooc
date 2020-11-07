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
  for (var i = 0; i < memoria_de_instrucoes.size(); i++) {
    $("#tabPC").append(
      '<tr class="valorPC">' +
        '<td id="instrucoes' +(100 + i * 4) +'" >' +
          memoria_de_instrucoes.allValues()[i] +
        "</td>" +
        "<td>" +
          memoria_de_instrucoes.allKeys()[i] +
        "</td>" +
        "</tr>"
    );
  }
}

function desenhaRegistradores() {
  $("#tabReg").html("");
  var registradoresPresentes = [];

  memoria_de_instrucoes.allValues().forEach((instrucao) => {
    var opcode = retiraBits(31, 26, instrucao);

    if (opcode != 2 && opcode != 3) {
      //Se for do tipo J não possui registrador
      if (opcode == 0) {
        // Instruções do tipo R tem 3 registradores
        var rsrtrd = [];
        rsrtrd.push(retiraBits(25, 21, instrucao));
        rsrtrd.push(retiraBits(20, 16, instrucao));
        rsrtrd.push(retiraBits(15, 11, instrucao));

        rsrtrd.forEach((reg) => {
          if (!registradoresPresentes.includes(reg))
            registradoresPresentes.push(reg);
        });
      } else {
        //Instruções do tipo I tem 2 registradores
        var rsrt = [];
        rsrt.push(retiraBits(25, 21, instrucao));
        rsrt.push(retiraBits(20, 16, instrucao));

        rsrt.forEach((reg) => {
          if (!registradoresPresentes.includes(reg))
            registradoresPresentes.push(reg);
        });
      }
    }
  });

  registradoresPresentes.sort((a, b) => a - b);

  for (var i = 0; i < registradoresPresentes.length; i++) {
    $("#tabReg").append(
      "<tr>" +
        "<td>" +dicRegistradores[registradoresPresentes[i]] +"</td>" +
        "<td id=reg" +registradoresPresentes[i]+' class="valorReg">' + banco_de_registradores[i].get(0) +
        "</td>" +
        "</tr>"
    );
  }
}

function lerComandos() {
  iniciarVarGlobais()
  var input = document.getElementById("fileinput");
  var textarea = document.getElementById("textarea");
  var endereco = 100;
  if (input.files[0] != null) {
    var file = input.files[0];
    var fr = new FileReader();
    fr.readAsText(file);
    fr.onload = function () {
      var fileArr = fr.result.split("\n");

      fileArr.forEach((element) => {
        memoria_de_instrucoes.set(endereco, parseInt(element, 2));
        endereco += 4;
      })
      
      desenhaPC()
      desenhaRegistradores()
      atualizarInterface()
      traduzirComando()
    }
  } else {
    if (textarea.value != "") {
      var array = textarea.value.split("\n");
      array.forEach((element) => {
        memoria_de_instrucoes.set(endereco, parseInt(element, 2));
        endereco += 4;
      });
      
      desenhaPC()
      desenhaRegistradores()
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

  //Atualizar tabela de registradores
  $(".valorReg").each(function () {
    id = $(this).attr("id").substring(3);
    $(this).html(banco_de_registradores[id].get(0));
  });

}

function carregar() {
  if (lerComandos()) {
    $("#titulos").hide();
    $("#entradas").hide();
    $("#estados").show();
    $("#btnCarregar").hide();
    $("#btns").show();
  }
}

function reset() {
  iniciarVarGlobais()
  $("#titulos").show();
  $("#entradas").show();
  $("#estados").hide();
  $("#btnCarregar").show();
  $("#btns").hide();
}

function execucaoTotal() {
  var size = memoria_de_instrucoes.size();
  var enderecoFinal = memoria_de_instrucoes.allKeys()[size - 1];

  while (parseInt(pc) < parseInt(enderecoFinal)) 
    main();

  $(".valorPC").each(function () {
    $(this).removeClass("instrucaoAtiva");
  });
  $("#instrucaoAtual").html("Finalizado");
}

function passoApasso() {
  var size = memoria_de_instrucoes.size();
  var enderecoFinal = memoria_de_instrucoes.allKeys()[size - 1];

  if (parseInt(pc) < parseInt(enderecoFinal)) {
    main();
    traduzirComando();
  } else{
    $("#instrucaoAtual").html("Finalizado");
    $(".valorPC").each(function () {
      $(this).removeClass("instrucaoAtiva");
    });
  } 
}
