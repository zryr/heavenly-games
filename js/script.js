// --- JavaScript ---

// --- Proxy URLs ---
const PROXY_URL_1 = 'https://4893dm-8080.csb.app/proxy/';
const PROXY_URL_2 = 'https://9lckky-8080.csb.app/proxy/';

// --- DOM Element References ---
const sidebarToggle = document.getElementById('sidebar-toggle-btn');
const sidebar = document.querySelector('.sidebar');
const body = document.body;
const searchInput = document.getElementById('search-input');
const searchResultsContainer = document.getElementById('search-results');
const homepageView = document.getElementById('homepage-view');
const gameDetailView = document.getElementById('game-detail-view');
const popularGrid = document.getElementById('popular-grid');
const trendingGrid = document.getElementById('trending-grid');
const newGrid = document.getElementById('new-grid');
const favoritedGrid = document.getElementById('favorited-grid');
const genreGamesSection = document.getElementById('genre-games');
const genreTitleElement = document.getElementById('genre-title');
const genreGrid = document.getElementById('genre-grid');
const gameTitleElement = document.getElementById('game-title');
const gameIframe = document.getElementById('splash-game-content');
const gameDescriptionElement = gameDetailView.querySelector('#game-description p');
const gameControlsList = gameDetailView.querySelector('#game-controls ul');
const gameTagsList = gameDetailView.querySelector('#game-tags .tags-list');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const favoriteBtn = document.getElementById('favorite-btn');
const likeBtn = document.getElementById('like-btn');
const dislikeBtn = document.getElementById('dislike-btn');
const shareBtn = document.getElementById('share-btn');
const sidebarNavLinks = document.querySelectorAll('.sidebar-nav a');
const mainContent = document.querySelector('.main-content'); // Added reference for event delegation

// Modal Elements
const modalOverlay = document.getElementById('launch-options-modal');
const modalCloseBtn = modalOverlay.querySelector('.modal-close-btn');
const modalModeButtons = modalOverlay.querySelectorAll('#modal-mode-options .modal-button');
const modalUnblockButtons = modalOverlay.querySelectorAll('#modal-unblock-options .modal-button');
const modalGoButton = document.getElementById('modal-go-button');

// --- Modal State ---
let currentGameModal = null; // Store the game object that opened the modal
let selectedMode = null;
let selectedUnblocker = 'none'; // Default to 'none'
let elementFocusedBeforeModal; // For accessibility focus restoration


// --- Local Storage for Favorites ---
function getFavoritedGamesIds() {
    const favoritedIds = localStorage.getItem('favoritedGames');
    return favoritedIds ? JSON.parse(favoritedIds) : [];
}

function addFavoriteGame(gameId) {
    const favoritedIds = getFavoritedGamesIds();
    if (!favoritedIds.includes(gameId)) {
        favoritedIds.push(gameId);
        localStorage.setItem('favoritedGames', JSON.stringify(favoritedIds));
    }
}

function removeFavoriteGame(gameId) {
     const favoritedIds = getFavoritedGamesIds().filter(id => id !== gameId);
     localStorage.setItem('favoritedGames', JSON.stringify(favoritedIds));
}

// --- Rendering Functions ---

// Renders a grid of games into a specific container
function renderGameGrid(gamesToRender, containerElement) {
    containerElement.innerHTML = ''; // Clear current content
    if (gamesToRender.length === 0) {
         containerElement.innerHTML = '<p>No games found in this section.</p>';
         return;
    }

    gamesToRender.forEach(game => {
        const gameCard = document.createElement('div'); // Use div, handle clicks with JS
        gameCard.classList.add('game-card');
        gameCard.dataset.gameId = game.id; // Store game ID for click handling

        const pillsHtml = game.platforms.map(pill => {
            let iconClass = '';
            switch (pill.toLowerCase()) {
                case 'pc only':
                    iconClass = 'fas fa-desktop';
                    break;
                case 'keyboard needed':
                    iconClass = 'fas fa-keyboard';
                    break;
                case 'mobile supported':
                    iconClass = 'fas fa-mobile-alt';
                    break;
                default:
                    iconClass = 'fas fa-tag';
            }
            return `<span class="pill" title="${pill}"><i class="${iconClass}"></i></span>`;
        }).join('');

        gameCard.innerHTML = `
            <div class="pills-container">
               ${pillsHtml}
            </div>
            <img src="${game.icon}" alt="${game.title} icon">
            <div class="game-title">${game.title}</div>
        `;
        containerElement.appendChild(gameCard);
    });
}

// --- Navigation/View Switching ---

// Shows the homepage view and optionally filters/sorts games
function showHomepage(filter = 'home', genre = null) {
    homepageView.style.display = 'block';
    gameDetailView.style.display = 'none';
    gameIframe.src = 'about:blank'; // Stop the iframe game if it was loaded

    // Hide genre section by default and show default sections
    genreGamesSection.style.display = 'none';
    document.getElementById('trending-games').style.display = 'block';
    document.getElementById('new-games').style.display = 'block';
    document.getElementById('favorited-games').style.display = 'block';


    if (genre) {
        // Show specific genre section
        const gamesToDisplay = games.filter(game => game.genres && game.genres.includes(genre)); // Check if genres exists
        genreTitleElement.textContent = `${genre} Games`;
        renderGameGrid(gamesToDisplay, genreGrid);
        genreGamesSection.style.display = 'block';
        document.getElementById('trending-games').style.display = 'none';
        document.getElementById('new-games').style.display = 'none';
        document.getElementById('favorited-games').style.display = 'none';

    } else {
         // Render all default sections
         const popularGames = games.sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes)).slice(0, 10);
         const trendingGames = games.filter(game => game.isTrending);
         const newGames = games.filter(game => game.isNew);
         const favoritedIds = getFavoritedGamesIds();
         const favoritedGames = games.filter(game => favoritedIds.includes(game.id));
         renderGameGrid(popularGames, popularGrid);
         renderGameGrid(trendingGames, trendingGrid);
         renderGameGrid(newGames, newGrid);
         renderGameGrid(favoritedGames, favoritedGrid);
         // Handle random game navigation directly
         if (filter === 'random' && games.length > 0) {
             const randomIndex = Math.floor(Math.random() * games.length);
             const randomGame = games[randomIndex];
             showGameDetail(randomGame.id);
             return;
         }
    }
     body.classList.remove('game-view-active');
}


// Shows the game detail view for a specific game ID (for iframe games)
function showGameDetail(gameId) {
    const game = games.find(g => g.id === gameId);

    if (!game || game.launchType === 'modal') { // Ensure it's an iframe game
        showHomepage(); // Redirect to homepage if game is invalid
        return;
    }

    homepageView.style.display = 'none';
    gameDetailView.style.display = 'block';

    document.getElementById('game-title-main').textContent = game.title;
    gameIframe.src = game.iframeSrc; // Set the iframe source
    gameDescriptionElement.textContent = game.description || 'No description available.';

    // Populate controls (handle optional properties)
    gameControlsList.innerHTML = '';
    if (game.controls && game.controls.length > 0) {
         game.controls.forEach(control => { const li = document.createElement('li'); li.textContent = control; gameControlsList.appendChild(li); });
    } else {
         const li = document.createElement('li'); li.textContent = 'No specific controls listed.'; gameControlsList.appendChild(li);
    }

    // Populate tags (handle optional properties)
    gameTagsList.innerHTML = '';
    if (game.tags && game.tags.length > 0) {
                game.tags.forEach(tag => {
                    const span = document.createElement('span');
                    span.classList.add('tag');
                    let iconClass = '';
                    switch (tag.toLowerCase()) {
                        case 'car':
                            iconClass = 'fas fa-car';
                            break;
                        case 'strategy':
                            iconClass = 'fas fa-brain';
                            break;
                        case 'pc only':
                            iconClass = 'fas fa-desktop';
                            break;
                        case 'keyboard needed':
                            iconClass = 'fas fa-keyboard';
                            break;
                        case 'mobile supported':
                            iconClass = 'fas fa-mobile-alt';
                            break;
                        case 'arcade':
                            iconClass = 'fas fa-gamepad';
                            break;
                        case 'shooting':
                            iconClass = 'fas fa-crosshairs';
                            break;
                        case 'special':
                            iconClass = 'fas fa-star';
                            break;
                        case 'proxy':
                            iconClass = 'fas fa-server';
                            break;
                        case 'puzzle':
                            iconClass = 'fas fa-puzzle-piece';
                            break;
                        default:
                            iconClass = 'fas fa-tag';
                    }
                    span.innerHTML = `<i class="${iconClass}"></i> ${tag}`;
                    span.addEventListener('click', () => {
                        showHomepage('genre', tag);
                    });
                    gameTagsList.appendChild(span);
                });
    } else {
        gameTagsList.innerHTML = '<span>No tags listed.</span>';
    }
    history.pushState({ view: 'game', gameId: gameId }, game.title, `?game=${gameId}`);
    body.classList.add('game-view-active');

    const favoritedIds = getFavoritedGamesIds();
    if (favoritedIds.includes(gameId)) {
        favoriteBtn.innerHTML = '<i class="fas fa-star"></i>';
    } else {
        favoriteBtn.innerHTML = '<i class="far fa-star"></i>';
    }

    // Populate related games
    const relatedGrid = document.getElementById('related-grid');
    const relatedGames = games.filter(g => g.genres.some(genre => game.genres.includes(genre)) && g.id !== game.id).slice(0, 5);
    renderGameGrid(relatedGames, relatedGrid);
}

// --- Modal Functions ---

function openModal(gameId) {
     const game = games.find(g => g.id === gameId);
     if (!game || game.launchType !== 'modal') return;

     // --- Accessibility: Store focused element ---
     elementFocusedBeforeModal = document.activeElement;

     currentGameModal = game;

     // --- Reset modal state and selected classes ---
     selectedMode = null;
     selectedUnblocker = 'none';
     modalModeButtons.forEach(btn => btn.classList.remove('selected'));
     modalUnblockButtons.forEach(btn => {
          btn.classList.remove('selected');
          if (btn.dataset.unblocker === 'none') btn.classList.add('selected');
     });
     modalGoButton.disabled = true;

     // --- Show modal with animation ---
     modalOverlay.classList.add('visible');

     // --- Accessibility: Focus first element in modal ---
     modalCloseBtn.focus();
}

function closeModal() {
     // --- Trigger closing animation ---
     modalOverlay.classList.add('closing');

     // --- Remove after animation completes ---
     modalOverlay.addEventListener('animationend', () => {
         modalOverlay.classList.remove('visible', 'closing');
         currentGameModal = null;
         // --- Accessibility: Restore focus ---
         if (elementFocusedBeforeModal) elementFocusedBeforeModal.focus();
     }, { once: true }); // Important: listener removes itself after one run
}

// --- Event Listeners ---

// Game card clicks (using event delegation on the main-content area)
mainContent.addEventListener('click', (event) => {
    const gameCard = event.target.closest('.game-card');
    if (!gameCard) return;
    event.preventDefault();
    const gameId = gameCard.dataset.gameId;
    const game = games.find(g => g.id === gameId);
    if (game) {
         if (game.launchType === 'modal') openModal(gameId);
         else showGameDetail(gameId);
    }
});

// Search input
searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    searchResultsContainer.innerHTML = '';
    if (!query) {
        searchResultsContainer.classList.remove('visible');
        return;
    }
    const filteredGames = games.filter(game => game.title.toLowerCase().includes(query));
    if (filteredGames.length > 0) {
         filteredGames.forEach(game => {
            const resultItem = document.createElement('div');
            resultItem.innerHTML = `<img src="${game.icon}" alt=""> <span>${game.title}</span>`;
            resultItem.addEventListener('click', () => {
                searchInput.value = '';
                searchResultsContainer.classList.remove('visible');
                if (game.launchType === 'modal') openModal(game.id);
                else showGameDetail(game.id);
            });
            searchResultsContainer.appendChild(resultItem);
        });
        searchResultsContainer.classList.add('visible');
    } else {
        searchResultsContainer.classList.remove('visible');
    }
});

// Hide search results when clicking outside
document.addEventListener('click', (event) => {
    if (!searchInput.parentElement.contains(event.target)) {
        searchResultsContainer.classList.remove('visible');
    }
});

// --- Modal Event Listeners ---

// Close modal using the 'X' button or overlay click
modalOverlay.addEventListener('click', (event) => {
     if (event.target === modalOverlay || event.target.closest('.modal-close-btn')) {
         closeModal();
     }
});

// Select Mode button handler
modalModeButtons.forEach(button => {
    button.addEventListener('click', () => {
        modalModeButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        selectedMode = button.dataset.mode;
        modalGoButton.disabled = false;
    });
});

// Select Unblocker button handler
modalUnblockButtons.forEach(button => {
    button.addEventListener('click', () => {
        modalUnblockButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        selectedUnblocker = button.dataset.unblocker;
    });
});

// Go button handler
modalGoButton.addEventListener('click', () => {
    if (!currentGameModal || !selectedMode) return;

    let targetUrl;
    if (selectedMode === 'normal') targetUrl = currentGameModal.normalUrl;
    else if (selectedMode === 'fullscreen') targetUrl = currentGameModal.fullscreenUrl;

    if (!targetUrl) {
        alert('Error: Game URL is missing.');
        return;
    }

    let finalUrl = targetUrl;
    if (selectedUnblocker === 'proxy1') finalUrl = PROXY_URL_1 + encodeURIComponent(targetUrl);
    else if (selectedUnblocker === 'proxy2') finalUrl = PROXY_URL_2 + encodeURIComponent(targetUrl);

    window.open(finalUrl, '_blank');
    closeModal();
});

// --- Keyboard Navigation & Accessibility ---
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalOverlay.classList.contains('visible')) {
        closeModal();
    }

    // --- Focus Trapping in Modal ---
    if (event.key === 'Tab' && modalOverlay.classList.contains('visible')) {
        const focusableElements = modalOverlay.querySelectorAll('button');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) { // Shift + Tab
            if (document.activeElement === firstElement) {
                lastElement.focus();
                event.preventDefault();
            }
        } else { // Tab
            if (document.activeElement === lastElement) {
                firstElement.focus();
                event.preventDefault();
            }
        }
    }
});


// --- Simplified Initial Load & History ---
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('game');
    const genre = urlParams.get('genre');

    if (gameId) showGameDetail(gameId);
    else if (genre) showHomepage('genre', genre);
    else showHomepage('home');

    // Set default modal states visually
    modalGoButton.disabled = true;
    modalUnblockButtons.forEach(btn => {
         if (btn.dataset.unblocker === 'none') btn.classList.add('selected');
    });
});

window.onpopstate = (event) => {
     // Close modal if it's open, otherwise navigate
     if (modalOverlay.classList.contains('visible')) {
         closeModal();
     } else if (event.state && event.state.view === 'game') {
         showGameDetail(event.state.gameId);
     } else {
         showHomepage('home');
     }
};

// --- Sidebar Toggle & Other minor listeners ---
sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    body.classList.toggle('sidebar-is-collapsed');
});
document.querySelector('.sidebar-nav').addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;
    event.preventDefault();

    document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
    link.classList.add('active');

    const section = link.dataset.section;
    const genre = link.dataset.genre;
    if (section) showHomepage(section);
    else if (genre) showHomepage('genre', genre);
});
fullscreenBtn.addEventListener('click', () => {
    gameIframe.requestFullscreen?.();
});

favoriteBtn.addEventListener('click', () => {
    const gameId = new URLSearchParams(window.location.search).get('game');
    const favoritedIds = getFavoritedGamesIds();
    if (favoritedIds.includes(gameId)) {
        removeFavoriteGame(gameId);
        favoriteBtn.innerHTML = '<i class="far fa-star"></i>';
    } else {
        addFavoriteGame(gameId);
        favoriteBtn.innerHTML = '<i class="fas fa-star"></i>';
    }
});

likeBtn.addEventListener('click', () => {
    const gameId = new URLSearchParams(window.location.search).get('game');
    const game = games.find(g => g.id === gameId);
    game.likes++;
    updateRating(gameId);
});

dislikeBtn.addEventListener('click', () => {
    const gameId = new URLSearchParams(window.location.search).get('game');
    const game = games.find(g => g.id === gameId);
    game.dislikes++;
    updateRating(gameId);
});

function updateRating(gameId) {
    const game = games.find(g => g.id === gameId);
    const likeCount = game.likes;
    const dislikeCount = game.dislikes;
    const totalVotes = likeCount + dislikeCount;
    const likePercentage = totalVotes === 0 ? 50 : (likeCount / totalVotes) * 100;
    document.getElementById('rating-bar-fill').style.width = `${likePercentage}%`;
}

shareBtn.addEventListener('click', () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
    }, () => {
        alert('Failed to copy link.');
    });
});

window.addEventListener('scroll', function() {
    const header = document.querySelector('.site-header');
    if (window.scrollY > 10) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});
