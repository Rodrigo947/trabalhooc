class Memory{

    constructor(){
        this.memoria = {}
    }
    get(endereco){
        hex = decimal4hex(endereco)
        return this.memoria[hex]
    }
    
    set(endereco,valor){
        hex = decimal4hex(endereco)
        this.memoria[hex] = valor 
    }

    size(){
        return Object.keys(this.memoria).length 
    }

    //Retorna um vetor de hexadecimais
    allKeys() {
        return Object.keys(this.memoria)
    }

    //Retorna um vetor de valores
    allValues() {
        return Object.values(this.memoria)
    }
}