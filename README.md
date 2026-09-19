# ParcelPulse — Verified Advertising on Delivery Packages

> Turn delivery packages into measurable advertising inventory. Businesses pay for verified placements, riders earn for participating, and our verification system provides evidence that the advertisement was actually placed and remained visible through the delivery.

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
Backend runs on **http://localhost:8080**

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on **http://localhost:5173**

### 4. Login
Use the **Quick Demo Access** buttons on the login page:
| Role | Email | Password |
|------|-------|----------|
| Advertiser | nike@demo.com | demo123 |
| Agent | ravi@demo.com | demo123 |
| Rider | arun@demo.com | demo123 |
| Admin | admin@parcelpulse.com | admin123 |

## Architecture
- **Backend**: Spring Boot 3.3 modular monolith (Java 17)
- **Frontend**: React 19 + Vite + React Router v7
- **Database**: PostgreSQL (auto-created tables via Hibernate)
- **Design**: Classic warm-toned theme (Swiggy/Zomato inspired)

## The 4 Portals
1. **Business Portal** — Create campaigns, pay, view results
2. **Agent Portal** — Receive stickers, assign to riders
3. **Rider App** — Place stickers, take START/END photos, earn rewards
4. **Admin Console** — Manage everything, verify placements, view analytics

## Demo Flow
1. Login as **Advertiser** → Create "Nike Summer Sprint" campaign → Activate
2. Login as **Admin** → Generate stickers → Issue to Agent
3. Login as **Agent** → Assign stickers to Rider
4. Login as **Rider** → Select sticker → START photo → Deliver → END photo → Submit
5. Verification runs automatically → ₹10 reward credited
6. Login as **Advertiser** → View campaign dashboard with results
7. Login as **Admin** → Review flagged placements → Approve/Reject
