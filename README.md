# SRM EASWARI ENGINEERING COLLEGE (AUTONOMOUS)
## Department of Computer Science & Engineering (Cyber Security)
### Full Stack Development (FSD) Project

# INTEGRATED ALUMNI-STUDENT MENTORSHIP AND JOB PORTAL

> **Presented By:** Adithyan Benoy (Register No: `310624149003`)  
> **Under the Guidance of:** Ms. Divyanjali, Technical Trainer, CSE (Cyber Security)  
> **Technology Stack:** MERN (MongoDB, Express.js, React.js, Node.js) with Socket.io Real-time WebSocket & Tailwind CSS  

---

## 🏛️ Project Abstract & Overview

The **Integrated Alumni-Student Mentorship and Job Portal** is a centralized, LinkedIn-inspired professional networking and career development platform built specifically for the academic and professional ecosystem of **SRM Easwari Engineering College**.

While existing platforms such as LinkedIn, commercial job boards, and college email lists exist in silos, students often struggle to identify suitable alumni mentors, acquire verified career guidance, and uncover exclusive internal company referral opportunities. This platform centralizes everything in one ecosystem:

1. **Student Module**: Academic & career profiles (CSE Cyber Security, AI/ML, IT, ECE), alumni discovery, 1-on-1 mentorship scheduling, job applications tracking, and discussion feed.
2. **Alumni Module**: Verification badges, portfolio and company highlights, mentorship session management, job posting, and applicant tracking.
3. **Mentorship Module**: Dedicated mentorship workflows with topic selection, meeting links, integrated direct chat, and 5-star rating/feedback.
4. **Job & Internship Portal**: Curated job listings posted by verified alumni at companies like Palo Alto Networks, Google, Zoho, AWS, and Cisco, featuring one-click student applications.
5. **Centralized LinkedIn-Style Social Feed**: College bulletins, tech tips, project showcases, reactions, and threaded comments.
6. **Administrative Dashboard**: Oversight for institutional coordinators, alumni identity verification queue, user management, and campus-wide bulletin broadcasting.

---

## 🚀 Quick Start & How to Run

### Prerequisites
- **Node.js** (v18+ or v20+)
- **MongoDB** (running locally on `mongodb://127.0.0.1:27017` or configured via `.env`)

### 1. Installation
To install dependencies for both the backend and frontend:
```bash
# In the root project folder:
npm run install-all
```

### 2. Database Seeding
Populate the database with realistic SRM Easwari students, alumni mentors at Google, Palo Alto Networks, Zoho, and AWS, active mentorship requests, job openings, and college bulletins:
```bash
npm run seed
```

### 3. Run the Development Servers
You can start both backend (port 5000) and frontend (port 5173) simultaneously:
```bash
npm run dev
```

Alternatively, run them in separate terminal windows:
```bash
# Terminal 1 - Backend:
npm run server

# Terminal 2 - Frontend:
npm run client
```

- **Frontend URL:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Demo Personas & Evaluation Credentials

For seamless evaluation, a **Demo Switcher** is built directly into the top navigation bar, allowing 1-click role switching between all stakeholders. You can also log in manually using the default password `Password@123`:

| Role | Name | Department / Affiliation | Email | Password |
|---|---|---|---|---|
| **Student (Presenter)** | **Adithyan Benoy** | CSE (Cyber Security), Reg: `310624149003` | `adithyan.benoy@student.srmrmp.edu.in` | `Password@123` |
| **Verified Alumni Mentor** | **Kavitha Sridhar** | Sr. Cloud Security Architect @ Palo Alto Networks | `kavitha.s@paloaltonetworks.com` | `Password@123` |
| **Faculty Guide** | **Ms. Divyanjali** | Technical Trainer, CSE (Cyber Security) | `divyanjali@easwari.srmrmp.edu.in` | `Password@123` |
| **Verified Alumnus** | **Vikram Raghavan** | Staff Software Engineer @ Google | `vikram.raghavan@google.com` | `Password@123` |
| **Verified Alumnus** | **Ananya Sundaram** | Product Security Lead @ Zoho Corporation | `ananya.sundaram@zohocorp.com` | `Password@123` |
| **Institutional Admin** | **Admin Office** | Placement & Alumni Relations Cell | `admin@easwari.srmrmp.edu.in` | `Password@123` |

---

## 🛠️ Architecture & Modules Breakdown

### 1. Student Module
- Comprehensive academic profiles including Register Number, Department, Batch, Bio, Skills, and Resume URL.
- Advanced mentor search filtered by department, company, domain (e.g. Cyber Security, AI/ML, Cloud), and experience.
- One-click mentorship request modal with topic, message, and preferred time slot.
- Real-time application tracker for jobs applied (Applied, Under Review, Shortlisted, Selected).

### 2. Alumni Module
- Profile showcasing current employer, designation, years of experience, and "Open for Mentoring" status.
- Mentorship session management: Accept, Decline, and Schedule calls with Google Meet links.
- "Post an Opportunity" form for posting internships and full-time jobs.
- Applicant Review Dashboard: view student resumes, cover notes, and update applicant statuses (Shortlist / Reject).

### 3. Mentorship Module
- Dual-tab workflow: "Explore Mentors" and "My Mentorship Sessions".
- Integrated direct communication & chat between mentor and mentee.
- Session completion tracking with 5-star student ratings and testimonials.

### 4. Job & Internship Portal
- Curated opportunities with company branding, salary/stipend tags, department eligibility, and deadlines.
- Filter by Job Type (Full-time, Internship) and Workplace (Remote, Hybrid, On-site).
- "Easy Apply" feature linking the student's academic credentials and custom pitch.

### 5. LinkedIn-Style Centralised Feed
- Share updates, career advice, job referrals, and project showcases with hashtags (#CyberSecurity, #MERNStack, #Placements2026).
- Rich reactions (Like / Celebrate) and threaded commenting.
- Pinned official college bulletins at the top of the feed.

### 6. Admin Control Center
- Platform KPI metrics: Total Students, Total Alumni, Active Mentorships, and Jobs.
- **Alumni Verification Queue**: Approve pending alumnus registrations to prevent counterfeit profiles.
- User Management: Search users, toggle account status (Active / Suspended), audit activities.
- Bulletin Broadcast Manager: Publish high-priority campus announcements across the college.

---

## 🛡️ Security & Full Stack Best Practices
- **Password Security:** Salted hashing with `bcryptjs`.
- **Stateless Authentication:** JSON Web Tokens (JWT) with authorization middleware for Role-Based Access Control (`student`, `alumni`, `admin`).
- **Real-Time Communication:** `Socket.io` WebSockets for live messaging and typing indicators.
- **Data Integrity:** Mongoose schemas with validation, relational population, and indexing.
- **Modern Responsive UI:** React 18, Vite 5, Tailwind CSS, and Lucide React icons.

---

*SRM Easwari Engineering College • Autonomous Institution • Educate and Excel*
