function capturar(nome, imagem, tipo) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/pokedex", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({
        nome: nome,
        imagem: imagem,
        tipo: tipo
    }));
}

function deletar(id) {
    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", `http://localhost:3000/pokedex/${id}`, true);
    xhr.send();
}

function editar(id, nome) {
    const xhr = new XMLHttpRequest();
    xhr.open("PATCH", `http://localhost:3000/pokedex/${id}`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({
        nome: nome
    }));
}