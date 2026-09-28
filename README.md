# SolveX — AI POWERED INTELLIGENT ASSISTANT FOR INDIAN STANDARDS AND BIS SERVICES FOR INDUSTRIES AND CONSUMERS 
### AI-Powered Intelligent Assistant for Indian Standards & BIS Services for Industries and Consumers


[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Frontend: React + Vite + Tailwind](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite%20%2B%20Tailwind-blue)](frontend)
[![Backend: Node.js + Express + TypeScript](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express%20%2B%20TS-emerald)](backend)
[![Database: Prisma ORM + SQLite / PostgreSQL](https://img.shields.io/badge/Database-Prisma%20ORM-indigo)](backend/prisma)
[![AI Engine: Grounded RAG + Gemini / OpenAI](https://img.shields.io/badge/AI%20Engine-Grounded%20RAG%20%2B%20Multi--LLM-cyan)](backend/src/services/aiService.ts)

---

##  1. Project Overview & SIH 2026 Problem Statement

* **Problem Statement ID:** 26107
* **Title:** AI-Powered Intelligent Assistant for Indian Standards and BIS Services for Industries and Consumers
* **Organization:** Bureau of Indian Standards (BIS), Ministry of Consumer Affairs, Food and Public Distribution, Government of India
* **Core Product Journey:**
  $$\text{ASK} \longrightarrow \text{UNDERSTAND} \longrightarrow \text{DISCOVER} \longrightarrow \text{RECOMMEND} \longrightarrow \text{VERIFY} \longrightarrow \text{EXPLAIN} \longrightarrow \text{TEST} \longrightarrow \text{COMPLY} \longrightarrow \text{STAY UPDATED}$$

**SolveX** transforms complex statutory BIS regulations, technical standard clauses, and Quality Control Orders (QCOs) into simple, actionable guidance for consumers, MSMEs, industrial manufacturers, startups, students, and government officers.

---

##  2. Key Features & Innovations

1. **Conversational BIS AI Assistant:** Grounded multi-turn conversational AI with zero-hallucination domain knowledge, authoritative citations, and recommended next actions.
2. **Smart Standard Recommendation Engine:** Translates natural-language product descriptions (e.g. *"I manufacture electric kettles"*) into exact Indian Standards (`IS 302-2-15`), mandatory QCO status, and testing parameters.
3. **Real Browser Camera Scanner:** Live camera scanner using `navigator.mediaDevices.getUserMedia()` with animated laser reticle, simulated computer vision mark recognition, and manual CM/L / HUID verification fallback.
4. **Document Intelligence & Clause Finder:** Drag-and-drop file upload (PDF, Word, TXT, images) with automated clause extraction, testing protocols, potential compliance pitfalls, and interactive document chat.
5. **Personalized 6-Stage Compliance Roadmap:**
   $$\text{01 IDENTIFY} \to \text{02 DISCOVER} \to \text{03 UNDERSTAND} \to \text{04 TEST} \to \text{05 CERTIFY} \to \text{06 COMPLY}$$
6. **Compliance Gap Detector & Explainable Readiness Score:** Quantifiable 0–100 score breakdown with clear *"Why this score?"* rationale.
7. **Interactive Compliance Checklist:** Dynamic tasks with live database status updates, priority tags, and celebratory milestone animations.
8. **Smart Testing Laboratory Finder:** Directory of 280+ NABL-accredited & BIS-recognized testing labs with location-based matching.
9. **Natural Terms AI (Technical → Simple):** Plain-language vs. statutory definitions for terms like *ISI Mark, HUID, CRS, Conformity Assessment, QCO, NABL, FMCS, SIT*.
10. **Multilingual & Voice BIS Assistant:** Full voice speech-to-text and text-to-speech across 6 Indian languages: **English, हिन्दी (Hindi), తెలుగు (Telugu), தமிழ் (Tamil), ಕನ್ನಡ (Kannada), and বাংলা (Bengali)**.
11. **Gazette Alerts & Notifications:** Real-time Quality Control Orders (QCO) enforcement tracking and Atmanirbhar Bharat MSME 50% fee concession notices.
12. **Admin Command Center:** System telemetry, standards cataloging, and official gazette broadcasting.

---

##  3. System Architecture

```
                       +---------------------------------------------------+
                       |             Modern Frontend (React 18)             |
                       |  Vite + TypeScript + Tailwind CSS + Lucide Icons  |
                       +-------------------------+-------------------------+
                                                 |
                                     REST API / JSON / WebRTC
                                                 |
                       +-------------------------v-------------------------+
                       |           Secure Node.js / Express Backend         |
                       |          TypeScript + Modular Architecture         |
                       +---+---------------------+---------------------+---+
                           |                     |                     |
            +--------------v---+           +-----v------+        +-----v--------------+
            |  AI Service      |           | Document   |        | Product            |
            |  Abstraction     |           | Processor  |        | Verification       |
            |  - Grounded RAG  |           | - Text     |        | - ISI / CM/L       |
            |  - Gemini/OpenAI |           | - Clauses  |        | - CRS R-Number     |
            |  - Multilingual  |           | - Chunks   |        | - Gold HUID        |
            +------------------+           +------------+        +--------------------+
                                                 |
                       +-------------------------v-------------------------+
                       |                    Prisma ORM                     |
                       |    SQLite (Zero-Setup Dev) / PostgreSQL (Prod)    |
                       +---------------------------------------------------+
```

---

##  4. Technology Stack

* **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Canvas Confetti, Web Speech API, WebRTC MediaDevices API.
* **Backend:** Node.js, Express, TypeScript, Multer, Bcrypt, JSON Web Tokens (JWT), CORS.
* **Database & ORM:** Prisma ORM with SQLite (instant zero-friction local execution) and PostgreSQL-ready schema for production deployment.
* **AI & RAG:** Multi-provider AI abstraction supporting Google Gemini, OpenAI, and internal Grounded BIS Domain Knowledge Engine.

---

##  5. Getting Started Locally

### Prerequisites
* Node.js v18+ (tested on v18.20.8)
* npm v10+

### Step 1: Clone Repository & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/GillaRohan/SolveX.git
cd SolveX

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Initialize & Seed Database
SolveX includes a pre-configured SQLite database with realistic Indian Standards, testing laboratories, gazette orders, and demo accounts:
```bash
cd ../backend

# Push schema and seed realistic BIS dataset
npm run prisma:push
npm run prisma:seed
```

### Step 3: Run the Full-Stack Application
In two separate terminals:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
# Backend runs on http://localhost:5000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

##  6. Demo Accounts & One-Click Logins

SolveX provides instantaneous **1-Click Demo Login** directly from the UI header and login modal without typing passwords:

| Persona | Name | Email | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **MSME Manufacturer** | Rajesh Verma | `manufacturer@solvex.in` | `DemoPass@123` | Compliance Roadmap, Checklist, Lab Finder, Gap Detector |
| **Consumer** | Priya Sharma | `consumer@solvex.in` | `DemoPass@123` | Camera Scanner, Mark Verification, Consumer Protection |
| **Student / Professional** | Ananya Deshmukh | `student@solvex.in` | `DemoPass@123` | Clauses Search, Natural Terms, Technical Standards |
| **Admin Officer** | Dr. A. K. Sundaram | `admin@solvex.in` | `DemoPass@123` | Analytics, Standards Ingestion, Gazette Notifications |

---

##  7. End-to-End Demo Scenarios

### Demo Scenario 1: MSME Manufacturer Compliance Journey ⭐⭐⭐
1. Select role **Manufacturer** from the header dropdown.
2. In the AI Search bar, ask:
   > *"I manufacture electric kettles. Which Indian Standard applies to my product?"*
3. The AI returns **IS 302-2-15:2023** with grounded citations, dry-boil abnormal operation test rules (Clause 19.4), handle temperature thresholds, and testing lab links.
4. Click **"Checklist"** or navigate to **Compliance Center**.
5. View the **6-Stage Statutory Roadmap** (`01 IDENTIFY` to `06 COMPLY`).
6. Complete checklist tasks, observe the live readiness score increase (e.g. from 65% to 85%), and trigger milestone celebrations.

### Demo Scenario 2: Consumer Camera Scanning & Verification ⭐⭐⭐
1. Click **"Scan Product"** in the sidebar.
2. The browser prompts for camera permission via `navigator.mediaDevices.getUserMedia()`.
3. View the live camera viewfinder with the animated holographic scanline reticle.
4. Click **"Capture & Verify Product"** or enter sample licence: `CM/L-8400192` (Prestige Kettle) or `CM/L-7123984` (Vega Helmet).
5. The system displays verified status (`OPERATIVE`), manufacturer, validity, factory location, and consumer protection advisory.

### Demo Scenario 3: Document Intelligence & Clause Extraction ⭐⭐⭐
1. Navigate to **Documents**.
2. Drag and drop any specification sheet, standard draft, or sample file.
3. SolveX extracts technical clauses, summaries, testing requirements, and compliance risks.
4. Use **"Chat with Document"** to ask questions grounded strictly in the uploaded document.

### Demo Scenario 4: Multilingual Voice Assistant in Indian Languages ⭐⭐⭐
1. Click the **Microphone** icon in the top header.
2. Select **తెలుగు (Telugu)**, **हिन्दी (Hindi)**, or **தமிழ் (Tamil)**.
3. Tap the microphone and ask a question.
4. SolveX processes the query and responds with both formatted text and spoken voice synthesis.

---

##  8. Security & Compliance Architecture

* **Authentication:** Signed JSON Web Tokens (JWT) with configurable expiration.
* **Role-Based Access Control (RBAC):** Middleware protecting `/api/admin/*` and user workspaces.
* **Upload Sanitization:** Strict MIME type validation (PDF, DOCX, TXT, images) and 25MB file size boundaries.
* **Safe SQL Operations:** Prisma ORM parameterization preventing SQL injection vulnerabilities.
* **Zero Client Secret Exposure:** API keys and database credentials reside strictly on the server layer.

---

##  9. Production Deployment

### Backend (Render / AWS / Railway / Cloud Run)
1. Configure environment variables (`DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`, `PORT`).
2. Run `npm run build`.
3. Start server using `npm start`.

### Frontend (Vercel / Netlify / Cloudflare Pages)
1. Set `VITE_API_URL` to your production backend URL.
2. Run `npm run build`.
3. Deploy output `frontend/dist/`.

---

## 🏛️ 10. Team & Acknowledgments

Developed for **Smart India Hackathon (SIH 2026)** to empower Indian industries and consumers with trustworthy, explainable, and accessible Bureau of Indian Standards intelligence.
