let page = 1;
let totalPages;
let countPages;
let count;
let characterStatus = '';
let dead;
let unknown;
let pageButton;
let result = [];

const characterCardsEl = document.getElementById("character_cards");
const charactersContainer = document.getElementById("characters");
const buttonsContainer = document.getElementById("buttons");

const instance = axios.create({
    baseURL: "https://rickandmortyapi.com/api",
});

async function loadCharacters() {
    try {
        loadLocations();
        loadEpisodes();

        const response = await instance.get(`/character?page=${page}`);
        const characters = response.data.results;
        console.log(response);

        totalPages = response.data.info.pages;

        limparElemento(characterCardsEl);
        pagination(totalPages)

        characters.forEach((character) => {
            const cardElement = criarElementoCartao(character);
            characterCardsEl.appendChild(cardElement);
        });

        totalCharacters(response.data.info.count)

    } catch (error) {
        console.log(error);
    }
}

function addPage() {
    if (pagina !== totalPages) {
        pagina++
        buttonsContainer.innerHTML = ''
        loadCharacters()
        scrollScreen()
    }
}

function outra(totalPages) {
    pagina = pagina - 2
    pagination(totalPages)
    loadCharacters()
}

function removePage(totalPages) {
    if (pagina > 1) {
        pagina--
        buttonsContainer.innerHTML = ''
        pagination(totalPages)
        loadCharacters()
        scrollScreen()
    }
}

function addPage() {
    if (pagina == 1) {
        pagina = 3
    } else if (pagina >= 3) {
        pagina++
    } else {
        pagina = 3
    }
    loadCharacters()
    scrollScreen()
}


function scrollScreen() {

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

async function initialCharacters() {
    await loadCharacters()
}

