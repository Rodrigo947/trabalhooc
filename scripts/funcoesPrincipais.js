function retiraBits(final,inicial,instrucao){
    var shiftEsquerda = 31 - final
    var bits = ((instrucao << shiftEsquerda) >>> 0)
    shiftDireita = 31 - (final - inicial)
    bits = (bits >>> shiftDireita)
    return bits
}