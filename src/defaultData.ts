/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NewsItem, SchoolProject, GalleryItem, VideoItem, DocumentItem, StudentResult, ContactMessage, PaymentRecord } from './types';

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
    principalRemarks: 'An exceptionally brilliant performance. Chinedu is hardworking, disciplined, and an asset to the school community.',
    teacherRemarks: 'Chinedu has maintained outstanding academic records in science subjects this term. Keep the fire burning!',
    accessPassword: 'HGASS-PASS-001',
    subjectScores: [
      { subject: 'Mathematics', testScore: 28, examScore: 68, totalScore: 96, grade: 'A', remarks: 'Excellent' },
      { subject: 'Physics', testScore: 29, examScore: 67, totalScore: 96, grade: 'A', remarks: 'Excellent' },
      { subject: 'Chemistry', testScore: 27, examScore: 65, totalScore: 92, grade: 'A', remarks: 'Excellent' },
      { subject: 'Biology', testScore: 26, examScore: 64, totalScore: 90, grade: 'A', remarks: 'Excellent' },
      { subject: 'Agricultural Science', testScore: 25, examScore: 62, totalScore: 87, grade: 'A', remarks: 'Excellent' },
      { subject: 'Computer Science', testScore: 30, examScore: 69, totalScore: 99, grade: 'A', remarks: 'Excellent' },
      { subject: 'Literature', testScore: 23, examScore: 54, totalScore: 77, grade: 'B', remarks: 'Very Good' },
      { subject: 'Civic Education', testScore: 26, examScore: 59, totalScore: 85, grade: 'A', remarks: 'Excellent' },
      { subject: 'Economics', testScore: 27, examScore: 61, totalScore: 88, grade: 'A', remarks: 'Excellent' }
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
    principalRemarks: 'Excellent conduct and academic excellence. Chioma continues to show exemplary leadership qualities.',
    teacherRemarks: 'An outstanding term. Her analytical skills in chemistry and physics are truly commendable.',
    accessPassword: 'HGASS-PASS-002',
    subjectScores: [
      { subject: 'Mathematics', testScore: 26, examScore: 64, totalScore: 90, grade: 'A', remarks: 'Excellent' },
      { subject: 'Physics', testScore: 27, examScore: 65, totalScore: 92, grade: 'A', remarks: 'Excellent' },
      { subject: 'Chemistry', testScore: 28, examScore: 66, totalScore: 94, grade: 'A', remarks: 'Excellent' },
      { subject: 'Biology', testScore: 25, examScore: 61, totalScore: 86, grade: 'A', remarks: 'Excellent' },
      { subject: 'Agricultural Science', testScore: 24, examScore: 58, totalScore: 82, grade: 'A', remarks: 'Excellent' },
      { subject: 'Computer Science', testScore: 29, examScore: 67, totalScore: 96, grade: 'A', remarks: 'Excellent' },
      { subject: 'Literature', testScore: 25, examScore: 57, totalScore: 82, grade: 'A', remarks: 'Excellent' },
      { subject: 'Civic Education', testScore: 24, examScore: 56, totalScore: 80, grade: 'A', remarks: 'Excellent' },
      { subject: 'Economics', testScore: 26, examScore: 58, totalScore: 84, grade: 'A', remarks: 'Excellent' }
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
    principalRemarks: 'A very impressive outcome. Maintain this focus and spirit to attain greater heights.',
    teacherRemarks: 'Emeka is a disciplined and highly inquisitive student. He performs exceedingly well in Basic Technology.',
    accessPassword: 'HGASS-PASS-003',
    subjectScores: [
      { subject: 'Mathematics', testScore: 25, examScore: 59, totalScore: 84, grade: 'A', remarks: 'Excellent' },
      { subject: 'English language', testScore: 24, examScore: 58, totalScore: 82, grade: 'A', remarks: 'Excellent' },
      { subject: 'CRS', testScore: 26, examScore: 60, totalScore: 86, grade: 'A', remarks: 'Excellent' },
      { subject: 'Civic education', testScore: 23, examScore: 54, totalScore: 77, grade: 'B', remarks: 'Very Good' },
      { subject: 'Agricultural Science', testScore: 25, examScore: 56, totalScore: 81, grade: 'A', remarks: 'Excellent' },
      { subject: 'Basic technology', testScore: 28, examScore: 65, totalScore: 93, grade: 'A', remarks: 'Excellent' },
      { subject: 'Basic Science', testScore: 26, examScore: 61, totalScore: 87, grade: 'A', remarks: 'Excellent' },
      { subject: 'Business studies', testScore: 22, examScore: 50, totalScore: 72, grade: 'B', remarks: 'Very Good' },
      { subject: 'Computer Science', testScore: 27, examScore: 60, totalScore: 87, grade: 'A', remarks: 'Excellent' }
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
