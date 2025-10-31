/**
 * ==============================================
 * ARQUIVO PRINCIPAL DE JAVASCRIPT - GAZETA MARISTA
 * ==============================================
 * 
 * @description Script principal para interatividade do site Gazeta Marista.
 * Gerencia o menu mobile, busca, carrosséis, widget de clima, barra lateral
 * e a otimização da tela de carregamento.
 * @version 3.3 - Corrigido erro do carrossel e menu mobile
 */

document.addEventListener('DOMContentLoaded', function () {
    // --- CONSTANTES E SELEÇÃO DE ELEMENTOS ---
    const DOM = {
        // Elementos existentes
        mobileMenuBtn: document.getElementById('mobileMenuBtn'),
        mobileMenu: document.getElementById('mobileMenu'),
        searchBtn: document.getElementById('searchBtn'),
        searchInput: document.getElementById('searchInput'),
        allNewsContainer: document.getElementById('allNews'),
        searchResultsContainer: document.getElementById('searchResultsContainer'),
        searchResults: document.getElementById('searchResults'),
        searchResultsTitle: document.getElementById('searchResultsTitle'),
        newsCards: document.querySelectorAll('.news-card'),
        currentYearElement: document.getElementById('currentYear'),
        editionBanner: document.getElementById('editionBanner'),
        loadingScreen: document.getElementById('loadingScreen'),

        // Novos elementos para a barra lateral
        sidebar: document.querySelector('.info-sidebar'),
        sidebarToggle: document.querySelector('.sidebar-toggle'),
        sidebarClose: document.querySelector('.sidebar-close')
    };

    // --- ESTADO DA APLICAÇÃO ---
    const state = {
        isMobileMenuOpen: false,
        isSidebarOpen: false
    };

    // --- VARIÁVEIS DO CARROSSEL ---
    let carouselInterval;
    let currentImageIndex = 0;

    // --- FUNÇÕES DE INICIALIZAÇÃO ---
    function initialize() {
        console.log('Inicializando aplicação...');
        
        if (DOM.loadingScreen) handleLoadingScreen();
        updateFooterYear();
        renderEditionBanner();
        setupEventListeners();
        animateNewsCards();
        initMenuCarousel();
        initWeatherWidget();
        initCarousel(); // Inicializa o carrossel com verificações de segurança
        setupClickOutsideListener();
        
        // Garante que o menu mobile inicie oculto
        if (DOM.mobileMenu) {
            DOM.mobileMenu.classList.remove('active');
        }
    }

    // --- MANIPULAÇÃO DA TELA DE CARREGAMENTO ---
    function handleLoadingScreen() {
        setTimeout(() => {
            DOM.loadingScreen.classList.add('hidden');
            DOM.loadingScreen.addEventListener('transitionend', () => {
                DOM.loadingScreen.remove();
            });
        }, 500);
    }

    // --- FUNÇÕES UTILITÁRIAS ---
    function updateFooterYear() {
        if (DOM.currentYearElement) {
            DOM.currentYearElement.textContent = new Date().getFullYear();
        }
    }

    function renderEditionBanner() {
        if (DOM.editionBanner) {
            const year = new Date().getFullYear();
            DOM.editionBanner.textContent = `Edição nº 08 – ${year}`;
        }
    }

    function animateNewsCards() {
        DOM.newsCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
        });
    }

    // --- CONFIGURAÇÃO DE EVENT LISTENERS ---
    function setupEventListeners() {
        // Menu mobile
        if (DOM.mobileMenuBtn) {
            DOM.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
            console.log('Botão do menu mobile configurado');
        } else {
            console.log('Botão do menu mobile não encontrado');
        }

        // Busca
        if (DOM.searchBtn) DOM.searchBtn.addEventListener('click', performSearch);
        if (DOM.searchInput) {
            DOM.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') performSearch();
            });
        }

        // Barra lateral
        if (DOM.sidebarToggle) {
            DOM.sidebarToggle.addEventListener('click', toggleSidebar);
        }
        if (DOM.sidebarClose) {
            DOM.sidebarClose.addEventListener('click', toggleSidebar);
        }

        // Fechar menu mobile ao clicar em links
        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    // --- FUNÇÃO PARA FECHAR MENU AO CLICAR FORA ---
    function setupClickOutsideListener() {
        document.addEventListener('click', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        function handleClickOutside(event) {
            const mobileMenu = DOM.mobileMenu;
            const mobileMenuBtn = DOM.mobileMenuBtn;

            // Verifica se o clique/toque foi fora do menu e do botão do menu
            if (state.isMobileMenuOpen &&
                mobileMenu && !mobileMenu.contains(event.target) &&
                mobileMenuBtn && !mobileMenuBtn.contains(event.target)) {
                closeMobileMenu();
            }

            // Verifica se o clique/toque foi fora da barra lateral e do seu botão
            if (state.isSidebarOpen &&
                DOM.sidebar &&
                !DOM.sidebar.contains(event.target) &&
                DOM.sidebarToggle && !DOM.sidebarToggle.contains(event.target)) {
                toggleSidebar();
            }
        }
    }

    // --- CONTROLE DO MENU MOBILE ---
    function toggleMobileMenu() {
        state.isMobileMenuOpen = !state.isMobileMenuOpen;

        if (DOM.mobileMenu) {
            DOM.mobileMenu.classList.toggle('active', state.isMobileMenuOpen);
            // Remove a classe 'hidden' quando ativo, adiciona quando inativo
            if (state.isMobileMenuOpen) {
                DOM.mobileMenu.classList.remove('hidden');
            } else {
                DOM.mobileMenu.classList.add('hidden');
            }
        }

        if (DOM.mobileMenuBtn) {
            DOM.mobileMenuBtn.setAttribute('aria-expanded', state.isMobileMenuOpen);
        }

        console.log('Menu mobile:', state.isMobileMenuOpen ? 'aberto' : 'fechado');

        // Fecha a barra lateral se estiver aberta
        if (state.isSidebarOpen) {
            toggleSidebar();
        }
    }

    function closeMobileMenu() {
        if (state.isMobileMenuOpen) {
            toggleMobileMenu();
        }
    }

    // --- CONTROLE DA BARRA LATERAL ---
    function toggleSidebar() {
        state.isSidebarOpen = !state.isSidebarOpen;
        
        if (DOM.sidebar) {
            DOM.sidebar.classList.toggle('open', state.isSidebarOpen);
        }

        // Atualiza atributos de acessibilidade
        if (DOM.sidebarToggle) {
            DOM.sidebarToggle.setAttribute('aria-expanded', state.isSidebarOpen);
            DOM.sidebarToggle.setAttribute('aria-label',
                state.isSidebarOpen ? 'Fechar barra lateral' : 'Abrir barra lateral');
        }

        // Fecha o menu mobile se estiver aberto
        if (state.isMobileMenuOpen) {
            toggleMobileMenu();
        }
    }

    // --- CARROSSEL DO MENU ---
    function initMenuCarousel() {
        const menuContainer = document.querySelector('.menu-container');
        const menu = document.querySelector('.menu');
        const arrowLeft = document.querySelector('.nav-arrow-left');
        const arrowRight = document.querySelector('.nav-arrow-right');

        if (!menuContainer || !menu || !arrowLeft || !arrowRight) {
            console.log('Elementos do carrossel do menu não encontrados');
            return;
        }

        const updateArrows = () => {
            const scrollLeft = menuContainer.scrollLeft;
            const scrollWidth = menu.scrollWidth;
            const clientWidth = menuContainer.clientWidth;

            arrowLeft.classList.toggle('hidden', scrollLeft <= 0);
            arrowRight.classList.toggle('hidden', scrollLeft >= scrollWidth - clientWidth - 1);
        };

        arrowLeft.addEventListener('click', () => menuContainer.scrollBy({ left: -200, behavior: 'smooth' }));
        arrowRight.addEventListener('click', () => menuContainer.scrollBy({ left: 200, behavior: 'smooth' }));
        menuContainer.addEventListener('scroll', updateArrows);
        window.addEventListener('resize', updateArrows);
        updateArrows();
        
        console.log('Carrossel do menu inicializado');
    }

    // --- CARROSSEL DE IMAGENS (COMPLETAMENTE CORRIGIDO) ---
    function initCarousel() {
        const images = document.querySelectorAll(".carousel img");
        
        console.log('Verificando carrossel...');
        console.log('Elemento .carousel:', document.querySelector('.carousel'));
        console.log('Imagens encontradas:', images.length);

        // VERIFICAÇÃO ROBUSTA - só inicializa se o carrossel existir
        if (!images || images.length === 0) {
            console.log('Carrossel não encontrado nesta página. Função não executada.');
            return; // Sai da função se não houver carrossel
        }

        console.log('Inicializando carrossel - Imagens encontradas:', images.length);
        
        // Reseta o índice
        currentImageIndex = 0;
        
        // Remove a classe active de todas as imagens primeiro
        images.forEach(img => {
            img.classList.remove("active");
        });
        
        // Ativa a primeira imagem
        if (images[0]) {
            images[0].classList.add("active");
            console.log('Primeira imagem ativada');
        }

        // Limpa qualquer intervalo existente
        if (carouselInterval) {
            clearInterval(carouselInterval);
        }

        // Inicia o intervalo apenas se houver mais de uma imagem
        if (images.length > 1) {
            carouselInterval = setInterval(showNextImage, 6000);
            console.log('Intervalo do carrossel iniciado');
        } else {
            console.log('Apenas uma imagem encontrada - intervalo não iniciado');
        }
    }

    function showNextImage() {
        const images = document.querySelectorAll(".carousel img");
        
        // VERIFICAÇÃO DUPLA DE SEGURANÇA
        if (!images || images.length === 0) {
            console.log('Carrossel: Nenhuma imagem disponível - limpando intervalo');
            if (carouselInterval) {
                clearInterval(carouselInterval);
                carouselInterval = null;
            }
            return;
        }

        // Remove classe da imagem atual (com verificação)
        if (images[currentImageIndex]) {
            images[currentImageIndex].classList.remove("active");
        }
        
        // Avança para a próxima imagem
        currentImageIndex = (currentImageIndex + 1) % images.length;
        
        // Adiciona classe à nova imagem atual (com verificação)
        if (images[currentImageIndex]) {
            images[currentImageIndex].classList.add("active");
        }
        
        console.log('Carrossel: Imagem atual:', currentImageIndex);
    }

    // --- LÓGICA DE PESQUISA ---
    function performSearch() {
        const searchTerm = DOM.searchInput.value.trim().toLowerCase();
        if (searchTerm.length < 2) {
            alert('Por favor, digite pelo menos 2 caracteres para buscar.');
            return;
        }

        const results = filterNewsCards(searchTerm);
        displaySearchResults(results, searchTerm);
    }

    function filterNewsCards(searchTerm) {
        const matchedCards = [];
        DOM.newsCards.forEach(card => {
            const keywords = (card.dataset.keywords || '').toLowerCase();
            const title = (card.querySelector('h3')?.textContent || '').toLowerCase();
            const content = (card.querySelector('p')?.textContent || '').toLowerCase();

            if (keywords.includes(searchTerm) || title.includes(searchTerm) || content.includes(searchTerm)) {
                matchedCards.push(card);
            }
        });
        return matchedCards;
    }

    function displaySearchResults(results, searchTerm) {
        if (!DOM.searchResults) return;
        
        DOM.searchResults.innerHTML = '';

        if (results.length === 0) {
            DOM.searchResultsTitle.textContent = `Nenhum resultado encontrado para "${searchTerm}"`;
        } else {
            DOM.searchResultsTitle.textContent = `${results.length} resultado(s) para "${searchTerm}"`;
            results.forEach(card => {
                const clonedCard = card.cloneNode(true);
                const highlightedCard = highlightSearchTerms(clonedCard, searchTerm);
                DOM.searchResults.appendChild(highlightedCard);
            });
        }

        if (DOM.allNewsContainer) DOM.allNewsContainer.classList.add('hidden');
        if (DOM.searchResultsContainer) {
            DOM.searchResultsContainer.classList.remove('hidden');
            DOM.searchResultsContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function highlightSearchTerms(card, term) {
        const elementsToHighlight = card.querySelectorAll('h3, p');
        const regex = new RegExp(term, 'gi');

        elementsToHighlight.forEach(el => {
            el.innerHTML = el.textContent.replace(regex, match => `<span class="search-highlight">${match}</span>`);
        });
        return card;
    }

    // --- WIDGET DE CLIMA ---
    function initWeatherWidget() {
        const API_KEY = '5968cf52fd3711482404d885547a6757';
        const weatherWidget = document.querySelector('.weather-widget');
        if (!weatherWidget) {
            console.log('Widget de clima não encontrado');
            return;
        }

        const weatherElements = {
            temp: weatherWidget.querySelector('.weather-temp'),
            city: weatherWidget.querySelector('.weather-city'),
            desc: weatherWidget.querySelector('.weather-desc'),
            icon: weatherWidget.querySelector('.weather-icon i'),
            refreshBtn: weatherWidget.querySelector('.weather-refresh')
        };

        // Verifica se todos os elementos do clima existem
        if (!weatherElements.temp || !weatherElements.city || !weatherElements.desc || !weatherElements.icon || !weatherElements.refreshBtn) {
            console.log('Elementos do widget de clima incompletos');
            return;
        }

        const fetchWeather = async (lat, lon) => {
            try {
                weatherElements.refreshBtn.classList.add('loading');
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${API_KEY}`);
                if (!response.ok) throw new Error('Erro ao buscar dados do clima');
                const data = await response.json();
                updateWeatherUI(data);
            } catch (error) {
                console.error('Erro no widget de clima:', error);
                weatherElements.city.textContent = 'disponível';
                weatherElements.temp.textContent = '--°C';
            } finally {
                weatherElements.refreshBtn.classList.remove('loading');
            }
        };

        const updateWeatherUI = (data) => {
            weatherElements.temp.textContent = `${Math.round(data.main.temp)}°C`;
            weatherElements.city.textContent = data.name;
            weatherElements.desc.textContent = data.weather[0].description;
            weatherElements.icon.className = `fas ${getWeatherIcon(data.weather[0].id)}`;
        };

        const getWeatherIcon = (weatherId) => {
            if (weatherId >= 200 && weatherId < 300) return 'fa-bolt';
            if (weatherId >= 300 && weatherId < 400) return 'fa-cloud-rain';
            if (weatherId >= 500 && weatherId < 600) return 'fa-cloud-showers-heavy';
            if (weatherId >= 600 && weatherId < 700) return 'fa-snowflake';
            if (weatherId >= 700 && weatherId < 800) return 'fa-smog';
            if (weatherId === 800) return 'fa-sun';
            if (weatherId > 800) return 'fa-cloud';
            return 'fa-question-circle';
        };

        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => fetchWeather(position.coords.latitude, position.coords.longitude),
                    error => {
                        console.error('Erro ao obter localização. Usando fallback para Londrina.', error);
                        fetchWeather(-23.2927, -51.1732);
                    }
                );
            } else {
                console.log('Geolocalização não suportada. Usando fallback para Londrina.');
                fetchWeather(-23.2927, -51.1732);
            }
        };

        weatherElements.refreshBtn.addEventListener('click', getLocation);
        getLocation();
        
        console.log('Widget de clima inicializado');
    }

    // --- SCROLL REVEAL ANIMATIONS ---
    (function () {
        var script = document.createElement("script");
        script.src = "https://unpkg.com/scrollreveal";
        script.async = true;
        script.onload = function () {
            iniciarScrollReveal();
        };
        document.head.appendChild(script);
    })();

    function iniciarScrollReveal() {
        if (typeof ScrollReveal !== "undefined") {
            ScrollReveal().reveal(" .content, .featured-news, .headline-container, .headline-card, .headline-content, .read-more-btn, .hidden, .search-results-title, .news-section, .news-card, .news-image, .news-card-content, .section-title, .footer-container, .footer-section, .footer-links, .newsletter-form, .newsletter-btn, .social-icons, .footer-bottom, .loading-overlay, .loading-spinner, .info-sidebar, .sidebar-toggle, .sidebar-icon, .sidebar-content, .sidebar-header, .sidebar-close, .sidebar-section, #searchResultsContainer, #searchResultsTitle, #searchResults, #allNews, #currentYear, #loadingOverlay, .conteiner-sobre, .dobra-1-topo, .logo-conexao, .txt-dobra-1, .tittle-dobra-1-esquerda, .tittle-dobra-1-direita, .wrapper-text, .img-dobra-1-direita, .txt-dobra-1-direita, .btn-custom, .btn-text-wrap, .btn-arrow, .conteudo, .indice, .card-item, .left-card, .right-card, .text-banner, .logo-container, .list-item", {
                duration: 1200,
                origin: "bottom",
                distance: "20px",
                delay: 0.5,
                reset: true
            });
        }
    }

    // --- INICIALIZAÇÃO ---
    initialize();
});

// Adiciona personalização aos cards da página sobre 
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll(".card-item");
    
    cards.forEach(card => {
        card.addEventListener("click", () => {
            console.log("Card clicado");
            card.classList.toggle("active");
        });
    });
});