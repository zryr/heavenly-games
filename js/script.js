document.addEventListener('DOMContentLoaded', () => {
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
    const settingsView = document.getElementById('settings-view');
    const siteTitleInput = document.getElementById('site-title-input');
    const siteIconInput = document.getElementById('site-icon-input');
    const presetIconsContainer = document.getElementById('preset-icons-container');
    const resetSettingsBtn = document.getElementById('reset-settings-btn');
    const panicOverlay = document.getElementById('panic-overlay');
    const skeletonLoader = document.getElementById('skeleton-loader');
    const heroSection = document.getElementById('hero-section');
    const recentlyPlayedSection = document.getElementById('recently-played-games');
    const recentlyPlayedGrid = document.getElementById('recently-played-grid');
    const popularGrid = document.getElementById('popular-grid');
    const trendingGrid = document.getElementById('trending-grid');
    const newGrid = document.getElementById('new-grid');
    const favoritedGrid = document.getElementById('favorited-grid');
    const genreGamesSection = document.getElementById('genre-games');
    const genreTitleElement = document.getElementById('genre-title');
    const genreGrid = document.getElementById('genre-grid');
    const gameIframe = document.getElementById('splash-game-content');
    const gameDescriptionElement = gameDetailView.querySelector('#game-description p');
    const gameControlsList = gameDetailView.querySelector('#game-controls ul');
    const gameTagsList = gameDetailView.querySelector('#game-tags .tags-list');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const favoriteBtn = document.getElementById('favorite-btn');
    const shareBtn = document.getElementById('share-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const moviesBtn = document.getElementById('movies-btn');
    const sidebarNavLinks = document.querySelectorAll('.sidebar-nav a');
    const mainContent = document.querySelector('.main-content'); // Added reference for event delegation

    // Modal Elements
    const modalOverlay = document.getElementById('launch-options-modal');
    const modalCloseBtn = modalOverlay.querySelector('.modal-close-btn');
    const modalModeButtons = modalOverlay.querySelectorAll('#modal-mode-options .modal-button');
    const modalUnblockButtons = modalOverlay.querySelectorAll('#modal-unblock-options .modal-button');
    const modalGoButton = document.getElementById('modal-go-button');

    // Redirect Modal Elements
    const redirectModal = document.getElementById('redirect-modal');
    const redirectContinueBtn = document.getElementById('redirect-continue-btn');
    const redirectModalCloseBtn = redirectModal.querySelector('.modal-close-btn');

    // Toast Notification
    const toastNotification = document.getElementById('toast-notification');

    // Confirm Modal Elements
    const confirmModal = document.getElementById('confirm-modal');
    const confirmModalTitle = document.getElementById('confirm-modal-title');
    const confirmModalText = document.getElementById('confirm-modal-text');
    const confirmModalOkBtn = document.getElementById('confirm-modal-ok-btn');
    const confirmModalCancelBtn = document.getElementById('confirm-modal-cancel-btn');
    const confirmModalCloseBtn = document.getElementById('confirm-modal-close-btn');
    const stealthBtn = document.getElementById('stealth-btn');

    // Suggestion Modal Elements
    const suggestGameBtn = document.getElementById('suggest-game-btn');
    const suggestionModal = document.getElementById('suggestion-modal');


    // --- Settings ---
    const PRESETS = [
        { title: 'Heaven', icon: 'images/drive-mad.webp' },
        { title: 'Google', icon: 'https://www.google.com/s2/favicons?domain=google.com' },
        { title: 'YouTube', icon: 'https://www.google.com/s2/favicons?domain=youtube.com' },
        { title: 'Discord', icon: 'https://www.google.com/s2/favicons?domain=discord.com' },
        { title: 'Google Classroom', icon: 'https://www.google.com/s2/favicons?domain=classroom.google.com' },
        { title: 'ClassLink', icon: 'https://www.google.com/s2/favicons?domain=classlink.com' },
        { title: 'Canvas', icon: 'https://www.google.com/s2/favicons?domain=instructure.com' },
        { title: 'Schoology', icon: 'https://www.google.com/s2/favicons?domain=schoology.com' }
    ];

    function applyAppearanceSettings() {
        const savedTitle = localStorage.getItem('siteTitle');
        const savedIcon = localStorage.getItem('siteIcon');

        if (savedTitle) {
            document.title = savedTitle;
            siteTitleInput.value = savedTitle;
        }

        if (savedIcon) {
            document.querySelector('link[rel="shortcut icon"]').href = savedIcon;
            siteIconInput.value = savedIcon;
        }

        // Populate preset icons
        presetIconsContainer.innerHTML = '';
        PRESETS.forEach(preset => {
            const img = document.createElement('img');
            img.src = preset.icon;
            img.classList.add('preset-icon');
            img.addEventListener('click', () => {
                siteIconInput.value = preset.icon;
                updateIcon(preset.icon);
                siteTitleInput.value = preset.title;
                updateTitle(preset.title);
                document.querySelector('.preset-icon.selected')?.classList.remove('selected');
                img.classList.add('selected');
            });
            presetIconsContainer.appendChild(img);
        });
    }

    function updateTitle(newTitle) {
        document.title = newTitle;
        try {
            localStorage.setItem('siteTitle', newTitle);
        } catch (e) {
            console.warn('Could not save site title to localStorage.', e);
        }
    }

    function updateIcon(newIconUrl) {
        document.querySelector('link[rel="shortcut icon"]').href = newIconUrl;
        try {
            localStorage.setItem('siteIcon', newIconUrl);
        } catch (e) {
            console.warn('Could not save site icon to localStorage.', e);
        }
    }

    siteTitleInput.addEventListener('input', (e) => {
        updateTitle(e.target.value);
    });

    siteIconInput.addEventListener('input', (e) => {
        updateIcon(e.target.value);
    });

    resetSettingsBtn.addEventListener('click', async () => {
        const confirmed = await showConfirm('Reset All Settings', 'Are you sure you want to reset all settings? This action cannot be undone.');
        if (confirmed) {
            localStorage.removeItem('siteTitle');
            localStorage.removeItem('siteIcon');
            window.location.reload();
        }
    });

    stealthBtn.addEventListener('click', () => {
        const newWindow = window.open('about:blank', '_blank');
        if (newWindow) {
            const iframe = newWindow.document.createElement('iframe');
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.src = window.location.origin + window.location.pathname;
            newWindow.document.body.style.margin = '0';
            newWindow.document.body.appendChild(iframe);
            window.close();
        } else {
            showToast('Popup blocked! Please allow popups to use Stealth Mode.');
        }
    });


    // --- Global State ---
    let games = []; // This will be populated from games.json
    let currentGameModal = null; // Store the game object that opened the modal
    let selectedMode = null;
    let selectedUnblocker = 'none'; // Default to 'none'
    let elementFocusedBeforeModal; // For accessibility focus restoration

    // Playtime Tracking
    let playtimeTracker = null;
    let currentSessionTime = 0;
    let currentGameId = null;


    // --- User Game Data (Playtime, etc.) ---
    const USER_GAME_DATA_KEY = 'userGameData';
    const USER_VOTE_DATA_KEY = 'userVoteData';
    const GAME_VIEW_DATA_KEY = 'gameViewData';

    function getUserVoteData() {
        const data = localStorage.getItem(USER_VOTE_DATA_KEY);
        return data ? JSON.parse(data) : {};
    }

    function saveUserVoteData(data) {
        try {
            localStorage.setItem(USER_VOTE_DATA_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('Could not save user vote data to localStorage.', e);
        }
    }

    function getGameViewData() {
        const data = localStorage.getItem(GAME_VIEW_DATA_KEY);
        return data ? JSON.parse(data) : {};
    }

    function saveGameViewData(data) {
        try {
            localStorage.setItem(GAME_VIEW_DATA_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('Could not save game view data to localStorage.', e);
        }
    }

    function incrementViewCount(gameId) {
        const allData = getGameViewData();
        allData[gameId] = (allData[gameId] || 0) + 1;
        saveGameViewData(allData);
    }

    function getUserGameData() {
        const data = localStorage.getItem(USER_GAME_DATA_KEY);
        return data ? JSON.parse(data) : {};
    }

    function saveUserGameData(data) {
        try {
            localStorage.setItem(USER_GAME_DATA_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('Could not save user game data to localStorage.', e);
        }
    }

    function getGameData(gameId) {
        const allData = getUserGameData();
        return allData[gameId] || { totalPlaytime: 0, lastPlayed: null };
    }

    function formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) {
            return '0s';
        }
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);

        return [
            h > 0 ? `${h}h` : '',
            m > 0 ? `${m}m` : '',
            s > 0 ? `${s}s` : ''
        ].filter(Boolean).join(' ') || '0s';
    }

    function updateGameData(gameId, sessionTime) {
        const allData = getUserGameData();
        const gameData = allData[gameId] || { totalPlaytime: 0 };

        gameData.totalPlaytime += sessionTime;
        gameData.lastPlayed = Date.now();

        allData[gameId] = gameData;
        saveUserGameData(allData);
    }


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

            const pillsHtml = (game.platforms || []).map(pill => {
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
    function stopPlaytimeTracker() {
        if (playtimeTracker) {
            clearInterval(playtimeTracker);
            updateGameData(currentGameId, currentSessionTime);
            playtimeTracker = null;
            currentSessionTime = 0;
            currentGameId = null;
        }
    }

    // Shows the homepage view and optionally filters/sorts games
    function showHomepage(filter = 'home', genre = null) {
        stopPlaytimeTracker();
        // Hide all views
        gameDetailView.style.display = 'none';
        settingsView.style.display = 'none';
        gameDetailView.classList.remove('is-visible');
        settingsView.classList.remove('is-visible');
        fullscreenBtn.style.display = 'none'; // Hide fullscreen button

        homepageView.style.display = 'block';
        setTimeout(() => homepageView.classList.add('is-visible'), 10);

        gameIframe.src = 'about:blank'; // Stop the iframe game if it was loaded

        let filteredGames = [...games];

        // Apply platform filters
        if (activeFilters.platforms.length > 0) {
            filteredGames = filteredGames.filter(game =>
                game.platforms && activeFilters.platforms.every(platform => game.platforms.includes(platform))
            );
        }

        // Hide genre section by default and show default sections
        genreGamesSection.style.display = 'none';
        document.getElementById('trending-games').style.display = 'block';
        document.getElementById('new-games').style.display = 'block';
        document.getElementById('favorited-games').style.display = 'block';


        if (genre) {
            // Show specific genre section
            const gamesToDisplay = filteredGames.filter(game => game.tags && game.tags.includes(genre));
            genreTitleElement.textContent = `${genre} Games`;
            renderGameGrid(gamesToDisplay, genreGrid);
            genreGamesSection.style.display = 'block';
            document.getElementById('trending-games').style.display = 'none';
            document.getElementById('new-games').style.display = 'none';
            document.getElementById('favorited-games').style.display = 'none';
        document.getElementById('popular-games').style.display = 'none';
        document.getElementById('recently-played-games').style.display = 'none';
        document.getElementById('hero-section').style.display = 'none';

        } else {
        document.getElementById('popular-games').style.display = 'block';
        document.getElementById('hero-section').style.display = 'block';
             // Render all default sections
             const popularGames = [...filteredGames].sort((a, b) => ((b.likes || 0) - (b.dislikes || 0)) - ((a.likes || 0) - (a.dislikes || 0))).slice(0, 10);
             const trendingGames = [...filteredGames].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 10);
             const newGames = filteredGames.filter(game => game.isNew);

            // Populate Hero Section
            if (trendingGames.length > 0) {
                const heroGame = trendingGames[0];
                heroSection.style.backgroundImage = `url('${heroGame.icon}')`;
                heroSection.innerHTML = `
                    <div class="hero-content">
                        <h2 class="hero-title">${heroGame.title}</h2>
                        <a href="#" class="hero-button" data-game-id="${heroGame.id}">Play Now</a>
                    </div>
                `;
                // Add event listener for the hero button
                heroSection.querySelector('.hero-button').addEventListener('click', (e) => {
                    e.preventDefault();
                    const gameId = e.target.dataset.gameId;
                    const game = games.find(g => g.id === gameId);
                    if (game) {
                        if (game.launchType === 'modal') openModal(gameId);
                        else showGameDetail(gameId);
                    }
                });
            }

            // Populate Recently Played Section
            const userGameData = getUserGameData();
            const playedGameIds = Object.keys(userGameData);
            if (playedGameIds.length > 0) {
                const sortedPlayedGames = playedGameIds.sort((a, b) => {
                    return userGameData[b].lastPlayed - userGameData[a].lastPlayed;
                });
                const recentlyPlayedGames = sortedPlayedGames.map(gameId => filteredGames.find(g => g.id === gameId)).filter(Boolean);
                renderGameGrid(recentlyPlayedGames, recentlyPlayedGrid);
                recentlyPlayedSection.style.display = 'block';
            } else {
                recentlyPlayedSection.style.display = 'none';
            }

             const favoritedIds = getFavoritedGamesIds();
             const favoritedGames = filteredGames.filter(game => favoritedIds.includes(game.id));
             renderGameGrid(popularGames, popularGrid);
             renderGameGrid(trendingGames, trendingGrid);
             renderGameGrid(newGames, newGrid);
             renderGameGrid(favoritedGames, favoritedGrid);
             // Handle random game navigation directly
             if (filter === 'random' && filteredGames.length > 0) {
                 const randomIndex = Math.floor(Math.random() * filteredGames.length);
                 const randomGame = filteredGames[randomIndex];
                 showGameDetail(randomGame.id);
                 return;
             }
        }
         body.classList.remove('game-view-active');
    }


    // Shows the game detail view for a specific game ID (for iframe games)
    function showGameDetail(gameId) {
        incrementViewCount(gameId);
        stopPlaytimeTracker(); // Stop previous tracker if any
        const game = games.find(g => g.id === gameId);

        if (!game || game.launchType === 'modal') { // Ensure it's an iframe game
            showHomepage(); // Redirect to homepage if game is invalid
            return;
        }

        homepageView.style.display = 'none';
        settingsView.style.display = 'none';
        homepageView.classList.remove('is-visible');
        settingsView.classList.remove('is-visible');
        fullscreenBtn.style.display = 'flex'; // Show fullscreen button

        gameDetailView.style.display = 'block';
        setTimeout(() => gameDetailView.classList.add('is-visible'), 10);

        document.getElementById('game-title-main').textContent = game.title;
        gameIframe.src = game.iframeSrc; // Set the iframe source

        // Start Playtime Tracker
        currentGameId = gameId;
        playtimeTracker = setInterval(() => {
            currentSessionTime++;
            // Save periodically every 15 seconds
            if (currentSessionTime % 15 === 0) {
                updateGameData(currentGameId, 15);
                currentSessionTime = 0; // Reset session time after saving
            }
        }, 1000);
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
                            // Highlight the corresponding sidebar link
                            document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
                            const sidebarLink = document.querySelector(`.sidebar-nav a[data-genre="${tag}"]`);
                            if (sidebarLink) {
                                sidebarLink.classList.add('active');
                            }
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
        const relatedGames = games.filter(g => (g.tags || []).some(tag => (game.tags || []).includes(tag)) && g.id !== game.id).slice(0, 5);
        renderGameGrid(relatedGames, relatedGrid);

        // Populate creator info
    const creatorSpan = document.getElementById('game-creator');
        if (game.creator && game.creatorProfile) {
        creatorSpan.innerHTML = `<a href="${game.creatorProfile}" target="_blank"><b>${game.creator}</b></a>`;
        } else {
        creatorSpan.textContent = 'Not available';
        }

        // Populate playtime
    const playtimeSpan = document.getElementById('game-playtime');
        const userGameData = getGameData(gameId);
    playtimeSpan.textContent = formatTime(userGameData.totalPlaytime);

    // --- Metadata Bar Logic ---
    const viewCountSpan = document.getElementById('view-count-number');
    const likeBtn = document.getElementById('like-btn');
    const dislikeBtn = document.getElementById('dislike-btn');
    const likeBar = document.getElementById('like-bar');
    const likePercentageSpan = document.getElementById('like-percentage');

    // Populate view count
    const allViewData = getGameViewData();
    viewCountSpan.textContent = (allViewData[gameId] || 0).toLocaleString();

    // Populate and handle ratings
    let allVoteData = getUserVoteData();
    let userVote = allVoteData[gameId]; // 'like', 'dislike', or undefined

    const updateRatingDisplay = () => {
        const likes = game.likes || 0;
        const dislikes = game.dislikes || 0;
        const totalVotes = likes + dislikes;
        const percentage = totalVotes === 0 ? 0 : Math.round((likes / totalVotes) * 100);

        likeBar.style.width = `${percentage}%`;
        likePercentageSpan.textContent = `${percentage}%`;

        likeBtn.classList.remove('voted');
        dislikeBtn.classList.remove('voted');
        if (userVote === 'like') {
            likeBtn.classList.add('voted');
        } else if (userVote === 'dislike') {
            dislikeBtn.classList.add('voted');
        }
    };

    updateRatingDisplay();

    likeBtn.onclick = () => {
        if (userVote === 'like') return;

        if (userVote === 'dislike') {
            game.dislikes--;
        }
        game.likes++;
        userVote = 'like';
        allVoteData[gameId] = 'like';
        saveUserVoteData(allVoteData);
        updateRatingDisplay();
    };

    dislikeBtn.onclick = () => {
        if (userVote === 'dislike') return;

        if (userVote === 'like') {
            game.likes--;
        }
        game.dislikes++;
        userVote = 'dislike';
        allVoteData[gameId] = 'dislike';
        saveUserVoteData(allVoteData);
        updateRatingDisplay();
    };
    }

    function showSettingsView() {
        stopPlaytimeTracker();
        homepageView.style.display = 'none';
        gameDetailView.style.display = 'none';
        homepageView.classList.remove('is-visible');
        gameDetailView.classList.remove('is-visible');
        fullscreenBtn.style.display = 'none'; // Hide fullscreen button

        settingsView.style.display = 'block';
        setTimeout(() => settingsView.classList.add('is-visible'), 10);

        gameIframe.src = 'about:blank'; // Stop any running game
    }

    // --- Generic Modal Functions ---
    function showAnimatedModal(modal) {
        if (!modal) return;
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('visible'), 10); // Timeout ensures transition applies
    }

    function hideAnimatedModal(modal) {
        if (!modal) return;
        modal.classList.add('closing');
        modal.addEventListener('animationend', () => {
            modal.classList.remove('visible', 'closing');
            modal.style.display = 'none';
        }, { once: true });
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

    function showToast(message) {
        toastNotification.textContent = message;
        toastNotification.className = "toast show";
    setTimeout(function(){ toastNotification.className = toastNotification.className.replace("show", ""); }, 5000);
    }

    function showConfirm(title, text) {
        return new Promise(resolve => {
            confirmModalTitle.textContent = title;
            confirmModalText.textContent = text;

            confirmModal.style.display = 'flex';
            confirmModal.classList.add('visible');

            let resolved = false;

            const cleanupAndResolve = (value) => {
                if (resolved) return;
                resolved = true;

                confirmModal.classList.remove('visible');
                confirmModal.classList.add('closing');

                confirmModal.addEventListener('animationend', () => {
                    confirmModal.style.display = 'none';
                    confirmModal.classList.remove('closing');

                    // Clean up listeners
                    confirmModalOkBtn.removeEventListener('click', okListener);
                    confirmModalCancelBtn.removeEventListener('click', cancelListener);
                    confirmModalCloseBtn.removeEventListener('click', cancelListener);
                    confirmModal.removeEventListener('click', overlayListener);

                    resolve(value);
                }, { once: true });
            };

            const okListener = () => cleanupAndResolve(true);
            const cancelListener = () => cleanupAndResolve(false);
            const overlayListener = (event) => {
                if (event.target === confirmModal) {
                    cleanupAndResolve(false);
                }
            };

            confirmModalOkBtn.addEventListener('click', okListener);
            confirmModalCancelBtn.addEventListener('click', cancelListener);
            confirmModalCloseBtn.addEventListener('click', cancelListener);
            confirmModal.addEventListener('click', overlayListener);
        });
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
        let filteredGames = [...games];

        // Apply platform filters
        if (activeFilters.platforms.length > 0) {
            filteredGames = filteredGames.filter(game =>
                game.platforms && activeFilters.platforms.every(platform => game.platforms.includes(platform))
            );
        }
        const searchResults = filteredGames.filter(game => game.title.toLowerCase().includes(query));

        if (searchResults.length > 0) {
             searchResults.forEach(game => {
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

    settingsBtn.addEventListener('click', showSettingsView);

    // --- Redirect Modal Logic ---
    moviesBtn.addEventListener('click', () => {
        showAnimatedModal(redirectModal);
    });

    redirectModal.addEventListener('click', (event) => {
        if (event.target === redirectModal || event.target.closest('.modal-close-btn')) {
            hideAnimatedModal(redirectModal);
        }
    });

    redirectContinueBtn.addEventListener('click', () => {
        window.open('https://rs.gmsgroup.app/', '_blank');
        hideAnimatedModal(redirectModal);
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
            showToast('Error: Game URL is missing.');
            return;
        }

        let finalUrl = targetUrl;
                if (selectedUnblocker === 'proxy1') finalUrl = PROXY_URL_1 + targetUrl;
                else if (selectedUnblocker === 'proxy2') finalUrl = PROXY_URL_2 + targetUrl;

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


    // --- Application Initialization ---
    async function initializeApp() {
        // Restore sidebar state
        try {
            if (localStorage.getItem('sidebarCollapsed') === 'true') {
                sidebar.classList.add('collapsed');
                body.classList.add('sidebar-is-collapsed');
            }
        } catch (e) {
            console.warn('Could not load sidebar state from localStorage.', e);
        }

        applyAppearanceSettings();

        try {
            const response = await fetch('games.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            games = await response.json();

            // Once games are loaded, proceed with initial page setup
            const urlParams = new URLSearchParams(window.location.search);
            const gameId = urlParams.get('game');
            const genre = urlParams.get('genre');

            if (gameId) {
                showGameDetail(gameId);
            } else if (genre) {
                showHomepage('genre', genre);
            } else {
                showHomepage('home');
            }

            // Set default modal states visually
            modalGoButton.disabled = true;
            modalUnblockButtons.forEach(btn => {
                if (btn.dataset.unblocker === 'none') btn.classList.add('selected');
            });

            // Hide skeleton loader
            skeletonLoader.style.opacity = '0';
            setTimeout(() => {
                skeletonLoader.style.display = 'none';
            }, 500); // Match CSS transition duration

        } catch (error) {
            console.error("Could not load game data:", error);
            // Optionally, display an error message to the user on the page
        mainContent.innerHTML = '<p class="error">Sorry, we could not load the games. Please try again later. Error: ' + error.toString() + '</p>';
            // Hide skeleton loader to make error message visible
            skeletonLoader.style.opacity = '0';
            setTimeout(() => {
                skeletonLoader.style.display = 'none';
            }, 500); // Match CSS transition duration
        }
    }


    // --- Simplified Initial Load & History ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }

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
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    function closeSidebar() {
        sidebar.classList.add('collapsed');
        sidebarToggle.classList.remove('toggled');
        body.classList.add('sidebar-is-collapsed');
        sidebarOverlay.style.display = 'none';
        try {
            localStorage.setItem('sidebarCollapsed', true);
        } catch (e) {
            console.warn('Could not save sidebar state.', e);
        }
    }

    sidebarToggle.addEventListener('click', () => {
        const isCollapsed = sidebar.classList.toggle('collapsed');
        sidebarToggle.classList.toggle('toggled', !isCollapsed);
        body.classList.toggle('sidebar-is-collapsed', isCollapsed);
        sidebarOverlay.style.display = isCollapsed ? 'none' : 'block';
        try {
            localStorage.setItem('sidebarCollapsed', isCollapsed);
        } catch (e) {
            console.warn('Could not save sidebar state.', e);
        }
    });

    sidebarOverlay.addEventListener('click', closeSidebar);
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


    shareBtn.addEventListener('click', () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            showToast('Link copied to clipboard!');
        }, () => {
            showToast('Failed to copy link.');
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

    window.addEventListener('beforeunload', stopPlaytimeTracker);

    // --- Filter Logic ---
    const filterBtn = document.getElementById('filter-btn');
    const filterModal = document.getElementById('filter-modal');
    const applyFiltersBtn = document.getElementById('apply-filters-btn');

    let activeFilters = {
        platforms: []
    };

    filterBtn.addEventListener('click', () => {
        showAnimatedModal(filterModal);
    });

    filterModal.addEventListener('click', (event) => {
        if (event.target === filterModal || event.target.closest('.modal-close-btn')) {
            hideAnimatedModal(filterModal);
        }
    });

    applyFiltersBtn.addEventListener('click', () => {
        const platformCheckboxes = filterModal.querySelectorAll('input[name="platform"]:checked');
        activeFilters.platforms = Array.from(platformCheckboxes).map(cb => cb.value);
        hideAnimatedModal(filterModal);
        showHomepage('home'); // Re-render the homepage with the new filters
    });

    // Suggestion Modal Logic
    suggestGameBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showAnimatedModal(suggestionModal);
    });

    suggestionModal.addEventListener('click', (event) => {
        if (event.target === suggestionModal || event.target.closest('.modal-close-btn')) {
            hideAnimatedModal(suggestionModal);
        }
    });
});
