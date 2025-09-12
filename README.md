```markdown
# 📁 Digital Asset Management (DAM) Platform

A simple and scalable platform to upload, process, manage, and preview digital assets like images and videos. Built with modern technologies like Node.js, React, Redis, MinIO, BullMQ, and Docker.

---

## 🚀 Features

- Upload and store files (images/videos)
- Background processing (thumbnails, video transcoding, metadata)
- Preview and download assets
- Admin dashboard with filters and stats
- Scalable with Docker Swarm

---

## 🛠 Tech Stack

- **Frontend**: React + Tailwind CSS
- **Backend API**: Node.js + Express
- **Queue**: Redis + BullMQ
- **Workers**: FFmpeg (videos), Sharp (images)
- **Storage**: MinIO (S3-compatible)
- **Deployment**: Docker + Docker Swarm
- **Database**: MongoDB

---

## 📦 Folder Structure

```

dam-platform/
├── apps/
│   ├── frontend/     # React UI
│   ├── api/          # Node.js API server
│   └── worker/       # BullMQ processing workers
├── services/
│   └── bull-board/   # BullMQ dashboard (optional)
├── shared/           # Shared configs (Redis, MinIO, etc.)
├── docker/           # Docker and deployment configs
└── README.md

````

---

## 🧑‍💻 Getting Started (Development)

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/dam-platform.git
cd dam-platform
````

### 2. Start with Docker Compose (for local dev)

```bash
cd docker
docker-compose up --build
```

This will start:

* API server
* Worker service
* Frontend app
* Redis
* MinIO
* BullMQ dashboard

---

## 🔗 Default URLs (Local)

| Service          | URL                                            |
| ---------------- | ---------------------------------------------- |
| Frontend App     | [http://localhost:3000](http://localhost:3000) |
| API Server       | [http://localhost:4000](http://localhost:4000) |
| MinIO Console    | [http://localhost:9001](http://localhost:9001) |
| BullMQ Dashboard | [http://localhost:5000](http://localhost:5000) |
---
