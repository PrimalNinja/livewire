# Livewire Framework

## Overview
Livewire is a lightweight, server-driven web application framework that delivers UI components dynamically as JSON payloads. It combines traditional server-rendered applications with modern single-page application architectures, maintaining a minimal 18KB footprint.

## Key Features
- **Server Authority**: Server controls UI and functionality
- **Minimal Substrate**: 18KB client framework, dynamic code delivery
- **Code as Data**: UI components transmitted as JSON
- **State-Driven**: Session states determine UI delivery
- **Zero Build Complexity**: No webpack, babel, or build steps
- **Hot Code Reload**: Instant updates without page refresh

## Architecture
- Client (Browser)
  - Static HTML shell + inc-os.js (18KB)
  - Handlers injected as JSON
- Backend (PHP)
  - Modules (livewire, security, system)
  - Session management
- Communication: JSON-RPC over HTTP

## Getting Started
1. Copy files to web server
2. Configure inc-constants.php
3. Create sessions/logs directories
4. Import schema.sql (if using database)
5. Access via browser (default: admin/password)

## Handler Development
- 3-file pattern: handlerName.html, handlerName.css, handlerName.js
- Isolated, reusable, hot-reloadable components
- Scoped element IDs and Hungarian notation for CSS classes

## Security
- Server-side validation and state-based access control
- Use prepared statements (recommended)
- Implement CSRF protection and secure session handling

## License
MIT License

## Author
Cyborg Unicorn Pty Ltd, November 12, 2025