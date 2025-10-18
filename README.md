# 🚀 Job Board Importer - Scalable MERN Stack Application

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green)
![Redis](https://img.shields.io/badge/Redis-3.0+-red)
![License](https://img.shields.io/badge/license-MIT-blue)

A production-ready job import system with **queue-based processing**, **real-time updates**, and comprehensive **import history tracking**.

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [API Docs](#-api-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## 🎯 Overview

This is a **full-stack job board application** that automatically imports job listings from external RSS/XML feeds, processes them through a **Redis-based queue system**, and provides a beautiful admin interface to track imports and browse jobs.

### Key Highlights

✅ **Queue-Based Processing**: Background workers handle imports using Bull + Redis  
✅ **Real-time Updates**: Socket.IO provides live progress tracking  
✅ **Scalable Architecture**: Horizontal scaling support with multiple workers  
✅ **Import History**: Comprehensive logging with success/failure tracking  
✅ **Scheduled Imports**: Automated hourly job fetching via cron  
✅ **Modern UI**: Next.js 15 with Tailwind CSS  
✅ **Error Handling**: Retry logic with exponential backoff  

---

## ✨ Features

### Backend Features
- 🔄 **Queue Management**: Bull (Redis-backed) for reliable job processing
- 📊 **Batch Processing**: Configurable batch sizes for memory efficiency
- 🔁 **Retry Logic**: Automatic retries with exponential backoff
- 📝 **Detailed Logging**: Track every import with timestamps and statistics
- 🕐 **Cron Scheduling**: Hourly automated imports from multiple sources
- 🔌 **Real-time Updates**: Socket.IO for live import progress
- 📈 **Statistics**: Track total/new/updated/failed jobs per import
- 🛡️ **Error Tracking**: Capture and store failure reasons

### Frontend Features
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- 📱 **Mobile Responsive**: Works seamlessly on all devices
- 🔍 **Job Search**: Filter by category, type, company, and keywords
- 📊 **Import Dashboard**: Visual statistics and progress tracking
- 🔴 **Live Updates**: Real-time import progress via WebSockets
- 📑 **Pagination**: Efficient data loading for large datasets
- 🚀 **Trigger Imports**: Manual import triggering with preset URLs

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime environment |
| Express.js | 4.x | Web framework |
| MongoDB | 6.0+ | Database |
| Mongoose | 8.x | ODM for MongoDB |
| Bull | 4.x | Redis-based queue |
| Redis | 3.0+ | Queue storage |
| Socket.IO | 4.x | Real-time updates |
| Axios | 1.6+ | HTTP requests |
| xml2js | 0.6+ | XML parsing |
| node-cron | 3.x | Job scheduling |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.x | React framework |
| React | 18.x | UI library |
| Tailwind CSS | 3.x | Styling |
| Socket.IO Client | 4.x | Real-time client |
| Axios | 1.7+ | API requests |
| React Icons | 5.x | Icon library |
| date-fns | 4.x | Date formatting |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- ✅ **Node.js** v18 or higher ([Download](https://nodejs.org/))
- ✅ **MongoDB** v6.0 or higher ([Download](https://www.mongodb.com/try/download/community))
- ✅ **Redis** v3.0 or higher ([Windows Guide](https://redis.io/docs/getting-started/installation/install-redis-on-windows/))
- ✅ **Git** ([Download](https://git-scm.com/downloads))

### Optional (Recommended)
- 🐳 **Docker Desktop** - For containerized Redis ([Download](https://www.docker.com/products/docker-desktop/))
- 📝 **VS Code** - Recommended IDE ([Download](https://code.visualstudio.com/))

### Verify Installations
node --version # Should be v18+
npm --version # Should be 9+
mongod --version # Should be v6.0+
redis-cli --version # Should be v3.0+

## 🚀 Installation

### Step 1: Clone the Repository

git clone https://github.com/your-username/job-board-importer.git
cd job-board-importer


### Step 2: Install Backend Dependencies

cd server <br/>
npm install <br/>

**Expected packages:**
- express, mongoose, bull, ioredis
- axios, xml2js, socket.io
- dotenv, node-cron, cors

### Step 3: Install Frontend Dependencies
cd ../client <br/>
npm install <br/>

### env.local FOR Frontend
- NEXT_PUBLIC_API_URL=http://localhost:8889

### env for Backend
- NODE_ENV=development
- PORT=your_port_number
- MONGO_URI=your_mongodb-uri
- REDIS_HOST=your_redis_host
- REDIS_PORT=your_redis_port
- WORKER_CONCURRENCY=enter_number_of_concurrency_eg.10
- BATCH_SIZE=enter_number_of_batchSize_eg.50
- FRONTEND_URL=enter_your_frontend_url
- JOB_SOURCES=https://jobicy.com/?feed=job_feed,https://jobicy.com/?feed=job_feed&job_categories=dev,https://jobicy.com/?feed=job_feed&job_categories=data-science,https://jobicy.com/?feed=job_feed&job_categories=design-multimedia,https://jobicy.com/?feed=job_feed&job_categories=marketing



**Expected packages:**
- next, react, react-dom
- tailwindcss, postcss, autoprefixer
- socket.io-client, axios, react-icons

### Step 4: Setup MongoDB

**Option A: Local Installation**
- Start MongoDB service
- Install Redis

### Access the Application

- **Frontend**: http://localhost:3000
- **Import History**: http://localhost:3000/imports
- **Trigger Import**: http://localhost:3000/imports/trigger
- **Jobs Listing**: http://localhost:3000/jobs
- **Backend API**: http://localhost:8889/health

---

## 📁 Project Structure

job-board-importer/<br/>
# Backend Structure <br/>
├── server/ <br/>
│ ├── src/ <br/>
│ │ ├── config/ # Configuration files <br/>
│ │ │ ├── database.js # MongoDB connection <br/>
│ │ │ ├── redis.js # Redis connection <br/>
│ │ │ ├── queue.js # Bull queue setup <br/>
│ │ │ └── socket.js # Socket.IO setup <br/>
│ │ │
│ │ ├── models/ # Mongoose schemas <br/>
│ │ │ ├── Job.js # Job model <br/>
│ │ │ └── ImportLog.js # Import log model <br/>
│ │ │
│ │ ├── controllers/ # Route controllers <br/>
│ │ │ ├── importController.js <br/>
│ │ │ └── jobController.js <br/>
│ │ │
│ │ ├── routes/ # Express routes <br/>
│ │ │ ├── importRoutes.js <br/>
│ │ │ └── jobRoutes.js <br/>
│ │ │
│ │ ├── workers/ # Queue workers <br/>
│ │ │ └── jobImportWorker.js <br/>
│ │ │
│ │ ├── utils/ # Utility functions <br/>
│ │ │ ├── xmlParser.js # XML to JSON parser <br/>
│ │ │ └── logger.js # Logging utility <br/>
│ │ │
│ │ ├── cron/ # Scheduled tasks <br/>
│ │ │ └── scheduledImport.js <br/>
│ │ │
│ │ ├── app.js # Express app <br/>
│ │ └── server.js # Server entry <br/>
│ │
│ ├── .env # Environment variables <br/>
│ └── package.json <br/>
│<br/>
# Frontend Structure <br/>
├── client/ <br/>
│ ├── src/ <br/>
│ │ ├── app/ # Next.js App Router  <br/>
│ │ │ ├── page.js # Home page <br/>
│ │ │ ├── imports/ # Import pages <br/>
│ │ │ │ ├── page.js # Import history <br/>
│ │ │ │ └── trigger/ <br/>
│ │ │ │ └── page.js # Trigger import  <br/>
│ │ │ └── jobs/ <br/>
│ │ │ └── page.js # Jobs listing  <br/>
│ │ │
│ │ ├── components/ # React components <br/>
│ │ │ ├── Navbar.js <br/>
│ │ │ ├── ImportTable.js <br/>
│ │ │ ├── JobCard.js <br/>
│ │ │ └── Pagination.js <br/>
│ │ │
│ │ ├── services/ # API services <br/>
│ │ │ └── api.js <br/>
│ │ │
│ │ └── hooks/ # Custom hooks  <br/>
│ │ └── useSocket.js <br/>
│ │
│ ├── .env <br/>
│ └── package.json <br/>
│
├── docs/ # Documentation <br/>
│ ├── architecture.md <br/>
│ └── api-documentation.md <br/>
│
└── README.md # This file <br/>

**Solution:**
- Verify API URL is accessible
- Check category name is valid (use `dev` not `it-tech`)
- Test with: `curl https://jobicy.com/?feed=job_feed`

---

## 📚 Documentation

- **[API Documentation](docs/📚 API Documentation - Job Board Importer.pdf)** - Complete API reference
- **[Architecture Guide](docs/📚 API Documentation - Job Board Importer.pdf)** - System design and decisions

---

## 🎯 Key Features Demo

### 1. Import History Tracking
- View all import operations in paginated table
- Real-time status updates (Processing → Completed)
- Detailed statistics (Total/New/Updated/Failed)
- Filter by status and search

### 2. Trigger Manual Import
- Select preset URLs or enter custom
- Immediate queue confirmation
- Live progress tracking

### 3. Real-time Progress
- Socket.IO powered updates
- Progress bar animation
- No page refresh needed

### 4. Jobs Listing
- Browse all imported jobs
- Search by keywords
- Filter by category and type
- Paginated results

---


---

## 👥 Author

**Afzal Vepari**
- GitHub: [@afzalveparii](https://github.com/afzalveparii)
- Email: afzal.vepariii@gmail.com
- LinkedIn: [afzalveparii](https://linkedin.com/in/afzalveparii)

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **Bull** - For reliable queue processing
- **Next.js** - For amazing React framework
- **MongoDB** - For flexible database
- **Socket.IO** - For real-time capabilities
- **Jobicy API** - For providing job data

---

## 📞 Support

For issues or questions:
- Create an issue on GitHub

---

**Built with ❤️ for Artha Job Board Assignment**

