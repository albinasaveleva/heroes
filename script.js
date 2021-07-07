'use strict';

class Heroes {
    constructor() {
        this.url = './dbHeroes.json';
        this.heroes = document.querySelector('.heroes');
        this.heroesList = [];
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
                const addToFilterList = (filterList, obj, key) => {
                    filterList.add(obj[key].toLowerCase());
                };

                result.forEach(obj => {
                    for (let key in obj) {
                        if (key === 'species') {
                            addToFilterList(this.speciesFilter, obj, key);
                        } else if (key === 'citizenship') {
                            addToFilterList(this.citizenshipFilter, obj, key);
                        } else if (key === 'gender') {
                            addToFilterList(this.genderFilter, obj, key);
                        } else if (key === 'status') {
                            addToFilterList(this.statusFilter, obj, key);
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
        const getSelect = (selector, filterList) => {
            const select = document.querySelector(`#${selector} select`);

            filterList.forEach(item => {
                let option = document.createElement('option');
                option.value = item;
                option.textContent = item;
                select.insertAdjacentElement('beforeend', option);
            });
        };

        getSelect('species', this.speciesFilter);
        getSelect('citizenship', this.citizenshipFilter);
        getSelect('gender', this.genderFilter);
        getSelect('status', this.statusFilter);
        getSelect('movies', this.moviesFilter);
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
                        const startFilter = document.querySelector('#all');
                        this.filter = startFilter.textContent;
                        this.filterSelect = startFilter.textContent;
                        this.getHeroesList(startFilter.textContent);
                        return;
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
            arrowRight = document.querySelector('.slider-arrow_right'),
            slides = document.querySelectorAll('.hero');
        let currentSlide = 0;

        const prevSlide = (elem, index, strClass) => {
            elem[index].classList.remove(strClass);
        };
        const nextSlide = (elem, index, strClass) => {
            elem[index].classList.add(strClass);
        };

        arrowLeft.addEventListener('click', () => {
            prevSlide(slides, currentSlide, 'hero_active');
            currentSlide--;
            if (currentSlide < 0) {
                currentSlide = slides.length - 1;
            }  
            nextSlide(slides, currentSlide, 'hero_active');      
        });
        arrowRight.addEventListener('click', () => {
            prevSlide(slides, currentSlide, 'hero_active');
            currentSlide++;
            if (currentSlide >= slides.length) {
                currentSlide = 0;
            }
            nextSlide(slides, currentSlide, 'hero_active');
        });

    }
    showHeroes() {
        this.heroes.textContent = '';
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
                if (key === 'name' || key === 'citizenship') {
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
        if (this.heroesList.length > 1) {
            if (!document.querySelector('.slider-arrow_left') &&
                !document.querySelector('.slider-arrow_left')) {
                    this.addSliderArrows();
                }
            this.slider();
        } else {
            this.deleteSliderArrows();
        }
        this.showHeroDescription();
    }
    showHeroDescription() {
        const doVisible = (target, selector) => {
            target
                .parentNode
                .querySelector(selector)
                .classList
                .toggle('visible');
        };
        document.querySelectorAll('.hero').forEach(hero=> {
            hero.addEventListener('click', event => {
                let target = event.target;
                
                if (target.parentNode.matches('.hero')) {
                    doVisible(target, '.hero-description');
                } else {
                    do {target = target.parentNode;
                        if (target.parentNode.matches('.hero')) {
                            doVisible(target, '.hero-description');
                        }
                    } while (!target.matches('.hero'));
                }
            });
        }); 
    }
    init(startFilter) {
        this.getFilters();
        this.filter = startFilter.textContent;
        this.filterSelect = startFilter.textContent;
        this.getHeroesList(startFilter.textContent);
    }
}

const dbHeroes = new Heroes();
dbHeroes.init(document.querySelector('#all'));