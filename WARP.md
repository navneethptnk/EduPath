# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- This repo contains a static frontend and a Node.js API under edupath-5/.
- The static site (HTML pages in edupath-5/) is deployed to GitHub Pages via a workflow at edupath-5/.github/workflows/deploy.yml.
- The API (edupath-5/api) aggregates education-related announcements (exams, admissions, scholarships, results) from official sources and stores them in a local SQLite database.

Common commands
- Start the API (development)
  - PowerShell (Windows):
    - cd edupath-5/api
    - npm install
    - Copy-Item .env.example .env
    - npm run dev
  - POSIX shells:
    - cd edupath-5/api
    - npm install
    - cp .env.example .env
    - npm run dev
- Start the API (production-ish):
  - cd edupath-5/api && npm start
- Run tests (Jest):
  - All tests: cd edupath-5/api && npm test
  - Watch mode: cd edupath-5/api && npm run test:watch
  - Single test file or name (examples):
    - By file: npx jest path/to/test.spec.js
    - By name: npx jest -t "name of test"
  Notes: At present, there are no repository test files under edupath-5/api; Jest is configured but tests may not run until tests are added.
- Seed sample data into SQLite:
  - cd edupath-5/api && node insert-fresh-data.js
  - Alternative (older sample): cd edupath-5/api && node seed-sample-data.js
- Quick endpoint checks (once server is running on localhost:3000):
  - curl "http://localhost:3000/api/announcements?category=exam&status=active&limit=5"
  - curl "http://localhost:3000/api/search?q=NEET&category=exam&limit=5"
  - curl http://localhost:3000/health

Notes on build/lint
- Build: No build step is required; the API runs directly with Node (main entry: server.js).
- Lint/format: No lint configuration or scripts are present in the repository.

Important environment/setup
- API env file: edupath-5/api/.env (copy from .env.example). Key vars:
  - PORT (default 3000), ADMIN_API_KEY (required for POST /api/refresh), ALLOWED_ORIGINS, DB_PATH (SQLite path), logging/rate-limit/cache toggles, etc.
- SQLite file defaults to edupath-5/api/edupath_announcements.db (configurable via DB_PATH).

High-level architecture
- Static frontend (edupath-5/)
  - HTML pages (index.html, timeline*.html, etc.) read API data when available.
  - api/client-integration.js exposes a lightweight browser client (EduPathAPIClient) and TimelineIntegration to render announcements into the timeline UI. It calls the API endpoints (e.g., /api/announcements, /api/search) and handles simple caching and user-interaction tracking.
- API server (edupath-5/api/server.js)
  - Express application with security (helmet), CORS (ALLOWED_ORIGINS), rate limiting (/api/*), compression, logging (morgan), and JSON body parsing.
  - Routes (non-exhaustive):
    - GET /health – basic liveness probe
    - GET / – human-friendly API dashboard
    - GET /api – JSON summary of endpoints and filters
    - GET /api/announcements – filtered listing (category, status, priority, scope, state, source, date ranges, tags, search, sort, pagination)
    - GET /api/announcements/:id – single announcement by id
    - GET /api/categories – categories derived from stored items
    - GET /api/trending – shortcuts for high-priority, active/upcoming items
    - GET /api/sources – per-source status and recent error log
    - GET /api/statistics – aggregate counts and recent activity
    - POST /api/refresh – triggers a manual aggregate pull; requires X-API-Key header matching ADMIN_API_KEY
    - POST /api/track – records interaction events (view, bookmark, share, click, apply)
  - Startup flow: On start(), the server triggers an aggregate update (DataAggregator.triggerUpdate()) and persists any returned announcements.
- Data aggregation (edupath-5/api/data-aggregator.js)
  - Source registry (this.sources) with parser functions for each provider:
    - NTA (RSS, XML) → exams
    - UPSC (RSS, XML) → exams
    - SSC (RSS, XML) → exams
    - NSP (JSON API) → scholarships
    - CBSE (RSS, XML) → exams/admissions/results/notifications (auto-detected)
  - fetchData() wraps axios with timeouts, retry, exponential backoff, and error logging.
  - Parsing utilities: extract dates from text, eligibility hints, tags, PDF links; heuristic status/priority assignment; content cleaning.
  - Scheduling: node-cron job runs every 6 hours (0 */6 * * *) and aggregates all sources; aggregation returns normalized objects but does not itself persist (server.js does initial persistence; scheduled persist can be wired similarly if/when needed).
- Database layer (edupath-5/api/database.js)
  - SQLite schema with four tables:
    - announcements: core records; JSON-ish fields (states, regions, eligibility, financial, links, tags, metadata) stored as TEXT and parsed on read; indexed on common filters (category/status/priority/dates/source).
    - sources: optional registry for source metadata and health (not heavily used by server routes yet).
    - error_logs: for capture of source/parse failures.
    - user_interactions: for tracking views/clicks/etc.
  - Key methods: upsertAnnouncement, insertAnnouncements (batch), searchAnnouncements (applies filter conditions dynamically and parses JSON TEXT), getAnnouncementById, trackInteraction, getStatistics, cleanup (delete old, completed records).
- Monitoring (edupath-5/api/monitoring.js)
  - SourceMonitor coordinates:
    - monitorSources(): checks last fetch, recent data quality, and reports issues with severities.
    - detectFormatChanges(): probes sources and tries to validate expected formats (RSS/JSON), reporting changes.
    - checkDataFreshness(): identifies stale categories vs freshness threshold.
    - improveDataQuality(): attempts heuristic improvements (title enrichment, missing dates extraction, better categorization) and persists any upgrades.
  - Not currently wired into server routes; available for future health dashboards or background workers.
- Shared schema (edupath-5/api/schema.js)
  - Describes a normalized announcement structure and category-specific fields (exam/scholarship/admission). The database mirrors this shape, with JSON stored as TEXT.

Working with the repo
- Static site
  - Open edupath-5/index.html directly to browse locally (it can function with fallback data when the API is unavailable).
- API-first local dev
  - Use the “Start the API” commands above.
  - Adjust .env (especially ADMIN_API_KEY) for POST /api/refresh.
- CI/CD
  - edupath-5/.github/workflows/deploy.yml publishes the static contents to GitHub Pages on push/PR to main/master.

Caveats and gotchas
- Package scripts in edupath-5/api/package.json reference migrate/seed/refresh/cleanup under scripts/, but the scripts/ directory is not present. Prefer the provided top-level scripts:
  - node insert-fresh-data.js (seed sample data)
  - POST /api/refresh with X-API-Key to trigger a live fetch/normalize run
- No lint configuration and no test files are present in-repo as of now (though Jest is installed). Tests will not run until test files are added.
