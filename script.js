var pc = []

function lerComandos(){
    var input = document.getElementById("fileinput")
    var textarea = document.getElementById("textarea")
    
    if(input.files[0]!=null){
        var file = input.files[0]
        var fr = new FileReader()
        fr.readAsText(file)
        fr.onload = function (e) {
            var fileArr = fr.result.split('\n');
            
            fileArr.forEach(element => {
                pc.push(parseInt(element,2))
            })
            desenhaPC()
        }
    }
    else {
        if(textarea.value != ''){
            var array = textarea.value.split('\n')
            array.forEach(element => {
                pc.push(parseInt(element,2))
            })
            desenhaPC()
        }
        else{
            return false
        }
    }
    return true
}

function desenhaPC(){
    $('#tabPC').html('')
    for (var i = 0; i < pc.length; i++) {
        $('#tabPC').append('<tr><td id=pc'+i+'>'+pc[i]+'</td></tr>')
    }
        
}

function main() {
    
    if(lerComandos()){
        $('#titulos').hide()
        $('#entradas').hide()
        $('#estados').show()
        $('#btnComecar').hide()
        $('#btnReiniciar').show()
    }
    
}

function reset(){
    pc = []
    $('#titulos').show()
    $('#entradas').show()
    $('#estados').hide()
    $('#btnComecar').show()
    $('#btnReiniciar').hide()
}



