const body = document.querySelector('body');
const input = document.querySelector('.input');

const btn_prev = document.querySelector('.btn-prev');
const btn_next = document.querySelector('.btn-next');

const movies = document.querySelector('.movies');
const moviesSeletor = document.querySelector('.movies .movie');
const movie = document.querySelector('.movie');
const movie__title = document.querySelector('.movie__title');
const movie__rating = document.querySelector('.movie__rating');

const highlight__title = document.querySelector('.highlight__title');
const highlight__description = document.querySelector('.highlight__description');
const highlight__rating = document.querySelector('.highlight__rating');
const highlight__genres = document.querySelector('.highlight__genres');
const highlight__launch = document.querySelector('.highlight__launch');
const highlight__video = document.querySelector('.highlight__video');
const highlight__videoLink = document.querySelector('.highlight__video-link');

const modal = document.querySelector('.modal');
const modal__title = document.querySelector('.modal__title');
const modal__img = document.querySelector('.modal__img');
const modal__description = document.querySelector('.modal__description');
const modal__average = document.querySelector('.modal__average');
const modal__genres = document.querySelector('.modal__genres');

let listaDeFilmes = [];
let page = 0;
let maxPage = 15;
let minPage = 0;


const promiseAnswerMovies = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false');

btn_prev.addEventListener('click', function () {
    if (page === 0) {
        page = maxPage;
    } else {
        page -= 5;
    }
    watchMovies();
});

btn_next.addEventListener('click', function () {
    if (page === maxPage) {
        page = minPage;
    } else {
        page += 5;
    }
    watchMovies();
});

function watchMovies() {

    for (let i = page; i < page + 5; i++) {

        const infosMovie = document.createElement('div');
        infosMovie.classList.add('movie__info');

        const titleMovie = document.createElement('span');
        titleMovie.classList.add('movie__title');
        titleMovie.textContent = listaDeFilmes.results[i].title;

        const divMovie = document.createElement('div');
        divMovie.classList.add('movie');
        divMovie.style.backgroundImage = `url(${listaDeFilmes.results[i].poster_path})`;


        const note = document.createElement('span');
        note.classList.add('movie__rating-rate');
        note.textContent = listaDeFilmes.results[i].vote_average;

        const spanNote = document.createElement('span');
        spanNote.classList.add('movie__rating');

        const image = document.createElement('img');
        image.src = "./assets/estrela.svg";

        spanNote.append(image, note);
        infosMovie.append(titleMovie, spanNote);
        divMovie.append(infosMovie);
        movies.append(divMovie);
    }
}

promiseAnswerMovies.then(function (resp) {
    const promiseBody = resp.json();
    promiseBody.then(function (body) {
        listaDeFilmes = body;
        for (let i = page; i < 5; i++) {

            const infosMovie = document.createElement('div');
            infosMovie.classList.add('movie__info');

            const titleMovie = document.createElement('span');
            titleMovie.classList.add('movie__title');
            titleMovie.textContent = body.results[i].title;

            const divMovie = document.createElement('div');
            divMovie.classList.add('movie');
            divMovie.style.backgroundImage = `url(${body.results[i].poster_path})`;
            divMovie.setAttribute("id", body.results[i].id);

            const note = document.createElement('span');
            note.classList.add('movie__rating-rate');
            note.textContent = body.results[i].vote_average;

            const spanNote = document.createElement('span');
            spanNote.classList.add('movie__rating');

            const image = document.createElement('img');
            image.src = "./assets/estrela.svg";

            spanNote.append(image, note);
            infosMovie.append(titleMovie, spanNote);
            divMovie.append(infosMovie);
            movies.append(divMovie);
        }

    });
});

input.addEventListener('keydown', function (event) {
    if (event.key !== 'Enter') {
        return;
    }
    page = 0;
    if (input.value === '') {
        const promiseAnswerMovies = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false');
        promiseAnswerMovies.then(function (resp) {
            const promiseBody = resp.json();
            promiseBody.then(function (body) {
                listaDeFilmes = body;
                recarregaFilmes();
            });
        });
    } else {
        const promiseAnswerQuest = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${input.value}`);
        promiseAnswerQuest.then(function (resp) {
            const promiseBody = resp.json();
            promiseBody.then(function (body) {
                listaDeFilmes = body;
                recarregaFilmes();
            });
        });
    };

    input.value = '';
});

const promiseAnswerHighlight = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR');

promiseAnswerHighlight.then(function (resposta) {
    const promiseBody = resposta.json();
    promiseBody.then(function (body) {
        highlight__title.textContent = body.title;
        highlight__description.textContent = body.overview;
        highlight__rating.textContent = body.vote_average;
        let genres = '';
        let premiereDate = '';
        body.genres.forEach(genero => {
            genres += `${genero.name.toUpperCase()}`;
        });
        highlight__genres.textContent = genres;
        premiereDate = `Data estreia: ${body.release_date.slice(-2)}/${body.release_date.slice(5, 7)}/${body.release_date.slice(0, 4)}`;
        highlight__launch.textContent = premiereDate;
        highlight__video.style.backgroundImage = `url(${body.backdrop_path})`;
    });
});

const promiseAnswerVideo = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR');

promiseAnswerVideo.then(function (resp) {
    const promiseBody = resp.json();
    promiseBody.then(function (body) {
        highlight__videoLink.href = `https://www.youtube.com/watch?v=${body.results[0].key}`;
    });
});

movies.addEventListener('click', function (event) {
    const id = event.target.id;

    const promiseAnswerModal = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`);

    promiseAnswerModal.then(function (resp) {
        const promiseBody = resp.json();
        promiseBody.then(function (body) {
            modal__title.textContent = body.title;
            modal__img.src = body.backdrop_path;
            modal__description.textContent = body.overview;
            body.genres.forEach(genero => {
                const divGenre = document.createElement('div');
                divGenre.classList.add('modal__genre');
                divGenre.textContent = genero.name;
                modal__genres.append(divGenre);
            });
            modal__average.textContent = body.vote_average;
        })
    })

    modal.classList.remove('hidden');
});

modal.addEventListener('click', function () {
    modal.classList.add('hidden');
});







