import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Job from '../models/Job.js';
import MentorshipRequest from '../models/MentorshipRequest.js';
import Message from '../models/Message.js';
import Announcement from '../models/Announcement.js';
import Event from '../models/Event.js';
import Notification from '../models/Notification.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/easwari_alumni_portal';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Connected to MongoDB...');

    // Clear existing collections
    await User.deleteMany();
    await Post.deleteMany();
    await Job.deleteMany();
    await MentorshipRequest.deleteMany();
    await Message.deleteMany();
    await Announcement.deleteMany();
    await Event.deleteMany();
    await Notification.deleteMany();

    console.log('[Seed] Cleared existing database records.');

    // Common password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Password@123', salt);

    // 1. Create Users
    console.log('[Seed] Creating SRM Easwari Users...');
    const usersData = [
      {
        name: 'SRM Easwari Admin Office',
        email: 'admin@easwari.srmrmp.edu.in',
        password: hashedPassword,
        role: 'admin',
        department: 'CSE (Cyber Security)',
        batchYear: 2015,
        designation: 'Portal Administrator',
        company: 'SRM Easwari Engineering College',
        bio: 'Official administration portal for SRM Easwari Engineering College alumni-student network and placement cell.',
        isVerifiedAlumni: true,
        isMentorAvailable: false,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      },
      {
        name: 'Ms. Divyanjali',
        email: 'divyanjali@easwari.srmrmp.edu.in',
        password: hashedPassword,
        role: 'alumni',
        department: 'CSE (Cyber Security)',
        batchYear: 2018,
        designation: 'Technical Trainer & Security Mentor',
        company: 'SRM Easwari Engineering College',
        location: 'Chennai, India',
        bio: 'Faculty Guide & Technical Trainer for CSE (Cyber Security). Guiding students in secure software engineering, threat modeling, and career readiness.',
        skills: ['Cyber Security', 'Network Security', 'Cryptography', 'Ethical Hacking', 'Secure Coding'],
        mentorTopics: ['Cyber Security Career Paths', 'Research & Final Year Projects', 'Placement Strategy'],
        isVerifiedAlumni: true,
        isMentorAvailable: true,
        experienceYears: 6,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
      },
      {
        name: 'Adithyan Benoy',
        email: 'adithyan.benoy@student.srmrmp.edu.in',
        password: hashedPassword,
        role: 'student',
        department: 'CSE (Cyber Security)',
        batchYear: 2026,
        registerNumber: '310624149003',
        location: 'Chennai, India',
        bio: 'CSE Cyber Security Undergraduate at SRM Easwari Engineering College. Building full-stack systems, threat detection pipelines, and exploring enterprise software security.',
        skills: ['Cyber Security', 'Penetration Testing', 'MERN Stack', 'React.js', 'Node.js', 'MongoDB', 'Python'],
        linkedinUrl: 'https://linkedin.com/in/adithyan-benoy',
        githubUrl: 'https://github.com/adithyanbenoy',
        resumeUrl: 'https://example.com/resumes/adithyan_benoy.pdf',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
      },
      {
        name: 'Kavitha Sridhar',
        email: 'kavitha.s@paloaltonetworks.com',
        password: hashedPassword,
        role: 'alumni',
        department: 'CSE (Cyber Security)',
        batchYear: 2021,
        designation: 'Senior Cloud Security Architect',
        company: 'Palo Alto Networks',
        location: 'Bengaluru, India',
        bio: 'Easwari 2021 batch graduate. Helping students crack tier-1 cyber security roles, understand cloud native security, and obtain industry certifications.',
        skills: ['Cloud Security', 'Kubernetes Security', 'Prisma Cloud', 'Threat Hunting', 'SIEM/SOAR'],
        mentorTopics: ['Cyber Security Industry Roadmap', 'Certifications (CEH / CISSP / Security+)', 'Resume Review for Security Roles'],
        isVerifiedAlumni: true,
        isMentorAvailable: true,
        experienceYears: 4,
        linkedinUrl: 'https://linkedin.com/in/kavithasridhar',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
      },
      {
        name: 'Vikram Raghavan',
        email: 'vikram.raghavan@google.com',
        password: hashedPassword,
        role: 'alumni',
        department: 'CSE',
        batchYear: 2020,
        designation: 'Staff Software Engineer',
        company: 'Google',
        location: 'Bengaluru, India',
        bio: 'Alumnus from 2020 batch. Passionate about large scale distributed systems and mentoring ambitious juniors for top product company interviews.',
        skills: ['Distributed Systems', 'System Design', 'Go', 'Java', 'Algorithms', 'Microservices'],
        mentorTopics: ['Product Company Interview Preparation', 'System Design Fundamentals', 'Open Source Contribution'],
        isVerifiedAlumni: true,
        isMentorAvailable: true,
        experienceYears: 5,
        linkedinUrl: 'https://linkedin.com/in/vikramraghavan',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      },
      {
        name: 'Ananya Sundaram',
        email: 'ananya.sundaram@zohocorp.com',
        password: hashedPassword,
        role: 'alumni',
        department: 'Information Technology',
        batchYear: 2022,
        designation: 'Product Security Lead',
        company: 'Zoho Corporation',
        location: 'Chennai, India',
        bio: 'Proud Easwari alumna working at Zoho HQ. Happy to guide students on web application penetration testing, secure SDLC, and hiring trends at Zoho.',
        skills: ['Application Security', 'OWASP Top 10', 'DevSecOps', 'React', 'Java'],
        mentorTopics: ['Zoho Campus Hiring Tips', 'AppSec Hands-on Labs', 'Final Year Project Guidance'],
        isVerifiedAlumni: true,
        isMentorAvailable: true,
        experienceYears: 3,
        linkedinUrl: 'https://linkedin.com/in/ananyasundaram',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      },
      {
        name: 'Arjun Nambiar',
        email: 'arjun.n@amazon.com',
        password: hashedPassword,
        role: 'alumni',
        department: 'CSE',
        batchYear: 2019,
        designation: 'Senior SDE II (AWS)',
        company: 'Amazon Web Services',
        location: 'Hyderabad, India',
        bio: 'Cloud Architect & SDE at AWS. Happy to assist Easwari students with AWS cloud architecture, competitive coding, and placement rounds.',
        skills: ['AWS', 'Serverless', 'TypeScript', 'Node.js', 'DynamoDB', 'Docker'],
        mentorTopics: ['Amazon Leadership Principles', 'Cloud Certification Guidance', 'Full-stack Portfolio Projects'],
        isVerifiedAlumni: true,
        isMentorAvailable: true,
        experienceYears: 6,
        linkedinUrl: 'https://linkedin.com/in/arjunnambiar',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
      },
      {
        name: 'Harish Kumar',
        email: 'harish.k@cisco.com',
        password: hashedPassword,
        role: 'alumni',
        department: 'CSE (Cyber Security)',
        batchYear: 2023,
        designation: 'Security Operations Analyst',
        company: 'Cisco',
        location: 'Chennai, India',
        bio: 'Recent Easwari graduate. Working on endpoint telemetry and enterprise network defence. Enthusiastic about mentoring juniors.',
        skills: ['SOC Analysis', 'Splunk', 'Wireshark', 'Network Protocols', 'Incident Response'],
        mentorTopics: ['Starting a Career in SOC', 'Networking Fundamentals for Cyber Roles', 'Campus to Corporate Transition'],
        isVerifiedAlumni: true,
        isMentorAvailable: true,
        experienceYears: 2,
        linkedinUrl: 'https://linkedin.com/in/harishkumar',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
      },
      {
        name: 'Deepa Chandran',
        email: 'deepa.chandran@microsoft.com',
        password: hashedPassword,
        role: 'alumni',
        department: 'CSE (AI & ML)',
        batchYear: 2024,
        designation: 'Associate AI Engineer',
        company: 'Microsoft Research',
        location: 'Hyderabad, India',
        bio: 'Fresh Easwari alumna working on LLM fine-tuning and retrieval augmented generation. Profile pending admin verification check.',
        skills: ['Python', 'PyTorch', 'Generative AI', 'NLP', 'Azure AI'],
        mentorTopics: ['AI/ML Capstone Projects', 'Publishing Papers during B.Tech'],
        isVerifiedAlumni: false, // Testing admin verification workflow!
        isMentorAvailable: false,
        experienceYears: 1,
        linkedinUrl: 'https://linkedin.com/in/deepachandran',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
      },
      {
        name: 'Pooja Ramesh',
        email: 'pooja.ramesh@student.srmrmp.edu.in',
        password: hashedPassword,
        role: 'student',
        department: 'CSE (AI & ML)',
        batchYear: 2025,
        registerNumber: '310624104045',
        location: 'Chennai, India',
        bio: 'Final year student interested in Machine Learning and Computer Vision. Looking for mentorship in tier-1 product placements.',
        skills: ['Python', 'TensorFlow', 'Data Science', 'SQL'],
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
      },
      {
        name: 'Karthik Subramanian',
        email: 'karthik.sub@student.srmrmp.edu.in',
        password: hashedPassword,
        role: 'student',
        department: 'Information Technology',
        batchYear: 2026,
        registerNumber: '310624205032',
        location: 'Chennai, India',
        bio: 'Third year IT student passionate about full-stack web and mobile development.',
        skills: ['React Native', 'Node.js', 'Express', 'TailwindCSS'],
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80'
      }
    ];

    const createdUsers = await User.insertMany(usersData);
    console.log(`[Seed] Seeded ${createdUsers.length} users successfully.`);

    // Map users by email for reference
    const userMap = {};
    createdUsers.forEach((u) => {
      userMap[u.email] = u;
    });

    const admin = userMap['admin@easwari.srmrmp.edu.in'];
    const divyanjali = userMap['divyanjali@easwari.srmrmp.edu.in'];
    const adithyan = userMap['adithyan.benoy@student.srmrmp.edu.in'];
    const kavitha = userMap['kavitha.s@paloaltonetworks.com'];
    const vikram = userMap['vikram.raghavan@google.com'];
    const ananya = userMap['ananya.sundaram@zohocorp.com'];
    const arjun = userMap['arjun.n@amazon.com'];
    const harish = userMap['harish.k@cisco.com'];
    const pooja = userMap['pooja.ramesh@student.srmrmp.edu.in'];

    // 2. Announcements
    console.log('[Seed] Creating College Announcements...');
    await Announcement.insertMany([
      {
        title: 'SRM Easwari Annual Placement Conclave 2026 & Alumni Referral Portal Launched',
        content: 'We are thrilled to launch the official Integrated Alumni-Student Mentorship and Job Portal. Students can now connect directly with our esteemed alumni across global tech giants for career mentorship, mock interviews, and exclusive internal referral opportunities.',
        author: admin._id,
        priority: 'high',
        category: 'Placement'
      },
      {
        title: 'Special Guest Lecture: Industrial Cyber Security & Zero-Trust Architecture',
        content: 'The Department of CSE (Cyber Security) in association with our Alumni Cell is hosting a hands-on webinar by Ms. Kavitha Sridhar (Senior Cloud Security Architect, Palo Alto Networks). Check the Events section to RSVP!',
        author: divyanjali._id,
        priority: 'medium',
        category: 'Academic'
      }
    ]);

    // 3. Posts (LinkedIn-style Feed)
    console.log('[Seed] Creating Feed Posts...');
    await Post.insertMany([
      {
        author: kavitha._id,
        content: `Excited to reconnect with my alma mater SRM Easwari Engineering College! 🛡️

To all 3rd and final year students preparing for Cyber Security and Cloud Security placements this semester:
1. Focus deeply on networking fundamentals (TCP/IP, DNS, SSL/TLS, packet analysis with Wireshark).
2. Familiarize yourself with Cloud security baselines (IAM, VPC Peering, Zero Trust).
3. Build real projects (e.g., SIEM dashboards, packet sniffers, or vulnerable web app walkthroughs) rather than just listing certifications.

Feel free to request a 1-on-1 mentorship session with me right here on the portal. Let's make Easwari proud! 🚀`,
        category: 'Career Advice',
        tags: ['CyberSecurity', 'EaswariAlumni', 'CareerGuidance', 'CloudSecurity', 'Placements2026'],
        likes: [adithyan._id, pooja._id, admin._id],
        comments: [
          {
            user: adithyan._id,
            content: 'Thank you so much for the valuable advice, ma\'am! Really excited for the cloud security mentorship session.',
            createdAt: new Date(Date.now() - 3600000 * 4)
          },
          {
            user: divyanjali._id,
            content: 'Inspiring to see our alumni giving back to the department juniors. Great points, Kavitha!',
            createdAt: new Date(Date.now() - 3600000 * 2)
          }
        ]
      },
      {
        author: adithyan._id,
        content: `Thrilled to present our Full Stack Development project under the guidance of Ms. Divyanjali: "Integrated Alumni-Student Mentorship and Job Portal" for SRM Easwari Engineering College! 🎓💻

A single centralized platform where students can:
✅ Seamlessly discover verified alumni mentors by department, company, and domain.
✅ Schedule 1-on-1 career guidance sessions with built-in chat and video links.
✅ Browse and apply for exclusive job & internship postings with one click.
✅ Engage in a LinkedIn-like professional feed with college announcements and tech discussions.
✅ Comprehensive admin dashboard for college oversight and alumni verification.

Built on the modern MERN Stack with real-time Socket.io communication. Looking forward to feedback from faculty and fellow students! 🌟`,
        category: 'Project Showcase',
        tags: ['MERNStack', 'SRMEaswari', 'FinalProject', 'CyberSecurity', 'Innovation', 'FullStackDevelopment'],
        mediaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
        likes: [kavitha._id, vikram._id, ananya._id, divyanjali._id, admin._id],
        comments: [
          {
            user: divyanjali._id,
            content: 'Outstanding work Adithyan! The centralized integration of mentorship and jobs directly solves our campus placement and alumni networking needs.',
            createdAt: new Date(Date.now() - 3600000 * 3)
          },
          {
            user: vikram._id,
            content: 'Impressive MERN stack architecture! The clean separation of concerns and real-time chat are great additions. Kudos from Google!',
            createdAt: new Date(Date.now() - 3600000 * 1)
          }
        ]
      },
      {
        author: ananya._id,
        content: `Zoho Corporation is actively opening summer internship and full-time hiring for software development and application security roles! 💼

We love hiring from SRM Easwari because of the strong foundational grounding. I have posted 2 open roles directly in our Job Board here. If you have built solid full-stack or cybersecurity projects, apply now and send me a note for an internal recommendation!`,
        category: 'Job Referral',
        tags: ['ZohoHiring', 'Internship2026', 'EaswariPlacements', 'AppSec', 'SoftwareEngineer'],
        likes: [adithyan._id, pooja._id, arjun._id],
        comments: [
          {
            user: pooja._id,
            content: 'Applied for the SDE intern role! Thank you so much Ananya ma\'am for sharing this opportunity.',
            createdAt: new Date(Date.now() - 3600000 * 5)
          }
        ]
      },
      {
        author: vikram._id,
        content: `Quick tip for students preparing for Product Company Coding Rounds:
Don't just memorize LeetCode solutions. Interviewers care about:
1. How you clarify edge cases before typing code.
2. How cleanly you communicate your thought process and trade-offs (Time vs Space complexity).
3. Writing clean, modular, production-ready code with meaningful variable names.

Open to conducting mock technical interviews for 2-3 final year students this weekend! Send a mentorship request on the portal.`,
        category: 'Career Advice',
        tags: ['InterviewTips', 'Google', 'DataStructures', 'SoftwareEngineering', 'CampusToCorporate'],
        likes: [adithyan._id, kavitha._id, harish._id],
        comments: []
      }
    ]);

    // 4. Jobs & Internships
    console.log('[Seed] Creating Jobs and Internships...');
    await Job.insertMany([
      {
        title: 'Cyber Security Analyst Intern (Cloud & Threat Defense)',
        company: 'Palo Alto Networks',
        companyLogo: 'https://logo.clearbit.com/paloaltonetworks.com',
        location: 'Bengaluru / Remote Hybrid',
        type: 'Internship',
        workplaceType: 'Hybrid',
        departmentEligibility: ['CSE (Cyber Security)', 'CSE', 'Information Technology'],
        description: `Palo Alto Networks is looking for passionate Cyber Security Interns to join our Cloud Threat Defense unit. You will work closely with senior security architects to monitor threat telemetry, evaluate vulnerability reports, and design automated remediation playbooks.

Key Responsibilities:
• Assist in triaging security events using modern SIEM and XDR tools.
• Conduct security posture assessments across AWS and GCP environments.
• Collaborate on security automation scripts using Python and REST APIs.`,
        requirements: [
          'Pursuing B.Tech in CSE / Cyber Security / IT (3rd or 4th Year)',
          'Strong understanding of TCP/IP, OSI model, and network security protocols',
          'Proficiency with Python, Linux command-line, and Git',
          'Good analytical and problem-solving skills'
        ],
        salaryOrStipend: '₹45,000 / month + Pre-Placement Offer (PPO)',
        applyDeadline: new Date(Date.now() + 86400000 * 20),
        postedBy: kavitha._id,
        status: 'active',
        applicants: [
          {
            student: adithyan._id,
            coverNote: 'I am in 3rd year CSE Cyber Security at SRM Easwari. I have hands-on experience in penetration testing, threat modeling, and building secure full-stack applications. Would love the opportunity to contribute at Palo Alto Networks!',
            resumeUrl: 'https://example.com/resumes/adithyan_benoy.pdf',
            status: 'shortlisted',
            appliedAt: new Date(Date.now() - 86400000 * 2),
            notes: 'Strong candidate with cybersecurity specialization and impressive full-stack portal project.'
          }
        ]
      },
      {
        title: 'Associate Software Development Engineer (Full Stack)',
        company: 'Zoho Corporation',
        companyLogo: 'https://logo.clearbit.com/zoho.com',
        location: 'Chennai (Estancia Campus)',
        type: 'Full-time',
        workplaceType: 'On-site',
        departmentEligibility: ['All Departments'],
        description: `Zoho Corporation is hiring Associate Software Development Engineers to engineer high-scale SaaS products used by over 100 million users worldwide.

You will be responsible for:
• Developing responsive, performant user interfaces with modern web standards.
• Engineering fault-tolerant backend REST APIs and microservices.
• Optimizing database queries and system throughput.`,
        requirements: [
          'Graduating Batch of 2025 or 2026',
          'Hands-on expertise in JavaScript / TypeScript / React / Node.js or Java',
          'Strong problem-solving and algorithmic thinking',
          'Enthusiasm to work on deep-tech products'
        ],
        salaryOrStipend: '₹7,50,000 - ₹10,00,000 / annum',
        applyDeadline: new Date(Date.now() + 86400000 * 25),
        postedBy: ananya._id,
        status: 'active',
        applicants: [
          {
            student: pooja._id,
            coverNote: 'Interested in working on scalable SaaS products at Zoho Chennai campus.',
            resumeUrl: 'https://example.com/resumes/pooja_ramesh.pdf',
            status: 'under_review',
            appliedAt: new Date(Date.now() - 86400000 * 1)
          }
        ]
      },
      {
        title: 'Cloud Support & DevOps Associate',
        company: 'Amazon Web Services (AWS)',
        companyLogo: 'https://logo.clearbit.com/amazon.com',
        location: 'Hyderabad / Chennai',
        type: 'Full-time',
        workplaceType: 'Hybrid',
        departmentEligibility: ['CSE', 'CSE (Cyber Security)', 'Information Technology', 'ECE'],
        description: `Join AWS as a Cloud Associate. You will work with global enterprise customers to troubleshoot distributed architectures, container orchestrations, and AWS security configurations.`,
        requirements: [
          'B.Tech 2025/2026 batch with minimum 7.5 CGPA',
          'Familiarity with AWS core services (EC2, S3, IAM, Lambda, VPC)',
          'Scripting skills in Bash, Python or JavaScript'
        ],
        salaryOrStipend: '₹14,00,000 - ₹18,00,000 CTC',
        applyDeadline: new Date(Date.now() + 86400000 * 15),
        postedBy: arjun._id,
        status: 'active',
        applicants: []
      },
      {
        title: 'Junior SOC Analyst (Security Operations Center)',
        company: 'Cisco Systems',
        companyLogo: 'https://logo.clearbit.com/cisco.com',
        location: 'Chennai, India',
        type: 'Full-time',
        workplaceType: 'On-site',
        departmentEligibility: ['CSE (Cyber Security)', 'CSE', 'IT'],
        description: `Join Cisco Customer Experience (CX) Security Center. Monitor real-time intrusion attempts, investigate malware behaviors, and assist global response teams.`,
        requirements: [
          'Specialization in Cyber Security or strong coursework in Network Defense',
          'Understanding of MITRE ATT&CK framework, SIEM, and firewalls',
          'CCNA or Security+ certification is a big plus'
        ],
        salaryOrStipend: '₹9,00,000 - ₹12,00,000 CTC',
        applyDeadline: new Date(Date.now() + 86400000 * 30),
        postedBy: harish._id,
        status: 'active',
        applicants: []
      }
    ]);

    // 5. Mentorship Sessions
    console.log('[Seed] Creating Mentorship Requests...');
    await MentorshipRequest.insertMany([
      {
        student: adithyan._id,
        alumni: kavitha._id,
        topic: 'Cyber Security Career Roadmap & SOC Analyst Interview Prep',
        message: 'Hello Kavitha ma\'am, I am in 3rd year CSE Cyber Security at Easwari. I am building hands-on labs and our FSD portal. I would love your advice on preparing for cloud security roles and certifications like CompTIA Security+.',
        preferredTiming: 'Saturdays 5:00 PM - 6:00 PM',
        status: 'accepted',
        meetingLink: 'https://meet.google.com/easwari-sec-mentor',
        scheduledDate: new Date(Date.now() + 86400000 * 2),
        mentorNotes: 'Looking forward to meeting Adithyan. Very impressive resume and project foundation. Will discuss cloud security playbooks and interview tips.'
      },
      {
        student: pooja._id,
        alumni: vikram._id,
        topic: 'Cracking Tier-1 Product Company Algorithms & System Design',
        message: 'Hi Vikram sir, I am preparing for tier-1 campus placements and would love your guidance on prioritizing dynamic programming vs graphs for Google interview rounds.',
        preferredTiming: 'Sunday Morning',
        status: 'pending'
      },
      {
        student: adithyan._id,
        alumni: divyanjali._id,
        topic: 'Final Review: Integrated Alumni-Student Portal Architecture',
        message: 'Ma\'am, requesting a brief walkthrough session to review the final MERN stack endpoints, authentication security, and admin verification module.',
        preferredTiming: 'College Hours / Lab 3',
        status: 'completed',
        meetingLink: 'In-person / Faculty Cabin CSE',
        mentorNotes: 'Reviewed the full MERN stack implementation. Security controls and role-based access are very well engineered.',
        rating: 5,
        feedback: 'Excellent guidance from Ms. Divyanjali throughout the project lifecycle.'
      }
    ]);

    // 6. Direct Messages
    console.log('[Seed] Creating Sample Chat Messages...');
    await Message.insertMany([
      {
        sender: kavitha._id,
        recipient: adithyan._id,
        content: 'Hi Adithyan! I saw your mentorship request and your project showcase. Great to see fellow Cyber Security juniors doing remarkable work at Easwari!'
      },
      {
        sender: adithyan._id,
        recipient: kavitha._id,
        content: 'Thank you so much Kavitha ma\'am! It means a lot coming from an alumnus at Palo Alto Networks. Looking forward to our scheduled session this Saturday!'
      },
      {
        sender: kavitha._id,
        recipient: adithyan._id,
        content: 'I have added the Google Meet link in the portal. Please keep a list of your top questions ready so we can make the best use of time.'
      }
    ]);

    // 7. Upcoming College Events & Alumni Webinars
    console.log('[Seed] Creating Campus Events...');
    await Event.insertMany([
      {
        title: 'Navigating the Cyber Security Landscape in 2026: From Campus to Palo Alto Networks',
        description: 'An exclusive interactive keynote by alumna Kavitha Sridhar covering emerging threat vectors, zero-trust cloud security, and what hiring managers look for in campus recruits.',
        date: new Date(Date.now() + 86400000 * 5),
        time: '10:30 AM - 12:30 PM IST',
        location: 'Online via Google Meet & TRP Auditorium Live Broadcast',
        meetingUrl: 'https://meet.google.com/sec-alumni-talk',
        speaker: {
          name: 'Kavitha Sridhar',
          role: 'Senior Cloud Security Architect',
          company: 'Palo Alto Networks',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
        },
        organizer: divyanjali._id,
        category: 'Webinar',
        attendees: [adithyan._id, pooja._id]
      },
      {
        title: 'Crack the Tier-1 SDE Placement: Google, Amazon & Microsoft Alumni Panel',
        description: 'Join SRM Easwari alumni Vikram Raghavan (Google) and Arjun Nambiar (AWS) as they break down coding round patterns, system design rounds, and resume building tips.',
        date: new Date(Date.now() + 86400000 * 9),
        time: '6:00 PM - 7:30 PM IST',
        location: 'Virtual Session (Google Meet)',
        meetingUrl: 'https://meet.google.com/easwari-tier1-panel',
        speaker: {
          name: 'Vikram Raghavan & Arjun Nambiar',
          role: 'Tech Leads',
          company: 'Google & AWS',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        },
        organizer: admin._id,
        category: 'Tech Talk',
        attendees: [adithyan._id]
      }
    ]);

    // 8. Notifications
    console.log('[Seed] Creating Sample Notifications...');
    await Notification.insertMany([
      {
        recipient: adithyan._id,
        sender: kavitha._id,
        type: 'mentorship_status',
        title: 'Mentorship Request Accepted',
        message: 'Kavitha Sridhar accepted your mentorship request. Meeting link is now active.',
        link: '/mentorship'
      },
      {
        recipient: adithyan._id,
        sender: kavitha._id,
        type: 'application_status',
        title: 'Job Application Shortlisted',
        message: 'Your application for Cyber Security Analyst Intern at Palo Alto Networks has been shortlisted!',
        link: '/jobs'
      }
    ]);

    console.log('[Seed] Database successfully populated with realistic SRM Easwari data!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedDatabase();
