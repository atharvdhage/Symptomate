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
  - `splash.html` - Splash screen with login/register options
  - `login.html` - User login page
  - `register.html` - User registration page
- **Styling**: `style.css` with modern neumorphic gradient design
- **Logic**: `script.js` with localStorage-based chat history and `utils.js` for toast notifications

## Key Features
- **Authentication System** (Optional)
  - Users can register, login, or skip and continue as guest
  - localStorage-based authentication
  - User session management with logout functionality
  - Non-logged-in users are shown the splash screen
  - Logged-in users skip straight to the chat interface
- **Modern UI Design**
  - Neumorphic button design with 3D soft shadows
  - Subtle gradient backgrounds throughout
  - Interactive dashboard cards with hover glow effects
  - Light-themed WhatsApp-style user avatars
  - Smooth page transition animations
- **Interactive Features**
  - Toast notification system (success, error, warning, info)
  - Chat interface with typing animation
  - Mock AI responses for common health symptoms
  - Dark mode support
  - Chat history persistence using localStorage
  - Settings page for customization
  - Dashboard with health activity overview

## Current State
- Frontend is fully functional with mock responses
- Optional login system implemented with localStorage
- Modern neumorphic UI with smooth animations
- Ready for AI API integration (placeholder in `getAIResponse()` function)
- All static assets in place

## Setup
The project runs on a simple HTTP server on port 5000. No build process or dependencies required.

## Recent Changes
- 2025-10-19: Initial import and Replit environment setup
- 2025-10-19: Added neumorphic UI design, toast notifications, page transitions
- 2025-10-19: Implemented optional login/register system with WhatsApp-style light avatars

## Notes
According to the README, the original plan included a Flask backend with LLM integration, but the current implementation is pure frontend with mock responses. The AI integration is ready for implementation via the commented API call in `script.js`.
