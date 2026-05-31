// /**
//  * ==============================================
//  * ARQUIVO PRINCIPAL DE JAVASCRIPT - GAZETA MARISTA
//  * ==============================================
//  * 
//  * @description Script principal para interatividade do site Gazeta Marista.
//  * Gerencia o menu mobile, busca, carrosséis, widget de clima, barra lateral
//  * e a otimização da tela de carregamento.
//  * @version 3.3 - Corrigido erro do carrossel e menu mobile
//  */

// document.addEventListener('DOMContentLoaded', function () {
//     // --- CONSTANTES E SELEÇÃO DE ELEMENTOS ---
//     const DOM = {
//         // Elementos existentes
//         mobileMenuBtn: document.getElementById('mobileMenuBtn'),
//         mobileMenu: document.getElementById('mobileMenu'),
//         searchBtn: document.getElementById('searchBtn'),
//         searchInput: document.getElementById('searchInput'),
//         allNewsContainer: document.getElementById('allNews'),
//         searchResultsContainer: document.getElementById('searchResultsContainer'),
//         searchResults: document.getElementById('searchResults'),
//         searchResultsTitle: document.getElementById('searchResultsTitle'),
//         newsCards: document.querySelectorAll('.news-card'),
//         currentYearElement: document.getElementById('currentYear'),
//         editionBanner: document.getElementById('editionBanner'),
//         loadingScreen: document.getElementById('loadingScreen'),

//         // Novos elementos para a barra lateral
//         sidebar: document.querySelector('.info-sidebar'),
//         sidebarToggle: document.querySelector('.sidebar-toggle'),
//         sidebarClose: document.querySelector('.sidebar-close')
//     };

//     // --- ESTADO DA APLICAÇÃO ---
//     const state = {
//         isMobileMenuOpen: false,
//         isSidebarOpen: false
//     };

//     // --- VARIÁVEIS DO CARROSSEL ---
//     let carouselInterval;
//     let currentImageIndex = 0;

//     // --- FUNÇÕES DE INICIALIZAÇÃO ---
//     function initialize() {
//         console.log('Inicializando aplicação...');
        
//         if (DOM.loadingScreen) handleLoadingScreen();
//         updateFooterYear();
//         renderEditionBanner();
//         setupEventListeners();
//         animateNewsCards();
//         initMenuCarousel();
//         initWeatherWidget();
//         initCarousel(); // Inicializa o carrossel com verificações de segurança
//         setupClickOutsideListener();
        
//         // Garante que o menu mobile inicie oculto
//         if (DOM.mobileMenu && !DOM.mobileMenu.classList.contains('hidden')) {
//             DOM.mobileMenu.classList.add('hidden');
//         }
//     }

//     // --- MANIPULAÇÃO DA TELA DE CARREGAMENTO ---
//     function handleLoadingScreen() {
//         setTimeout(() => {
//             DOM.loadingScreen.classList.add('hidden');
//             DOM.loadingScreen.addEventListener('transitionend', () => {
//                 DOM.loadingScreen.remove();
//             });
//         }, 500);
//     }

//     // --- FUNÇÕES UTILITÁRIAS ---
//     function updateFooterYear() {
//         if (DOM.currentYearElement) {
//             DOM.currentYearElement.textContent = new Date().getFullYear();
//         }
//     }

//     function animateNewsCards() {
//         DOM.newsCards.forEach((card, index) => {
//             card.style.opacity = '0';
//             card.style.transform = 'translateY(20px)';
//             card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
//         });
//     }

//     // --- CONFIGURAÇÃO DE EVENT LISTENERS ---
//     function setupEventListeners() {
//         // Menu mobile
//         if (DOM.mobileMenuBtn) {
//             DOM.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
//             console.log('Botão do menu mobile configurado');
//         } else {
//             console.log('Botão do menu mobile não encontrado');
//         }

//         // Busca
//         if (DOM.searchBtn) DOM.searchBtn.addEventListener('click', performSearch);
//         if (DOM.searchInput) {
//             DOM.searchInput.addEventListener('keypress', (e) => {
//                 if (e.key === 'Enter') performSearch();
//             });
//         }

//         // Barra lateral
//         if (DOM.sidebarToggle) {
//             DOM.sidebarToggle.addEventListener('click', toggleSidebar);
//         }
//         if (DOM.sidebarClose) {
//             DOM.sidebarClose.addEventListener('click', toggleSidebar);
//         }

//         // Fechar menu mobile ao clicar em links
//         document.querySelectorAll('.mobile-menu a').forEach(link => {
//             link.addEventListener('click', closeMobileMenu);
//         });
//     }

//     // --- FUNÇÃO PARA FECHAR MENU AO CLICAR FORA ---
//     function setupClickOutsideListener() {
//         document.addEventListener('click', handleClickOutside);
//         document.addEventListener('touchstart', handleClickOutside);

//         function handleClickOutside(event) {
//             const mobileMenu = DOM.mobileMenu;
//             const mobileMenuBtn = DOM.mobileMenuBtn;

//             // Verifica se o clique/toque foi fora do menu e do botão do menu
//             if (state.isMobileMenuOpen &&
//                 mobileMenu && !mobileMenu.contains(event.target) &&
//                 mobileMenuBtn && !mobileMenuBtn.contains(event.target)) {
//                 closeMobileMenu();
//             }

//             // Verifica se o clique/toque foi fora da barra lateral e do seu botão
//             if (state.isSidebarOpen &&
//                 DOM.sidebar &&
//                 !DOM.sidebar.contains(event.target) &&
//                 DOM.sidebarToggle && !DOM.sidebarToggle.contains(event.target)) {
//                 toggleSidebar();
//             }
//         }
//     }

//     // --- CONTROLE DO MENU MOBILE ---
//     function toggleMobileMenu() {
//         state.isMobileMenuOpen = !state.isMobileMenuOpen;
        
//         if (DOM.mobileMenu) {
//             DOM.mobileMenu.classList.toggle('active', state.isMobileMenuOpen);
//             DOM.mobileMenu.classList.toggle('hidden', !state.isMobileMenuOpen);
//         }
        
//         if (DOM.mobileMenuBtn) {
//             DOM.mobileMenuBtn.setAttribute('aria-expanded', state.isMobileMenuOpen);
//         }

//         console.log('Menu mobile:', state.isMobileMenuOpen ? 'aberto' : 'fechado');

//         // Fecha a barra lateral se estiver aberta
//         if (state.isSidebarOpen) {
//             toggleSidebar();
//         }
//     }

//     function closeMobileMenu() {
//         if (state.isMobileMenuOpen) {
//             toggleMobileMenu();
//         }
//     }

//     // --- CONTROLE DA BARRA LATERAL ---
//     function toggleSidebar() {
//         state.isSidebarOpen = !state.isSidebarOpen;
        
//         if (DOM.sidebar) {
//             DOM.sidebar.classList.toggle('open', state.isSidebarOpen);
//         }

//         // Atualiza atributos de acessibilidade
//         if (DOM.sidebarToggle) {
//             DOM.sidebarToggle.setAttribute('aria-expanded', state.isSidebarOpen);
//             DOM.sidebarToggle.setAttribute('aria-label',
//                 state.isSidebarOpen ? 'Fechar barra lateral' : 'Abrir barra lateral');
//         }

//         // Fecha o menu mobile se estiver aberto
//         if (state.isMobileMenuOpen) {
//             toggleMobileMenu();
//         }
//     }

//     // --- CARROSSEL DO MENU ---
//     function initMenuCarousel() {
//         const menuContainer = document.querySelector('.menu-container');
//         const menu = document.querySelector('.menu');
//         const arrowLeft = document.querySelector('.nav-arrow-left');
//         const arrowRight = document.querySelector('.nav-arrow-right');

//         if (!menuContainer || !menu || !arrowLeft || !arrowRight) {
//             console.log('Elementos do carrossel do menu não encontrados');
//             return;
//         }

//         const updateArrows = () => {
//             const scrollLeft = menuContainer.scrollLeft;
//             const scrollWidth = menu.scrollWidth;
//             const clientWidth = menuContainer.clientWidth;

//             arrowLeft.classList.toggle('hidden', scrollLeft <= 0);
//             arrowRight.classList.toggle('hidden', scrollLeft >= scrollWidth - clientWidth - 1);
//         };

//         arrowLeft.addEventListener('click', () => menuContainer.scrollBy({ left: -200, behavior: 'smooth' }));
//         arrowRight.addEventListener('click', () => menuContainer.scrollBy({ left: 200, behavior: 'smooth' }));
//         menuContainer.addEventListener('scroll', updateArrows);
//         window.addEventListener('resize', updateArrows);
//         updateArrows();
        
//         console.log('Carrossel do menu inicializado');
//     }

//     // --- CARROSSEL DE IMAGENS (COMPLETAMENTE CORRIGIDO) ---
//     function initCarousel() {
//         const images = document.querySelectorAll(".carousel img");
        
//         console.log('Verificando carrossel...');
//         console.log('Elemento .carousel:', document.querySelector('.carousel'));
//         console.log('Imagens encontradas:', images.length);

//         // VERIFICAÇÃO ROBUSTA - só inicializa se o carrossel existir
//         if (!images || images.length === 0) {
//             console.log('Carrossel não encontrado nesta página. Função não executada.');
//             return; // Sai da função se não houver carrossel
//         }

//         console.log('Inicializando carrossel - Imagens encontradas:', images.length);
        
//         // Reseta o índice
//         currentImageIndex = 0;
        
//         // Remove a classe active de todas as imagens primeiro
//         images.forEach(img => {
//             img.classList.remove("active");
//         });
        
//         // Ativa a primeira imagem
//         if (images[0]) {
//             images[0].classList.add("active");
//             console.log('Primeira imagem ativada');
//         }

//         // Limpa qualquer intervalo existente
//         if (carouselInterval) {
//             clearInterval(carouselInterval);
//         }

//         // Inicia o intervalo apenas se houver mais de uma imagem
//         if (images.length > 1) {
//             carouselInterval = setInterval(showNextImage, 6000);
//             console.log('Intervalo do carrossel iniciado');
//         } else {
//             console.log('Apenas uma imagem encontrada - intervalo não iniciado');
//         }
//     }

//     function showNextImage() {
//         const images = document.querySelectorAll(".carousel img");
        
//         // VERIFICAÇÃO DUPLA DE SEGURANÇA
//         if (!images || images.length === 0) {
//             console.log('Carrossel: Nenhuma imagem disponível - limpando intervalo');
//             if (carouselInterval) {
//                 clearInterval(carouselInterval);
//                 carouselInterval = null;
//             }
//             return;
//         }

//         // Remove classe da imagem atual (com verificação)
//         if (images[currentImageIndex]) {
//             images[currentImageIndex].classList.remove("active");
//         }
        
//         // Avança para a próxima imagem
//         currentImageIndex = (currentImageIndex + 1) % images.length;
        
//         // Adiciona classe à nova imagem atual (com verificação)
//         if (images[currentImageIndex]) {
//             images[currentImageIndex].classList.add("active");
//         }
        
//         console.log('Carrossel: Imagem atual:', currentImageIndex);
//     }

//     // --- LÓGICA DE PESQUISA ---
//     function performSearch() {
//         const searchTerm = DOM.searchInput.value.trim().toLowerCase();
//         if (searchTerm.length < 2) {
//             alert('Por favor, digite pelo menos 2 caracteres para buscar.');
//             return;
//         }

//         const results = filterNewsCards(searchTerm);
//         displaySearchResults(results, searchTerm);
//     }

//     function filterNewsCards(searchTerm) {
//         const matchedCards = [];
//         DOM.newsCards.forEach(card => {
//             const keywords = (card.dataset.keywords || '').toLowerCase();
//             const title = (card.querySelector('h3')?.textContent || '').toLowerCase();
//             const content = (card.querySelector('p')?.textContent || '').toLowerCase();

//             if (keywords.includes(searchTerm) || title.includes(searchTerm) || content.includes(searchTerm)) {
//                 matchedCards.push(card);
//             }
//         });
//         return matchedCards;
//     }

//     function displaySearchResults(results, searchTerm) {
//         if (!DOM.searchResults) return;
        
//         DOM.searchResults.innerHTML = '';

//         if (results.length === 0) {
//             DOM.searchResultsTitle.textContent = `Nenhum resultado encontrado para "${searchTerm}"`;
//         } else {
//             DOM.searchResultsTitle.textContent = `${results.length} resultado(s) para "${searchTerm}"`;
//             results.forEach(card => {
//                 const clonedCard = card.cloneNode(true);
//                 const highlightedCard = highlightSearchTerms(clonedCard, searchTerm);
//                 DOM.searchResults.appendChild(highlightedCard);
//             });
//         }

//         if (DOM.allNewsContainer) DOM.allNewsContainer.classList.add('hidden');
//         if (DOM.searchResultsContainer) {
//             DOM.searchResultsContainer.classList.remove('hidden');
//             DOM.searchResultsContainer.scrollIntoView({ behavior: 'smooth' });
//         }
//     }

//     function highlightSearchTerms(card, term) {
//         const elementsToHighlight = card.querySelectorAll('h3, p');
//         const regex = new RegExp(term, 'gi');

//         elementsToHighlight.forEach(el => {
//             el.innerHTML = el.textContent.replace(regex, match => `<span class="search-highlight">${match}</span>`);
//         });
//         return card;
//     }

//     // --- WIDGET DE CLIMA ---
//     function initWeatherWidget() {
//         const API_KEY = '5968cf52fd3711482404d885547a6757';
//         const weatherWidget = document.querySelector('.weather-widget');
//         if (!weatherWidget) {
//             console.log('Widget de clima não encontrado');
//             return;
//         }

//         const weatherElements = {
//             temp: weatherWidget.querySelector('.weather-temp'),
//             city: weatherWidget.querySelector('.weather-city'),
//             desc: weatherWidget.querySelector('.weather-desc'),
//             icon: weatherWidget.querySelector('.weather-icon i'),
//             refreshBtn: weatherWidget.querySelector('.weather-refresh')
//         };

//         // Verifica se todos os elementos do clima existem
//         if (!weatherElements.temp || !weatherElements.city || !weatherElements.desc || !weatherElements.icon || !weatherElements.refreshBtn) {
//             console.log('Elementos do widget de clima incompletos');
//             return;
//         }

//         const fetchWeather = async (lat, lon) => {
//             try {
//                 weatherElements.refreshBtn.classList.add('loading');
//                 const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${API_KEY}`);
//                 if (!response.ok) throw new Error('Erro ao buscar dados do clima');
//                 const data = await response.json();
//                 updateWeatherUI(data);
//             } catch (error) {
//                 console.error('Erro no widget de clima:', error);
//                 weatherElements.city.textContent = 'disponível';
//                 weatherElements.temp.textContent = '--°C';
//             } finally {
//                 weatherElements.refreshBtn.classList.remove('loading');
//             }
//         };

//         const updateWeatherUI = (data) => {
//             weatherElements.temp.textContent = `${Math.round(data.main.temp)}°C`;
//             weatherElements.city.textContent = data.name;
//             weatherElements.desc.textContent = data.weather[0].description;
//             weatherElements.icon.className = `fas ${getWeatherIcon(data.weather[0].id)}`;
//         };

//         const getWeatherIcon = (weatherId) => {
//             if (weatherId >= 200 && weatherId < 300) return 'fa-bolt';
//             if (weatherId >= 300 && weatherId < 400) return 'fa-cloud-rain';
//             if (weatherId >= 500 && weatherId < 600) return 'fa-cloud-showers-heavy';
//             if (weatherId >= 600 && weatherId < 700) return 'fa-snowflake';
//             if (weatherId >= 700 && weatherId < 800) return 'fa-smog';
//             if (weatherId === 800) return 'fa-sun';
//             if (weatherId > 800) return 'fa-cloud';
//             return 'fa-question-circle';
//         };

//         const getLocation = () => {
//             if (navigator.geolocation) {
//                 navigator.geolocation.getCurrentPosition(
//                     position => fetchWeather(position.coords.latitude, position.coords.longitude),
//                     error => {
//                         console.error('Erro ao obter localização. Usando fallback para Londrina.', error);
//                         fetchWeather(-23.2927, -51.1732);
//                     }
//                 );
//             } else {
//                 console.log('Geolocalização não suportada. Usando fallback para Londrina.');
//                 fetchWeather(-23.2927, -51.1732);
//             }
//         };

//         weatherElements.refreshBtn.addEventListener('click', getLocation);
//         getLocation();
        
//         console.log('Widget de clima inicializado');
//     }

//     // --- SCROLL REVEAL ANIMATIONS ---
//     (function () {
//         var script = document.createElement("script");
//         script.src = "https://unpkg.com/scrollreveal";
//         script.async = true;
//         script.onload = function () {
//             iniciarScrollReveal();
//         };
//         document.head.appendChild(script);
//     })();

//     function iniciarScrollReveal() {
//         if (typeof ScrollReveal !== "undefined") {
//             ScrollReveal().reveal(" .content, .featured-news, .headline-container, .headline-card, .headline-content, .read-more-btn, .hidden, .search-results-title, .news-section, .news-card, .news-image, .news-card-content, .section-title, .footer-container, .footer-section, .footer-links, .newsletter-form, .newsletter-btn, .social-icons, .footer-bottom, .loading-overlay, .loading-spinner, .info-sidebar, .sidebar-toggle, .sidebar-icon, .sidebar-content, .sidebar-header, .sidebar-close, .sidebar-section, #searchResultsContainer, #searchResultsTitle, #searchResults, #allNews, #currentYear, #loadingOverlay, .conteiner-sobre, .dobra-1-topo, .logo-conexao, .txt-dobra-1, .tittle-dobra-1-esquerda, .tittle-dobra-1-direita, .wrapper-text, .img-dobra-1-direita, .txt-dobra-1-direita, .btn-custom, .btn-text-wrap, .btn-arrow, .conteudo, .indice, .card-item, .left-card, .right-card, .text-banner, .logo-container, .list-item", {
//                 duration: 1200,
//                 origin: "bottom",
//                 distance: "20px",
//                 delay: 0.5,
//                 reset: true
//             });
//         }
//     }

//     // --- INICIALIZAÇÃO ---
//     initialize();
// });

// // Adiciona personalização aos cards da página sobre 
// document.addEventListener('DOMContentLoaded', function() {
//     const cards = document.querySelectorAll(".card-item");
    
//     cards.forEach(card => {
//         card.addEventListener("click", () => {
//             console.log("Card clicado");
//             card.classList.toggle("active");
//         });
//     });
// });

// // FUNÇÃO ESPECÍFICA PARA O MENU MOBILE - CORRIGIDA
// function initMobileMenu() {
//     const mobileMenuBtn = document.getElementById('mobileMenuBtn');
//     const mobileMenu = document.getElementById('mobileMenu');
    
//     console.log('Iniciando menu mobile...');
//     console.log('Botão:', mobileMenuBtn);
//     console.log('Menu:', mobileMenu);
    
//     if (!mobileMenuBtn || !mobileMenu) {
//         console.error('❌ Elementos do menu mobile não encontrados!');
//         return;
//     }
    
//     // Função para abrir/fechar menu
//     function toggleMobileMenu() {
//         const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
//         const newState = !isExpanded;
        
//         // Alternar estados
//         mobileMenuBtn.setAttribute('aria-expanded', newState);
//         mobileMenu.setAttribute('aria-hidden', !newState);
//         mobileMenu.classList.toggle('active', newState);
        
//         // Mudar ícone
//         const icon = mobileMenuBtn.querySelector('i');
//         if (icon) {
//             icon.className = newState ? 'fas fa-times' : 'fas fa-bars';
//         }
        
//         // Prevenir scroll do body quando menu está aberto
//         document.body.style.overflow = newState ? 'hidden' : '';
        
//         console.log('📱 Menu mobile:', newState ? 'ABERTO' : 'FECHADO');
//     }
    
//     // Event listener do botão
//     mobileMenuBtn.addEventListener('click', function(e) {
//         e.stopPropagation();
//         e.preventDefault();
//         toggleMobileMenu();
//     });
    
//     // Fechar menu ao clicar em links
//     mobileMenu.querySelectorAll('a').forEach(link => {
//         link.addEventListener('click', function() {
//             closeMobileMenu();
//         });
//     });
    
//     // Fechar menu ao clicar fora
//     document.addEventListener('click', function(e) {
//         if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
//             closeMobileMenu();
//         }
//     });
    
//     // Fechar menu com ESC
//     document.addEventListener('keydown', function(e) {
//         if (e.key === 'Escape') {
//             closeMobileMenu();
//         }
//     });
    
//     // Função para fechar menu
//     function closeMobileMenu() {
//         mobileMenuBtn.setAttribute('aria-expanded', 'false');
//         mobileMenu.setAttribute('aria-hidden', 'true');
//         mobileMenu.classList.remove('active');
        
//         const icon = mobileMenuBtn.querySelector('i');
//         if (icon) {
//             icon.className = 'fas fa-bars';
//         }
        
//         document.body.style.overflow = '';
//     }
    
//     // Fechar menu ao redimensionar para desktop
//     window.addEventListener('resize', function() {
//         if (window.innerWidth > 992) {
//             closeMobileMenu();
//         }
//     });
    
//     console.log('✅ Menu mobile inicializado com sucesso!');
// }

// // INICIALIZAR QUANDO O DOM CARREGAR
// document.addEventListener('DOMContentLoaded', function() {
//     console.log('🚀 DOM Carregado - Iniciando scripts...');
//     initMobileMenu();
// });

// // SE O SCRIPT.JS JÁ TEM CÓDIGO, ADICIONE APENAS A FUNÇÃO initMobileMenu() E A CHAMADA NO DOMContentLoaded

/**
 * ==============================================
 * ARQUIVO PRINCIPAL DE JAVASCRIPT - GAZETA MARISTA
 * ==============================================
 * 
 * @description Script principal para interatividade do site Gazeta Marista.
 * Gerencia o menu mobile, busca, carrosséis, widget de clima e funcionalidades gerais.
 * @version 4.0 - Completamente revisado e corrigido
 */

// --- ESTADO GLOBAL DA APLICAÇÃO ---
const AppState = {
    isMobileMenuOpen: false,
    isSidebarOpen: false,
    currentCarouselIndex: 0,
    carouselInterval: null,
    searchTerm: ''
};

// --- SELEÇÃO DE ELEMENTOS DO DOM ---
const DOM = {
    // Menu Mobile
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    mobileMenu: document.getElementById('mobileMenu'),
    
    // Busca
    searchBtn: document.getElementById('searchBtn'),
    searchInput: document.getElementById('searchInput'),
    
    // Conteúdo
    allNewsContainer: document.getElementById('allNews'),
    searchResultsContainer: document.getElementById('searchResultsContainer'),
    searchResults: document.getElementById('searchResults'),
    searchResultsTitle: document.getElementById('searchResultsTitle'),
    newsCards: document.querySelectorAll('.news-card'),
    
    // Informações
    currentYearElement: document.getElementById('currentYear'),
    editionBanner: document.getElementById('editionBanner'),
    loadingScreen: document.getElementById('loadingScreen'),
    
    // Carrossel
    carouselImages: document.querySelectorAll('.carousel img'),
    
    // Clima
    weatherWidget: document.querySelector('.weather-widget')
};

// --- INICIALIZAÇÃO PRINCIPAL ---
function initializeApp() {
    console.log('🚀 Inicializando Gazeta Marista...');
    
    // Verificar elementos críticos
    if (!checkEssentialElements()) {
        console.error('❌ Elementos essenciais não encontrados!');
        return;
    }
    
    // Inicializar módulos
    initLoadingScreen();
    initMobileMenu();
    initSearchFunctionality();
    initCarousel();
    initWeatherWidget();
    initUtilities();
    
    console.log('✅ Aplicação inicializada com sucesso!');
}

// --- VERIFICAÇÃO DE ELEMENTOS ESSENCIAIS ---
function checkEssentialElements() {
    const essentials = [
        { element: DOM.mobileMenuBtn, name: 'Botão Menu Mobile' },
        { element: DOM.mobileMenu, name: 'Menu Mobile' },
    ];
    
    let allFound = true;
    
    essentials.forEach(item => {
        if (!item.element) {
            console.error(`❌ ${item.name} não encontrado!`);
            allFound = false;
        }
    });
    
    return allFound;
}

// --- TELA DE CARREGAMENTO ---
function initLoadingScreen() {
    if (!DOM.loadingScreen) return;
    
    // Simular tempo de carregamento
    setTimeout(() => {
        DOM.loadingScreen.style.opacity = '0';
        DOM.loadingScreen.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            DOM.loadingScreen.style.display = 'none';
        }, 500);
    }, 1000);
}

// --- MENU MOBILE - COMPLETAMENTE CORRIGIDO ---
function initMobileMenu() {
    console.log('📱 Inicializando menu mobile...');
    
    if (!DOM.mobileMenuBtn || !DOM.mobileMenu) {
        console.error('❌ Elementos do menu mobile não encontrados!');
        return;
    }

    // Função para abrir menu
    function openMobileMenu() {
        DOM.mobileMenu.classList.add('active');
        DOM.mobileMenuBtn.setAttribute('aria-expanded', 'true');
        DOM.mobileMenu.setAttribute('aria-hidden', 'false');
        
        // Mudar ícone para X
        const icon = DOM.mobileMenuBtn.querySelector('i');
        if (icon) icon.className = 'fas fa-times';
        
        AppState.isMobileMenuOpen = true;
        document.body.style.overflow = 'hidden';
        
        console.log('📱 Menu mobile ABERTO');
    }

    // Função para fechar menu
    function closeMobileMenu() {
        DOM.mobileMenu.classList.remove('active');
        DOM.mobileMenuBtn.setAttribute('aria-expanded', 'false');
        DOM.mobileMenu.setAttribute('aria-hidden', 'true');
        
        // Mudar ícone para hamburger
        const icon = DOM.mobileMenuBtn.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
        
        AppState.isMobileMenuOpen = false;
        document.body.style.overflow = '';
        
        console.log('📱 Menu mobile FECHADO');
    }

    // Função para alternar menu
    function toggleMobileMenu() {
        if (AppState.isMobileMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    // Event Listeners
    DOM.mobileMenuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileMenu();
    });

    // Fechar menu ao clicar em links
    DOM.mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', function(e) {
        if (AppState.isMobileMenuOpen && 
            !DOM.mobileMenu.contains(e.target) && 
            !DOM.mobileMenuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Fechar menu com tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && AppState.isMobileMenuOpen) {
            closeMobileMenu();
        }
    });

    // Fechar menu ao redimensionar para desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992 && AppState.isMobileMenuOpen) {
            closeMobileMenu();
        }
    });

    console.log('✅ Menu mobile inicializado!');
}

// --- SISTEMA DE BUSCA ---
function initSearchFunctionality() {
    if (!DOM.searchBtn || !DOM.searchInput) return;
    
    console.log('🔍 Inicializando sistema de busca...');

    function performSearch() {
        const searchTerm = DOM.searchInput.value.trim().toLowerCase();
        
        if (searchTerm.length < 2) {
            alert('🔍 Por favor, digite pelo menos 2 caracteres para buscar.');
            DOM.searchInput.focus();
            return;
        }

        AppState.searchTerm = searchTerm;
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
        if (!DOM.searchResults || !DOM.searchResultsTitle || !DOM.searchResultsContainer) return;
        
        DOM.searchResults.innerHTML = '';

        if (results.length === 0) {
            DOM.searchResultsTitle.textContent = `❌ Nenhum resultado encontrado para "${searchTerm}"`;
        } else {
            DOM.searchResultsTitle.textContent = `✅ ${results.length} resultado(s) para "${searchTerm}"`;
            
            results.forEach(card => {
                const clonedCard = card.cloneNode(true);
                const highlightedCard = highlightSearchTerms(clonedCard, searchTerm);
                DOM.searchResults.appendChild(highlightedCard);
            });
        }

        // Mostrar resultados e esconder notícias
        if (DOM.allNewsContainer) DOM.allNewsContainer.classList.add('hidden');
        DOM.searchResultsContainer.classList.remove('hidden');
        
        // Scroll para resultados
        DOM.searchResultsContainer.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    function highlightSearchTerms(card, term) {
        const elementsToHighlight = card.querySelectorAll('h3, p');
        const regex = new RegExp(term, 'gi');

        elementsToHighlight.forEach(el => {
            el.innerHTML = el.textContent.replace(regex, 
                match => `<span class="search-highlight">${match}</span>`
            );
        });
        
        return card;
    }

    // Event Listeners para busca
    DOM.searchBtn.addEventListener('click', performSearch);
    
    DOM.searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Busca na versão mobile
    const mobileSearchBtn = document.querySelector('.mobile-search button');
    const mobileSearchInput = document.querySelector('.mobile-search input');
    
    if (mobileSearchBtn && mobileSearchInput) {
        mobileSearchBtn.addEventListener('click', function() {
            DOM.searchInput.value = mobileSearchInput.value;
            performSearch();
            if (AppState.isMobileMenuOpen) {
                DOM.mobileMenu.classList.remove('active');
                AppState.isMobileMenuOpen = false;
            }
        });

        mobileSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                DOM.searchInput.value = mobileSearchInput.value;
                performSearch();
                if (AppState.isMobileMenuOpen) {
                    DOM.mobileMenu.classList.remove('active');
                    AppState.isMobileMenuOpen = false;
                }
            }
        });
    }

    console.log('✅ Sistema de busca inicializado!');
}

// --- CARROSSEL DE IMAGENS ---
function initCarousel() {
    if (!DOM.carouselImages || DOM.carouselImages.length === 0) {
        console.log('ℹ️ Nenhum carrossel encontrado nesta página.');
        return;
    }

    console.log('🖼️ Inicializando carrossel...');

    function showNextImage() {
        // Remover classe da imagem atual
        DOM.carouselImages[AppState.currentCarouselIndex].classList.remove('active');
        
        // Avançar índice
        AppState.currentCarouselIndex = (AppState.currentCarouselIndex + 1) % DOM.carouselImages.length;
        
        // Adicionar classe à nova imagem
        DOM.carouselImages[AppState.currentCarouselIndex].classList.add('active');
    }

    // Iniciar apenas se houver mais de uma imagem
    if (DOM.carouselImages.length > 1) {
        // Limpar intervalo existente
        if (AppState.carouselInterval) {
            clearInterval(AppState.carouselInterval);
        }
        
        // Iniciar novo intervalo
        AppState.carouselInterval = setInterval(showNextImage, 5000);
        console.log(`✅ Carrossel iniciado com ${DOM.carouselImages.length} imagens`);
    }
}

// --- WIDGET DE CLIMA ---
function initWeatherWidget() {
    if (!DOM.weatherWidget) {
        console.log('ℹ️ Widget de clima não encontrado.');
        return;
    }

    console.log('🌤️ Inicializando widget de clima...');

    const API_KEY = '5968cf52fd3711482404d885547a6757';
    const weatherElements = {
        temp: DOM.weatherWidget.querySelector('.weather-temp'),
        city: DOM.weatherWidget.querySelector('.weather-city'),
        desc: DOM.weatherWidget.querySelector('.weather-desc'),
        icon: DOM.weatherWidget.querySelector('.weather-icon i'),
        refreshBtn: DOM.weatherWidget.querySelector('.weather-refresh')
    };

    // Verificar se todos os elementos existem
    if (!weatherElements.temp || !weatherElements.city || !weatherElements.desc || !weatherElements.icon || !weatherElements.refreshBtn) {
        console.error('❌ Elementos do clima incompletos!');
        return;
    }

    async function fetchWeather(lat, lon) {
        try {
            weatherElements.refreshBtn.classList.add('loading');
            
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${API_KEY}`
            );
            
            if (!response.ok) throw new Error('Erro na API do clima');
            
            const data = await response.json();
            updateWeatherUI(data);
            
        } catch (error) {
            console.error('❌ Erro ao buscar clima:', error);
            showWeatherError();
        } finally {
            weatherElements.refreshBtn.classList.remove('loading');
        }
    }

    function updateWeatherUI(data) {
        weatherElements.temp.textContent = `${Math.round(data.main.temp)}°C`;
        weatherElements.city.textContent = data.name;
        weatherElements.desc.textContent = data.weather[0].description;
        weatherElements.icon.className = `fas ${getWeatherIcon(data.weather[0].id)}`;
    }

    function showWeatherError() {
        weatherElements.temp.textContent = '--°C';
        weatherElements.city.textContent = 'Não disponível';
        weatherElements.desc.textContent = 'Erro ao carregar';
        weatherElements.icon.className = 'fas fa-exclamation-triangle';
    }

    function getWeatherIcon(weatherId) {
        if (weatherId >= 200 && weatherId < 300) return 'fa-bolt';
        if (weatherId >= 300 && weatherId < 400) return 'fa-cloud-rain';
        if (weatherId >= 500 && weatherId < 600) return 'fa-cloud-showers-heavy';
        if (weatherId >= 600 && weatherId < 700) return 'fa-snowflake';
        if (weatherId >= 700 && weatherId < 800) return 'fa-smog';
        if (weatherId === 800) return 'fa-sun';
        if (weatherId > 800) return 'fa-cloud';
        return 'fa-question';
    }

    function getLocation() {
        if (!navigator.geolocation) {
            console.log('ℹ️ Geolocalização não suportada.');
            fetchWeather(-23.2927, -51.1732); // Fallback para Londrina
            return;
        }

        navigator.geolocation.getCurrentPosition(
            position => {
                fetchWeather(position.coords.latitude, position.coords.longitude);
            },
            error => {
                console.error('❌ Erro de geolocalização:', error);
                fetchWeather(-23.2927, -51.1732); // Fallback para Londrina
            },
            { timeout: 10000 }
        );
    }

    // Event Listeners
    weatherElements.refreshBtn.addEventListener('click', getLocation);
    
    // Carregar clima automaticamente
    getLocation();
    
    console.log('✅ Widget de clima inicializado!');
}

// --- FUNÇÕES UTILITÁRIAS ---
function initUtilities() {
    console.log('🔧 Inicializando utilitários...');
    
    // Atualizar ano no footer
    if (DOM.currentYearElement) {
        DOM.currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Animações de entrada para cards
    animateNewsCards();
    
    // Inicializar ScrollReveal se disponível
    initScrollReveal();
    
    console.log('✅ Utilitários inicializados!');
}

function animateNewsCards() {
    DOM.newsCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function initScrollReveal() {
    if (typeof ScrollReveal !== 'undefined') {
        ScrollReveal().reveal('.news-card, .headline-card, .section-title', {
            duration: 1000,
            distance: '30px',
            origin: 'bottom',
            interval: 100,
            reset: false
        });
    }
}

// --- CARROSSEL DO MENU (SE EXISTIR) ---
function initMenuCarousel() {
    const menuContainer = document.querySelector('.menu-container');
    const menu = document.querySelector('.menu');
    const arrowLeft = document.querySelector('.nav-arrow-left');
    const arrowRight = document.querySelector('.nav-arrow-right');

    if (!menuContainer || !menu || !arrowLeft || !arrowRight) return;

    function updateArrows() {
        const scrollLeft = menuContainer.scrollLeft;
        const scrollWidth = menu.scrollWidth;
        const clientWidth = menuContainer.clientWidth;

        arrowLeft.classList.toggle('hidden', scrollLeft <= 0);
        arrowRight.classList.toggle('hidden', scrollLeft >= scrollWidth - clientWidth - 1);
    }

    arrowLeft.addEventListener('click', () => {
        menuContainer.scrollBy({ left: -200, behavior: 'smooth' });
    });

    arrowRight.addEventListener('click', () => {
        menuContainer.scrollBy({ left: 200, behavior: 'smooth' });
    });

    menuContainer.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);
    
    updateArrows();
}

// --- MANIPULADOR DE ERROS GLOBAL ---
window.addEventListener('error', function(e) {
    console.error('❌ Erro global:', e.error);
});

// --- INICIALIZAR APLICAÇÃO ---
document.addEventListener('DOMContentLoaded', function() {
    // Pequeno delay para garantir que tudo carregou
    setTimeout(initializeApp, 100);
});

// --- EXPORTAR PARA USO GLOBAL (se necessário) ---
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initializeApp };
}