async function capturar(nome, imagem, tipo) {
    await axios.post("http://localhost:3000/pokedex", {
        nome: nome,
        imagem: imagem,
        tipo: tipo
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    });
}