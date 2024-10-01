let offset = 0;
const limit = 32; 
let characters = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
const loading = document.getElementById("loading");

function fetchCharacters(){
    loading.classList.remove("hidden");

    const url =`https://gateway.marvel.com:443/v1/public/characters?ts=1727537033&apikey=3444107d0bd02670ca56c338d4239c0c&hash=1fd612aeb66cb006c2f3aa6b1f152a64&offset=${offset}&limit=${limit}`;
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            const divHero = document.getElementById("personagens");
            characters = [...characters, ...data.data.results];
            showCharacters(characters, divHero);
            offset += limit;           
        })
        .catch((error) => console.error(error))
        .finally(() => loading.classList.add("hidden"));
}

function showCharacters(characters, divAppend){
    divAppend.innerHTML = '';
    characters.forEach(character => {
        const srcImg = character.thumbnail.path + '.' + character.thumbnail.extension
        if (srcImg === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
            return;
        }    
        const name = character.name
        const descricao = character.description || "No description"
        const isFavorite = favorites.some(fav => fav.id === character.id);
        createDivHero(srcImg, name, descricao, character.id, divAppend, isFavorite)
    });
}

function createDivHero(srcImg, name, descricao, id, divAppend, isFavorite) {
    const divPai = document.createElement('div')
    const divfilho = document.createElement('div')
    const nameHero = document.createElement('p')
    const img = document.createElement('img')
    const description = document.createElement('p')
    const favoriteIcon = document.createElement('button');

    nameHero.textContent = name
    img.src = srcImg
    img.title ="Ver descrição"
    description.textContent = descricao;
    description.title = "Ver imagem"
    description.classList.add('description');
    favoriteIcon.classList.add('favorite-icon');
    favoriteIcon.innerHTML = isFavorite ? '★' : '☆';
    favoriteIcon.title = "Adicionar aos favoritos";

    img.addEventListener('click', () => {
        img.style.display = 'none';
        description.style.display = 'block';
    });
    description.addEventListener('click', () => {
        description.style.display = 'none';
        img.style.display = 'block';
    });
    favoriteIcon.addEventListener('click', () => {
        addFavorite({ id, srcImg, name, descricao }, favoriteIcon);
    });

    divfilho.appendChild(img)
    divfilho.appendChild(description)
    divfilho.appendChild(nameHero)
    divfilho.appendChild(favoriteIcon)
    divPai.appendChild(divfilho)
    divAppend.appendChild(divPai)

}

function filter(){
    const filtro = document.getElementById("filtroInput");
    const valorFiltro = filtro.value.toLowerCase(); 

    if (valorFiltro) {
        const filtrados = characters.filter(character => 
            character.name.toLowerCase().includes(valorFiltro));
        showCharacters(filtrados, document.getElementById("personagens"));
    } else {
        showCharacters(characters, document.getElementById("personagens"));
    }
}

function addFavorite(character, icon) {
    const favoriteIndex = favorites.findIndex(fav => fav.id === character.id);
    if (favoriteIndex > -1) {
        favorites.splice(favoriteIndex, 1);
        icon.innerHTML = '☆';
    } else {
        favorites.push(character);
        icon.innerHTML = '★';
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    showFavorites();
}
    
function showFavorites() {
    const divFavorites = document.getElementById("favoritos");
    const noFavorites = document.getElementById("noFavorites");
    
    divFavorites.innerHTML = '';
    if (favorites.length === 0) {
        noFavorites.style.display = 'block';
    } else {
        noFavorites.style.display = 'none';
        favorites.forEach(character => {
            const { srcImg, name, descricao } = character;
            createDivHero(srcImg, name, descricao, character.id, divFavorites, true);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    showFavorites();
    fetchCharacters();
        
    const loadMore = document.getElementById("btn");
    loadMore.addEventListener("click", fetchCharacters);
    
    const filtro = document.getElementById("filtroInput");
    filtro.addEventListener("input", filter)
    });