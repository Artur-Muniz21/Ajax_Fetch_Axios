const buscarFetch = document.getElementById("buscarFetch");
const buscarAjax = document.getElementById("buscarAjax");
const buscarPokemon = document.getElementById("buscarPokemon");
const resposta = document.getElementById("resposta");
const pokedex = document.getElementById("pokedex");

carregarPokedex()

buscarFetch.onclick = () => {
    const nomePokemon = buscarPokemon.value.toLowerCase(); 
    fetchPokemon(nomePokemon);
}

buscarAjax.onclick = () => {
    const nomePokemon = buscarPokemon.value.toLowerCase(); 
    ajaxPokemon(nomePokemon);
}

async function fetchPokemon(nomePokemon) {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?offset=0&limit=100000");
    const data = await response.json();
    const results = data.results;

    const pokemonEncontrado = results.find(pokemon => pokemon.name === nomePokemon);

    if (pokemonEncontrado) {
        await fetchPokemonEspecifico(pokemonEncontrado.url);
    } else {
        resposta.innerHTML = `<p>Pokémon não encontrado. Verifique o nome e tente novamente.</p>`;
    }
}

async function fetchPokemonEspecifico(url) {
    const response = await fetch(url);
    const data = await response.json();
    const id = data.id;
    const habilidades = data.abilities;
    const nome = data.species.name;
    const imagem = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
    const tipo = data.types[0].type.name;

    resposta.innerHTML = ''

    resposta.innerHTML = 
    `
        <div class="pokemonInfo">
            <img class="imgPokemon" src="${imagem}" alt="${nome}">
            <p>${nome}</p>
            <p>${tipo}</p>
            <div class="listaHabilidades"><p>Habilidades: <br></p></div>
            <button class="btnCapturar"><img src="pokeball-pokemon-svgrepo-com.svg"></button>
        </div>
    `;

    const btnCapturar = resposta.querySelector(".btnCapturar");  
    const listaHabilidades = resposta.querySelector(".listaHabilidades");

    habilidades.forEach(habilidade => {
        const habilidadeItem = document.createElement('p');
        habilidadeItem.textContent = habilidade.ability.name;
        listaHabilidades.appendChild(habilidadeItem);
    });

    btnCapturar.onclick = (event) => {
        event.preventDefault();
        capturar(nome, imagem, tipo);
    };
}

function ajaxPokemon(nomePokemon) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "https://pokeapi.co/api/v2/pokemon?offset=0&limit=100000", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            const results = data.results;

            const pokemonEncontrado = results.find(pokemon => pokemon.name === nomePokemon);

            if (pokemonEncontrado) {
                ajaxPokemonEspecifico(pokemonEncontrado.url);
            } else {
                resposta.innerHTML = `<p>Pokémon não encontrado. Verifique o nome e tente novamente.</p>`;
            }
        }
    };
    xhr.send();
}

function ajaxPokemonEspecifico(url) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            const id = data.id;
            const habilidades = data.abilities;
            const nome = data.species.name;
            const nomeCapitalizado = nome.charAt(0).toUpperCase() + nome.slice(1);
            const imagem = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
            const tipo = data.types[0].type.name;

            resposta.innerHTML = '';

            resposta.innerHTML = 
            `
                <div class="pokemonInfo">
                    <img class="imgPokemon" src="${imagem}" alt="${nome}">
                    <p>${nomeCapitalizado}</p>
                    <p>${tipo}</p>
                    <div class="listaHabilidades"><p>Habilidades: <br></p></div>
                    <button class="btnCapturar"><img src="pokeball-pokemon-svgrepo-com.svg"></button>
                </div>
            `;

            const btnCapturar = resposta.querySelector(".btnCapturar");  
            const listaHabilidades = resposta.querySelector(".listaHabilidades");

            habilidades.forEach(habilidade => {
                const habilidadeItem = document.createElement('p');
                habilidadeItem.textContent = habilidade.ability.name;
                listaHabilidades.appendChild(habilidadeItem);
            });

            btnCapturar.onclick = (event) => {
                event.preventDefault();
                capturar(nome, imagem, tipo);
            };
        }
    };
    xhr.send();
}

async function capturar(nome, imagem, tipo) {
    await fetch("http://localhost:3000/pokedex", {
        method: "POST",
        headers: {"Content-Type": "application/json"  },
        body: JSON.stringify({
          nome: nome,
          imagem: imagem,
          tipo: tipo
        })
    });
}

async function carregarPokedex(){

    pokedex.innerHTML = ""

    const response = await fetch("http://localhost:3000/pokedex");
    const data = await response.json();
    data.forEach(pokemon => {

        const minhaPokedex = document.createElement('div');
        minhaPokedex.className = "minhaPokedex";
    
        minhaPokedex.innerHTML = 
        `
            <div class="pokemonsPokedex">
                <img src="${pokemon.imagem}">
                <p>Nome: ${pokemon.nome}</p>
                <p>Tipo: ${pokemon.tipo}</p>
                <button class="btnEditar">Editar</button>
                <button class="btnDeletar">Deletar</button>
            </div>
        `;

        pokedex.appendChild(minhaPokedex);

        const pokemonsPokedex = minhaPokedex.querySelector('.pokemonsPokedex');
        const btnDeletar = minhaPokedex.querySelector('.btnDeletar');
        const btnEditar = minhaPokedex.querySelector('.btnEditar');

        btnDeletar.onclick = () => {
            deletar(pokemon.id);
        }

        btnEditar.onclick = () => {
            camposEditar(pokemonsPokedex, pokemon.imagem, pokemon.id)
        }
    })
}

async function deletar(id) {
    await fetch(`http://localhost:3000/pokedex/${id}`, {method: "DELETE"});
}

async function camposEditar(pokemonsPokedex, imagem, id) {
    pokemonsPokedex.innerHTML = 
    `
                <img src="${imagem}">
                <input type="text" class="nomeEtidar">
                <button class="btnSalvar">Salvar</button>
                <button class="btnCancelar">Cancelar</button>
    `
    const btnSalvar = document.querySelector('.btnSalvar');
    const btnCancelar = document.querySelector('.btnCancelar');

    btnSalvar.onclick = () => {
        const nomeAlterado = document.querySelector('.nomeEtidar')
        editar(id, nomeAlterado.value)
    }

    btnCancelar.onclick = () => {
        carregarPokedex();
    }
}

async function editar(id, nome) {
    await fetch(`http://localhost:3000/pokedex/${id}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          nome: nome
        })
    });
}