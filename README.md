# ⚡ GitStory — Continuous Repository Intelligence & Visual Telemetry

<p align="center">
  <img src="public/gitstory-icon.svg" alt="GitStory Logo" width="96" height="96" />
</p>

<p align="center">
  <strong>Transforming complex public GitHub repositories into an intuitive visual story of velocity, codebase architecture, and team dynamics.</strong>
</p>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js_16-Turbopack-000000?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-Strict_TypeSafe-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS_v4-Matte_Dark-38BDF8?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" /></a>
  <a href="https://groq.com"><img src="https://img.shields.io/badge/Groq_Cloud-Llama_3.3_70B-F59E0B?style=for-the-badge&logo=fastapi" alt="Groq Cloud" /></a>
  <a href="https://vitest.dev"><img src="https://img.shields.io/badge/Vitest-27_Tests_Passing-10B981?style=for-the-badge&logo=vitest" alt="Vitest Tests" /></a>
  <a href="https://docker.com"><img src="https://img.shields.io/badge/Docker-Multi--Stage_Alpine-2496ED?style=for-the-badge&logo=docker" alt="Docker" /></a>
  <a href="https://jenkins.io"><img src="https://img.shields.io/badge/Jenkins-Declarative_CI%2FCD-D24939?style=for-the-badge&logo=jenkins" alt="Jenkins" /></a>
  <a href="https://kubernetes.io"><img src="https://img.shields.io/badge/Kubernetes-AWS_EKS_ReplicaSets-326CE5?style=for-the-badge&logo=kubernetes" alt="Kubernetes" /></a>
  <a href="https://aws.amazon.com/ec2"><img src="https://img.shields.io/badge/AWS_EC2-Compute_Cluster-FF9900?style=for-the-badge&logo=amazonec2" alt="AWS EC2" /></a>
  <a href="https://vercel.com"><img src="https://img.shields.io/badge/Deployment-Vercel_Live-000000?style=for-the-badge&logo=vercel" alt="Vercel Ready" /></a>
</p>

---

## 📌 Project Overview & Quick Links

| **Attribute** | **Details** |
|---|---|
| **Event** | **ACM Student Chapter Online Buildathon** |
| **Team Name** | **Arjuna_1** |
| **Project Name** | **GitStory** |
| **Repository** | [https://github.com/Darshan1814/Arjuna_1](https://github.com/Darshan1814/Arjuna_1) |
| **Live Deployed Application** | [https://arjuna-1.vercel.app](https://arjuna-1.vercel.app) |
| **Demo Video Walkthrough** | [https://youtu.be/miu00zCs5is](https://youtu.be/miu00zCs5is) |
| **SonarCloud Quality Gate** | **PASSED** (0 Security Hotspots, 0 Vulnerabilities) |

---

## 👥 Team Members & Responsibilities

| Member | Role | GitHub Handle | Key Responsibilities |
|---|---|---|---|
| **Darshan Patil** | Team Lead & Full-Stack Architect | [@Darshan1814](https://github.com/Darshan1814) | Next.js App Router, GitHub REST API client, Arjuna Sarthi assistant, Docker containerization, AWS EKS integration, Vercel deployment |
| **Swamini** | Frontend & Visualization Specialist | [@swamini9403](https://github.com/swamini9403) | Recharts 52-week velocity bar timeline, language donut breakdown, matte dark / light theme tokens, UI responsiveness & overflow controls |
| **Janhavi Hinganghatkar** | Backend & QA Systems Engineer | [@Janhavi-Hinganghatkar18](https://github.com/Janhavi-Hinganghatkar18) | Persistent SQLite search history API, README explorer & 4-pillar AI executive brief, Jenkins declarative CI/CD pipeline, Vitest test suite |

---

## 🎯 Problem Statement & Solution

### The Problem
Evaluating open-source repositories, onboarding to unfamiliar codebases, or conducting architectural diligence on modern software projects is hindered by major friction points:
1. **Scattered GitHub Views**: Commit logs, branch graphs, language breakdowns, and contributor graphs are distributed across separate pages, requiring high-latency page switches.
2. **Context Fatigue**: Identifying active architectural maintainers, measuring weekly development velocity, and detecting high-churn hot files requires tedious manual cross-referencing.
3. **Documentation Overload**: Project READMEs often exceed thousands of lines without executive summaries or clear architectural quick-takes.

### The GitStory Solution
**GitStory** aggregates GitHub's public telemetry into a single, cohesive, high-performance visual dashboard:
- **Zero-Friction Search & History**: Instant `owner/repo` or full URL lookup backed by persistent SQLite FIFO history (max 5 entries).
- **52-Week Velocity Visualizer**: Interactive commit timeline plotting weekly frequency and peak velocity trends.
- **Language Architecture**: Donut breakdown and segmented visual distribution across 25+ programming languages.
- **Ranked Contributor Dynamics**: Maintainer leaderboard with commit shares, addition/deletion diff volume meters.
- **Hot Files Detection**: Algorithmic sampling of recently modified files to highlight high-churn architectural files.
- **Dual-Mode AI Engine**:
  - **Executive Technical Story**: 3-paragraph architectural narrative synthesized using Groq Cloud high-speed inference.
  - **README Documentation Explorer & AI Synthesizer**: Expandable in-app markdown viewer with a 1-click structured **Executive Brief** tab.
- **Arjuna Sarthi (Repo Finder)**: A floating circular assistant at the bottom-right corner that guides developers to curated open-source repositories based on conversational topic queries (e.g., *"Fintech & Payment Gateways"*, *"High Performance Rust CLI"*).

---

## ⚖️ Tech Stack & Justifications (Judging Criteria: 5% Weightage)

Every technology in the GitStory ecosystem was deliberate, vetted, and selected based on architectural rigor, developer velocity, and performance benchmarks:

| Technology | Role / Icon | Architectural Justification | Alternatives Evaluated & Rejected |
|---|:---:|---|---|
| **Next.js 16 (App Router + Turbopack)** | <img src="https://img.shields.io/badge/Next.js_16-000000?style=flat&logo=next.js" height="20" /> | Delivers sub-second Turbopack compilation, streaming Server Components for skeleton hydration, and native App Router edge API routes with zero server overhead. | **Create React App / Vite SPA**: Rejected due to lack of native server-side API proxying, poor SEO metadata handling, and inability to securely hide upstream API keys. |
| **TypeScript (Strict Mode)** | <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript" height="20" /> | Enforces compile-time type safety across deeply nested GitHub API response schemas via Zod, eliminating null-pointer and undefined runtime exceptions. | **Vanilla JavaScript**: Rejected due to fragility when parsing heterogeneous GitHub REST API payloads. |
| **Tailwind CSS v4 + HSL Tokens** | <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38BDF8?style=flat&logo=tailwindcss" height="20" /> | Delivers zero-runtime-overhead styling, seamless matte dark and high-contrast light mode transitions via CSS variables, and fluid layout responsiveness. | **CSS-in-JS (Styled Components / Emotion)**: Rejected due to runtime serialization penalties, bundle bloat, and hydration mismatches in React Server Components. |
| **Recharts & Responsive SVG** | <img src="https://img.shields.io/badge/Recharts-22C55E?style=flat&logo=d3.js" height="20" /> | Composable declarative SVG charting with buttery-smooth hover tooltips that scale smoothly from mobile screens to 4K displays without canvas blurring. | **Chart.js**: Rejected because canvas-based rendering causes blurry text on retina displays and lacks accessibility DOM inspection. |
| **Native `node:sqlite`** | <img src="https://img.shields.io/badge/SQLite_node-003B57?style=flat&logo=sqlite" height="20" /> | Built-in standard library in Node 22+ providing zero-dependency disk persistence for search history, with automated fallback to `/tmp` in serverless Vercel environments. | **PostgreSQL / Redis**: Rejected to eliminate cloud database provision latency, external connection pool exhaustion, and network hop overhead for simple FIFO queries. |
| **Groq Cloud API (Llama 3.3 70B)** | <img src="https://img.shields.io/badge/Groq_Cloud-F59E0B?style=flat&logo=fastapi" height="20" /> | Delivers LPUs with ultra-low latency inference (~300 tokens/sec), ensuring technical repository briefs and Arjuna Sarthi advice stream near-instantly without blocking the UI. | **Standard OpenAI GPT-4**: Rejected due to 4-8 second time-to-first-token latency, which ruins interactive dashboard fluidity. |
| **Vitest** | <img src="https://img.shields.io/badge/Vitest-FCC72B?style=flat&logo=vitest" height="20" /> | Native ESM test runner sharing Vite/Turbopack transform pipelines; executes all 27 unit tests in <900ms with zero test-runner overhead. | **Jest**: Rejected due to slow CommonJS transpilation, Babel dependency baggage, and sluggish startup times. |
| **Docker (Multi-Stage Alpine)** | <img src="https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker" height="20" /> | Multi-stage image build shrinks container image to ~120MB, runs as non-root user `nextjs`, and eliminates host dependency discrepancies. | **Single-stage Docker**: Rejected because shipping `node_modules` and build tooling inflates image size to >1.1GB, slowing down CI/CD deployments. |
| **Jenkins Declarative Pipeline** | <img src="https://img.shields.io/badge/Jenkins-D24939?style=flat&logo=jenkins" height="20" /> | Standard enterprise CI/CD orchestration automating test execution, container image builds, AWS ECR tagging, and zero-downtime Kubernetes deployments. | **Manual Shell Scripts**: Rejected due to lack of stage traceability, audit logs, and automated rollback capabilities. |
| **Kubernetes (AWS EKS & EC2)** | <img src="https://img.shields.io/badge/Kubernetes_AWS_EKS-326CE5?style=flat&logo=kubernetes" height="20" /> | Provides feature-segregated ReplicaSets for Web UI, Telemetry API, and AI Assistant, paired with Horizontal Pod Autoscalers (HPA) for fault isolation. | **Single Monolithic Pod**: Rejected because a spike in heavy AI inference or upstream GitHub polling would degrade web UI responsiveness. |

---

## 🚀 CI/CD Pipeline & GitHub Webhook Trigger Flow

The following sequence diagram illustrates the automated continuous integration and continuous deployment (CI/CD) lifecycle triggered by GitHub commits, executing on an AWS EC2 Jenkins node, containerizing via Docker, and rolling out across Amazon EKS feature ReplicaSets:

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Developers (Darshan, Swamini, Janhavi)
    participant GH as GitHub Repository (Darshan1814/Arjuna_1)
    participant Webhook as GitHub Webhook
    participant Jenkins as Jenkins CI/CD (AWS EC2 Instance)
    participant Docker as Docker Engine (Multi-Stage Alpine)
    participant ECR as AWS Elastic Container Registry (ECR)
    participant EKS as Amazon EKS Cluster (Kubernetes)
    participant Vercel as Vercel Edge Platform

    Dev->>GH: git push origin (main / features / hotfix)
    par Simultaneous Vercel Edge Deployment
        GH->>Vercel: Automatic Webhook Trigger
        Vercel->>Vercel: Turbopack Build & Edge Global Distribution
    and AWS Enterprise Cloud Pipeline
        GH->>Webhook: Webhook Push Event (JSON Payload)
        Webhook->>Jenkins: Trigger Declarative Pipeline
        Jenkins->>Jenkins: Stage 1: Validate Node 22 & Clean Workspace
        Jenkins->>Jenkins: Stage 2: Parallel ESLint & Vitest (27 Passing Tests)
        Jenkins->>Docker: Stage 3: Multi-Stage Dockerfile Compilation
        Docker->>Docker: Build Next.js Standalone Runner (120MB)
        Docker->>Jenkins: Production Image Ready (arjuna-1/gitstory:1.0.0)
        Jenkins->>ECR: Stage 4: Authenticate & Push Tagged Image
        ECR-->>Jenkins: Image Manifest Stored
        Jenkins->>EKS: Stage 5: kubectl apply -f k8s/ (Feature ReplicaSets)
        EKS->>EKS: Rolling Update across Web, API & AI Pods
        Jenkins->>EKS: Stage 6: Rollout Validation & Pod Health Verification
        EKS-->>Jenkins: Deployment Healthy (0 Downtime)
    end
```

---

## ☸️ Enterprise AWS Multi-ReplicaSet Kubernetes Architecture

To ensure resilient high-availability, zero-downtime rolling updates, and micro-service fault isolation, GitStory runs on an **Amazon EKS cluster hosted on AWS EC2 worker instances**, segregating the application into **three distinct feature ReplicaSets**:

```mermaid
flowchart TD
    subgraph Users ["End Users & Developers"]
        Client["Web Browsers & Mobile Clients"]
    end

    subgraph AWS_Cloud ["Amazon Web Services (AWS Infrastructure)"]
        R53["Amazon Route 53 (DNS Management)"]
        
        subgraph Networking ["AWS VPC & Networking"]
            ALB["AWS Application Load Balancer (ALB Ingress Controller)\nPath-based Routing Engine"]
        end

        subgraph EC2_Compute ["Amazon EC2 Worker Node Cluster (Auto Scaling Group)"]
            subgraph K8S_Cluster ["Amazon EKS Cluster (Namespace: gitstory-prod)"]
                
                subgraph RS_Web ["Feature ReplicaSet 1: Web UI Dashboard"]
                    PodW1["Pod: gitstory-web-1\n(Port 3000)"]
                    PodW2["Pod: gitstory-web-2\n(Port 3000)"]
                    PodW3["Pod: gitstory-web-3\n(Port 3000)"]
                end
                
                subgraph RS_API ["Feature ReplicaSet 2: Git Telemetry Engine"]
                    PodA1["Pod: gitstory-api-1\n(Port 3000)"]
                    PodA2["Pod: gitstory-api-2\n(Port 3000)"]
                    PodA3["Pod: gitstory-api-3\n(Port 3000)"]
                end

                subgraph RS_AI ["Feature ReplicaSet 3: Arjuna Sarthi AI Agent"]
                    PodAI1["Pod: gitstory-ai-1\n(Port 3000)"]
                    PodAI2["Pod: gitstory-ai-2\n(Port 3000)"]
                end

                HPA["Horizontal Pod Autoscaler (HPA)\nTarget: 70-80% CPU Utilization"]
                ConfigMap["ConfigMap: gitstory-config\n(NODE_ENV, PORT, SQLITE_PATH)"]
                Secrets["Secret: gitstory-secrets\n(GITHUB_TOKEN, GROQ_API_KEY)"]
            end
        end

        subgraph DevOps_EC2 ["Dedicated AWS EC2 Instance"]
            JenkinsServer["Jenkins CI/CD Server\n(Automated Pipeline Orchestrator)"]
            DockerEngine["Docker Engine\n(Container Builder & Daemon)"]
        end

        subgraph Container_Registry ["AWS Container Services"]
            ECR["AWS Elastic Container Registry (ECR)\narjuna-1/gitstory:1.0.0"]
        end
    end

    subgraph External_APIs ["Upstream Cloud Providers"]
        GH_API["GitHub REST API v3\n(Authenticated / Cached)"]
        Groq_API["Groq Cloud LPU Inference\n(Llama 3.3 70B Versatile)"]
        Vercel_Edge["Vercel Global Edge Network\n(Public Live Deployment)"]
    end

    Client -->|HTTPS / DNS| R53
    R53 --> ALB
    Client -.->|Public Edge Route| Vercel_Edge

    ALB -->|Route: / | RS_Web
    ALB -->|Route: /api/repo, /api/activity, /api/commits| RS_API
    ALB -->|Route: /api/assistant, /api/summary, /api/readme| RS_AI

    HPA -.-> RS_Web
    HPA -.-> RS_API
    HPA -.-> RS_AI

    ConfigMap -.-> RS_Web & RS_API & RS_AI
    Secrets -.-> RS_Web & RS_API & RS_AI

    JenkinsServer --> DockerEngine
    DockerEngine -->|Push Image Tag| ECR
    ECR -->|Pull Verified Image| K8S_Cluster

    RS_API --> GH_API
    RS_AI --> GH_API & Groq_API
```

### ReplicaSet Feature Isolation Breakdown

| Feature ReplicaSet | Kubernetes Manifest | Desired Pods | Resource Allocation | Functional Responsibility |
|---|---|:---:|---|---|
| **Web UI Dashboard** | [`k8s/replicaset-web.yaml`](k8s/replicaset-web.yaml) | **3 Pods** | 250m CPU / 256Mi RAM | Server-side rendering (SSR), dynamic HTML streaming, and responsive Recharts rendering |
| **Telemetry & Aggregation API** | [`k8s/replicaset-api-telemetry.yaml`](k8s/replicaset-api-telemetry.yaml) | **3 Pods** | 300m CPU / 384Mi RAM | Upstream GitHub REST API batching, commit churn sampling, and SQLite search cache |
| **Arjuna Sarthi AI Assistant** | [`k8s/replicaset-ai-assistant.yaml`](k8s/replicaset-ai-assistant.yaml) | **2 Pods** | 250m CPU / 256Mi RAM | Conversational topic recommendation, natural language search sanitization, and README executive briefs |

---

## 🏛️ Application Architecture & Data Flow

```mermaid
flowchart TD
    subgraph Client ["Client Layer (Next.js 16 + React)"]
        UI["GitStory Dashboard UI"]
        Theme["Theme Engine (Matte Dark / Light)"]
        AS["Arjuna Sarthi (AI Repo Finder FAB)"]
        RM["README Explorer & AI Tabs"]
    end

    subgraph Server ["Server & API Layer (Next.js App Router)"]
        R_Repo["/api/repo (Metadata & Languages)"]
        R_Act["/api/activity (52-Wk Commits & Contributors)"]
        R_Com["/api/commits (Recent Commits & Hot Files)"]
        R_Sum["/api/summary (AI Technical Narrative)"]
        R_Readme["/api/readme & /api/readme/summary"]
        R_Asst["/api/assistant (GitHub Topic Search + AI)"]
        R_Hist["/api/history (SQLite FIFO Cache)"]
    end

    subgraph Storage ["Persistent Storage Layer"]
        DB[("node:sqlite FIFO Cache\n(/tmp on Vercel | .data on EKS)")]
    end

    subgraph External ["Upstream Cloud Services"]
        GH["GitHub REST API v3\n(Authenticated / Cached)"]
        Groq["Groq Cloud AI Engine\n(Llama 3.3 70B Versatile)"]
    end

    UI --> R_Repo & R_Act & R_Com & R_Hist
    AS --> R_Asst
    RM --> R_Readme
    UI --> R_Sum

    R_Repo --> GH
    R_Act --> GH
    R_Com --> GH
    R_Readme --> GH & Groq
    R_Asst --> GH & Groq
    R_Sum --> Groq
    R_Hist --> DB
```

---

## ✨ Core Feature Walkthrough

### 1. Unified Telemetry Header
- **Repository Metadata**: Real-time stats for **Stars**, **Forks**, **Watchers**, **Open Issues**, **Default Branch**, **License**, **Creation Date**, and **Pushed Date**.
- **Interactive Badges**: Clickable pills direct users directly to GitHub commit logs, issues, stargazers, and forks.

### 2. 52-Week Commit Activity Timeline
- Full 1-year weekly commit velocity rendered with Recharts.
- Peak velocity detection with formatted tooltips.
- Automated fallback handling GitHub 202 ("crunching data") states via `/stats/participation`.

### 3. Codebase Architecture & Donut Breakdown
- Donut chart with color palette mapping 25+ major programming languages.
- Interactive hover cards displaying byte counts and exact percentage shares.
- Segmented distribution bar displaying code density at a glance.

### 4. Ranked Contributor Dynamics
- Ranked maintainer leaderboard with commit contributions.
- Proportional progress bars displaying commit dominance.
- Addition (`+`) and deletion (`-`) diff volume telemetry.

### 5. Frequently Changed Files (Hot Files)
- Samples recent commit batches to identify active architectural hotspots.
- Ranks files by churn frequency to highlight active development zones.
- Height-bounded scroll container prevents layout clipping.

### 6. In-App README Explorer & AI Executive Brief
- In-app markdown previewer that decodes and displays the repository's `README.md`.
- **1-Click AI Summarizer**: Converts lengthy documentations into 4 clear executive categories:
  1. *What It Is & Core Value*
  2. *Key Capabilities*
  3. *Quickstart & Setup*
  4. *Architecture & Best Practices*

### 7. Arjuna Sarthi (AI Repo Finder)
- Accessible via a circular Floating Action Button (FAB) on the bottom-right corner.
- Accepts natural language queries (e.g. *"Show me high performance Rust CLIs"*, *"Fintech payment gateways"*).
- Synthesizes clean plain text advice and provides 1-click **Explore** buttons to load recommended repositories directly into GitStory.

---

## 📁 Repository Directory Structure

```text
Arjuna_1/
├── app/
│   ├── api/
│   │   ├── activity/route.ts        # 52-week commit activity & contributors
│   │   ├── assistant/route.ts       # Arjuna Sarthi AI recommendations & search
│   │   ├── commits/route.ts         # Recent commits & hot files analysis
│   │   ├── history/route.ts         # Persistent SQLite search history (max 5)
│   │   ├── readme/route.ts          # README fetch & base64 decode
│   │   ├── readme/summary/route.ts  # README 4-pillar AI executive brief
│   │   ├── repo/route.ts            # Repository metadata & language bytes
│   │   └── summary/route.ts         # Technical narrative AI synthesis
│   ├── globals.css                  # Design system tokens & animations
│   ├── icon.svg                     # High-definition SVG application icon
│   ├── layout.tsx                   # Metadata, Geist fonts, Theme Provider
│   └── page.tsx                     # Main GitStory dashboard container
├── components/
│   ├── AiSummary.tsx                # Technical narrative AI card
│   ├── ArjunaSarthi.tsx             # Floating circular repo finder assistant
│   ├── CommitActivity.tsx           # 52-week commit bar timeline
│   ├── ContributorsList.tsx         # Contributor leaderboard & diff bars
│   ├── HotFiles.tsx                 # Frequently changed files card
│   ├── LanguageBreakdown.tsx        # Donut chart & segmented bar
│   ├── PanelState.tsx               # Skeleton loading, error & empty states
│   ├── ReadmeViewer.tsx             # Collapsible README & executive brief
│   ├── RecentCommits.tsx            # Filterable commit history feed
│   ├── RepoHeader.tsx               # Repository header & telemetry pills
│   ├── SearchBar.tsx                # Hero search & recent history chips
│   └── ThemeToggle.tsx              # Matte Dark / Light mode switcher
├── k8s/
│   ├── configmap.yaml               # Cluster environment variables
│   ├── secrets.yaml                 # Upstream token secret template
│   ├── replicaset-web.yaml          # Web UI feature ReplicaSet (3 replicas)
│   ├── replicaset-api-telemetry.yaml# Telemetry API feature ReplicaSet (3 replicas)
│   ├── replicaset-ai-assistant.yaml # AI Assistant feature ReplicaSet (2 replicas)
│   ├── services.yaml                # Internal ClusterIP services
│   ├── ingress.yaml                 # AWS ALB Ingress controller routing
│   └── hpa.yaml                     # Horizontal Pod Autoscaling policies
├── lib/
│   ├── aggregate.ts                 # Commit & hot file aggregation algorithms
│   ├── constants.ts                 # Endpoints & default constants
│   ├── db.ts                        # SQLite database helper (Vercel /tmp safe)
│   ├── format.ts                    # Compact numbers, relative time, bytes
│   ├── github.ts                    # GitHub REST client & token header injector
│   ├── parse-repo.ts                # Robust repo input & URL parser
│   └── schemas.ts                   # Zod TypeScript schema definitions
├── public/
│   └── gitstory-icon.svg            # Official GitStory SVG brand logo
├── __tests__/
│   ├── aggregate.test.ts            # Commit aggregation unit tests
│   ├── format.test.ts               # Number & time formatting unit tests
│   └── parse-repo.test.ts           # GitHub URL parsing unit tests
├── Dockerfile                       # Multi-stage production container build
├── .dockerignore                    # Build context exclusions
├── Jenkinsfile                      # Declarative CI/CD pipeline for AWS EKS
├── package.json
├── tsconfig.json
├── vercel.json                      # Vercel deployment build configuration
└── vitest.config.ts                 # Vitest test runner configuration
```

---

## 🚀 Local Setup & Installation Guide

### Prerequisites
- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **npm**: `v10.x` or higher

### 1. Clone the Repository
```bash
git clone https://github.com/Darshan1814/Arjuna_1.git
cd Arjuna_1
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
# Optional: GitHub Personal Access Token (Increases rate limit from 60 to 5,000 req/hr)
GITHUB_TOKEN=ghp_yourPersonalAccessTokenHere

# Optional: Groq Cloud API Key (Enables AI Technical Summary, README briefs, and Arjuna Sarthi)
GROQ_API_KEY=gsk_yourGroqApiKeyHere
```

> **Note**: Both keys are optional. If no keys are provided, GitStory gracefully degrades: core GitHub visual timelines, donut charts, and contributor metrics remain fully operational within public rate limits, and informative setup banners are displayed for AI features.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Verification & Test Suite

GitStory includes a comprehensive Vitest unit test suite validating core parsing, aggregation, and formatting utilities:

```bash
# Run all unit tests
npx vitest run

# Run linter
npm run lint

# Validate production build
npm run build
```

### Test Coverage Summary (27 Passing Tests):
- `__tests__/parse-repo.test.ts` (7 tests): Validates `owner/repo`, `https://github.com/owner/repo`, trailing `.git`, branch subpaths, and malformed input handling.
- `__tests__/format.test.ts` (13 tests): Validates compact number formatting (`101.1k`, `3.0M`), byte conversions (`MB`, `KB`), and relative human time calculations.
- `__tests__/aggregate.test.ts` (7 tests): Validates commit file change sampling, addition/deletion totals, and sorting algorithms.

---

## 🌿 Git Branching Strategy & Workflow

GitStory strictly followed a feature-branch and trunk-based integration workflow across all 3 team members:

```text
  main        ●───●───●───────●───────●───────●───●───● [Official Vercel & AWS Production Release]
                   \         /       /       /       /
  hotfix            \       /       /       ●───●───● [DevOps Hardening & Final Submission Polish]
                     \     /       /
  testing             \   /       ●───────● [Vitest Suites & Edge Cases]
                       \ /
  integration           ●───────● [App Router API Wiring & SQLite Cache]
                       /
  features    ●───●───● [Core UI, Recharts Timelines, AI Summaries]
```

- `main`: Production-ready release branch deployed to Vercel and AWS EKS.
- `features`: Feature branch where GitHub API clients, visualization components, README viewer, and Arjuna Sarthi assistant were developed.
- `integration`: Branch dedicated to wiring API routes, implementing SQLite persistence with serverless fallbacks, and orchestrating theme toggles.
- `testing`: Dedicated branch for building unit test suites with Vitest, validating edge cases, and verifying production builds.
- `hotfix`: Branch for rapid resolution of CSS overflow constraints, buzzword elimination, DevOps manifests, and final submission metadata.

---

## 🏆 ACM Buildathon Compliance Checklist

- [x] **Repository Submission**: Clean, organized repository with collaborative commits across branches.
- [x] **Comprehensive README**: Includes Team Name (`Arjuna_1`), Team Members, Project Overview, Tech Stack Justification (5% weightage), Live Deployment URL, and Demo Video Walkthrough.
- [x] **Production Deployment**: Verified live public deployment on Vercel with zero serverless database lockups.
- [x] **Enterprise DevOps**: Multi-stage Docker containerization, Jenkins declarative pipeline, and AWS EKS Kubernetes manifests with feature-segregated ReplicaSets.
- [x] **Functional Completeness**: Real-time GitHub telemetry, commit timeline, language breakdown, contributor leaderboard, hot files, README viewer, and Arjuna Sarthi assistant.
- [x] **Code Quality**: Zero ESLint errors, zero TypeScript warnings, 100% passing Vitest test suite (`27 / 27`).
- [x] **Security Rating**: SonarCloud Quality Gate PASSED with 0 Security Hotspots and 0 Vulnerabilities.

---

<p align="center">
  Crafted with ❤️ for the <strong>ACM Student Chapter Online Buildathon</strong> by Team <strong>Arjuna_1</strong>.
</p>
