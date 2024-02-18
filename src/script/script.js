const characterCardsEl = document.getElementById("character_cards");
const buttonsContainer = document.getElementById("buttons");
const characterTotalEl = document.getElementById("character");
const locationTotalEl = document.getElementById("location");
const episodeTotalEl = document.getElementById("episode");

let page = 1;
let totalPages;

const instance = axios.create({
    baseURL: "https://rickandmortyapi.com/api",
});

async function loadCharacters() {
    try {
        const response = await instance.get(`/character?page=${page}`);
        const characters = response.data.results;

        totalPages = response.data.info.pages;

        clearElement(characterCardsEl);

        characters.forEach((character) => {
            const cardElement = createCardElement(character);
            characterCardsEl.appendChild(cardElement);
        });

        createPaginationElement();

        characterTotalEl.textContent = response.data.info.count;

    } catch (error) {
        console.log(error);
    }
}

async function loadTotalCount(endpoint, element) {
    try {
        const response = await instance.get(`/${endpoint}`);
        element.textContent = response.data.info.count;
    } catch (error) {
        console.log(error);
    }
}

async function initialData() {
    try {
        await Promise.all([
            loadCharacters(),
            loadTotalCount("location", locationTotalEl),
            loadTotalCount("episode", episodeTotalEl)
        ]);
    } catch (error) {
        console.log(error);
    }
}

function createPaginationElement() {
    buttonsContainer.innerHTML = '';

    const firstPageButton = createButton("Início", () => {
        page = 1;
        loadCharacters();
        scrollScreen();
    });
    buttonsContainer.appendChild(firstPageButton);

    const previousPageButton = createButton("Anterior", () => {
        if (page > 1) {
            page--;
            loadCharacters();
            scrollScreen();
        }
    });
    buttonsContainer.appendChild(previousPageButton);

    for (let i = 1; i <= 3; i++) {
        const buttonElement = createButton(page + i - 2, () => {
            page = page + i - 2;
            loadCharacters();
            scrollScreen();
        });
        buttonsContainer.appendChild(buttonElement);
    }

    const nextPageButton = createButton("Proximo", () => {
        if (page < totalPages) {
            page++;
            loadCharacters();
            scrollScreen();
        }
    });
    buttonsContainer.appendChild(nextPageButton);

    const goToTopButton = createButton("Voltar ao topo", () => {
        scrollScreen();
    });
    buttonsContainer.appendChild(goToTopButton);
}

function createButton(text, onClick) {
    const buttonElement = document.createElement("button");
    buttonElement.className = "paginationButton";
    buttonElement.textContent = text;
    buttonElement.addEventListener('click', onClick);
    return buttonElement;
}

function scrollScreen() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function createCardElement(character) {
    const cardElement = document.createElement('div');
    cardElement.className = `cardSize puff-in-center bg-secondary text-white card my-2 mx-2 ${getShadow(character.status)}`;
    const imageElement = document.createElement('img');
    imageElement.src = character.image;
    imageElement.className = 'card-img-top image_character';
    imageElement.alt = 'Imagem do Personagem';
    const cardBodyElement = document.createElement('div');
    cardBodyElement.className = 'card-body background border border-top-0 border-success rounded-bottom';
    const titleElement = document.createElement('h6');
    titleElement.className = 'card-title fs-5';
    titleElement.textContent = character.name;
    const statusElement = document.createElement('p');
    statusElement.className = 'card-text fs-6';
    statusElement.innerHTML = getStatusIcon(character.status);
    const statusCharacterElement = document.createElement('span');
    statusCharacterElement.className = 'fs-6 ms-3';
    statusCharacterElement.innerHTML = `${character.status} - ${character.species}`;
    const buttonElement = document.createElement('button');
    buttonElement.type = 'button';
    buttonElement.addEventListener('click', () => { modalcharacter(character) });
    buttonElement.id = 'botao-detalhes';
    buttonElement.className = 'btn btnDefault pulsate-fwd';
    buttonElement.setAttribute('data-bs-toggle', 'modal');
    buttonElement.setAttribute('data-bs-target', '#modal_detalhes');
    buttonElement.style = '--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;';
    buttonElement.textContent = 'Mais detalhes';
    cardBodyElement.appendChild(titleElement);
    statusElement.appendChild(statusCharacterElement);
    cardBodyElement.appendChild(statusElement);
    cardBodyElement.appendChild(buttonElement);
    cardElement.appendChild(imageElement);
    cardElement.appendChild(cardBodyElement);

    return cardElement;
}

function modalcharacter(character) {
    const details = document.getElementById('details');
    const characterStatus = getStatusIcon(character.status);

    const modalContent = `
        <div class="row">
            <div class="col-6 col-md-5">
                <img src="${character.image}" class="img-fluid rounded-start" alt="Imagem do character">
            </div>
            <div class="col-6 col-md-7 bg-dark-subtle">
                <div class="card-body">
                    <h4 class="card-title ">${character.name}</h4>
                    <p class="card-text">${characterStatus}<span class="ms-3">${character.status}</span> - ${character.species}</p>
                    <h6 class="card-title mb-0 ms-3">Localização:</h6>
                    <p class="card-text ms-3">${character.location.name}</p>
                </div>
            </div>
        </div>
    `;
    details.innerHTML = modalContent;
}

function getStatusIcon(status) {
    switch (status) {
        case 'Alive':
            return '<span class="color_status_alive"></span>';
        case 'unknown':
            return '<span class="color_status_unknown"></span>';
        case 'Dead':
            return '<span class="color_status_dead"></span>';
        default:
            return '';
    }
}

function getShadow(status) {
    switch (status) {
        case 'Alive':
            return 'shadow_card_alive';
        case 'unknown':
            return 'shadow_card_unknown';
        case 'Dead':
            return 'shadow_card_dead';
        default:
            return '';
    }
}

initialData();
