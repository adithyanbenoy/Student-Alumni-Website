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

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/alumni_portal';

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
    console.log('[Seed] Creating Platform Users...');
    const usersData = [
      {
        name: 'Portal Administrator',
        email: 'admin@alumniportal.edu',
        password: hashedPassword,
        role: 'admin',
        department: 'Computer Science & Engineering',
        batchYear: 2015,
        designation: 'Director of Alumni Relations',
        company: 'Student Alumni Network',
        bio: 'Managing the centralized platform connecting students and alumni for professional growth, career mentorship, and employment.',
        isVerifiedAlumni: true,
        isMentorAvailable: false,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      },
      {
        name: 'Dr. Priya Sharma',
        email: 'priya.sharma@alumniportal.edu',
        password: hashedPassword,
        role: 'alumni',
        department: 'Computer Science & Engineering',
        batchYear: 2017,
        designation: 'Distinguished Career Mentor & Lead Advisor',
        company: 'Tech Mentorship Council',
        location: 'San Francisco, CA',
        bio: 'Guiding students in secure software engineering, architecture, threat modeling, and career progression across top tech firms.',
        skills: ['Cyber Security', 'Network Security', 'Cryptography', 'Cloud Systems', 'Career Strategy'],
        mentorTopics: ['Cyber Security Career Paths', 'Graduate Transition', 'Placement Strategy'],
        isVerifiedAlumni: true,
        isMentorAvailable: true,
        experienceYears: 8,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
      },
      {
        name: 'Marcus Chen',
        email: 'marcus.chen@student.alumniportal.edu',
        password: hashedPassword,
        role: 'student',
        department: 'Computer Science & Engineering',
        batchYear: 2026,
        registerNumber: 'STU-2026-8804',
        location: 'Seattle, WA',
        bio: 'Computer Science undergraduate passionate about full-stack engineering, cloud security, and distributed systems.',
        skills: ['Cyber Security', 'Full Stack Development', 'React', 'Node.js', 'MongoDB', 'Python'],
        linkedinUrl: 'https://linkedin.com/in/marcus-chen-tech',
        githubUrl: 'https://github.com/marcuschen-dev',
        resumeUrl: 'https://example.com/resumes/marcus_chen.pdf',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
      },
      {
        name: 'Rachel Adams',
        email: 'rachel.adams@paloaltonetworks.com',
        password: hashedPassword,
        role: 'alumni',
        department: 'Computer Science & Engineering',
        batchYear: 2021,
        designation: 'Senior Cloud Security Architect',
        company: 'Palo Alto Networks',
        location: 'San Jose, CA',
        bio: 'Alumna working on cloud security posture and zero trust architectures. Dedicated to helping students transition into top cybersecurity roles.',
        skills: ['Cloud Security', 'Kubernetes Security', 'Threat Hunting', 'SIEM/SOAR', 'Prisma Cloud'],
        mentorTopics: ['Cyber Security Industry Roadmap', 'Certifications (Security+ / CISSP)', 'Security Engineering Interviews'],
        isVerifiedAlumni: true,
        isMentorAvailable: true,
        experienceYears: 5,
        linkedinUrl: 'https://linkedin.com/in/rachel-adams-security',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
      },
      {
        name: 'Alex Chen',
        email: 'alex.chen@google.com',
        password: hashedPassword,
        role: 'alumni',
        department: 'Computer Science & Engineering',
        batchYear: 2020,
        designation: 'Staff Software Engineer',
        company: 'Google',
        location: 'Mountain View, CA',
        bio: 'Staff Engineer working on scalable distributed systems. Open to mentoring students on data structures, algorithms, and system design.',
        skills: ['Distributed Systems', 'System Design', 'Go', 'Java', 'Algorithms', 'Microservices'],
        mentorTopics: ['Tier-1 Tech Interview Preparation', 'System Design Fundamentals', 'Open Source Contribution'],
        isVerifiedAlumni: true,
        isMentorAvailable: true,
        experienceYears: 6,
        linkedinUrl: 'https://linkedin.com/in/alex-chen-google',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      },
      {
        name: 'Neha Patel',
        email: 'neha.patel@zohocorp.com',
        password: hashedPassword,
        role: 'alumni',
        department: 'Information Technology',
        batchYear: 2022,
        designation: 'Product Security Lead',
        company: 'Zoho Corporation',
        location: 'Austin, TX',
        bio: 'Passionate about web application security, secure SDLC, and assisting students with practical penetration testing skills.',
        skills: ['Application Security', 'OWASP Top 10', 'DevSecOps', 'React', 'Java'],
        mentorTopics: ['Software Engineering Hiring Tips', 'AppSec Hands-on Projects', 'Capstone Guidance'],
        isVerifiedAlumni: true,
        isMentorAvailable: true,
        experienceYears: 4,
        linkedinUrl: 'https://linkedin.com/in/neha-patel-sec',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      },
      {
        name: 'James Wilson',
        email: 'james.wilson@amazon.com',
        password: hashedPassword,
        role: 'alumni',
        department: 'Computer Science & Engineering',
        batchYear: 2019,
        designation: 'Senior SDE II (AWS)',
        company: 'Amazon Web Services',
        location: 'Seattle, WA',
        bio: 'Cloud Architect & SDE at AWS. Happy to mentor students on cloud-native solutions, serverless architectures, and interview preparation.',
        skills: ['AWS', 'Serverless', 'TypeScript', 'Node.js', 'DynamoDB', 'Docker'],
        mentorTopics: ['Amazon Leadership Principles', 'Cloud Certification Guidance', 'Full-stack Portfolio Projects'],
        isVerifiedAlumni: true,
        isMentorAvailable: true,
        experienceYears: 7,
        linkedinUrl: 'https://linkedin.com/in/james-wilson-aws',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
      },
      {
        name: 'Michael Torres',
        email: 'michael.torres@cisco.com',
        password: hashedPassword,
        role: 'alumni',
        department: 'Computer Science & Engineering',
        batchYear: 2023,
        designation: 'Security Operations Analyst',
        company: 'Cisco',
        location: 'Raleigh, NC',
        bio: 'Working on enterprise network defence, threat telemetry, and security incident response. Passionate about guiding young graduates.',
        skills: ['SOC Analysis', 'Splunk', 'Wireshark', 'Network Protocols', 'Incident Response'],
        mentorTopics: ['Starting a Career in SOC', 'Networking Fundamentals for Cyber Roles', 'Campus to Corporate Transition'],
        isVerifiedAlumni: true,
        isMentorAvailable: true,
        experienceYears: 3,
        linkedinUrl: 'https://linkedin.com/in/michael-torres-cisco',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
      },
      {
        name: 'Emily Watson',
        email: 'emily.watson@microsoft.com',
        password: hashedPassword,
        role: 'alumni',
        department: 'Artificial Intelligence & Data Science',
        batchYear: 2024,
        designation: 'Associate AI Engineer',
        company: 'Microsoft Research',
        location: 'Redmond, WA',
        bio: 'Working on LLM fine-tuning and retrieval-augmented generation. Recent graduate profile pending admin identity verification.',
        skills: ['Python', 'PyTorch', 'Generative AI', 'NLP', 'Azure AI'],
        mentorTopics: ['AI/ML Capstone Projects', 'Publishing Papers during Undergrad'],
        isVerifiedAlumni: false, // For admin verification demo!
        isMentorAvailable: false,
        experienceYears: 1,
        linkedinUrl: 'https://linkedin.com/in/emily-watson-ai',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
      },
      {
        name: 'Sarah Jenkins',
        email: 'sarah.jenkins@student.alumniportal.edu',
        password: hashedPassword,
        role: 'student',
        department: 'Artificial Intelligence & Data Science',
        batchYear: 2025,
        registerNumber: 'STU-2025-4102',
        location: 'Boston, MA',
        bio: 'Senior undergraduate exploring Computer Vision, deep learning, and predictive modeling for autonomous systems.',
        skills: ['Python', 'TensorFlow', 'Data Science', 'SQL'],
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
      },
      {
        name: 'David Kim',
        email: 'david.kim@student.alumniportal.edu',
        password: hashedPassword,
        role: 'student',
        department: 'Information Technology',
        batchYear: 2026,
        registerNumber: 'STU-2026-6209',
        location: 'Chicago, IL',
        bio: 'Third-year student specializing in modern web frameworks, cloud microservices, and mobile application development.',
        skills: ['React Native', 'Node.js', 'Express', 'TailwindCSS'],
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80'
      }
    ];

    const createdUsers = await User.insertMany(usersData);
    console.log(`[Seed] Seeded ${createdUsers.length} users successfully.`);

    const userMap = {};
    createdUsers.forEach((u) => {
      userMap[u.email] = u;
    });

    const admin = userMap['admin@alumniportal.edu'];
    const priya = userMap['priya.sharma@alumniportal.edu'];
    const marcus = userMap['marcus.chen@student.alumniportal.edu'];
    const rachel = userMap['rachel.adams@paloaltonetworks.com'];
    const alex = userMap['alex.chen@google.com'];
    const neha = userMap['neha.patel@zohocorp.com'];
    const james = userMap['james.wilson@amazon.com'];
    const michael = userMap['michael.torres@cisco.com'];
    const sarah = userMap['sarah.jenkins@student.alumniportal.edu'];

    // 2. Announcements
    console.log('[Seed] Creating Announcements...');
    await Announcement.insertMany([
      {
        title: 'Annual Tech Career Conclave & Alumni Referral Network Launched',
        content: 'Welcome to the official Student Alumni Portal! Students can now connect directly with our alumni working across global technology companies for career guidance, mock technical interviews, and exclusive internal job referrals.',
        author: admin._id,
        priority: 'high',
        category: 'Placement'
      },
      {
        title: 'Special Keynote: Cloud Security Architecture & Zero-Trust Defense',
        content: 'Join alumna Rachel Adams (Senior Cloud Security Architect at Palo Alto Networks) for an interactive session on cloud-native security, network defense, and early-career cybersecurity opportunities.',
        author: priya._id,
        priority: 'medium',
        category: 'Academic'
      }
    ]);

    // 3. Posts
    console.log('[Seed] Creating Feed Posts...');
    await Post.insertMany([
      {
        author: rachel._id,
        content: `Excited to connect with students and fellow alumni through the portal! 🛡️

To all students preparing for cybersecurity and cloud engineering roles this semester:
1. Master core networking fundamentals (TCP/IP, DNS, TLS, packet analysis with Wireshark).
2. Learn cloud security fundamentals (IAM policies, VPC peering, least privilege).
3. Build real projects (SIEM dashboards, automated log scanners, vulnerable web lab walkthroughs) rather than relying only on certifications.

Feel free to request a 1-on-1 mentorship session with me on the portal. Happy to help! 🚀`,
        category: 'Career Advice',
        tags: ['CyberSecurity', 'CareerGuidance', 'CloudSecurity', 'TechPlacements'],
        likes: [marcus._id, sarah._id, admin._id],
        comments: [
          {
            user: marcus._id,
            content: 'Thank you for the practical advice! Looking forward to our cloud security session this week.',
            createdAt: new Date(Date.now() - 3600000 * 4)
          },
          {
            user: priya._id,
            content: 'Inspiring to see our alumni actively giving back to aspiring juniors. Great points, Rachel!',
            createdAt: new Date(Date.now() - 3600000 * 2)
          }
        ]
      },
      {
        author: marcus._id,
        content: `Thrilled to share our new full-stack platform: "Student Alumni Portal" — a centralized, professional network connecting students, alumni mentors, and recruiters! 🎓💻

Key Highlights:
✅ Verified alumni directory searchable by company, role, and domain expertise.
✅ 1-on-1 career mentorship scheduling with integrated video meeting links.
✅ Curated job & internship board with 1-click student applications.
✅ Real-time messaging and interactive discussions.
✅ Administrative dashboard with alumni credential verification.

Built on the MERN stack with Socket.io real-time communication. Feedback and thoughts are warmly welcomed! 🌟`,
        category: 'Project Showcase',
        tags: ['MERNStack', 'FullStackDevelopment', 'WebSockets', 'React', 'NodeJS'],
        mediaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
        likes: [rachel._id, alex._id, neha._id, priya._id, admin._id],
        comments: [
          {
            user: priya._id,
            content: 'Impressive system design and execution, Marcus! The integrated mentorship and referral pipeline is seamless.',
            createdAt: new Date(Date.now() - 3600000 * 3)
          },
          {
            user: alex._id,
            content: 'Great clean architecture! The real-time messaging and responsive layout look sharp.',
            createdAt: new Date(Date.now() - 3600000 * 1)
          }
        ]
      },
      {
        author: neha._id,
        content: `Zoho Corporation is opening applications for software engineering and application security internships! 💼

I have listed open positions directly in our Job Board here. If you have built solid full-stack or security projects, feel free to apply and reach out for an internal referral!`,
        category: 'Job Referral',
        tags: ['ZohoHiring', 'Internship2026', 'AppSec', 'SoftwareEngineer'],
        likes: [marcus._id, sarah._id, james._id],
        comments: [
          {
            user: sarah._id,
            content: 'Just submitted my application! Thank you for sharing this opportunity, Neha!',
            createdAt: new Date(Date.now() - 3600000 * 5)
          }
        ]
      },
      {
        author: alex._id,
        content: `A quick tip for coding rounds and technical interviews:
Focus on communication and edge cases rather than rushing to write syntax:
1. Ask clarifying questions before starting.
2. Discuss trade-offs (Time vs Space complexity) clearly.
3. Write clean, modular functions with meaningful variable names.

I am hosting mock technical interview sessions for a few final-year students this weekend. Check the Mentorship tab to request a slot!`,
        category: 'Career Advice',
        tags: ['InterviewTips', 'Google', 'DataStructures', 'SoftwareEngineering'],
        likes: [marcus._id, rachel._id, michael._id],
        comments: []
      }
    ]);

    // 4. Jobs & Internships
    console.log('[Seed] Creating Jobs and Internships...');
    await Job.insertMany([
      {
        title: 'Cyber Security Analyst Intern (Cloud Threat Defense)',
        company: 'Palo Alto Networks',
        companyLogo: 'https://logo.clearbit.com/paloaltonetworks.com',
        location: 'San Jose, CA / Remote Hybrid',
        type: 'Internship',
        workplaceType: 'Hybrid',
        departmentEligibility: ['Computer Science & Engineering', 'Information Technology'],
        description: `Palo Alto Networks is seeking passionate Cyber Security Interns to join our Cloud Threat Defense unit. You will work with senior security architects to analyze threat telemetry, evaluate vulnerability reports, and design automated remediation workflows.

Key Responsibilities:
• Assist in triaging security events using modern SIEM and XDR systems.
• Conduct security posture assessments across AWS and GCP environments.
• Build security automation scripts using Python and REST APIs.`,
        requirements: [
          'Pursuing Bachelor in Computer Science / Information Technology (3rd or 4th Year)',
          'Strong understanding of TCP/IP, OSI model, and network security protocols',
          'Proficiency with Python, Linux command-line, and Git',
          'Good analytical and problem-solving skills'
        ],
        salaryOrStipend: '$45 / hr + Housing Stipend',
        applyDeadline: new Date(Date.now() + 86400000 * 20),
        postedBy: rachel._id,
        status: 'active',
        applicants: [
          {
            student: marcus._id,
            coverNote: 'I am a 3rd-year CS student with hands-on experience in penetration testing, threat modeling, and building secure full-stack applications. Would love the opportunity to contribute at Palo Alto Networks!',
            resumeUrl: 'https://example.com/resumes/marcus_chen.pdf',
            status: 'shortlisted',
            appliedAt: new Date(Date.now() - 86400000 * 2),
            notes: 'Strong candidate with impressive full-stack portal project and security foundations.'
          }
        ]
      },
      {
        title: 'Associate Software Development Engineer (Full Stack)',
        company: 'Zoho Corporation',
        companyLogo: 'https://logo.clearbit.com/zoho.com',
        location: 'Austin, TX',
        type: 'Full-time',
        workplaceType: 'On-site',
        departmentEligibility: ['All Departments'],
        description: `Zoho Corporation is hiring Associate Software Engineers to build scalable SaaS applications used by over 100 million users globally.

Responsibilities:
• Develop responsive, performant user interfaces with modern web standards.
• Engineer fault-tolerant backend REST APIs and microservices.
• Optimize database queries and system throughput.`,
        requirements: [
          'Graduating Batch of 2025 or 2026',
          'Hands-on expertise in JavaScript / TypeScript / React / Node.js or Java',
          'Strong algorithmic thinking and problem solving'
        ],
        salaryOrStipend: '$85,000 - $110,000 / year',
        applyDeadline: new Date(Date.now() + 86400000 * 25),
        postedBy: neha._id,
        status: 'active',
        applicants: [
          {
            student: sarah._id,
            coverNote: 'Interested in scalable web applications and SaaS architecture at Zoho.',
            resumeUrl: 'https://example.com/resumes/sarah_jenkins.pdf',
            status: 'under_review',
            appliedAt: new Date(Date.now() - 86400000 * 1)
          }
        ]
      },
      {
        title: 'Cloud Support & DevOps Associate',
        company: 'Amazon Web Services (AWS)',
        companyLogo: 'https://logo.clearbit.com/amazon.com',
        location: 'Seattle, WA',
        type: 'Full-time',
        workplaceType: 'Hybrid',
        departmentEligibility: ['Computer Science & Engineering', 'Information Technology'],
        description: `Join AWS as a Cloud Associate. Troubleshoot distributed architectures, container orchestrations, and AWS security configurations for enterprise cloud customers.`,
        requirements: [
          'Undergraduate 2025/2026 batch in Computer Science or related fields',
          'Familiarity with AWS core services (EC2, S3, IAM, Lambda, VPC)',
          'Scripting skills in Bash, Python or JavaScript'
        ],
        salaryOrStipend: '$120,000 - $145,000 Total Compensation',
        applyDeadline: new Date(Date.now() + 86400000 * 15),
        postedBy: james._id,
        status: 'active',
        applicants: []
      },
      {
        title: 'Junior SOC Analyst (Security Operations Center)',
        company: 'Cisco Systems',
        companyLogo: 'https://logo.clearbit.com/cisco.com',
        location: 'RTP, NC',
        type: 'Full-time',
        workplaceType: 'On-site',
        departmentEligibility: ['Computer Science & Engineering', 'Information Technology'],
        description: `Join Cisco Customer Experience Security Operations. Monitor real-time intrusion attempts, investigate malware behaviors, and assist global response teams.`,
        requirements: [
          'Strong coursework in Network Defense and System Security',
          'Understanding of MITRE ATT&CK framework, SIEM, and firewalls',
          'Security+ or CCNA is a plus'
        ],
        salaryOrStipend: '$80,000 - $95,000 / year',
        applyDeadline: new Date(Date.now() + 86400000 * 30),
        postedBy: michael._id,
        status: 'active',
        applicants: []
      }
    ]);

    // 5. Mentorship Sessions
    console.log('[Seed] Creating Mentorship Requests...');
    await MentorshipRequest.insertMany([
      {
        student: marcus._id,
        alumni: rachel._id,
        topic: 'Cyber Security Career Roadmap & SOC Analyst Interview Prep',
        message: 'Hello Rachel, I am in my 3rd year studying Computer Science. I have built full-stack projects and want to pursue a career in cloud security. Would love your guidance on certifications and interview prep.',
        preferredTiming: 'Saturdays 5:00 PM - 6:00 PM',
        status: 'accepted',
        meetingLink: 'https://meet.google.com/sec-alumni-mentor',
        scheduledDate: new Date(Date.now() + 86400000 * 2),
        mentorNotes: 'Looking forward to meeting Marcus. Very impressive project foundations. Will discuss cloud security playbooks and interview tips.'
      },
      {
        student: sarah._id,
        alumni: alex._id,
        topic: 'Preparing for Tier-1 Product Company Algorithms & System Design',
        message: 'Hi Alex, I am preparing for product company placements and would love advice on structuring technical practice for data structures and system design rounds.',
        preferredTiming: 'Sunday Morning',
        status: 'pending'
      },
      {
        student: marcus._id,
        alumni: priya._id,
        topic: 'Final Review: Full Stack Portal Architecture and Security',
        message: 'Dr. Sharma, requesting a walkthrough session to review the final MERN stack endpoints, authentication security, and admin verification module.',
        preferredTiming: 'Friday Afternoon',
        status: 'completed',
        meetingLink: 'https://meet.google.com/faculty-review',
        mentorNotes: 'Reviewed the full MERN stack implementation. Security controls and role-based access are well engineered.',
        rating: 5,
        feedback: 'Invaluable feedback and architectural guidance.'
      }
    ]);

    // 6. Direct Messages
    console.log('[Seed] Creating Sample Chat Messages...');
    await Message.insertMany([
      {
        sender: rachel._id,
        recipient: marcus._id,
        content: 'Hi Marcus! I saw your mentorship request and your full-stack project showcase. Great to see students building impressive end-to-end architectures!'
      },
      {
        sender: marcus._id,
        recipient: rachel._id,
        content: 'Thank you so much, Rachel! It means a lot. Really looking forward to our scheduled session this Saturday!'
      },
      {
        sender: rachel._id,
        recipient: marcus._id,
        content: 'I have attached the Google Meet link in the portal. Please have your top questions and resume ready so we can dive right in.'
      }
    ]);

    // 7. Events & Webinars
    console.log('[Seed] Creating Campus Events...');
    await Event.insertMany([
      {
        title: 'Navigating the Cyber Security Landscape: From Campus to Enterprise',
        description: 'An exclusive interactive keynote by alumna Rachel Adams covering emerging cloud threats, zero-trust architectures, and what security leaders look for in college graduates.',
        date: new Date(Date.now() + 86400000 * 5),
        time: '10:30 AM - 12:00 PM EST',
        location: 'Online via Google Meet',
        meetingUrl: 'https://meet.google.com/sec-alumni-talk',
        speaker: {
          name: 'Rachel Adams',
          role: 'Senior Cloud Security Architect',
          company: 'Palo Alto Networks',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
        },
        organizer: priya._id,
        category: 'Webinar',
        attendees: [marcus._id, sarah._id]
      },
      {
        title: 'Cracking the Tier-1 SDE Placement: Google, Amazon & Microsoft Alumni Panel',
        description: 'Join alumni Alex Chen (Google) and James Wilson (AWS) as they break down coding interview patterns, system design rounds, and resume building tips.',
        date: new Date(Date.now() + 86400000 * 9),
        time: '6:00 PM - 7:30 PM EST',
        location: 'Virtual Session (Google Meet)',
        meetingUrl: 'https://meet.google.com/tech-alumni-panel',
        speaker: {
          name: 'Alex Chen & James Wilson',
          role: 'Tech Leads',
          company: 'Google & AWS',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        },
        organizer: admin._id,
        category: 'Tech Talk',
        attendees: [marcus._id]
      }
    ]);

    // 8. Notifications
    console.log('[Seed] Creating Sample Notifications...');
    await Notification.insertMany([
      {
        recipient: marcus._id,
        sender: rachel._id,
        type: 'mentorship_status',
        title: 'Mentorship Request Accepted',
        message: 'Rachel Adams accepted your mentorship request. The Google Meet link is now active.',
        link: '/mentorship'
      },
      {
        recipient: marcus._id,
        sender: rachel._id,
        type: 'application_status',
        title: 'Job Application Shortlisted',
        message: 'Your application for Cyber Security Analyst Intern at Palo Alto Networks has been shortlisted!',
        link: '/jobs'
      }
    ]);

    console.log('[Seed] Database successfully populated with realistic platform data!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedDatabase();
