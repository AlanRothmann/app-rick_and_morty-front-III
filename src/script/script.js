let page = 1;
let totalPages;
let countPages;
let count;
let characterStatus = '';
let dead;
let unknown;
let pageButton;
let result = [];

const characterEl = document.getElementById("character");
const locationEl = document.getElementById("location");
const episodeEl = document.getElementById("episode");
const characterCardsEl = document.getElementById("character_cards");
const charactersContainer = document.getElementById("characters");
const buttonsContainer = document.getElementById("buttons");

const instance = axios.create({
    baseURL: "https://rickandmortyapi.com/api",
});

