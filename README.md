# ParcelPulse — Verified Advertising on Delivery Packages

> ⚠️ **CONFIDENTIAL & PROPRIETARY** — This repository contains trade secrets and proprietary intellectual property of ParcelPulse. Unauthorized access, copying, distribution, or use of any part of this codebase is strictly prohibited and may result in legal action. See [LICENSE](./LICENSE) for details.

---

> Turn delivery packages into measurable advertising inventory. Businesses pay for verified placements, riders earn for participating, and our verification system provides evidence that the advertisement was actually placed and remained visible through the delivery.

**Copyright © 2026 ParcelPulse. All Rights Reserved.**

---

## Quick Start

### Prerequisites
- **Java 17+** (JDK)
- **Maven** (or use `./mvnw`)
- **Node.js 18+** (with npm)
- **PostgreSQL** (running on localhost:5432)

### 1. Database Setup
```bash
# Create the database
psql -U postgres -c "CREATE DATABASE parcelpulse;"
```

### 2. Start Backend
```bash
cd backend
mvn spring-boot:run
```
The API starts at `http://localhost:8081/api`

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

## Demo Accounts (Auto-seeded)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@parcelpulse.com | admin123 |
| Business | business@parcelpulse.com | business123 |
| Agent | agent@parcelpulse.com | agent123 |
| Rider | rider@parcelpulse.com | rider123 |

## Architecture

- **Backend**: Spring Boot 3.3 / Java 17 (REST API)
- **Frontend**: React 19 + Vite (SPA)
- **Database**: PostgreSQL
- **Image Storage**: Cloudinary (production) / Local filesystem (dev)

## Legal

This software is proprietary. See [LICENSE](./LICENSE) for full terms.

**Patent Pending**: The verified advertising placement system, including the
GPS + Photo + Time evidence pipeline, is the subject of pending patent
applications.

© 2026 ParcelPulse. All Rights Reserved. Unauthorized use is prohibited.
