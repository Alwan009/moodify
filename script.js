// DOM Elements
const form = document.getElementById('playlist-form');
const moodSelect = document.getElementById('mood');
const musicTypeSelect = document.getElementById('music-type');
const countrySelect = document.getElementById('country');
const resultsSection = document.getElementById('results');
const playlistContainer = document.getElementById('playlist-container');
const noResultsMessage = document.getElementById('no-results');
const themeToggle = document.getElementById('theme-toggle');
const factText = document.getElementById('fact-text');
const musicFactSection = document.getElementById('music-fact');
const favoritesContainer = document.getElementById('favorites-container');
const noFavoritesMessage = document.getElementById('no-favorites');
const recommendationsTab = document.getElementById('recommendations-tab');
const favoritesTab = document.getElementById('favorites-tab');
const recommendationsContent = document.getElementById('recommendations-content');
const favoritesContent = document.getElementById('favorites-content');
const toast = document.getElementById('toast');

// Random music facts to display
const musicFacts = [
    "The world's longest concert lasted for 639 hours.",
    "The most expensive musical instrument ever sold was a Stradivarius violin for $15.9 million.",
    "Listening to music can release dopamine, the 'feel good' chemical in your brain.",
    "The first music was created around 55,000 years ago.",
    "Mozart wrote his first symphony at the age of 8.",
    "The Beatles have sold over 600 million albums worldwide.",
    "The longest recorded pop song is 'The Rise and Fall of Bossanova' at 13 hours, 23 minutes, and 32 seconds.",
    "The human voice is the oldest musical instrument.",
    "The most expensive music video ever made was Michael Jackson's 'Scream' at $7 million.",
    "The shortest song ever recorded is 'You Suffer' by Napalm Death at 1.316 seconds long.",
    "The first commercial CD was 'The Visitors' by ABBA, released in 1982.",
    "The most covered song of all time is 'Yesterday' by The Beatles.",
    "The loudest band in the world is KISS, reaching 136 decibels in a 2009 concert.",
    "The first music streaming service was launched in 1993 called 'Internet Underground Music Archive'.",
    "The best-selling album of all time is Michael Jackson's 'Thriller'."
];

// Playlist data - YouTube video IDs for different combinations
// Format: mood_musicType_country: [array of YouTube video IDs]
const playlists = {
    // Happy mood
    happy_pop_usa: ['ZbZSe6N_BXs', 'fWNaR-rxAic', 'y6Sxv-sUYtM', 'ru0K8uYEZWw', 'CevxZvSJLk8'],
    happy_rock_usa: ['tuK6n2Lkza0', 'ZyhrYis509A', 'lDK9QqIzhwk', 'btPJPFnesV4', 'Soa3gO7tL-c'],
    happy_jazz_usa: ['vmDDOFXSgAs', 'QhHrC8-4oSo', 'rXwkBvHpCm0', 'SS6mPWZf58I', 'CWzrABouyeE'],
    happy_pop_morocco: ['k5qht2iHBw4', 'jDGUuWSm_KA', 'pTuS8WdJonw', 'ZuXhbIQXNdU', 'Wd_MtxEFw7E'],
    happy_pop_spain: ['kJQP7kiw5Fk', '9jI-z9QN6g8', 'aJOTlE1K90k', '6Mgqbai3fKo', 'pRpeEdMmmQ0'],

    // Sad mood
    sad_pop_usa: ['hLQl3WQQoQ0', 'SR6iYWJxHqs', 'fvEZUbzqqyM', 'bpOSxM0rNPM', 'QNJL6nfu__Q'],
    sad_rock_usa: ['SJkj3DgW8Y0', 'hPC2Fp7IT7o', 'kXYiU_JCYtU', 'eVTXPUF4Oz4', '3YxaaGgTQYM'],
    sad_jazz_usa: ['PJ8y9LhgY0s', 'CWzrABouyeE', 'rgnXuKWocJ0', 'ss0M9gg4_Vg', 'PLS2suJ1M6Qs4KfpRKLpUvTrHOeGP0dKQH'],
    sad_classical_usa: ['4Tr0otuiQuU', 'aWIE0PX1uXk', 'KUlKuKx4GxA', 'NlprozGcs80', 'XfhdmTVzcQQ'],
    sad_blues_usa: ['IXdNnw99-Ic', '94IdHH9GF_Q', 'cJunCsrhJjg', '71Gt46aX9Z4', 'ZrjWxZ7i5IU'],

    // Chill mood
    chill_pop_usa: ['3AtDtfuLRHE', 'TGan48YE9Us', 'KWZGAExj-es', 'w1oM3kQpXRo', 'jfKfPfyJRdk'],
    chill_jazz_usa: ['neV3EPgvZ3g', 'Dx5qFachd3A', 'VMDDOFXSgAs', 'SS6mPWZf58I', 'CWzrABouyeE'],
    chill_edm_usa: ['tJXPfNDVF4I', 'UpHaIcl6PxE', 'tCXGJQYZ9JA', 'D7ztZ_qhx5Q', 'q76bMs-NwRk'],
    chill_reggae_usa: ['zaGUr6wzyT8', 'lZBaklS79Wc', 'wQ3UrRl7tXs', 'zV3qWty6FL0', 'zXt56MB-3vc'],
    chill_classical_usa: ['9E6b3swbnWg', 'liTSRH4fix4', 'XfhdmTVzcQQ', 'NlprozGcs80', 'KUlKuKx4GxA'],

    // Energetic mood
    energetic_rock_usa: ['btPJPFnesV4', 'VcDy8HEg1QY', 'Gs069dndIYk', 'gCYcHz2k5x0', 'KQ6zr6kCPj8'],
    energetic_pop_usa: ['dPI-mRFEIH0', 'CevxZvSJLk8', 'ktvTqknDobU', 'pRpeEdMmmQ0', 'KQ6zr6kCPj8'],
    energetic_metal_usa: ['CSvFpBOe8eY', 'WM8bTdBs-cw', 'v2AC41dglnM', 'l482T0yNkeo', 'kXYiU_JCYtU'],
    energetic_edm_usa: ['gCYcHz2k5x0', 'KQ6zr6kCPj8', 'qrOeGCJdZe4', '60ItHLz5WEA', 'fKopy74weus'],
    energetic_hiphop_usa: ['xpVfcZ0ZcFM', 'JZjAg6fK-BQ', '_Yhyp-_hX2s', '9vMLTcftlyI', 'tvTRZJ-4EyI'],

    // Focused mood
    focused_classical_usa: ['9E6b3swbnWg', 'liTSRH4fix4', 'XfhdmTVzcQQ', 'NlprozGcs80', 'KUlKuKx4GxA'],
    focused_jazz_usa: ['neV3EPgvZ3g', 'Dx5qFachd3A', 'VMDDOFXSgAs', 'SS6mPWZf58I', 'CWzrABouyeE'],
    focused_edm_usa: ['5qap5aO4i9A', 'DWcJFNfaw9c', 'lTRiuFIWV54', 'tNkZsRW7h2c', 'jfKfPfyJRdk'],
    focused_rock_usa: ['tuK6n2Lkza0', 'ZyhrYis509A', 'lDK9QqIzhwk', 'btPJPFnesV4', 'Soa3gO7tL-c'],
    focused_hiphop_usa: ['bmVKaAV_7-A', 'hLQl3WQQoQ0', 'SR6iYWJxHqs', 'fvEZUbzqqyM', 'bpOSxM0rNPM']
};

// Display a random music fact
function displayRandomMusicFact() {
    const randomIndex = Math.floor(Math.random() * musicFacts.length);
    factText.textContent = musicFacts[randomIndex];

    // Add a highlight animation
    musicFactSection.classList.add('highlight-fact');
    setTimeout(() => {
        musicFactSection.classList.remove('highlight-fact');
    }, 2000);
}

// Get favorites from localStorage
function getFavorites() {
    const favorites = localStorage.getItem('moodify-favorites');
    return favorites ? JSON.parse(favorites) : [];
}

// Save a favorite to localStorage
function saveFavorite(videoId) {
    const favorites = getFavorites();

    // Check if this video is already in favorites
    if (!favorites.includes(videoId)) {
        favorites.push(videoId);
        localStorage.setItem('moodify-favorites', JSON.stringify(favorites));
        return true; // Added successfully
    }

    return false; // Already in favorites
}

// Remove a favorite from localStorage
function removeFavorite(videoId) {
    const favorites = getFavorites();
    const index = favorites.indexOf(videoId);

    if (index !== -1) {
        favorites.splice(index, 1);
        localStorage.setItem('moodify-favorites', JSON.stringify(favorites));
        return true; // Removed successfully
    }

    return false; // Not in favorites
}

// Check if a video is in favorites
function isInFavorites(videoId) {
    return getFavorites().includes(videoId);
}

// Load saved preferences from localStorage
function loadSavedPreferences() {
    const savedMood = localStorage.getItem('moodify-mood');
    const savedMusicType = localStorage.getItem('moodify-music-type');
    const savedCountry = localStorage.getItem('moodify-country');
    const savedTheme = localStorage.getItem('moodify-theme');

    if (savedMood) moodSelect.value = savedMood;
    if (savedMusicType) musicTypeSelect.value = savedMusicType;
    if (savedCountry) countrySelect.value = savedCountry;

    // Apply saved theme or default to light
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    // Display a random music fact
    displayRandomMusicFact();

    // Load favorites
    displayFavorites();
}

// Save preferences to localStorage
function savePreferences(mood, musicType, country) {
    localStorage.setItem('moodify-mood', mood);
    localStorage.setItem('moodify-music-type', musicType);
    localStorage.setItem('moodify-country', country);
}

// Toggle theme between light and dark
function toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('moodify-theme', 'light');
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('moodify-theme', 'dark');
    }
}

// Show toast notification
function showToast(message) {
    toast.querySelector('p').textContent = message;
    toast.classList.add('show-toast');

    setTimeout(() => {
        toast.classList.remove('show-toast');
    }, 3000);
}

// Copy YouTube link to clipboard
function copyToClipboard(videoId) {
    const youtubeLink = `https://www.youtube.com/watch?v=${videoId}`;
    navigator.clipboard.writeText(youtubeLink)
        .then(() => {
            showToast('Link copied to clipboard!');
        })
        .catch(err => {
            console.error('Could not copy text: ', err);
            showToast('Failed to copy link');
        });
}

// Toggle favorite status
function toggleFavorite(videoId, button) {
    if (isInFavorites(videoId)) {
        removeFavorite(videoId);
        button.classList.remove('active');
        button.innerHTML = '<i class="far fa-heart mr-1"></i> Favorite';

        // If we're in the favorites tab, refresh the display
        if (!favoritesContent.classList.contains('hidden')) {
            displayFavorites();
        }
    } else {
        saveFavorite(videoId);
        button.classList.add('active');
        button.innerHTML = '<i class="fas fa-heart mr-1"></i> Favorited';
    }
}

// Create YouTube embed for a video ID
function createVideoEmbed(videoId, showControls = true) {
    const videoWrapper = document.createElement('div');
    videoWrapper.className = 'fade-in';
    videoWrapper.style.animationDelay = `${Math.random() * 0.5}s`;

    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-container';

    videoContainer.innerHTML = `
        <iframe
            src="https://www.youtube.com/embed/${videoId}"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
        </iframe>
    `;

    videoWrapper.appendChild(videoContainer);

    // Add controls if requested
    if (showControls) {
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'video-controls';

        // Favorite button
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'favorite-btn';
        favoriteBtn.innerHTML = isInFavorites(videoId) ?
            '<i class="fas fa-heart mr-1"></i> Favorited' :
            '<i class="far fa-heart mr-1"></i> Favorite';

        if (isInFavorites(videoId)) {
            favoriteBtn.classList.add('active');
        }

        favoriteBtn.addEventListener('click', () => toggleFavorite(videoId, favoriteBtn));

        // Share button
        const shareBtn = document.createElement('button');
        shareBtn.className = 'share-btn';
        shareBtn.innerHTML = '<i class="fas fa-share-alt mr-1"></i> Share';
        shareBtn.addEventListener('click', () => copyToClipboard(videoId));

        controlsDiv.appendChild(favoriteBtn);
        controlsDiv.appendChild(shareBtn);

        videoWrapper.appendChild(controlsDiv);
    }

    return videoWrapper;
}

// Display playlist based on user selections
function displayPlaylist(mood, musicType, country) {
    // Clear previous results
    playlistContainer.innerHTML = '';

    // Create the key for the playlists object
    const playlistKey = `${mood}_${musicType}_${country}`;

    // Check if we have a playlist for this combination
    if (playlists[playlistKey] && playlists[playlistKey].length > 0) {
        // Show results section, hide no results message
        resultsSection.classList.remove('hidden');
        noResultsMessage.classList.add('hidden');

        // Get up to 5 videos for this playlist
        const videos = playlists[playlistKey].slice(0, 5);

        // Create and append video embeds
        videos.forEach(videoId => {
            const videoEmbed = createVideoEmbed(videoId);
            playlistContainer.appendChild(videoEmbed);
        });

        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    } else {
        // Show no results message, hide results section
        resultsSection.classList.add('hidden');
        noResultsMessage.classList.remove('hidden');
        noResultsMessage.scrollIntoView({ behavior: 'smooth' });
    }
}

// Form submission handler
form.addEventListener('submit', function(e) {
    e.preventDefault();

    const mood = moodSelect.value;
    const musicType = musicTypeSelect.value;
    const country = countrySelect.value;

    // Validate selections
    if (!mood || !musicType || !country) {
        alert('Please select all options to get your personalized playlist.');
        return;
    }

    // Save preferences
    savePreferences(mood, musicType, country);

    // Display the playlist
    displayPlaylist(mood, musicType, country);
});

// Theme toggle handler
themeToggle.addEventListener('click', toggleTheme);

// Display favorites
function displayFavorites() {
    // Clear previous results
    favoritesContainer.innerHTML = '';

    // Get favorites from localStorage
    const favorites = getFavorites();

    // Check if we have any favorites
    if (favorites.length > 0) {
        // Hide no favorites message
        noFavoritesMessage.classList.add('hidden');

        // Create and append video embeds
        favorites.forEach(videoId => {
            const videoEmbed = createVideoEmbed(videoId, true);
            favoritesContainer.appendChild(videoEmbed);
        });
    } else {
        // Show no favorites message
        noFavoritesMessage.classList.remove('hidden');
    }
}

// Switch between tabs
function switchTab(tabName) {
    if (tabName === 'recommendations') {
        // Update tab styling
        recommendationsTab.classList.add('tab-active');
        recommendationsTab.classList.remove('tab-inactive');
        favoritesTab.classList.add('tab-inactive');
        favoritesTab.classList.remove('tab-active');

        // Show/hide content
        recommendationsContent.classList.remove('hidden');
        favoritesContent.classList.add('hidden');
    } else if (tabName === 'favorites') {
        // Update tab styling
        favoritesTab.classList.add('tab-active');
        favoritesTab.classList.remove('tab-inactive');
        recommendationsTab.classList.add('tab-inactive');
        recommendationsTab.classList.remove('tab-active');

        // Show/hide content
        favoritesContent.classList.remove('hidden');
        recommendationsContent.classList.add('hidden');

        // Refresh favorites display
        displayFavorites();
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', loadSavedPreferences);

// Refresh music fact when clicked
musicFactSection.addEventListener('click', displayRandomMusicFact);

// Tab switching
recommendationsTab.addEventListener('click', () => switchTab('recommendations'));
favoritesTab.addEventListener('click', () => switchTab('favorites'));
