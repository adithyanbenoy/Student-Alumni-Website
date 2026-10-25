# STUDENT ALUMNI PORTAL
## Centralized Professional Mentorship & Job Referral Platform

A full-stack, LinkedIn-inspired professional networking and career development system built on the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) with real-time **Socket.io WebSockets** and **Tailwind CSS**.

---

## 🏛️ Platform Overview

The **Student Alumni Portal** bridges the gap between current students, experienced alumni professionals, and hiring recruiters in a single unified ecosystem:

1. **Student Module**: Academic & career profiles, discovery of alumni across top tech companies, 1-on-1 mentorship scheduling, job application tracking, and professional discussions.
2. **Alumni Module**: Verified identity badges, portfolio and company highlights, mentorship session management with meeting links, job posting, and applicant tracking.
3. **Mentorship Module**: Dedicated mentorship workflows with topic selection, meeting links, integrated direct chat, and 5-star rating/feedback.
4. **Job & Internship Board**: Curated openings posted by alumni working at companies like Palo Alto Networks, Google, Zoho, AWS, and Cisco, featuring one-click student applications.
5. **Centralized LinkedIn-Style Social Feed**: Professional advice, tech tips, project showcases, reactions, and threaded comments.
6. **Administrative Dashboard**: Platform metrics, alumni identity verification queue, user management, and broadcast announcements.

---

## 🚀 Quick Start

### 1. Installation
Install dependencies for both backend and frontend:
```bash
npm run install-all
```

### 2. Database Seeding
Populate the database with realistic students, verified alumni mentors at Google, Palo Alto Networks, Zoho, and AWS, active mentorship requests, job openings, and announcements:
```bash
npm run seed
```

### 3. Run the Development Servers
```bash
npm run dev
```
*(Or double-click `run-portal.bat` in the project root)*

* **Frontend:** [http://localhost:5173](http://localhost:5173)
* **Backend API:** [http://localhost:5000](http://localhost:5000)
* **Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Login Accounts (Pre-seeded Data)

All accounts use the default password: **`Password@123`**

| Role | Name | Current Position / Affiliation | Email |
|---|---|---|---|
| **Student** | **Marcus Chen** | Computer Science (Senior) | `marcus.chen@student.alumniportal.edu` |
| **Verified Alumni** | **Rachel Adams** | Senior Cloud Security Architect @ Palo Alto Networks | `rachel.adams@paloaltonetworks.com` |
| **Verified Alumni** | **Alex Chen** | Staff Software Engineer @ Google | `alex.chen@google.com` |
| **Verified Alumni** | **Neha Patel** | Product Security Lead @ Zoho Corporation | `neha.patel@zohocorp.com` |
| **Verified Alumni** | **James Wilson** | Senior SDE II (AWS) @ Amazon | `james.wilson@amazon.com` |
| **Mentor & Faculty** | **Dr. Priya Sharma** | Distinguished Career Mentor & Lead Advisor | `priya.sharma@alumniportal.edu` |
| **Administrator** | **Portal Administrator** | Director of Alumni Relations | `admin@alumniportal.edu` |

---

## 🛠️ Architecture & Modules

### 1. Student Module
* Comprehensive academic profile with ID number, department, graduation batch, bio, skills, and resume URL.
* Search alumni mentors filtered by department, company, domain, and experience.
* Submit 1-on-1 mentorship requests with discussion topics and preferred schedules.
* Track submitted job applications (*Applied*, *Under Review*, *Shortlisted*, *Accepted*).

### 2. Alumni Module
* Verified profile highlighting company, designation, experience, and mentorship availability.
* Mentorship management: review student requests, Accept/Decline, and attach Google Meet links.
* Post internship and full-time job openings.
* Review student applicants, inspect resumes, and update application statuses (*Shortlist*, *Decline*).

### 3. Mentorship Hub
* Dual-tab workflow: *"Explore Mentors"* and *"My Mentorship Sessions"*.
* Direct chat and meeting links for active sessions.
* Session completion tracking with 5-star ratings and feedback.

### 4. Jobs & Internships
* Search and filter by Job Type (*Full-time*, *Internship*) and Workplace (*Remote*, *Hybrid*, *On-site*).
* "Easy Apply" feature linking the student's profile, resume, and cover pitch.

### 5. Social Feed
* LinkedIn-style professional feed supporting categories like `Career Advice`, `Job Referral`, `Internship Opportunity`, and `Project Showcase`.
* Hashtag indexing (`#CyberSecurity`, `#MERNStack`), rich reactions, and comments.

### 6. Admin Control Center
* Platform KPI metrics: total students, total alumni, active mentorships, and jobs.
* **Alumni Verification Queue**: Approve pending alumnus registrations to prevent counterfeit profiles.
* User management: search, toggle active/suspended status.
* Official bulletin broadcast manager.

---

## 🛡️ Security & Best Practices
* **Password Security:** Salted hashing with `bcryptjs`.
* **Stateless Authentication:** JSON Web Tokens (JWT) with Role-Based Access Control (`student`, `alumni`, `admin`).
* **Real-Time Communication:** `Socket.io` WebSockets for live messaging and typing indicators.
* **Database Design:** Mongoose schemas with validation, relational population, and indexing.
* **Responsive UI:** React 18, Vite 5, Tailwind CSS, and Lucide React icons.
