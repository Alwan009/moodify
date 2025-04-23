// DOM Elements
const form = document.getElementById('playlist-form');
const moodSelect = document.getElementById('mood');
const languageSelect = document.getElementById('language');
const countrySelect = document.getElementById('country');
const resultsSection = document.getElementById('results');
const playlistContainer = document.getElementById('playlist-container');
const noResultsMessage = document.getElementById('no-results');
const themeToggle = document.getElementById('theme-toggle');

// Playlist data - YouTube video IDs for different combinations
// Format: mood_language_country: [array of YouTube video IDs]
const playlists = {
    // Happy mood
    happy_english_usa: ['ZbZSe6N_BXs', 'fWNaR-rxAic', 'y6Sxv-sUYtM', 'ru0K8uYEZWw', 'CevxZvSJLk8'],
    happy_spanish_spain: ['kJQP7kiw5Fk', '9jI-z9QN6g8', 'aJOTlE1K90k', '6Mgqbai3fKo', 'pRpeEdMmmQ0'],
    happy_arabic_morocco: ['k5qht2iHBw4', 'jDGUuWSm_KA', 'pTuS8WdJonw', 'ZuXhbIQXNdU', 'Wd_MtxEFw7E'],
    happy_korean_korea: ['9bZkp7q19f0', 'gdZLi9oWNZg', 'mPVDGOVjRQ0', 'V2hlQkVJZhE', 'bw9CALKOvAI'],
    happy_french_france: ['fFRBWX0sHfE', 'k3Fa4lOQfbA', 'K5KAc5CoCuk', 'dDwpkvQUQPw', 'CAMWdvo71ls'],
    
    // Sad mood
    sad_english_usa: ['hLQl3WQQoQ0', 'SR6iYWJxHqs', 'fvEZUbzqqyM', 'bpOSxM0rNPM', 'QNJL6nfu__Q'],
    sad_spanish_spain: ['AMsHzVuIpn8', 'sDHt-jLEeRs', 'kN0iD0pI3o0', 'USKDmvOw1R0', 'GP8n3o2Hy-Q'],
    sad_arabic_morocco: ['CVyXLkPjJL0', 'QOYhD0-QZQE', 'Fpn1imb9qZg', 'ZuqUtOnYn3c', 'Wd_MtxEFw7E'],
    sad_korean_korea: ['eN5mG_yMDiM', 'NMdTd9e-LEI', 'D_nyuB8GpyQ', 'mZz9uYdj_v4', 'dYRqIAuC9gY'],
    sad_french_france: ['k3Fa4lOQfbA', 'AzaTyxMsDtQ', 'K5KAc5CoCuk', 'dDwpkvQUQPw', 'CAMWdvo71ls'],
    
    // Chill mood
    chill_english_usa: ['3AtDtfuLRHE', 'TGan48YE9Us', 'KWZGAExj-es', 'w1oM3kQpXRo', 'jfKfPfyJRdk'],
    chill_spanish_spain: ['TapXs54Ah3E', 'yyRJcO4bv9s', 'kJQP7kiw5Fk', 'DkeiKbqa02g', 'aJOTlE1K90k'],
    chill_arabic_morocco: ['2-sP_6Nev8A', 'QOYhD0-QZQE', 'Fpn1imb9qZg', 'ZuqUtOnYn3c', 'Wd_MtxEFw7E'],
    chill_korean_korea: ['U9Q1mwi5Xk0', 'D1PvIWdJ8xo', 'mZz9uYdj_v4', 'dYRqIAuC9gY', 'D_nyuB8GpyQ'],
    chill_french_france: ['fFRBWX0sHfE', 'k3Fa4lOQfbA', 'K5KAc5CoCuk', 'dDwpkvQUQPw', 'CAMWdvo71ls'],
    
    // Energetic mood
    energetic_english_usa: ['btPJPFnesV4', 'VcDy8HEg1QY', 'Gs069dndIYk', 'gCYcHz2k5x0', 'KQ6zr6kCPj8'],
    energetic_spanish_spain: ['kJQP7kiw5Fk', '9jI-z9QN6g8', 'aJOTlE1K90k', '6Mgqbai3fKo', 'pRpeEdMmmQ0'],
    energetic_arabic_morocco: ['k5qht2iHBw4', 'jDGUuWSm_KA', 'pTuS8WdJonw', 'ZuXhbIQXNdU', 'Wd_MtxEFw7E'],
    energetic_korean_korea: ['9bZkp7q19f0', 'gdZLi9oWNZg', 'mPVDGOVjRQ0', 'V2hlQkVJZhE', 'bw9CALKOvAI'],
    energetic_french_france: ['fFRBWX0sHfE', 'k3Fa4lOQfbA', 'K5KAc5CoCuk', 'dDwpkvQUQPw', 'CAMWdvo71ls'],
    
    // Focused mood
    focused_english_usa: ['5qap5aO4i9A', 'DWcJFNfaw9c', 'lTRiuFIWV54', 'tNkZsRW7h2c', 'jfKfPfyJRdk'],
    focused_spanish_spain: ['TapXs54Ah3E', 'yyRJcO4bv9s', 'kJQP7kiw5Fk', 'DkeiKbqa02g', 'aJOTlE1K90k'],
    focused_arabic_morocco: ['2-sP_6Nev8A', 'QOYhD0-QZQE', 'Fpn1imb9qZg', 'ZuqUtOnYn3c', 'Wd_MtxEFw7E'],
    focused_korean_korea: ['U9Q1mwi5Xk0', 'D1PvIWdJ8xo', 'mZz9uYdj_v4', 'dYRqIAuC9gY', 'D_nyuB8GpyQ'],
    focused_french_france: ['fFRBWX0sHfE', 'k3Fa4lOQfbA', 'K5KAc5CoCuk', 'dDwpkvQUQPw', 'CAMWdvo71ls']
};

// Load saved preferences from localStorage
function loadSavedPreferences() {
    const savedMood = localStorage.getItem('moodify-mood');
    const savedLanguage = localStorage.getItem('moodify-language');
    const savedCountry = localStorage.getItem('moodify-country');
    const savedTheme = localStorage.getItem('moodify-theme');
    
    if (savedMood) moodSelect.value = savedMood;
    if (savedLanguage) languageSelect.value = savedLanguage;
    if (savedCountry) countrySelect.value = savedCountry;
    
    // Apply saved theme or default to light
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

// Save preferences to localStorage
function savePreferences(mood, language, country) {
    localStorage.setItem('moodify-mood', mood);
    localStorage.setItem('moodify-language', language);
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

// Create YouTube embed for a video ID
function createVideoEmbed(videoId) {
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-container fade-in';
    videoContainer.style.animationDelay = `${Math.random() * 0.5}s`;
    
    videoContainer.innerHTML = `
        <iframe 
            src="https://www.youtube.com/embed/${videoId}" 
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
        </iframe>
    `;
    
    return videoContainer;
}

// Display playlist based on user selections
function displayPlaylist(mood, language, country) {
    // Clear previous results
    playlistContainer.innerHTML = '';
    
    // Create the key for the playlists object
    const playlistKey = `${mood}_${language}_${country}`;
    
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
    const language = languageSelect.value;
    const country = countrySelect.value;
    
    // Validate selections
    if (!mood || !language || !country) {
        alert('Please select all options to get your personalized playlist.');
        return;
    }
    
    // Save preferences
    savePreferences(mood, language, country);
    
    // Display the playlist
    displayPlaylist(mood, language, country);
});

// Theme toggle handler
themeToggle.addEventListener('click', toggleTheme);

// Initialize the app
document.addEventListener('DOMContentLoaded', loadSavedPreferences);
