'use strict';
class Heroes {
    constructor() {
        this.heroes = document.querySelector('.heroes');
        this.heroesList = [];
        this.url = './dbHeroes.json';
        this.filter = '';
        this.filterSelect = '';
        this.speciesFilter = new Set();
        this.citizenshipFilter = new Set();
        this.genderFilter = new Set();
        this.statusFilter = new Set();
        this.moviesFilter = new Set();
    }
    getFilters() {
        return fetch(this.url)
            .then(response => {
                if (response.status !== 200) {
                    throw new Error('status network not 200');
                }
                return response.json();
            })
            .then((result) => {
                result.forEach(obj => {
                    for (let key in obj) {
                        if (key === 'species') {
                            this.speciesFilter.add(obj[key].toLowerCase());
                        } else if (key === 'citizenship') {
                            this.citizenshipFilter.add(obj[key].toLowerCase());
                        } else if (key === 'gender') {
                            this.genderFilter.add(obj[key].toLowerCase());
                        } else if (key === 'status') {
                            this.statusFilter.add(obj[key].toLowerCase());
                        } else if (key === 'movies') {
                            obj[key].forEach(item => this.moviesFilter.add(item));
                        }
                    }
                });
                this.showFilters();
                this.filtering();
            })
            .catch((error) => console.log(error));
    }
    showFilters() {
        const speciesFilter = () => {
            const speciesSelect = document.querySelector('#species select');
            this.speciesFilter.forEach(item => {
                let option = document.createElement('option');
                option.value = item;
                option.textContent = item;
                speciesSelect.insertAdjacentElement('beforeend', option);
            });
        };
        speciesFilter();

        const citizenshipFilter = () => {
            const citizenshipSelect = document.querySelector('#citizenship select');
            this.citizenshipFilter.forEach(item => {
                let option = document.createElement('option');
                option.value = item;
                option.textContent = item;
                citizenshipSelect.insertAdjacentElement('beforeend', option);
            });
        };
        citizenshipFilter();

        const genderFilter = () => {
            const genderSelect = document.querySelector('#gender select');
            this.genderFilter.forEach(item => {
                let option = document.createElement('option');
                option.value = item;
                option.textContent = item;
                genderSelect.insertAdjacentElement('beforeend', option);
            });
        };
        genderFilter();

        const statusFilter = () => {
            const statusSelect = document.querySelector('#status select');
            this.statusFilter.forEach(item => {
                let option = document.createElement('option');
                option.value = item;
                option.textContent = item;
                statusSelect.insertAdjacentElement('beforeend', option);
            });
        };
        statusFilter();

        const moviesFilter = () => {
            const moviesSelect = document.querySelector('#movies select');
            this.moviesFilter.forEach(item => {
                let option = document.createElement('option');
                option.value = item;
                option.textContent = item;
                moviesSelect.insertAdjacentElement('beforeend', option);
            });
        };
        moviesFilter();

    }
    filtering() {
        const filters = document.querySelectorAll('.filter');
        filters.forEach(filter => {
            filter.addEventListener('click', (event) => {
                let target = event.target;
                if (target.matches('#all')) {
                    this.filter = target.textContent;
                    this.filterSelect = target.textContent;
                    this.getHeroesList(target.textContent);
                } 
            });
            filter.addEventListener('change', (event) => {
                let target = event.target;
                if (target.parentNode.matches('#species, #citizenship, #gender, #status, #movies')) {
                    this.filter = target.parentNode.id;
                    if (filter.children[0].value) {
                        this.filterSelect = filter.children[0].value;
                        filters.forEach(filter => {
                            if (filter.children[0] && filter.children[0].value !== this.filterSelect) {
                                filter.children[0].value = '';
                            }
                        });
                    } else {
                        this.filterSelect = '';
                    }
                } 
                this.getHeroesList();
            });
        });
    }
    getHeroesList(value){
        return fetch(this.url)
            .then(response =>{
                if (response.status !== 200) {
                    throw new Error('status network not 200');
                }
                return response.json();
            })
            .then((result) => {
                if (this.filter === value && this.filterSelect === value) {
                    this.heroesList = result;
                } else if (this.filter === 'movies') {
                    this.heroesList = [];
                    result.forEach(obj => {
                        if (obj[this.filter]) {
                            if (obj[this.filter].some(movie => movie.toLowerCase() === this.filterSelect.toLowerCase())) {
                                this.heroesList.push(obj);
                            }
                        }
                    });
                } else {
                    this.heroesList = [];
                    result.forEach(obj => {
                        for (let key in obj) {
                            if (key === this.filter) {
                                if (obj[key].toLowerCase() === this.filterSelect) {
                                    this.heroesList.push(obj);
                                }
                            }
                        }
                    });
                }
                this.showHeroes();
            })
            .catch((error) => console.log(error));
    }
    addSliderArrows() {
        const slider = document.querySelector('.slider'),
            arrowLeft = document.createElement('div'),
            arrowRight = document.createElement('div');
        arrowLeft.setAttribute('id', 'arrow-left');
        arrowLeft.classList.add('slider-arrow', 'slider-arrow_left');
        slider.insertAdjacentElement('beforeend', arrowLeft);
        arrowRight.setAttribute('id', 'arrow-right');
        arrowRight.classList.add('slider-arrow', 'slider-arrow_right');
        slider.insertAdjacentElement('beforeend', arrowRight);
    }
    deleteSliderArrows() {
        const arrowLeft = document.querySelector('.slider-arrow_left'),
            arrowRight = document.querySelector('.slider-arrow_right');
        if (arrowLeft && arrowRight) {
            arrowLeft.remove();
            arrowRight.remove();
        }
    }
    slider() {
        const arrowLeft = document.querySelector('.slider-arrow_left'),
            arrowRight = document.querySelector('.slider-arrow_right');
        const prevSlide = () => {
            console.log('prev');
        };
        const nextSlide = () => {
            console.log('next');
        };
        arrowLeft.addEventListener('click', prevSlide);
        arrowRight.addEventListener('click', nextSlide);

    }
    showHeroes() {
        this.heroes.textContent = '';
        if (this.heroesList.length > 1) {
            this.addSliderArrows();
            this.slider();
        } else {
            this.deleteSliderArrows();
        }
        this.heroesList.forEach((hero, index) => {
            let heroData = hero;
            let heroCard = document.createElement('div');
            heroCard.classList.add('hero');
            if (index === 0) {
                heroCard.classList.add('hero_active');
            }
            let heroDescription = document.createElement('div');
            heroDescription.classList.add('hero-description');
            heroCard.append(heroDescription);
            for (let key in heroData) {
                if (key === 'name') {
                    let div = document.createElement('div');
                    div.classList.add(key);
                    div.textContent = heroData[key];
                    heroDescription.insertAdjacentElement( 'beforebegin', div);
                } else if (key === 'citizenship') {
                    let div = document.createElement('div');
                    div.classList.add(key);
                    div.textContent = heroData[key];
                    heroDescription.insertAdjacentElement( 'beforebegin', div);
                } else if (key === 'photo') {
                    let img = document.createElement('img');
                    img.classList.add(key);
                    img.setAttribute('src', heroData[key]);
                    heroDescription.insertAdjacentElement( 'beforebegin', img);
                } else if (key === 'movies') {
                    let moviesList = document.createElement('ul');
                    moviesList.classList.add('movies-list');
                    let movie = document.createElement('li');
                        movie.textContent = key;
                        moviesList.append(movie);
                    heroData[key].forEach(item => {
                        let movie = document.createElement('li');
                        movie.textContent = item;
                        moviesList.append(movie);
                    });
                    heroDescription.append(moviesList);
                } else {
                    let div = document.createElement('div');
                    div.classList.add(key);
                    div.textContent = `${key}: ${heroData[key]}`;
                    heroDescription.append(div);
                }
            }
            this.heroes.append(heroCard);
        });
    }
    listeners() {
        document.querySelectorAll('.hero').forEach(hero=> {
            hero.addEventListener('click', event => {
                let target = event.target;
                if (target.parentNode.matches('.hero')) {
                    target
                        .parentNode
                        .querySelector('.hero-description')
                        .classList
                        .toggle('visible');
                } else {
                    do {target = target.parentNode;
                        if (target.parentNode.matches('.hero')) {
                            target
                                .parentNode
                                .querySelector('.hero-description')
                                .classList
                                .toggle('visible');
                        }
                    } while (!target.matches('.hero'));
                }
            });
        })
        
        
    }
    showHeroDescription(heroCard) {
        const heroDescription = heroCard.querySelector('.hero-description');
        heroDescription.classList.toggle('.visible');
    }
    init(startFilter) {
        this.getFilters();
        this.filter = startFilter.textContent;
        this.filterSelect = startFilter.textContent;
        this.getHeroesList(startFilter.textContent)
    }
}

const dbHeroes = new Heroes();
dbHeroes.init(document.querySelector('#all'));