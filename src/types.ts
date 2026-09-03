/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string; // 'Academic', 'Announcement', 'Sports', 'Event'
  imageUrl?: string;
  isPublished: boolean;
}

export interface SchoolProject {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  budget: string;
  startDate: string;
  expectedCompletionDate: string;
  percentageCompletion: number; // 0 to 100
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  category: string; // 'School Activities', 'Sports', 'Academics', 'Graduation', 'Cultural Events', 'Projects'
  uploadDate: string;
}

export interface VideoItem {
  id: string;
  title: string;
  url: string; // YouTube or Google Drive share link
  description: string;
  uploadDate: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  fileType: string; // 'pdf', 'docx', 'xlsx'
  fileSize: string; // e.g. "2.4 MB"
  uploadDate: string;
  downloadUrl: string; // base64 or object URL
}

export interface SubjectScore {
  subject: string;
  testScore: number; // continuous assessment, e.g. 30
  examScore: number; // exam score, e.g. 70
  totalScore: number; // test + exam = 100
  grade: string; // A, B, C, D, E, F
  remarks: string; // Excellent, Very Good, Credit, Pass, Fail
}

export interface StudentResult {
  id: string; // result unique ID
  studentId: string; // Student Registration ID (e.g. HGASS/2026/001)
  studentName: string;
  classLevel: string; // e.g. "JSS 1", "SS 2"
  term: string; // "1st Term", "2nd Term", "3rd Term"
  academicSession: string; // e.g. "2025/2026"
  gender: string;
  rollNumber: string;
  position: string; // e.g. "1st of 45"
  attendance: string; // e.g. "82 of 85 days"
  principalRemarks: string;
  teacherRemarks: string;
  subjectScores: SubjectScore[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface PaymentRecord {
  id: string;
  referenceNumber: string; // e.g. "HGA-PAY-2026-98124"
  payerName: string;
  payerPhone: string;
  payerEmail: string;
  studentName: string;
  studentId?: string;
  classLevel: string; // e.g. "JSS 1", "SS 2", "Prospective Student", "Alumnus / Donor"
  purpose: string; // 'School Fees / Tuition', 'Boarding & Hostel Fees', 'Admission & Application Form', 'PTA Levy', 'Uniform & Textbooks', 'Diocesan Project Donation', 'Other'
  amount: number; // in Naira (₦)
  paymentDate: string;
  paymentMethod: string; // 'UBA Direct Bank Transfer', 'USSD Transfer', 'Mobile Banking App', 'Bank Branch Teller Deposit', 'POS / Card'
  bankReference: string; // Bank Transaction Ref or Teller Number
  proofImageUrl?: string; // Uploaded receipt image / receipt screenshot
  remarks?: string;
  status: 'Verified' | 'Pending Verification' | 'Rejected';
  createdAt: string;
}
