function B(nome: string) {
    console.log(nome)
}
function A(type: string) {
    return B
}
A("A")("asdsad")