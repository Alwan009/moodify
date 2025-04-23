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
const aiRecommendationsTab = document.getElementById('ai-recommendations-tab');
const favoritesTab = document.getElementById('favorites-tab');
const recommendationsContent = document.getElementById('recommendations-content');
const aiRecommendationsContent = document.getElementById('ai-recommendations-content');
const favoritesContent = document.getElementById('favorites-content');
const aiPromptInput = document.getElementById('ai-prompt');
const aiSearchBtn = document.getElementById('ai-search-btn');
const aiLoading = document.getElementById('ai-loading');
const aiResults = document.getElementById('ai-results');
const aiPlaylistContainer = document.getElementById('ai-playlist-container');
const aiNoResults = document.getElementById('ai-no-results');
const toast = document.getElementById('toast');

// Gemini API Key - Updated for better reliability
const GEMINI_API_KEY = 'AIzaSyDHZvGdYbZQJ5QCgQH-FYdV-Gs9QHbIz-Q';

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

// No predefined playlists - using AI only

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

    // Try to use the modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(youtubeLink)
            .then(() => {
                showToast('Link copied to clipboard!');
            })
            .catch(err => {
                console.error('Could not copy text with Clipboard API: ', err);
                fallbackCopyToClipboard(youtubeLink);
            });
    } else {
        // Fallback for browsers that don't support the Clipboard API
        fallbackCopyToClipboard(youtubeLink);
    }
}

// Fallback method for copying to clipboard
function fallbackCopyToClipboard(text) {
    // Create a temporary input element
    const tempInput = document.createElement('input');
    tempInput.style.position = 'absolute';
    tempInput.style.left = '-1000px';
    tempInput.value = text;
    document.body.appendChild(tempInput);

    // Select and copy the text
    tempInput.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showToast('Link copied to clipboard!');
        } else {
            showToast('Failed to copy link');
        }
    } catch (err) {
        console.error('Fallback: Could not copy text: ', err);
        showToast('Failed to copy link');
    }

    // Clean up
    document.body.removeChild(tempInput);
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

// Display playlist based on user selections - AI only version
async function displayPlaylist(mood, musicType, country) {
    // Clear previous results
    playlistContainer.innerHTML = '';

    // Show loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'playlist-loading';
    loadingIndicator.className = 'text-center py-8';
    loadingIndicator.innerHTML = `
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-light dark:border-primary-dark"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Finding the perfect ${mood} ${musicType} songs from ${country}...</p>
    `;
    playlistContainer.appendChild(loadingIndicator);
    resultsSection.classList.remove('hidden');
    noResultsMessage.classList.add('hidden');

    // Use Gemini AI to generate recommendations
    try {
        // Create a prompt based on the user's selections
        const prompt = `I need YouTube video IDs for ${mood} ${musicType} music specifically from ${country}.
        It's VERY IMPORTANT that all songs must be by artists from ${country} or in the language/style of ${country}.
        The country requirement is the highest priority - all results MUST be authentic ${country} music.
        Please provide 5 great examples.`;

        console.log('Sending prompt to Gemini AI:', prompt);

        // Get AI recommendations
        const videoData = await getGeminiRecommendations(prompt);

        console.log('Received response from Gemini AI:', videoData);

        // Display the AI-generated recommendations
        if (videoData && videoData.length > 0) {
            // Remove loading indicator
            playlistContainer.innerHTML = '';

            // Add AI badge to indicate these are AI-generated recommendations
            const aiBadge = document.createElement('div');
            aiBadge.className = 'bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-3 mb-6 text-center';
            aiBadge.innerHTML = `
                <p class="text-sm text-gray-700 dark:text-gray-300">🤖 AI-powered recommendations for ${mood} ${musicType} music from ${country}</p>
            `;
            playlistContainer.appendChild(aiBadge);

            // Add country verification notice
            const countryNotice = document.createElement('div');
            countryNotice.className = 'mb-4 text-center';
            countryNotice.innerHTML = `
                <p class="text-xs text-gray-500 dark:text-gray-400">If any recommendation doesn't match ${country} music, please click the feedback button below.</p>
            `;
            playlistContainer.appendChild(countryNotice);

            // Display videos with titles and descriptions
            videoData.forEach(video => {
                // Create video wrapper
                const videoWrapper = document.createElement('div');
                videoWrapper.className = 'fade-in mb-8';
                videoWrapper.style.animationDelay = `${Math.random() * 0.5}s`;

                // Create video container
                const videoContainer = document.createElement('div');
                videoContainer.className = 'video-container';

                // Add video iframe
                videoContainer.innerHTML = `
                    <iframe
                        src="https://www.youtube.com/embed/${video.videoId}"
                        title="${video.title || 'YouTube video'}"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                    </iframe>
                `;

                videoWrapper.appendChild(videoContainer);

                // Add video title and description if available
                if (video.title || video.description) {
                    const videoInfo = document.createElement('div');
                    videoInfo.className = 'mt-2 mb-2';
                    let infoHTML = '';

                    if (video.title) {
                        infoHTML += `<h4 class="font-medium text-gray-900 dark:text-white">${video.title}</h4>`;
                    }

                    if (video.description) {
                        infoHTML += `<p class="text-sm text-gray-600 dark:text-gray-400">${video.description}</p>`;
                    }

                    videoInfo.innerHTML = infoHTML;
                    videoWrapper.appendChild(videoInfo);
                }

                // Add controls
                const controlsDiv = document.createElement('div');
                controlsDiv.className = 'video-controls';

                // Favorite button
                const favoriteBtn = document.createElement('button');
                favoriteBtn.className = 'favorite-btn';
                favoriteBtn.innerHTML = isInFavorites(video.videoId) ?
                    '<i class="fas fa-heart mr-1"></i> Favorited' :
                    '<i class="far fa-heart mr-1"></i> Favorite';

                if (isInFavorites(video.videoId)) {
                    favoriteBtn.classList.add('active');
                }

                favoriteBtn.addEventListener('click', () => toggleFavorite(video.videoId, favoriteBtn));

                // Share button
                const shareBtn = document.createElement('button');
                shareBtn.className = 'share-btn';
                shareBtn.innerHTML = '<i class="fas fa-share-alt mr-1"></i> Share';
                shareBtn.addEventListener('click', () => copyToClipboard(video.videoId));

                controlsDiv.appendChild(favoriteBtn);
                controlsDiv.appendChild(shareBtn);

                videoWrapper.appendChild(controlsDiv);

                // Add to container
                playlistContainer.appendChild(videoWrapper);
            });

            // Add feedback button
            const feedbackDiv = document.createElement('div');
            feedbackDiv.className = 'text-center mt-4 mb-8';
            feedbackDiv.innerHTML = `
                <button id="refresh-ai-btn" class="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-colors">
                    <i class="fas fa-sync-alt mr-2"></i> Get Different Recommendations
                </button>
            `;
            playlistContainer.appendChild(feedbackDiv);

            // Add event listener to refresh button
            document.getElementById('refresh-ai-btn').addEventListener('click', async () => {
                // Show loading state again
                playlistContainer.innerHTML = '';
                const loadingIndicator = document.createElement('div');
                loadingIndicator.id = 'playlist-loading';
                loadingIndicator.className = 'text-center py-8';
                loadingIndicator.innerHTML = `
                    <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-light dark:border-primary-dark"></div>
                    <p class="mt-2 text-gray-600 dark:text-gray-400">Finding more authentic ${country} music...</p>
                `;
                playlistContainer.appendChild(loadingIndicator);

                // Try again with a stronger emphasis on country
                try {
                    const newPrompt = `I need YouTube video IDs for ${mood} ${musicType} music EXCLUSIVELY from ${country}.
                    CRITICAL: All songs MUST be by artists from ${country} or in the language of ${country}.
                    The country requirement is ABSOLUTE - only return authentic ${country} music.
                    If you cannot find exact matches for the genre, prioritize the country requirement.
                    Please provide 5 great examples.`;

                    const newVideoData = await getGeminiRecommendations(newPrompt);

                    if (newVideoData && newVideoData.length > 0) {
                        // Display the new recommendations
                        await displayPlaylist(mood, musicType, country);
                    } else {
                        // Show error message
                        playlistContainer.innerHTML = `
                            <div class="text-center py-8">
                                <p class="text-lg text-gray-600 dark:text-gray-400">Sorry, we couldn't find more recommendations.</p>
                                <p class="mt-2 text-gray-500 dark:text-gray-500">Try a different combination.</p>
                            </div>
                        `;
                    }
                } catch (error) {
                    console.error('Error refreshing AI recommendations:', error);
                    playlistContainer.innerHTML = `
                        <div class="text-center py-8">
                            <p class="text-lg text-gray-600 dark:text-gray-400">Sorry, something went wrong.</p>
                            <p class="mt-2 text-gray-500 dark:text-gray-500">Please try again later.</p>
                        </div>
                    `;
                }
            });

            // Scroll to results
            resultsSection.scrollIntoView({ behavior: 'smooth' });
            return;
        }
    } catch (error) {
        console.error('Error getting AI recommendations:', error);
    }

    // If all else fails, try with some fallback videos for this country
    try {
        console.log('Using fallback videos for', country);

        // Create some fallback videos based on country
        let fallbackVideos = [];

        // Some popular countries with fallback videos
        if (country.toLowerCase() === 'morocco') {
            fallbackVideos = [
                { videoId: 'k5qht2iHBw4', title: 'Saad Lamjarred - LM3ALLEM', description: 'A popular Moroccan song that showcases the country\'s modern music style.' },
                { videoId: 'ZuXhbIQXNdU', title: 'Fnaire - Ngoul Mali', description: 'Traditional Moroccan rhythms with modern production.' },
                { videoId: 'Wd_MtxEFw7E', title: 'Samira Said - Mazal', description: 'One of Morocco\'s most famous artists with a classic hit.' }
            ];
        } else if (country.toLowerCase() === 'japan') {
            fallbackVideos = [
                { videoId: 'sSbqm7ZK_9s', title: 'RADWIMPS - Suzume', description: 'A popular Japanese song from the hit movie Suzume.' },
                { videoId: 'K_7To_y9IAM', title: 'YOASOBI - Idol', description: 'Modern J-pop that has become an international hit.' },
                { videoId: 'dy90tA3TT1c', title: 'Official HIGE DANdism - Subtitle', description: 'Contemporary Japanese pop music with jazz influences.' }
            ];
        } else if (country.toLowerCase() === 'spain') {
            fallbackVideos = [
                { videoId: 'kJQP7kiw5Fk', title: 'Luis Fonsi - Despacito', description: 'One of the most popular Spanish-language songs of all time.' },
                { videoId: '9jI-z9QN6g8', title: 'Rosalía - MALAMENTE', description: 'Modern flamenco fusion from Spain.' },
                { videoId: 'aJOTlE1K90k', title: 'Enrique Iglesias - Bailando', description: 'Spanish pop music with traditional influences.' }
            ];
        } else {
            // For any other country, show the no results message
            resultsSection.classList.add('hidden');
            noResultsMessage.classList.remove('hidden');
            noResultsMessage.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        // Display fallback videos
        if (fallbackVideos.length > 0) {
            // Remove loading indicator
            playlistContainer.innerHTML = '';

            // Add fallback notice
            const fallbackNotice = document.createElement('div');
            fallbackNotice.className = 'bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-3 mb-6 text-center';
            fallbackNotice.innerHTML = `
                <p class="text-sm text-yellow-700 dark:text-yellow-300">⚠️ We're having trouble connecting to our AI service. Here are some popular ${country} songs instead.</p>
            `;
            playlistContainer.appendChild(fallbackNotice);

            // Display videos
            fallbackVideos.forEach(video => {
                // Create video wrapper
                const videoWrapper = document.createElement('div');
                videoWrapper.className = 'fade-in mb-8';
                videoWrapper.style.animationDelay = `${Math.random() * 0.5}s`;

                // Create video container
                const videoContainer = document.createElement('div');
                videoContainer.className = 'video-container';

                // Add video iframe
                videoContainer.innerHTML = `
                    <iframe
                        src="https://www.youtube.com/embed/${video.videoId}"
                        title="${video.title || 'YouTube video'}"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                    </iframe>
                `;

                videoWrapper.appendChild(videoContainer);

                // Add video title and description
                const videoInfo = document.createElement('div');
                videoInfo.className = 'mt-2 mb-2';
                let infoHTML = '';

                if (video.title) {
                    infoHTML += `<h4 class="font-medium text-gray-900 dark:text-white">${video.title}</h4>`;
                }

                if (video.description) {
                    infoHTML += `<p class="text-sm text-gray-600 dark:text-gray-400">${video.description}</p>`;
                }

                videoInfo.innerHTML = infoHTML;
                videoWrapper.appendChild(videoInfo);

                // Add controls
                const controlsDiv = document.createElement('div');
                controlsDiv.className = 'video-controls';

                // Favorite button
                const favoriteBtn = document.createElement('button');
                favoriteBtn.className = 'favorite-btn';
                favoriteBtn.innerHTML = isInFavorites(video.videoId) ?
                    '<i class="fas fa-heart mr-1"></i> Favorited' :
                    '<i class="far fa-heart mr-1"></i> Favorite';

                if (isInFavorites(video.videoId)) {
                    favoriteBtn.classList.add('active');
                }

                favoriteBtn.addEventListener('click', () => toggleFavorite(video.videoId, favoriteBtn));

                // Share button
                const shareBtn = document.createElement('button');
                shareBtn.className = 'share-btn';
                shareBtn.innerHTML = '<i class="fas fa-share-alt mr-1"></i> Share';
                shareBtn.addEventListener('click', () => copyToClipboard(video.videoId));

                controlsDiv.appendChild(favoriteBtn);
                controlsDiv.appendChild(shareBtn);

                videoWrapper.appendChild(controlsDiv);

                // Add to container
                playlistContainer.appendChild(videoWrapper);
            });

            // Add retry button
            const retryDiv = document.createElement('div');
            retryDiv.className = 'text-center mt-4 mb-8';
            retryDiv.innerHTML = `
                <button id="retry-ai-btn" class="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-colors">
                    <i class="fas fa-sync-alt mr-2"></i> Try AI Search Again
                </button>
            `;
            playlistContainer.appendChild(retryDiv);

            // Add event listener to retry button
            document.getElementById('retry-ai-btn').addEventListener('click', async () => {
                await displayPlaylist(mood, musicType, country);
            });

            // Scroll to results
            resultsSection.scrollIntoView({ behavior: 'smooth' });
            return;
        }
    } catch (fallbackError) {
        console.error('Error with fallback videos:', fallbackError);
    }

    // If all fallbacks fail, show no results message
    resultsSection.classList.add('hidden');
    noResultsMessage.classList.remove('hidden');
    noResultsMessage.scrollIntoView({ behavior: 'smooth' });
}

// This function was used for predefined playlists and is no longer needed

// Form submission handler
form.addEventListener('submit', async function(e) {
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

    // Display the playlist (now async to support AI recommendations)
    await displayPlaylist(mood, musicType, country);
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
    // Reset all tabs to inactive
    recommendationsTab.classList.remove('tab-active');
    recommendationsTab.classList.add('tab-inactive');
    aiRecommendationsTab.classList.remove('tab-active');
    aiRecommendationsTab.classList.add('tab-inactive');
    favoritesTab.classList.remove('tab-active');
    favoritesTab.classList.add('tab-inactive');

    // Hide all content
    recommendationsContent.classList.add('hidden');
    aiRecommendationsContent.classList.add('hidden');
    favoritesContent.classList.add('hidden');

    // Show selected tab content
    if (tabName === 'recommendations') {
        recommendationsTab.classList.add('tab-active');
        recommendationsTab.classList.remove('tab-inactive');
        recommendationsContent.classList.remove('hidden');
    } else if (tabName === 'ai-recommendations') {
        aiRecommendationsTab.classList.add('tab-active');
        aiRecommendationsTab.classList.remove('tab-inactive');
        aiRecommendationsContent.classList.remove('hidden');
    } else if (tabName === 'favorites') {
        favoritesTab.classList.add('tab-active');
        favoritesTab.classList.remove('tab-inactive');
        favoritesContent.classList.remove('hidden');

        // Refresh favorites display
        displayFavorites();
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Load preferences and initialize the app
    loadSavedPreferences();

    // Check if we need to force a refresh for mobile browsers
    const lastVersion = localStorage.getItem('moodify-version');
    const currentVersion = '1.7'; // Update this when making changes

    if (lastVersion !== currentVersion) {
        localStorage.setItem('moodify-version', currentVersion);
        // Clear any cached data if needed
    }

    // Initialize the app in recommendations tab by default
    switchTab('recommendations');
});

// Refresh music fact when clicked
musicFactSection.addEventListener('click', displayRandomMusicFact);

// Function to get recommendations from Gemini AI
async function getGeminiRecommendations(prompt) {
    try {
        // Prepare the API request
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

        // Get country from prompt for variable interpolation
        const countryMatch = prompt.match(/from\s+([\w\s]+)\./i);
        const country = countryMatch ? countryMatch[1].trim() : 'the selected country';

        // Get mood from prompt for variable interpolation
        const moodMatch = prompt.match(/for\s+([\w\s]+)\s+[\w\s]+\s+music/i);
        const mood = moodMatch ? moodMatch[1].trim() : 'the selected mood';

        // Get music type from prompt for variable interpolation
        const musicTypeMatch = prompt.match(/for\s+[\w\s]+\s+([\w\s-]+)\s+music/i);
        const musicType = musicTypeMatch ? musicTypeMatch[1].trim() : 'the selected genre';

        // Create a more detailed prompt for better results
        const detailedPrompt = `I need YouTube video IDs for music based on this request: "${prompt}".
        Please provide exactly 5 YouTube video IDs that match this description.

        IMPORTANT REQUIREMENTS:
        1. All songs MUST be by artists from ${country} or in the language/style of ${country}
        2. The songs should match the ${mood} mood and ${musicType} genre
        3. If you cannot find exact matches, prioritize the country requirement first

        For each video, provide the following information in this exact JSON format:
        [
          {
            "videoId": "YouTube_ID_here",
            "title": "Song title - Artist",
            "description": "Brief description of why this matches the request, including how it relates to ${country}"
          },
          ... (more videos)
        ]
        Only respond with the JSON array, nothing else.`;

        console.log('Detailed prompt sent to API:', detailedPrompt);

        // Make the API request
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: detailedPrompt
                    }]
                }]
            })
        });

        // Check if the response is ok
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API error response:', errorData);
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        // Parse the response
        const data = await response.json();
        console.log('Full API response:', data);

        // Check if we have candidates
        if (!data.candidates || data.candidates.length === 0) {
            console.error('No candidates in response:', data);
            throw new Error('No candidates in API response');
        }

        // Extract the text response
        const textResponse = data.candidates[0].content.parts[0].text;
        console.log('Raw text response:', textResponse);

        // Try to parse the JSON response
        let videoData;
        try {
            // Find JSON in the response (in case AI added extra text)
            const jsonMatch = textResponse.match(/\[\s*\{.*\}\s*\]/s);
            if (jsonMatch) {
                console.log('Found JSON match in response');
                videoData = JSON.parse(jsonMatch[0]);
            } else {
                console.log('Trying to parse full response as JSON');
                videoData = JSON.parse(textResponse);
            }

            console.log('Parsed video data:', videoData);

            // Validate the video data
            if (!Array.isArray(videoData)) {
                throw new Error('Response is not an array');
            }

            // Ensure each item has a videoId
            videoData = videoData.filter(item => item && item.videoId);

            if (videoData.length === 0) {
                throw new Error('No valid video IDs in response');
            }

        } catch (parseError) {
            console.error('Error parsing AI response:', parseError);
            console.log('Raw response:', textResponse);
            throw new Error('Could not parse AI response: ' + parseError.message);
        }

        return videoData;

    } catch (error) {
        console.error('Error getting recommendations from Gemini AI:', error);
        throw error;
    }
}

// Display AI search results
function displayAIResults(videoData) {
    // Clear previous results
    aiPlaylistContainer.innerHTML = '';

    // Show results container
    aiResults.classList.remove('hidden');

    // Create and append video embeds
    videoData.forEach(video => {
        // Create video wrapper
        const videoWrapper = document.createElement('div');
        videoWrapper.className = 'fade-in';
        videoWrapper.style.animationDelay = `${Math.random() * 0.5}s`;

        // Create video container
        const videoContainer = document.createElement('div');
        videoContainer.className = 'video-container';

        // Add video iframe
        videoContainer.innerHTML = `
            <iframe
                src="https://www.youtube.com/embed/${video.videoId}"
                title="${video.title}"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
            </iframe>
        `;

        videoWrapper.appendChild(videoContainer);

        // Add video title and description
        const videoInfo = document.createElement('div');
        videoInfo.className = 'mt-2 mb-2';
        videoInfo.innerHTML = `
            <h4 class="font-medium text-gray-900 dark:text-white">${video.title}</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">${video.description}</p>
        `;

        videoWrapper.appendChild(videoInfo);

        // Add controls
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'video-controls';

        // Favorite button
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'favorite-btn';
        favoriteBtn.innerHTML = isInFavorites(video.videoId) ?
            '<i class="fas fa-heart mr-1"></i> Favorited' :
            '<i class="far fa-heart mr-1"></i> Favorite';

        if (isInFavorites(video.videoId)) {
            favoriteBtn.classList.add('active');
        }

        favoriteBtn.addEventListener('click', () => toggleFavorite(video.videoId, favoriteBtn));

        // Share button
        const shareBtn = document.createElement('button');
        shareBtn.className = 'share-btn';
        shareBtn.innerHTML = '<i class="fas fa-share-alt mr-1"></i> Share';
        shareBtn.addEventListener('click', () => copyToClipboard(video.videoId));

        controlsDiv.appendChild(favoriteBtn);
        controlsDiv.appendChild(shareBtn);

        videoWrapper.appendChild(controlsDiv);

        // Add to container
        aiPlaylistContainer.appendChild(videoWrapper);
    });

    // Scroll to results
    aiResults.scrollIntoView({ behavior: 'smooth' });
}

// Tab switching
recommendationsTab.addEventListener('click', () => switchTab('recommendations'));
aiRecommendationsTab.addEventListener('click', () => switchTab('ai-recommendations'));
favoritesTab.addEventListener('click', () => switchTab('favorites'));

// Add touchstart event listeners for mobile
recommendationsTab.addEventListener('touchstart', () => switchTab('recommendations'));
aiRecommendationsTab.addEventListener('touchstart', () => switchTab('ai-recommendations'));
favoritesTab.addEventListener('touchstart', () => switchTab('favorites'));

// AI search button event listener
aiSearchBtn.addEventListener('click', () => {
    const prompt = aiPromptInput.value.trim();
    if (prompt) {
        searchWithGeminiAI(prompt);
    } else {
        showToast('Please enter a search prompt');
    }
});

// Allow pressing Enter in the search input
aiPromptInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const prompt = aiPromptInput.value.trim();
        if (prompt) {
            searchWithGeminiAI(prompt);
        } else {
            showToast('Please enter a search prompt');
        }
    }
});
