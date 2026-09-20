# ParcelPulse — Complete Project Documentation

> ⚠️ **CONFIDENTIAL & PROPRIETARY** — This document contains trade secrets and
> proprietary intellectual property. See [LICENSE](./LICENSE) for terms.

**Copyright © 2026 ParcelPulse. All Rights Reserved.**
**Version**: 1.0.0 (MVP)
**Last Updated**: September 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Solution Overview](#3-solution-overview)
4. [Business Model](#4-business-model)
5. [System Architecture](#5-system-architecture)
6. [Technology Stack](#6-technology-stack)
7. [Database Schema](#7-database-schema)
8. [API Reference](#8-api-reference)
9. [Frontend Portals](#9-frontend-portals)
10. [Verification Engine](#10-verification-engine)
11. [Deployment Guide](#11-deployment-guide)
12. [Security Considerations](#12-security-considerations)
13. [Future Implementation Roadmap](#13-future-implementation-roadmap)
14. [Competitive Analysis](#14-competitive-analysis)
15. [Glossary](#15-glossary)

---

## 1. Executive Summary

**ParcelPulse** is a technology platform that transforms delivery packages into
measurable advertising inventory. We connect three stakeholders in a verified
advertising ecosystem:

| Stakeholder | Role | Value |
|---|---|---|
| **Advertisers** (Businesses) | Create and fund ad campaigns | Verified, hyper-local advertising with proof of placement |
| **Riders** (Delivery partners) | Place ad stickers on packages during deliveries | Earn ₹X per verified placement + bonuses |
| **ParcelPulse** (Platform) | Orchestrates, verifies, and audits everything | Takes a margin between advertiser payment and rider payout |

The core innovation is our **3-layer verification pipeline** — combining
photographic evidence, GPS coordinates, and timestamps to cryptographically
prove that an advertisement was physically placed on a package and remained
visible throughout its delivery journey.

---

## 2. Problem Statement

### For Advertisers
- Traditional outdoor advertising (billboards, posters) has **no verifiable proof** of audience reach.
- Digital advertising faces **ad fraud**, **ad blockers**, and **banner blindness**.
- Hyper-local advertising (targeting specific neighborhoods) is **expensive and imprecise**.

### For Delivery Riders
- Gig economy riders earn **thin margins** on each delivery.
- There are **no passive income streams** available during normal deliveries.
- Riders have **unused real estate** on every package they carry.

### For the Market
- India's last-mile delivery market processes **1.8+ billion packages annually**.
- Each package is seen by **5-15 people** during its journey.
- This is an **untapped advertising surface** worth billions.

---

## 3. Solution Overview

### The ParcelPulse Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PARCELPULSE ECOSYSTEM                              │
│                                                                             │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │ADVERTISER│───▶│PARCELPULSE│───▶│  AGENT   │───▶│  RIDER   │              │
│  │          │    │(Platform)│    │          │    │          │              │
│  │ Creates  │    │ Sets     │    │ Receives │    │ Places   │              │
│  │ Campaign │    │ Pricing  │    │ Stickers │    │ Stickers │              │
│  │ & Pays   │    │ & Prints │    │ & Hands  │    │ on Pkgs  │              │
│  │          │    │ Stickers │    │ to Riders│    │ & Submits│              │
│  └──────────┘    └─────┬────┘    └──────────┘    │ Evidence │              │
│                        │                         └─────┬────┘              │
│                        │                               │                    │
│                        ▼                               ▼                    │
│                  ┌───────────┐                   ┌───────────┐             │
│                  │VERIFICATION│◀──────────────────│  PHOTO +  │             │
│                  │  ENGINE    │                   │  GPS +    │             │
│                  │            │                   │  TIME     │             │
│                  │  Auto +    │                   └───────────┘             │
│                  │  Manual    │                                             │
│                  └─────┬─────┘                                             │
│                        │                                                    │
│                        ▼                                                    │
│                  ┌───────────┐                                             │
│                  │  REWARD   │──▶ Rider gets ₹X per verified placement     │
│                  │  ENGINE   │──▶ Bonus for streaks & milestones           │
│                  └───────────┘                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Step-by-Step Flow

1. **Advertiser creates a campaign** — defines brand, target area, number of placements, budget, and payment plan (full/partial).
2. **ParcelPulse sets rider economics** — internally decides ₹X per verified placement and any completion bonuses.
3. **ParcelPulse generates stickers** — each sticker gets a unique code and QR data for tracking.
4. **Admin issues stickers to agents** — agents are field logistics partners in target areas.
5. **Agent hands stickers to riders** — riders receive stickers for their delivery routes.
6. **Rider places sticker & submits evidence** — takes a start photo with GPS + time, then an end photo after delivery.
7. **Verification engine processes evidence** — auto-checks GPS distance, time consistency, and photo hash integrity.
8. **Admin reviews flagged placements** — any placement that fails auto-verification goes to manual review.
9. **Rewards are issued** — verified placements trigger automatic reward calculation for the rider.
10. **Advertiser sees real-time dashboard** — verified placements, reach, and spend tracking.

---

## 4. Business Model

### Revenue Streams

| Stream | Description |
|---|---|
| **Campaign Fees** | Advertisers pay per placement. ParcelPulse keeps the margin between advertiser rate and rider payout. |
| **Full Payment Discount** | Advertisers who pay upfront receive a ParcelPulse-defined discount (incentivizes cash flow). |
| **Partial Payment Plans** | Advertisers can pay in installments per a defined payment plan. |
| **Premium Campaigns** | Future: priority placement, geo-fencing, and real-time analytics at premium rates. |

### Unit Economics (Example)

```
Advertiser pays:     ₹10 per placement
ParcelPulse keeps:   ₹4 margin (40%)
Rider receives:      ₹5 base reward
Agent receives:      ₹1 distribution fee
────────────────────────────────────
Net margin:          ₹4 per verified placement
```

### Payment Options

| Option | Description | Discount |
|---|---|---|
| **FULL_PAYMENT** | Pay entire campaign budget upfront | Platform-defined discount applied |
| **PARTIAL_PAYMENT** | Pay according to available installment plan | No discount |

---

## 5. System Architecture

### High-Level Architecture

```
┌───────────────────────┐        ┌──────────────────────────┐
│     FRONTEND (SPA)    │        │      BACKEND (API)       │
│                       │        │                          │
│  React 19 + Vite      │◀──────▶│  Spring Boot 3.3         │
│  Port: 5173 (dev)     │  REST  │  Port: 8081              │
│                       │  JSON  │                          │
│  ┌─────────────────┐  │        │  ┌────────────────────┐  │
│  │ Business Portal │  │        │  │ Controllers (REST) │  │
│  │ Agent Portal    │  │        │  │ Services (Logic)   │  │
│  │ Rider Portal    │  │        │  │ Repositories (JPA) │  │
│  │ Admin Console   │  │        │  │ Domain Entities    │  │
│  └─────────────────┘  │        │  └────────────────────┘  │
└───────────────────────┘        └────────────┬─────────────┘
                                              │
                                    ┌─────────▼─────────┐
                                    │   PostgreSQL DB    │
                                    │   (Neon / Local)   │
                                    └───────────────────┘
                                              │
                                    ┌─────────▼─────────┐
                                    │    Cloudinary      │
                                    │  (Image Storage)   │
                                    └───────────────────┘
```

### Design Patterns Used

| Pattern | Where | Purpose |
|---|---|---|
| **Modular Monolith** | Overall architecture | Simple deployment; can be decomposed into microservices later |
| **Repository Pattern** | Data access layer | Abstract database operations behind interfaces |
| **Service Layer** | Business logic | Isolate business rules from controllers |
| **Builder Pattern** | Entity construction | Clean object creation with Lombok `@Builder` |
| **DTO Pattern** | Request/response | Separate API contracts from domain entities |

---

## 6. Technology Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Java | 17 | Core language |
| Spring Boot | 3.3.5 | Web framework |
| Spring Data JPA | 3.3.x | ORM / database access |
| Hibernate | 6.x | JPA implementation |
| PostgreSQL | 15+ | Primary database |
| Lombok | Latest | Boilerplate reduction |
| Cloudinary SDK | 1.36.0 | Image upload & hosting |
| Maven | 3.9.6 | Build tool |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI library |
| Vite | 6.x | Build tool & dev server |
| Axios | Latest | HTTP client |
| React Router | 7.x | Client-side routing |
| Vanilla CSS | — | Styling (custom design system) |

### Infrastructure (Production)

| Service | Provider | Purpose |
|---|---|---|
| Backend Hosting | Render (Docker) | Spring Boot API |
| Frontend Hosting | Vercel | Static SPA |
| Database | Neon | Serverless PostgreSQL |
| Image Storage | Cloudinary | Photo evidence uploads |

---

## 7. Database Schema

### Entity Relationship Diagram

```
┌──────────┐     ┌───────────┐     ┌──────────┐     ┌────────────────┐
│   User   │────▶│  Campaign │────▶│ Sticker  │────▶│   Placement    │
│          │     │           │     │          │     │                │
│ id       │     │ id        │     │ id       │     │ id             │
│ name     │     │ advertiser│     │ campaign │     │ sticker_id     │
│ email    │     │ name      │     │ code     │     │ rider_id       │
│ password │     │ brand     │     │ qr_data  │     │ campaign_id    │
│ role     │     │ budget    │     │ status   │     │ start_photo    │
│ phone    │     │ status    │     │ agent_id │     │ start_gps      │
└──────────┘     │ dates     │     │ rider_id │     │ end_photo      │
                 └───────────┘     └──────────┘     │ end_gps        │
                                                    │ status         │
                                                    └───────┬────────┘
                                                            │
                                          ┌─────────────────┼──────────────┐
                                          ▼                                ▼
                                   ┌──────────────┐              ┌─────────────┐
                                   │ Verification │              │   Reward    │
                                   │    Result    │              │             │
                                   │              │              │ rider_id    │
                                   │ placement_id │              │ amount      │
                                   │ gps_valid    │              │ type        │
                                   │ time_valid   │              │ status      │
                                   │ photo_valid  │              └─────────────┘
                                   │ auto_result  │
                                   │ admin_result │
                                   └──────────────┘
```

### Tables

#### `users`
| Column | Type | Description |
|---|---|---|
| id | BIGINT PK | Auto-generated ID |
| name | VARCHAR | Full name |
| email | VARCHAR UNIQUE | Login email |
| password | VARCHAR | Hashed password |
| role | ENUM | `ADVERTISER`, `AGENT`, `RIDER`, `ADMIN` |
| phone | VARCHAR | Contact number |
| created_at | TIMESTAMP | Registration date |

#### `campaigns`
| Column | Type | Description |
|---|---|---|
| id | BIGINT PK | Auto-generated ID |
| advertiser_id | BIGINT FK | References `users.id` |
| name | VARCHAR | Campaign name |
| brand_name | VARCHAR | Brand being advertised |
| ad_description | TEXT | Description of the ad |
| target_area | VARCHAR | Geographic target area |
| target_placements | INT | Desired number of placements |
| budget | DECIMAL(12,2) | Total campaign budget |
| payment_type | ENUM | `FULL_PAYMENT`, `PARTIAL_PAYMENT` |
| amount_paid | DECIMAL(12,2) | Amount received |
| discount_applied | DECIMAL(12,2) | Discount for full payment |
| status | ENUM | `DRAFT`, `ACTIVE`, `PAUSED`, `COMPLETED` |
| reward_per_placement | DECIMAL(8,2) | ₹ per verified placement for rider |
| completion_bonus | DECIMAL(8,2) | Bonus for hitting milestones |
| start_date / end_date | DATE | Campaign duration |
| created_at | TIMESTAMP | Creation timestamp |

#### `stickers`
| Column | Type | Description |
|---|---|---|
| id | BIGINT PK | Auto-generated ID |
| campaign_id | BIGINT FK | References `campaigns.id` |
| sticker_code | VARCHAR UNIQUE | Human-readable unique code (e.g., `PP-CAMP1-00001`) |
| qr_data | VARCHAR | Encoded QR data for scanning |
| status | ENUM | `CREATED`, `WITH_AGENT`, `WITH_RIDER`, `USED`, `DAMAGED` |
| current_agent_id | BIGINT | Agent currently holding the sticker |
| current_rider_id | BIGINT | Rider currently holding the sticker |
| created_at / updated_at | TIMESTAMP | Lifecycle timestamps |

#### `placements`
| Column | Type | Description |
|---|---|---|
| id | BIGINT PK | Auto-generated ID |
| sticker_id | BIGINT FK | Which sticker was placed |
| rider_id | BIGINT FK | Who placed it |
| campaign_id | BIGINT FK | Which campaign it belongs to |
| status | ENUM | `STARTED`, `SUBMITTED`, `VERIFIED`, `REVIEW_REQUIRED`, `REJECTED` |
| start_photo_path | VARCHAR | Photo URL at placement start |
| start_latitude / start_longitude | DECIMAL(10,7) | GPS at start |
| start_time | TIMESTAMP | When placement started |
| photo_hash_start | VARCHAR | SHA-256 hash of start photo |
| end_photo_path | VARCHAR | Photo URL at delivery end |
| end_latitude / end_longitude | DECIMAL(10,7) | GPS at end |
| end_time | TIMESTAMP | When delivery completed |
| photo_hash_end | VARCHAR | SHA-256 hash of end photo |

#### `verification_results`
| Column | Type | Description |
|---|---|---|
| id | BIGINT PK | Auto-generated ID |
| placement_id | BIGINT FK | References `placements.id` |
| gps_distance_valid | BOOLEAN | Start/end GPS distance within threshold |
| time_window_valid | BOOLEAN | Delivery completed within reasonable time |
| photo_hash_valid | BOOLEAN | Start and end photos are different (not reused) |
| auto_result | ENUM | `PASS`, `FAIL`, `REVIEW_REQUIRED` |
| admin_decision | ENUM | `APPROVED`, `REJECTED`, `null` |
| admin_notes | TEXT | Admin's review notes |
| verified_at | TIMESTAMP | When verification completed |

#### `rewards`
| Column | Type | Description |
|---|---|---|
| id | BIGINT PK | Auto-generated ID |
| rider_id | BIGINT FK | Who earned it |
| placement_id | BIGINT FK | Which placement triggered it |
| campaign_id | BIGINT FK | Which campaign |
| amount | DECIMAL(8,2) | Reward amount in ₹ |
| type | ENUM | `PLACEMENT_REWARD`, `COMPLETION_BONUS`, `STREAK_BONUS` |
| status | ENUM | `PENDING`, `APPROVED`, `PAID` |

#### Supporting Tables
- **`sticker_handovers`** — Tracks chain of custody (Admin → Agent → Rider)
- **`rider_stats`** — Aggregated performance metrics per rider
- **`audit_logs`** — Complete audit trail of all system actions

---

## 8. API Reference

**Base URL**: `https://parcelpulse-api.onrender.com/api`

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive user data |
| GET | `/users` | List all users |
| GET | `/users/{id}` | Get user by ID |
| GET | `/users/role/{role}` | Get users by role |

**Register Request:**
```json
{
  "name": "Business Corp",
  "email": "biz@example.com",
  "password": "securepass",
  "role": "ADVERTISER",
  "phone": "9876543210"
}
```

---

### Campaigns

| Method | Endpoint | Description |
|---|---|---|
| POST | `/campaigns` | Create a new campaign |
| GET | `/campaigns` | List all campaigns |
| GET | `/campaigns/{id}` | Get campaign by ID |
| GET | `/campaigns/advertiser/{id}` | Get campaigns by advertiser |
| PUT | `/campaigns/{id}/activate` | Activate a draft campaign |
| GET | `/campaigns/{id}/dashboard` | Get campaign analytics dashboard |

**Create Campaign Request:**
```json
{
  "advertiserId": 2,
  "name": "Summer Sale 2026",
  "brandName": "FreshCart",
  "adDescription": "Summer sale - 50% off groceries",
  "targetArea": "Mumbai South",
  "targetPlacements": 500,
  "budget": 5000.00,
  "paymentType": "FULL_PAYMENT",
  "startDate": "2026-10-01",
  "endDate": "2026-10-31"
}
```

---

### Stickers

| Method | Endpoint | Description |
|---|---|---|
| POST | `/stickers/generate` | Generate stickers for a campaign |
| POST | `/stickers/issue-to-agent` | Issue stickers from inventory to an agent |
| POST | `/stickers/assign-to-rider` | Agent assigns stickers to a rider |
| GET | `/stickers/campaign/{id}` | All stickers for a campaign |
| GET | `/stickers/agent/{id}` | All stickers held by an agent |
| GET | `/stickers/agent/{id}/available` | Available stickers an agent can distribute |
| GET | `/stickers/rider/{id}` | All stickers held by a rider |
| GET | `/stickers/rider/{id}/available` | Stickers a rider can use for placements |
| GET | `/stickers/{id}` | Get sticker by ID |
| PUT | `/stickers/{id}/damaged` | Mark a sticker as damaged |

---

### Placements

| Method | Endpoint | Description |
|---|---|---|
| POST | `/placements/start` | Start a placement (multipart: photo + GPS) |
| POST | `/placements/{id}/end` | End a placement (multipart: photo + GPS) |
| GET | `/placements/rider/{id}` | Get all placements by a rider |
| GET | `/placements/campaign/{id}` | Get all placements for a campaign |
| GET | `/placements/{id}` | Get placement by ID |
| GET | `/placements/{id}/evidence` | Get full evidence bundle for a placement |

**Start Placement (multipart/form-data):**
```
stickerId: 1
riderId: 4
photo: [FILE]
latitude: 19.0760
longitude: 72.8777
```

---

### Verification

| Method | Endpoint | Description |
|---|---|---|
| GET | `/verifications/placement/{id}` | Get verification result for a placement |
| GET | `/verifications/review-required` | List all placements needing admin review |
| PUT | `/verifications/{id}/decide` | Admin approves/rejects a placement |

**Admin Decision Request:**
```json
{
  "decision": "APPROVED",
  "notes": "GPS and photo evidence checks out. Verified."
}
```

---

### Rewards

| Method | Endpoint | Description |
|---|---|---|
| GET | `/rewards/rider/{id}` | Get all rewards for a rider |
| GET | `/rewards/rider/{id}/summary` | Get reward summary (total earned, pending, paid) |
| GET | `/rewards/campaign/{id}` | Get reward distribution for a campaign |

---

### Admin

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/dashboard` | Platform-wide analytics dashboard |
| GET | `/admin/campaigns` | All campaigns overview |
| GET | `/admin/stickers/overview` | Sticker inventory & status breakdown |
| GET | `/admin/riders/overview` | All riders and their stats |
| GET | `/admin/audit-log` | Complete audit trail |

---

## 9. Frontend Portals

### Design System

- **Typography**: Poppins (Google Fonts)
- **Primary Gradient**: `#FF6B35` → `#E8302A` (warm orange-red, inspired by Swiggy/Zomato)
- **Card Style**: White cards with soft shadows (`0 2px 12px rgba(0,0,0,0.08)`)
- **Border Radius**: 12px–16px for modern feel
- **Animations**: Subtle fade-ins and hover transitions

### Portal Overview

| Portal | User Role | Key Features |
|---|---|---|
| **Business Portal** | ADVERTISER | Create campaigns, view dashboards, track placements |
| **Agent Portal** | AGENT | Receive stickers from admin, distribute to riders, view inventory |
| **Rider Portal** | RIDER | View assigned stickers, start/end placements with photo evidence, track rewards |
| **Admin Console** | ADMIN | Platform dashboard, verification queue, sticker/rider/campaign overview, audit logs |

### Routing Structure

```
/login              → Login page
/register           → Registration page
/business           → Business Portal (Advertiser)
  /business/create  → Create new campaign
  /business/:id     → Campaign dashboard
/agent              → Agent Portal
  /agent/assign     → Assign stickers to riders
  /agent/inventory  → View sticker inventory
/rider              → Rider Portal
  /rider/place      → Start a new placement
  /rider/placements → My placements history
  /rider/stickers   → My assigned stickers
  /rider/rewards    → My rewards & earnings
/admin              → Admin Console
  /admin/verify     → Verification queue
  /admin/campaigns  → Campaign overview
  /admin/stickers   → Sticker management
  /admin/riders     → Rider stats
  /admin/audit      → Audit log
```

---

## 10. Verification Engine

### How It Works

The verification engine is the core IP of ParcelPulse. It uses a **3-layer
evidence pipeline** to determine whether an advertising placement was genuine:

```
┌─────────────────────────────────────────────────────┐
│                VERIFICATION PIPELINE                 │
│                                                     │
│  Layer 1: GPS Validation                            │
│  ├── Start GPS ≠ End GPS (rider actually moved)     │
│  └── Distance between points > minimum threshold    │
│                                                     │
│  Layer 2: Time Validation                           │
│  ├── End time > Start time                          │
│  └── Duration falls within reasonable delivery      │
│       window (not too fast, not too slow)            │
│                                                     │
│  Layer 3: Photo Hash Validation                     │
│  ├── SHA-256 hash of start photo                    │
│  ├── SHA-256 hash of end photo                      │
│  └── Hashes must be different (not the same photo)  │
│                                                     │
│  Result:                                            │
│  ├── ALL PASS → Auto-VERIFIED ✅                    │
│  ├── ANY FAIL → REVIEW_REQUIRED ⚠️ (admin queue)   │
│  └── Admin can APPROVE or REJECT after review       │
└─────────────────────────────────────────────────────┘
```

### Verification Results

| Auto Result | Meaning | Next Step |
|---|---|---|
| `PASS` | All 3 layers passed | Placement auto-verified, reward issued |
| `FAIL` | Critical failure | Sent to admin review queue |
| `REVIEW_REQUIRED` | Borderline case | Admin manually approves/rejects |

---

## 11. Deployment Guide

### Production URLs

| Service | URL |
|---|---|
| Backend API | https://parcelpulse-api.onrender.com |
| Frontend App | Deployed on Vercel (after setup) |

### Environment Variables (Backend)

| Variable | Description | Example |
|---|---|---|
| `DB_URL` | PostgreSQL connection string | `jdbc:postgresql://host.neon.tech/parcelpulse?sslmode=require` |
| `DB_USER` | Database username | `parcelpulse_user` |
| `DB_PASS` | Database password | `***` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `dabc123` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary secret | `***` |

### Local Development Setup

```bash
# 1. Clone the repo
git clone https://github.com/vikram583135/ParcelPulse.git
cd ParcelPulse

# 2. Setup database
psql -U postgres -c "CREATE DATABASE parcelpulse;"

# 3. Start backend
cd backend
mvn spring-boot:run

# 4. Start frontend (new terminal)
cd frontend
npm install
npm run dev
```

### Demo Accounts (Auto-seeded by DataInitializer)

| Role | Email | Password |
|---|---|---|
| Admin | admin@parcelpulse.com | admin123 |
| Business | business@parcelpulse.com | business123 |
| Agent | agent@parcelpulse.com | agent123 |
| Rider | rider@parcelpulse.com | rider123 |

---

## 12. Security Considerations

### Current MVP Security

| Feature | Status | Details |
|---|---|---|
| Password Hashing | ⚠️ Basic | Passwords stored with basic encoding; needs BCrypt upgrade |
| Authentication | ⚠️ Session-based | Simple login; needs JWT token-based auth |
| CORS | ✅ Configured | Allows requests from deployed frontend domains |
| Photo Integrity | ✅ SHA-256 | Photos hashed to detect reuse/tampering |
| Audit Trail | ✅ Complete | Every action logged with actor, action, timestamp |
| Input Validation | ✅ Spring Validation | Request bodies validated at controller level |

### Security Upgrades Needed for Production

1. **JWT Authentication** with refresh tokens
2. **BCrypt password hashing** (minimum 12 rounds)
3. **Rate limiting** on all API endpoints
4. **Role-based access control (RBAC)** middleware
5. **HTTPS enforcement** (Render provides this by default)
6. **SQL injection protection** (JPA parameterized queries already provide this)

---

## 13. Future Implementation Roadmap

### Phase 2: Core Enhancements (Month 1–2)

#### 🔐 Authentication & Security
- [ ] JWT token-based authentication with refresh tokens
- [ ] BCrypt password hashing
- [ ] Role-based middleware (riders can't access admin endpoints)
- [ ] API rate limiting (100 requests/min per user)
- [ ] Two-factor authentication for admin accounts

#### 📱 Mobile App (React Native)
- [ ] Rider mobile app with native camera integration
- [ ] Real-time GPS tracking during deliveries
- [ ] QR code scanning with device camera (replace dropdown simulation)
- [ ] Push notifications for new sticker assignments and reward payouts
- [ ] Offline support for areas with poor connectivity

#### 🤖 AI-Powered Verification
- [ ] Computer vision model to verify sticker is actually visible in photo
- [ ] OCR to match brand name on sticker with campaign details
- [ ] Anomaly detection for suspicious placement patterns
- [ ] Auto-rejection of blurry, dark, or irrelevant photos
- [ ] Deepfake/AI-generated image detection

---

### Phase 3: Business Features (Month 3–4)

#### 💳 Payment Integration
- [ ] Razorpay/Stripe integration for advertiser payments
- [ ] Automated rider payouts via UPI/bank transfer
- [ ] Invoice generation for advertisers
- [ ] GST-compliant billing
- [ ] Partial payment installment tracking

#### 📊 Advanced Analytics
- [ ] Real-time campaign dashboard with live map of placements
- [ ] Heatmap visualization of placement density
- [ ] Impression estimation model (based on route, area foot traffic)
- [ ] Advertiser ROI calculator
- [ ] Rider performance leaderboards

#### 🗺️ Geo-Fencing
- [ ] Define campaign zones on a map (polygon-based)
- [ ] Auto-reject placements outside the target zone
- [ ] Suggest optimal delivery routes for maximum ad visibility
- [ ] Integration with Google Maps / Mapbox APIs

---

### Phase 4: Scale & Partnerships (Month 5–8)

#### 🏢 Enterprise Features
- [ ] Multi-tenant architecture for large brands with multiple campaigns
- [ ] White-label portal for delivery companies (Swiggy, Zomato, Dunzo)
- [ ] Bulk campaign creation via CSV upload
- [ ] API access for enterprise advertisers (self-serve)
- [ ] Custom SLA agreements and priority support

#### 🤝 Delivery Platform Integrations
- [ ] Swiggy delivery partner API integration
- [ ] Zomato rider integration
- [ ] Amazon Flex integration
- [ ] Dunzo partner integration
- [ ] Custom fleet management for direct delivery companies

#### 🏆 Gamification & Retention
- [ ] Rider level system (Bronze → Silver → Gold → Platinum)
- [ ] Daily/weekly streak bonuses
- [ ] Referral program (rider refers rider, both earn bonus)
- [ ] Leaderboard with monthly prizes
- [ ] Achievement badges displayed on rider profile

---

### Phase 5: Advanced Platform (Month 9–12)

#### 📈 Marketplace
- [ ] Self-serve advertiser marketplace (sign up, create campaign, pay, go live)
- [ ] Dynamic pricing engine (price per placement based on demand, area, time)
- [ ] Campaign bidding system for premium routes
- [ ] Advertiser credit system (pre-load wallet)

#### 🔗 Blockchain Verification (Optional)
- [ ] Immutable placement records on blockchain
- [ ] Smart contracts for automated rider payouts
- [ ] Transparent advertiser proof-of-placement certificates
- [ ] NFT-based achievement badges for top riders

#### 🌍 Geographic Expansion
- [ ] Multi-city launch (Mumbai → Delhi → Bangalore → Hyderabad)
- [ ] Multi-language support (Hindi, Marathi, Kannada, Telugu)
- [ ] Currency and tax localization
- [ ] Regional agent network management

#### 📡 IoT & Hardware (Long-term Vision)
- [ ] Smart stickers with NFC chips for automatic scan verification
- [ ] Bluetooth beacons on delivery bags for proximity-based ad tracking
- [ ] Integration with smart delivery boxes

---

## 14. Competitive Analysis

| Feature | ParcelPulse | Traditional Billboard | Digital Ads (Google/Meta) | Other Package Ads |
|---|---|---|---|---|
| **Verified Placement** | ✅ 3-layer proof | ❌ No proof | ⚠️ Bot fraud risk | ❌ No verification |
| **Hyper-Local** | ✅ Route-level | ❌ Fixed location | ⚠️ Approximate | ⚠️ Limited |
| **Cost per Impression** | ₹0.5–2 | ₹5–50 | ₹2–20 | Unknown |
| **Real-time Analytics** | ✅ Dashboard | ❌ None | ✅ Available | ❌ Limited |
| **Passive Income for Riders** | ✅ Core feature | N/A | N/A | ⚠️ Informal |
| **Anti-Fraud** | ✅ GPS + Photo + Hash | N/A | ⚠️ Weak | ❌ None |
| **Scalability** | ✅ 1.8B packages/year | ❌ Fixed | ✅ Infinite | ❌ Manual |

### Unique Differentiators

1. **3-Layer Verification Pipeline** — No competitor offers GPS + Photo + Time + Hash verification.
2. **Agent Distribution Network** — Solves the last-mile logistics of getting stickers to riders.
3. **Rider Economics** — Clear, transparent reward system with gamification potential.
4. **Audit Trail** — Complete chain of custody from print → agent → rider → package → verification.

---

## 15. Glossary

| Term | Definition |
|---|---|
| **Advertiser** | A business that pays to place ads on delivery packages |
| **Agent** | A field logistics partner who distributes stickers to riders in a target area |
| **Rider** | A delivery partner who places advertising stickers on packages during deliveries |
| **Campaign** | An advertising campaign created by an advertiser with a target area, budget, and duration |
| **Sticker** | A physical advertising sticker with a unique code and QR data |
| **Placement** | A single instance of a rider placing a sticker on a package (with evidence) |
| **Verification** | The automated + manual process of confirming a placement was genuine |
| **Reward** | The monetary payout to a rider for a verified placement |
| **Evidence Bundle** | Start photo + end photo + GPS coordinates + timestamps for a placement |
| **Photo Hash** | SHA-256 cryptographic hash of a photo, used to detect reuse or tampering |
| **Handover** | The transfer of stickers between parties (Admin→Agent, Agent→Rider) |
| **Audit Log** | An immutable record of every action taken on the platform |

---

**Copyright © 2026 ParcelPulse. All Rights Reserved.**

*Patent Pending: The verified advertising placement system, including the
GPS + Photo + Time evidence pipeline, is the subject of pending patent
applications.*

*For inquiries: [your-email@parcelpulse.in]*
