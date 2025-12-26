# Media Tracker

This repository contains a simple scaffold for a media-tracking app (movies, anime, books).

Structure:

- backend/: Express backend with services and a small JSON data store
- frontend/: Vite + React frontend
- cli/: Minimal command-line tooling

Quick start (backend):

1. cd backend
2. npm install
3. node src/server.js

Quick start (frontend):

1. cd frontend
2. npm install
3. npm run dev

CLI:

1. cd cli
2. node index.js

Notes:
- The service files in `backend/src/services` are placeholders. Add real API calls and API keys in `backend/.env`.
- The backend uses a simple file-based store at `backend/data/media.json` for now.


## TODO
- upgrade database from json to an actual db
- add functionality for more user customizability when they watch a movie, tv show, anime, etc
- watch later list