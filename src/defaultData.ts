/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NewsItem, SchoolProject, GalleryItem, VideoItem, DocumentItem, StudentResult, ContactMessage, PaymentRecord, StaffMember } from './types';

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'HGASS Clinches 1st Position in Anambra State Science Championship',
    content: 'We are delighted to announce that Holy Ghost Academy Secondary School has emerged as the state champion in the annual Anambra State Secondary School Science and Technology Exhibition. Our students, led by Chinedu Okafor and Chioma Azikiwe, designed a smart solar-powered irrigation prototype tailored for agricultural efficiency in Anambra communities.',
    date: '2026-06-10',
    category: 'Academic',
    imageUrl: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&q=80&w=1200',
    isPublished: true,
  },
  {
    id: 'news-2',
    title: 'Commissioning of the Ultra-Modern Digital Library',
    content: 'The school management, in collaboration with the Alumni association and parents, has officially commissioned the new Digital Library Center. Equipped with 50 high-speed computers, interactive learning tablets, and high-speed internet, the center is designed to give our students access to global educational resources, digital textbooks, and research journals.',
    date: '2026-05-18',
    category: 'Announcement',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=1200',
    isPublished: true,
  },
  {
    id: 'news-3',
    title: 'Annual Cultural and Inter-House Sports Festival 2026',
    content: 'Our annual inter-house sports and cultural festival took place with great color and energy! Students displayed sportsmanship across track and field events, football, and volleyball. Furthermore, the cultural showcase beautifully highlighted the rich Igbo heritage alongside other Nigerian cultures in Awka, emphasizing unity in diversity.',
    date: '2026-03-22',
    category: 'Sports',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=1200',
    isPublished: true,
  },
];

export const INITIAL_PROJECTS: SchoolProject[] = [
  {
    id: 'proj-1',
    title: 'Chemistry Laboratory Upgrade',
    description: 'Renovation and supply of modern lab equipment, state-of-the-art gas pipelines, safety eyewash stations, and comprehensive diagnostic chemical kits for senior secondary chemistry practicals.',
    imageUrl: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&q=80&w=1200',
    budget: '₦8,500,000',
    startDate: '2026-01-15',
    expectedCompletionDate: '2026-08-30',
    percentageCompletion: 85,
  },
  {
    id: 'proj-2',
    title: 'Library Rehabilitation & E-Suite',
    description: 'Structural reinforcement, full air conditioning installation, comfortable modular reading chairs, and setting up the central digital e-learning catalog.',
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=1200',
    budget: '₦15,000,000',
    startDate: '2025-10-01',
    expectedCompletionDate: '2026-05-15',
    percentageCompletion: 100,
  },
  {
    id: 'proj-3',
    title: 'ICT Centre Development',
    description: 'Expanding workstation infrastructure to double student capacity, deploying network firewalls, and adding professional software modules for Python programming and digital design classes.',
    imageUrl: 'https://images.unsplash.com/photo-1562774053-4ab90860b27e?auto=format&fit=crop&q=80&w=1200',
    budget: '₦20,000,000',
    startDate: '2026-04-10',
    expectedCompletionDate: '2026-12-15',
    percentageCompletion: 45,
  },
  {
    id: 'proj-4',
    title: 'Biology & Physics Laboratories Overhaul',
    description: 'Replacing old optical microscopes with digital compound projection microscopes, upgrading precision calipers, circuitry boards, and optics kits for physics experiments.',
    imageUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=1200',
    budget: '₦12,500,000',
    startDate: '2026-05-01',
    expectedCompletionDate: '2026-10-10',
    percentageCompletion: 60,
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800',
    title: 'Front View of School Administration Block',
    category: 'School Activities',
    uploadDate: '2026-01-10',
  },
  {
    id: 'gal-2',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800',
    title: 'Class of 2025 Graduation Ceremony',
    category: 'Graduation',
    uploadDate: '2025-07-25',
  },
  {
    id: 'gal-3',
    imageUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800',
    title: 'Physics Practical Session in Progress',
    category: 'Academics',
    uploadDate: '2026-02-14',
  },
  {
    id: 'gal-4',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800',
    title: 'Football Team Captains Shaking Hands',
    category: 'Sports',
    uploadDate: '2026-03-20',
  },
  {
    id: 'gal-5',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800',
    title: 'Cultural Dance Group Anambra Heritage',
    category: 'Cultural Events',
    uploadDate: '2026-03-22',
  },
  {
    id: 'gal-6',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
    title: 'Peer Tutoring in the Digital Library',
    category: 'Academics',
    uploadDate: '2026-05-25',
  }
];

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'vid-1',
    title: 'Holy Ghost Academy Virtual Campus Tour',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Placeholder Link
    description: 'A comprehensive video tour showing the state-of-the-art facilities, laboratories, sports grounds, and spacious classrooms at Awka, Anambra State.',
    uploadDate: '2026-01-15',
  },
  {
    id: 'vid-2',
    title: 'Highlights of the 2025 Cultural Day & Prize Giving Ceremony',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description: 'Capturing moments of cultural exhibitions, local culinary presentations, and academic prize-giving ceremonies at HGASS.',
    uploadDate: '2025-12-05',
  }
];

// Base64 Text file representation
const base64SamplePdf = 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCjIgMCBvYmoKICA8PCAvVHlwZSAvUGFnZXMKICAgICAvS2lkcyBbIDMgMCBSIF0KICAgICAvQ291bnQgMQogID4+CmVuZG9iagozIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2UKICAgICAvUGFyZW50IDIgMCBSCiAgICAgL01lZGlhQm94IFsgMCAwIDU5NSA4NDIgXQogICAgIC9SZXNvdXJjZXMgPDwgL0ZvbnQgPDwgL0YxIDQgMCBSID4+ID4+CiAgICAgL0NvbnRlbnRzIDUgMCBSCiAgPj4KZW5kb2JqCjQgMCBvYmoKICA8PCAvVHlwZSAvRm9udAogICAgIC9TdWJ0eXBlIC9UeXBlMQogICAgIC9CYXNlRm9udCAvSGVsdmV0aWNhCiAgPj4KZW5kb2JqCjUgMCBvYmoKICA8PCAvTGVuZ3RoIDYyID4+CnN0cmVhbQpCVAovRjEgMjQgVGYKNTAgNzAwIFRkCihIb2x5IEdob3N0IEFjYWRlbXkgU2Vjb25kYXJ5IFNjaG9vbCAtIE9mZmljaWFsIERvY3VtZW50KSBUagogRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDA3MCAwMDAwMCBuIAowMDAwMDAwMTM1IDAwMDAgbiAKMDAwMDAwMDI1OCAwMDAwMCBuIAowMDAwMDAwMzI1IDAwMDAgbiAKdHJhaWxlcgogIDw8IC9TaXplIDYKICAgICAvUm9vdCAxIDAgUgogID4+CnN0YXJ0eHJlZgogNDM4CiUlRU9G';

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    title: 'Academic Calendar - First Term 2025/2026 Session',
    fileType: 'pdf',
    fileSize: '320 KB',
    uploadDate: '2025-09-01',
    downloadUrl: base64SamplePdf,
  },
  {
    id: 'doc-2',
    title: 'School Rules, Regulations and Dress Code Codebook',
    fileType: 'pdf',
    fileSize: '450 KB',
    uploadDate: '2025-09-01',
    downloadUrl: base64SamplePdf,
  },
  {
    id: 'doc-3',
    title: 'Junior Secondary School (JSS 1 - JSS 3) Booklist & Requirements',
    fileType: 'pdf',
    fileSize: '1.2 MB',
    uploadDate: '2025-08-15',
    downloadUrl: base64SamplePdf,
  },
  {
    id: 'doc-4',
    title: 'Senior Secondary School (SS 1 - SS 3) Science, Arts & Commerce Booklist',
    fileType: 'pdf',
    fileSize: '1.5 MB',
    uploadDate: '2025-08-15',
    downloadUrl: base64SamplePdf,
  }
];

export const INITIAL_RESULTS: StudentResult[] = [
  {
    id: 'res-1',
    studentId: 'HGASS/2026/001',
    studentName: 'Chinedu Emmanuel Okafor',
    classLevel: 'SS 2',
    term: '3rd Term',
    academicSession: '2025/2026',
    gender: 'Male',
    rollNumber: '08',
    position: '1st of 35',
    attendance: '85 of 85 Days',
    promotionStatus: 'Promoted to SS 3',
    principalRemarks: 'An exceptionally brilliant performance. Chinedu is hardworking, disciplined, and an asset to the school community.',
    teacherRemarks: 'Chinedu has maintained outstanding academic records in science subjects this term. Keep the fire burning!',
    subjectScores: [
      { subject: 'Mathematics', ca1Score: 19, ca2Score: 19, testScore: 38, examScore: 58, totalScore: 96, grade: 'A', remarks: 'Excellent' },
      { subject: 'Physics', ca1Score: 19, ca2Score: 19, testScore: 38, examScore: 58, totalScore: 96, grade: 'A', remarks: 'Excellent' },
      { subject: 'Chemistry', ca1Score: 18, ca2Score: 18, testScore: 36, examScore: 56, totalScore: 92, grade: 'A', remarks: 'Excellent' },
      { subject: 'Biology', ca1Score: 18, ca2Score: 17, testScore: 35, examScore: 55, totalScore: 90, grade: 'A', remarks: 'Excellent' },
      { subject: 'Agricultural Science', ca1Score: 17, ca2Score: 17, testScore: 34, examScore: 53, totalScore: 87, grade: 'A', remarks: 'Excellent' },
      { subject: 'Computer Science', ca1Score: 20, ca2Score: 20, testScore: 40, examScore: 59, totalScore: 99, grade: 'A', remarks: 'Excellent' },
      { subject: 'Literature', ca1Score: 15, ca2Score: 16, testScore: 31, examScore: 46, totalScore: 77, grade: 'B', remarks: 'Very Good' },
      { subject: 'Civic Education', ca1Score: 17, ca2Score: 18, testScore: 35, examScore: 50, totalScore: 85, grade: 'A', remarks: 'Excellent' },
      { subject: 'Economics', ca1Score: 18, ca2Score: 18, testScore: 36, examScore: 52, totalScore: 88, grade: 'A', remarks: 'Excellent' }
    ]
  },
  {
    id: 'res-2',
    studentId: 'HGASS/2026/002',
    studentName: 'Chioma Blessing Azikiwe',
    classLevel: 'SS 2',
    term: '3rd Term',
    academicSession: '2025/2026',
    gender: 'Female',
    rollNumber: '12',
    position: '2nd of 35',
    attendance: '84 of 85 Days',
    promotionStatus: 'Promoted to SS 3',
    principalRemarks: 'Excellent conduct and academic excellence. Chioma continues to show exemplary leadership qualities.',
    teacherRemarks: 'An outstanding term. Her analytical skills in chemistry and physics are truly commendable.',
    accessPassword: 'HGASS-PASS-002',
    subjectScores: [
      { subject: 'Mathematics', ca1Score: 18, ca2Score: 17, testScore: 35, examScore: 55, totalScore: 90, grade: 'A', remarks: 'Excellent' },
      { subject: 'Physics', ca1Score: 18, ca2Score: 18, testScore: 36, examScore: 56, totalScore: 92, grade: 'A', remarks: 'Excellent' },
      { subject: 'Chemistry', ca1Score: 19, ca2Score: 18, testScore: 37, examScore: 57, totalScore: 94, grade: 'A', remarks: 'Excellent' },
      { subject: 'Biology', ca1Score: 17, ca2Score: 16, testScore: 33, examScore: 53, totalScore: 86, grade: 'A', remarks: 'Excellent' },
      { subject: 'Agricultural Science', ca1Score: 16, ca2Score: 16, testScore: 32, examScore: 50, totalScore: 82, grade: 'A', remarks: 'Excellent' },
      { subject: 'Computer Science', ca1Score: 19, ca2Score: 19, testScore: 38, examScore: 58, totalScore: 96, grade: 'A', remarks: 'Excellent' },
      { subject: 'Literature', ca1Score: 17, ca2Score: 16, testScore: 33, examScore: 49, totalScore: 82, grade: 'A', remarks: 'Excellent' },
      { subject: 'Civic Education', ca1Score: 16, ca2Score: 16, testScore: 32, examScore: 48, totalScore: 80, grade: 'A', remarks: 'Excellent' },
      { subject: 'Economics', ca1Score: 17, ca2Score: 17, testScore: 34, examScore: 50, totalScore: 84, grade: 'A', remarks: 'Excellent' }
    ]
  },
  {
    id: 'res-3',
    studentId: 'HGASS/2026/003',
    studentName: 'Emeka Joshua Nnaji',
    classLevel: 'JSS 2',
    term: '3rd Term',
    academicSession: '2025/2026',
    gender: 'Male',
    rollNumber: '15',
    position: '3rd of 40',
    attendance: '81 of 85 Days',
    promotionStatus: 'Promoted to JSS 3',
    principalRemarks: 'A very impressive outcome. Maintain this focus and spirit to attain greater heights.',
    teacherRemarks: 'Emeka is a disciplined and highly inquisitive student. He performs exceedingly well in Basic Technology.',
    accessPassword: 'HGASS-PASS-003',
    subjectScores: [
      { subject: 'Mathematics', ca1Score: 17, ca2Score: 16, testScore: 33, examScore: 51, totalScore: 84, grade: 'A', remarks: 'Excellent' },
      { subject: 'English language', ca1Score: 16, ca2Score: 16, testScore: 32, examScore: 50, totalScore: 82, grade: 'A', remarks: 'Excellent' },
      { subject: 'CRS', ca1Score: 18, ca2Score: 17, testScore: 35, examScore: 51, totalScore: 86, grade: 'A', remarks: 'Excellent' },
      { subject: 'Civic education', ca1Score: 15, ca2Score: 15, testScore: 30, examScore: 47, totalScore: 77, grade: 'B', remarks: 'Very Good' },
      { subject: 'Agricultural Science', ca1Score: 17, ca2Score: 16, testScore: 33, examScore: 48, totalScore: 81, grade: 'A', remarks: 'Excellent' },
      { subject: 'Basic technology', ca1Score: 19, ca2Score: 18, testScore: 37, examScore: 56, totalScore: 93, grade: 'A', remarks: 'Excellent' },
      { subject: 'Basic Science', ca1Score: 18, ca2Score: 17, testScore: 35, examScore: 52, totalScore: 87, grade: 'A', remarks: 'Excellent' },
      { subject: 'Business studies', ca1Score: 14, ca2Score: 14, testScore: 28, examScore: 44, totalScore: 72, grade: 'B', remarks: 'Very Good' },
      { subject: 'Computer Science', ca1Score: 18, ca2Score: 17, testScore: 35, examScore: 52, totalScore: 87, grade: 'A', remarks: 'Excellent' }
    ]
  }
];

export const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Dr. Charles Obi',
    email: 'charles.obi@gmail.com',
    phone: '+234 803 123 4567',
    message: 'Hello, I am interested in enrolling my twin boys for the upcoming SS 1 session. Could you please provide information regarding the boarding facilities, fees, and entrance examination dates? Thank you.',
    date: '2026-07-14 10:30 AM',
    isRead: false,
  },
  {
    id: 'msg-2',
    name: 'Alumni Association Awka Chapter',
    email: 'alumni@hgass.org',
    phone: '+234 815 987 6543',
    message: 'Dear Principal, We have completed our fundraising drive for the Physics Lab Upgrade and would like to coordinate with the project team to inspect the development progress on Saturday. Best regards.',
    date: '2026-07-12 04:15 PM',
    isRead: true,
  }
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-1',
    referenceNumber: 'HGA-PAY-2026-88310',
    payerName: 'Mrs. Ngozi Ezeokafor',
    payerPhone: '+234 803 555 1234',
    payerEmail: 'ngozi.ezeokafor@yahoo.com',
    studentName: 'Chinedu Okafor',
    studentId: 'HGASS/2026/001',
    classLevel: 'SS 2',
    purpose: 'School Fees / Tuition',
    amount: 75000,
    paymentDate: '2026-08-10',
    paymentMethod: 'UBA Direct Bank Transfer',
    bankReference: 'UBA/TRX/998271625',
    remarks: '1st Term 2026/2027 Academic Session Tuition Fee',
    status: 'Verified',
    createdAt: '2026-08-10 11:24 AM'
  },
  {
    id: 'pay-2',
    referenceNumber: 'HGA-PAY-2026-54129',
    payerName: 'Engr. Patrick Nnamdi',
    payerPhone: '+234 812 777 9081',
    payerEmail: 'p.nnamdi@gmail.com',
    studentName: 'Somtochukwu Nnamdi',
    studentId: 'HGASS/2026/015',
    classLevel: 'JSS 2',
    purpose: 'Boarding & Hostel Fees',
    amount: 145000,
    paymentDate: '2026-08-15',
    paymentMethod: 'Mobile Banking App',
    bankReference: 'TRF/UBA/1027146728/0029',
    remarks: 'Full Boarding, hostel maintenance and feeding fees for JSS 2',
    status: 'Verified',
    createdAt: '2026-08-15 02:40 PM'
  },
  {
    id: 'pay-3',
    referenceNumber: 'HGA-PAY-2026-31908',
    payerName: 'Chief Emmanuel Udeh',
    payerPhone: '+234 802 444 8812',
    payerEmail: 'chiefudeh@outlook.com',
    studentName: 'Kamsiyochukwu Udeh',
    classLevel: 'Prospective Student',
    purpose: 'Admission & Application Form',
    amount: 10000,
    paymentDate: '2026-08-18',
    paymentMethod: 'USSD Transfer',
    bankReference: 'USSD/UBA/77621458',
    remarks: 'JSS 1 Entrance Examination registration form payment',
    status: 'Pending Verification',
    createdAt: '2026-08-18 09:15 AM'
  }
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Engr. ThankGod Ndibe B.Engr., M.Engr.',
    role: 'Manager',
    category: 'Administrative Board',
    qualifications: 'B.Engr., M.Engr. (Engineering & Educational Administration)',
    image: 'https://i.ibb.co/pj9SBTbc/cccg.jpg',
    desc: 'Visionary manager and educational administrator driving academic excellence, moral grounding, and global STEM learning standards at Holy Ghost Academy.',
    email: 'holyghostacademy@gmail.com',
    phone: '+234 (0) 905 414 5339'
  },
  {
    id: 'staff-2',
    name: 'Lady Beatrice Obi-Aniche',
    role: 'Vice Principal (Academics)',
    category: 'Administrative Board',
    qualifications: 'B.Sc (Ed) Chemistry, M.Ed (Curriculum Design)',
    image: 'https://images.unsplash.com/photo-1580894732444-8fecef2271ff?auto=format&fit=crop&q=80&w=400',
    desc: 'Lady Beatrice coordinates curriculum implementation and science exhibition championships, bringing 22 years of elite educational experience.',
    email: 'academics@holyghostacademy.edu.ng',
    phone: '+234 803 987 6543'
  },
  {
    id: 'staff-3',
    name: 'Rev. Sister Martha Chika, IHM',
    role: 'Vice Principal (Administration & Welfare)',
    category: 'Administrative Board',
    qualifications: 'B.A (Religious Studies), PGDE',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    desc: 'Sister Martha supervises school board rules, student codebook compliance, boarding facilities, and moral welfare programs.',
    email: 'welfare@holyghostacademy.edu.ng',
    phone: '+234 806 555 1234'
  },
  {
    id: 'staff-4',
    name: 'Mr. John Bosco Okafor',
    role: 'Dean of Studies & Science Coordinator',
    category: 'Administrative Board',
    qualifications: 'B.Sc (Physics), M.Sc (Industrial Electronics)',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    desc: 'An award-winning instructor, Mr. John Bosco coordinates lab modernizations, diagnostic assessments, and WAEC chemistry and physics preparatory camps.',
    email: 'dean.studies@holyghostacademy.edu.ng',
    phone: '+234 802 333 4455'
  },
  {
    id: 'staff-5',
    name: 'Mrs. Ngozi Ezeh',
    role: 'Head of Department (Mathematics)',
    category: 'Academic Staff',
    qualifications: 'B.Sc (Ed) Mathematics, TRCN Certified',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400',
    desc: 'With over 14 years of teaching excellence, Mrs. Ezeh mentors the national mathematics olympiad team and champions logical problem-solving.',
    email: 'maths@holyghostacademy.edu.ng',
    phone: '+234 814 111 2233'
  },
  {
    id: 'staff-6',
    name: 'Mr. Emeka Nnamdi',
    role: 'Head of ICT & Robotics Department',
    category: 'Academic Staff',
    qualifications: 'B.Eng (Computer Engineering), CCNA',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    desc: 'Coordinates software coding clubs, digital laboratory sessions, and state robotics exhibitions, ensuring students acquire 21st-century tech skills.',
    email: 'ict@holyghostacademy.edu.ng',
    phone: '+234 805 777 8899'
  },
  {
    id: 'staff-7',
    name: 'Mrs. Amaka Umeh',
    role: 'Head of Languages & Senior English Master',
    category: 'Academic Staff',
    qualifications: 'B.A (English), M.A (Linguistics)',
    image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400',
    desc: 'Passionate literary scholar leading debate societies, diction training, and national essay contests across southeastern secondary schools.',
    email: 'languages@holyghostacademy.edu.ng',
    phone: '+234 816 444 5566'
  },
  {
    id: 'staff-8',
    name: 'Mr. Anthony Maduka',
    role: 'School Bursar & Chief Accountant',
    category: 'Non-Academic Staff',
    qualifications: 'B.Sc (Accounting), ICAN in view',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
    desc: 'Oversees student fees administration, UBA direct billing reconciliation, inventory logistics, and diocesan financial auditing.',
    email: 'bursar@holyghostacademy.edu.ng',
    phone: '+234 803 666 7788'
  }
];
