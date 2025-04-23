# Gemini AI Integration for Moodify

This document explains how the Google Gemini AI integration works in the Moodify app.

## Overview

The Moodify app now includes an AI-powered recommendation feature that uses Google's Gemini AI to suggest music based on natural language descriptions. This allows users to get personalized music recommendations beyond the predefined playlists.

## How It Works

1. **User Interface**:
   - A new "AI Powered" tab has been added between "Recommendations" and "My Favorites"
   - Users can enter natural language descriptions of the music they want
   - Example: "Relaxing jazz for studying" or "Upbeat songs for a workout"

2. **API Integration**:
   - The app uses the Gemini Pro model via the Gemini API
   - When a user submits a search, the app sends a request to the Gemini API
   - The API returns YouTube video IDs and metadata that match the user's description

3. **Results Display**:
   - The app displays the recommended videos as YouTube embeds
   - Each video includes a title, description, and the same favorite/share buttons as regular recommendations

## Technical Implementation

### API Request

The app sends a structured prompt to the Gemini API asking for YouTube video IDs that match the user's description. The prompt is designed to return results in a specific JSON format:

```json
[
  {
    "videoId": "YouTube_ID_here",
    "title": "Song title - Artist",
    "description": "Brief description of why this matches the request"
  },
  ...
]
```

### Response Handling

The app parses the JSON response and displays the videos. If the API returns an error or no results, a friendly error message is shown.

### Security

- The API key is included in the frontend code, which is not ideal for production applications
- For a production environment, you should consider:
  - Using a backend proxy to make API calls
  - Implementing rate limiting
  - Adding user authentication

## Future Improvements

Potential enhancements for the AI integration:

1. **Context-Aware Recommendations**: Use the user's favorites to inform AI recommendations
2. **Feedback Loop**: Allow users to rate AI recommendations to improve future results
3. **More Detailed Prompts**: Include options for tempo, era, instruments, etc.
4. **Backend Integration**: Move API calls to a backend service for better security

## Troubleshooting

If you encounter issues with the AI recommendations:

1. **No Results**: Try a more specific or popular music description
2. **Error Messages**: Check the browser console for detailed error information
3. **API Limits**: The Gemini API has usage limits that may affect availability

## Credits

This integration uses Google's Gemini AI, a powerful large language model that can understand and generate text, including code and creative content.
