# Symptomate - AI Health Assistant

## Overview
Symptomate is an AI-powered health assistant that helps users understand their symptoms and provides triage-based guidance. The project features a chat interface where users can describe symptoms and receive helpful health information.

## Project Type
Static website (HTML/CSS/JavaScript)

## Architecture
- **Frontend**: Pure HTML, CSS, and JavaScript (no framework)
- **Pages**: 
  - `index.html` - Main chat interface
  - `dashboard.html` - Health overview dashboard
  - `settings.html` - User settings and preferences
  - `splash.html` - Splash screen
- **Styling**: `style.css` with modern gradient design
- **Logic**: `script.js` with localStorage-based chat history

## Key Features
- Interactive chat interface with typing animation
- Mock AI responses for common health symptoms
- Dark mode support
- Chat history persistence using localStorage
- Settings page for customization
- Dashboard with health activity overview

## Current State
- Frontend is fully functional with mock responses
- Ready for AI API integration (placeholder in `getAIResponse()` function)
- All static assets in place

## Setup
The project runs on a simple HTTP server on port 5000. No build process or dependencies required.

## Recent Changes
- 2025-10-19: Initial import and Replit environment setup

## Notes
According to the README, the original plan included a Flask backend with LLM integration, but the current implementation is pure frontend with mock responses. The AI integration is ready for implementation via the commented API call in `script.js`.
