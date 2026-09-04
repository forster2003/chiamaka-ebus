/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, Trash, Edit, Upload, ShieldCheck, LogOut, 
  Database, FileSpreadsheet, Layers, Film, Image as ImageIcon, 
  FileText, MessageSquare, AlertCircle, Save, CheckCircle2, ChevronRight, Eye, Calendar, RefreshCw, Download,
  CreditCard, AlertTriangle, Unlink, Key, Lock, Users, Trophy, Award, GraduationCap,
  UserPlus, UserCheck, Briefcase, Mail, Phone, X
} from 'lucide-react';
import { 
  NewsItem, SchoolProject, GalleryItem, VideoItem, 
  DocumentItem, StudentResult, SubjectScore, ContactMessage, PaymentRecord,
  SchoolMilestoneStats, DEFAULT_MILESTONE_STATS,
  StaffMember, StaffCategory
} from '../types';

interface AdminViewProps {
  isAdminLoggedIn: boolean;
  onLogin: (password: string) => boolean;
  onLogout: () => void;
  stats: {
    totalStudents: number;
    totalImages: number;
    totalVideos: number;
    totalDocuments: number;
    totalProjects: number;
    totalNewsPosts: number;
    unreadMessages: number;
    totalPayments?: number;
    pendingPayments?: number;
    verifiedRevenue?: number;
  };
  news: NewsItem[];
  projects: SchoolProject[];
  gallery: GalleryItem[];
  videos: VideoItem[];
  documents: DocumentItem[];
  results: StudentResult[];
  messages: ContactMessage[];
  payments: PaymentRecord[];
  staff?: StaffMember[];
  milestoneStats?: SchoolMilestoneStats;
  updateMilestoneStats?: (newStats: SchoolMilestoneStats) => void;
  // store mutators
  addNews: (item: Omit<NewsItem, "id" | "date">) => void;
  editNews: (id: string, fields: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;
  addProject: (item: Omit<SchoolProject, "id">) => void;
  editProject: (id: string, fields: Partial<SchoolProject>) => void;
  deleteProject: (id: string) => void;
  addGalleryItem: (item: Omit<GalleryItem, "id" | "uploadDate">) => void;
  deleteGalleryItem: (id: string) => void;
  addVideo: (item: Omit<VideoItem, "id" | "uploadDate">) => void;
  deleteVideo: (id: string) => void;
  addDocument: (item: Omit<DocumentItem, "id" | "uploadDate">) => void;
  deleteDocument: (id: string) => void;
  addResult: (item: StudentResult) => void;
  editResult?: (id: string, fields: Partial<StudentResult>) => void;
  deleteResult: (id: string) => void;
  importResultsList: (results: StudentResult[]) => void;
  addStaffMember?: (item: Omit<StaffMember, 'id'>) => void;
  editStaffMember?: (id: string, fields: Partial<StaffMember>) => void;
  deleteStaffMember?: (id: string) => void;
  markMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  onVerifyPayment?: (id: string, status: PaymentRecord['status']) => void;
  onDeletePayment?: (id: string) => void;
  supabaseStatus: 'idle' | 'connected' | 'error';
  pushAllLocalToSupabase: () => Promise<{ success: boolean; error?: string }>;
  pullAllFromSupabase: () => Promise<{ success: boolean; error?: string }>;
  onDisconnectSupabase?: () => void;
  onConnectSupabase?: (url: string, key: string) => Promise<{ success: boolean; error?: string }>;
}

export default function AdminView({
  isAdminLoggedIn, onLogin, onLogout, stats,
  news, projects, gallery, videos, documents, results, messages, payments = [],
  staff = [],
  milestoneStats, updateMilestoneStats,
  addNews, editNews, deleteNews, addProject, editProject, deleteProject,
  addGalleryItem, deleteGalleryItem, addVideo, deleteVideo, addDocument, deleteDocument,
  addResult, editResult, deleteResult, importResultsList, 
  addStaffMember, editStaffMember, deleteStaffMember,
  markMessageRead, deleteMessage,
  onVerifyPayment, onDeletePayment,
  supabaseStatus, pushAllLocalToSupabase, pullAllFromSupabase,
  onDisconnectSupabase, onConnectSupabase
}: AdminViewProps) {
  
  // Login Password input state
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard Sub-navigation panel
  const [activeTab, setActiveTab] = useState<'overview' | 'supabase' | 'news' | 'projects' | 'images' | 'videos' | 'documents' | 'results' | 'messages' | 'payments' | 'milestones' | 'staff'>('overview');

  // Milestone Statistics Form State
  const [editEnrolled, setEditEnrolled] = useState(milestoneStats?.enrolledStudents || '450+');
  const [editEducators, setEditEducators] = useState(milestoneStats?.professionalEducators || '38');
  const [editGraduates, setEditGraduates] = useState(milestoneStats?.exemplaryGraduates || '1,200+');
  const [editAwards, setEditAwards] = useState(milestoneStats?.stateAndNationalAwards || '15');
  const [statsSavedMessage, setStatsSavedMessage] = useState(false);

  // Administrative Board & Staff Registry State
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [isStaffFormOpen, setIsStaffFormOpen] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState('');
  const [staffCategory, setStaffCategory] = useState<StaffCategory>('Administrative Board');
  const [staffQualifications, setStaffQualifications] = useState('');
  const [staffImage, setStaffImage] = useState('');
  const [staffDesc, setStaffDesc] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffSearchQuery, setStaffSearchQuery] = useState('');
  const [staffCategoryFilter, setStaffCategoryFilter] = useState<'All' | StaffCategory>('All');
  const [staffSuccessNotice, setStaffSuccessNotice] = useState<string | null>(null);
  const staffFormRef = useRef<HTMLDivElement>(null);

  const STAFF_IMAGE_PRESETS = [
    { label: 'Clergy / Administrator', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400' },
    { label: 'Vice Principal (Academics)', url: 'https://images.unsplash.com/photo-1580894732444-8fecef2271ff?auto=format&fit=crop&q=80&w=400' },
    { label: 'Rev. Sister / Welfare', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400' },
    { label: 'Dean / Science Coord.', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400' },
    { label: 'HOD Mathematics', url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400' },
    { label: 'ICT & Robotics Head', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400' },
    { label: 'Languages Master', url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400' },
    { label: 'Bursar / Accountant', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400' },
  ];

  const resetStaffForm = () => {
    setEditingStaffId(null);
    setStaffName('');
    setStaffRole('');
    setStaffCategory('Administrative Board');
    setStaffQualifications('');
    setStaffImage('');
    setStaffDesc('');
    setStaffEmail('');
    setStaffPhone('');
  };

  const handleStartAddStaff = () => {
    resetStaffForm();
    setIsStaffFormOpen(true);
    setTimeout(() => {
      staffFormRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleStartEditStaff = (member: StaffMember) => {
    setEditingStaffId(member.id);
    setStaffName(member.name);
    setStaffRole(member.role);
    setStaffCategory(member.category);
    setStaffQualifications(member.qualifications || '');
    setStaffImage(member.image || '');
    setStaffDesc(member.desc || '');
    setStaffEmail(member.email || '');
    setStaffPhone(member.phone || '');
    setIsStaffFormOpen(true);
    setTimeout(() => {
      staffFormRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleStaffImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size exceeds 2MB limit. Please choose a smaller photo.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setStaffImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStaffFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim() || !staffRole.trim()) {
      alert("Please provide at least a full name and role/title.");
      return;
    }

    const payload = {
      name: staffName.trim(),
      role: staffRole.trim(),
      category: staffCategory,
      qualifications: staffQualifications.trim(),
      image: staffImage.trim() || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
      desc: staffDesc.trim() || 'Dedicated educator and mentor committed to academic excellence, leadership discipline, and positive character formation.',
      email: staffEmail.trim() || undefined,
      phone: staffPhone.trim() || undefined,
    };

    if (editingStaffId) {
      if (editStaffMember) {
        editStaffMember(editingStaffId, payload);
      }
      setStaffSuccessNotice(`Successfully updated records for ${payload.name}!`);
    } else {
      if (addStaffMember) {
        addStaffMember(payload);
      }
      setStaffSuccessNotice(`Successfully registered ${payload.name} as a new ${payload.category} member!`);
    }

    resetStaffForm();
    setIsStaffFormOpen(false);
    setTimeout(() => setStaffSuccessNotice(null), 4000);
  };

  const handleDeleteStaff = (member: StaffMember) => {
    setConfirmModal({
      title: `Delete ${member.category} Member`,
      message: `Are you sure you want to remove "${member.name}" (${member.role}) from the staff registry? This will immediately update the public About page.`,
      confirmText: 'Delete Member',
      onConfirm: () => {
        if (editingStaffId === member.id) {
          resetStaffForm();
          setIsStaffFormOpen(false);
        }
        if (deleteStaffMember) {
          deleteStaffMember(member.id);
          setStaffSuccessNotice(`Removed ${member.name} from staff directory.`);
          setTimeout(() => setStaffSuccessNotice(null), 3000);
        }
      }
    });
  };

  useEffect(() => {
    if (milestoneStats) {
      setEditEnrolled(milestoneStats.enrolledStudents || '450+');
      setEditEducators(milestoneStats.professionalEducators || '38');
      setEditGraduates(milestoneStats.exemplaryGraduates || '1,200+');
      setEditAwards(milestoneStats.stateAndNationalAwards || '15');
    }
  }, [milestoneStats]);

  const handleSaveMilestoneStats = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (updateMilestoneStats) {
      updateMilestoneStats({
        enrolledStudents: editEnrolled.trim() || '450+',
        professionalEducators: editEducators.trim() || '38',
        exemplaryGraduates: editGraduates.trim() || '1,200+',
        stateAndNationalAwards: editAwards.trim() || '15',
      });
      setStatsSavedMessage(true);
      setTimeout(() => setStatsSavedMessage(false), 3500);
    }
  };

  const handleResetMilestoneStats = () => {
    const defaultStats = {
      enrolledStudents: '450+',
      professionalEducators: '38',
      exemplaryGraduates: '1,200+',
      stateAndNationalAwards: '15',
    };
    setEditEnrolled(defaultStats.enrolledStudents);
    setEditEducators(defaultStats.professionalEducators);
    setEditGraduates(defaultStats.exemplaryGraduates);
    setEditAwards(defaultStats.stateAndNationalAwards);
    if (updateMilestoneStats) {
      updateMilestoneStats(defaultStats);
      setStatsSavedMessage(true);
      setTimeout(() => setStatsSavedMessage(false), 3500);
    }
  };

  // Interactive Confirmation Modal state (Iframe-safe alternative to window.confirm)
  const [confirmModal, setConfirmModal] = useState<{
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
  } | null>(null);

  // Payment search and filter state
  const [paymentSearch, setPaymentSearch] = useState('');
  const [paymentFilterStatus, setPaymentFilterStatus] = useState<'ALL' | 'Verified' | 'Pending Verification' | 'Rejected'>('ALL');

  // Form states
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState('Academic');
  const [newsImageUrl, setNewsImageUrl] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);

  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectImg, setProjectImg] = useState('');
  const [projectBudget, setProjectBudget] = useState('');
  const [projectStart, setProjectStart] = useState('');
  const [projectEnd, setProjectEnd] = useState('');
  const [projectProgress, setProjectProgress] = useState(0);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryCat, setGalleryCat] = useState('School Activities');
  const [galleryUrl, setGalleryUrl] = useState('');

  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDesc, setVideoDesc] = useState('');

  const [documentTitle, setDocumentTitle] = useState('');
  const [documentType, setDocumentType] = useState('pdf');
  const [documentUrlRaw, setDocumentUrlRaw] = useState('');
  const [documentPassword, setDocumentPassword] = useState('');

  const [csvRawText, setCsvRawText] = useState('');
  const [resultParseError, setResultParseError] = useState('');
  const [resultParseSuccess, setResultParseSuccess] = useState('');

  // Supabase live configuration state
  const [inputSupabaseUrl, setInputSupabaseUrl] = useState(localStorage.getItem('hgass_supabase_url') || '');
  const [inputSupabaseKey, setInputSupabaseKey] = useState(localStorage.getItem('hgass_supabase_anon_key') || '');
  const [syncMessage, setSyncMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDisconnectConfirming, setIsDisconnectConfirming] = useState(false);

  const [manualStudentId, setManualStudentId] = useState('');
  const [manualStudentName, setManualStudentName] = useState('');
  const [manualClass, setManualClass] = useState('SS 2');
  const [manualSession, setManualSession] = useState('2025/2026');
  const [manualTerm, setManualTerm] = useState('3rd Term');
  const [manualGender, setManualGender] = useState('Male');
  const [manualRollNo, setManualRollNo] = useState('');
  const [manualPos, setManualPos] = useState('');
  const [manualAttendance, setManualAttendance] = useState('');
  const [manualTeacherComment, setManualTeacherComment] = useState('');
  const [manualPrincipalComment, setManualPrincipalComment] = useState('');
  const [manualAccessPassword, setManualAccessPassword] = useState('');
  const [editingResultId, setEditingResultId] = useState<string | null>(null);
  const [resultsDeskTab, setResultsDeskTab] = useState<'edit' | 'create' | 'import' | 'roster'>('edit');
  const [resultNotice, setResultNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [resultsSearchQuery, setResultsSearchQuery] = useState('');
  const resultFormRef = useRef<HTMLFormElement | null>(null);
  const [subjectScoresInput, setSubjectScoresInput] = useState<SubjectScore[]>([
    { subject: 'Mathematics', testScore: 0, examScore: 0, totalScore: 0, grade: 'F', remarks: 'Fail' }
  ]);

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = onLogin(passwordInput);
    if (success) {
      setPasswordInput('');
    } else {
      setLoginError('Invalid access password. Please try again.');
    }
  };

  // Base64 helper for custom files
  const handleFileUploadBase64 = (e: React.ChangeEvent<HTMLInputElement>, target: 'gallery' | 'document') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size limit (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("File size exceeds the 2MB boundary limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      if (target === 'gallery') {
        setGalleryUrl(base64String);
      } else {
        setDocumentUrlRaw(base64String);
      }
    };
    reader.readAsDataURL(file);
  };

  // CRUD handlers: News
  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsContent.trim()) return;

    if (editingNewsId) {
      editNews(editingNewsId, {
        title: newsTitle,
        content: newsContent,
        category: newsCategory,
        imageUrl: newsImageUrl || undefined
      });
      setEditingNewsId(null);
    } else {
      addNews({
        title: newsTitle,
        content: newsContent,
        category: newsCategory,
        imageUrl: newsImageUrl || undefined,
        isPublished: true
      });
    }

    setNewsTitle('');
    setNewsContent('');
    setNewsImageUrl('');
    setNewsCategory('Academic');
  };

  const handleStartEditNews = (item: NewsItem) => {
    setEditingNewsId(item.id);
    setNewsTitle(item.title);
    setNewsContent(item.content);
    setNewsCategory(item.category);
    setNewsImageUrl(item.imageUrl || '');
  };

  // CRUD handlers: Projects
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim() || !projectDesc.trim() || !projectBudget.trim() || !projectStart.trim() || !projectEnd.trim()) return;

    const projData = {
      title: projectTitle,
      description: projectDesc,
      imageUrl: projectImg || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=400',
      budget: projectBudget,
      startDate: projectStart,
      expectedCompletionDate: projectEnd,
      percentageCompletion: Number(projectProgress)
    };

    if (editingProjectId) {
      editProject(editingProjectId, projData);
      setEditingProjectId(null);
    } else {
      addProject(projData);
    }

    setProjectTitle('');
    setProjectDesc('');
    setProjectImg('');
    setProjectBudget('');
    setProjectStart('');
    setProjectEnd('');
    setProjectProgress(0);
  };

  const handleStartEditProject = (proj: SchoolProject) => {
    setEditingProjectId(proj.id);
    setProjectTitle(proj.title);
    setProjectDesc(proj.description);
    setProjectImg(proj.imageUrl);
    setProjectBudget(proj.budget);
    setProjectStart(proj.startDate);
    setProjectEnd(proj.expectedCompletionDate);
    setProjectProgress(proj.percentageCompletion);
  };

  // CRUD handlers: Gallery
  const handleAddGallerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryTitle.trim() || !galleryUrl) {
      alert("Please provide a title and select/input an image.");
      return;
    }
    addGalleryItem({
      title: galleryTitle,
      category: galleryCat,
      imageUrl: galleryUrl
    });
    setGalleryTitle('');
    setGalleryUrl('');
    alert("Image successfully uploaded and added to the Gallery!");
  };

  // CRUD handlers: Videos
  const handleAddVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim() || !videoUrl.trim()) return;
    addVideo({
      title: videoTitle,
      url: videoUrl,
      description: videoDesc
    });
    setVideoTitle('');
    setVideoUrl('');
    setVideoDesc('');
    alert("Video URL successfully registered! It will now appear on the public board.");
  };

  // CRUD handlers: Documents
  const handleAddDocumentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentTitle.trim() || !documentUrlRaw) {
      alert("Please provide a title and select a file to upload.");
      return;
    }
    
    // Simulate size
    const sizeStr = `${(Math.random() * 2 + 0.1).toFixed(1)} MB`;

    addDocument({
      title: documentTitle,
      fileType: documentType,
      fileSize: sizeStr,
      downloadUrl: documentUrlRaw,
      accessPassword: documentPassword.trim() || undefined
    });

    setDocumentTitle('');
    setDocumentUrlRaw('');
    setDocumentPassword('');
    alert("Document registered successfully and added to Downloads!");
  };

  // CRUD handlers: Results (CSV Parser & Manual addition)
  const calculateGradeAndRemarks = (total: number) => {
    if (total >= 80) return { grade: 'A', remarks: 'Excellent' };
    if (total >= 70) return { grade: 'B', remarks: 'Very Good' };
    if (total >= 60) return { grade: 'C', remarks: 'Credit' };
    if (total >= 50) return { grade: 'D', remarks: 'Pass' };
    if (total >= 40) return { grade: 'E', remarks: 'Pass' };
    return { grade: 'F', remarks: 'Fail' };
  };

  const handleSubjectScoreChange = (index: number, field: 'subject' | 'testScore' | 'examScore', value: string) => {
    const updated = [...subjectScoresInput];
    if (field === 'subject') {
      updated[index].subject = value;
    } else {
      const numVal = Math.min(Math.max(Number(value) || 0, 0), field === 'testScore' ? 30 : 70);
      updated[index][field] = numVal;
      // Recalculate totals
      const total = updated[index].testScore + updated[index].examScore;
      updated[index].totalScore = total;
      const calc = calculateGradeAndRemarks(total);
      updated[index].grade = calc.grade;
      updated[index].remarks = calc.remarks;
    }
    setSubjectScoresInput(updated);
  };

  const addManualSubjectScoreField = () => {
    setSubjectScoresInput([...subjectScoresInput, { subject: '', testScore: 0, examScore: 0, totalScore: 0, grade: 'F', remarks: 'Fail' }]);
  };

  const removeSubjectScoreField = (index: number) => {
    if (subjectScoresInput.length <= 1) return;
    setSubjectScoresInput(subjectScoresInput.filter((_, i) => i !== index));
  };

  const resetManualResultForm = () => {
    setManualStudentId('');
    setManualStudentName('');
    setManualRollNo('');
    setManualPos('');
    setManualAttendance('');
    setManualTeacherComment('');
    setManualPrincipalComment('');
    setManualAccessPassword('');
    setSubjectScoresInput([{ subject: 'Mathematics', testScore: 0, examScore: 0, totalScore: 0, grade: 'F', remarks: 'Fail' }]);
  };

  const startEditingResult = (res: StudentResult) => {
    setEditingResultId(res.id);
    setManualStudentId(res.studentId);
    setManualStudentName(res.studentName);
    setManualClass(res.classLevel);
    setManualSession(res.academicSession);
    setManualTerm(res.term);
    setManualGender(res.gender);
    setManualRollNo(res.rollNumber);
    setManualPos(res.position);
    setManualAttendance(res.attendance || '');
    setManualTeacherComment(res.teacherRemarks || '');
    setManualPrincipalComment(res.principalRemarks || '');
    setManualAccessPassword(res.accessPassword || '');
    setSubjectScoresInput(
      res.subjectScores && res.subjectScores.length > 0
        ? JSON.parse(JSON.stringify(res.subjectScores))
        : [{ subject: 'Mathematics', testScore: 0, examScore: 0, totalScore: 0, grade: 'F', remarks: 'Fail' }]
    );
    setResultsDeskTab('edit');
    setResultNotice(null);
    setTimeout(() => {
      resultFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const cancelEditingResult = () => {
    setEditingResultId(null);
    resetManualResultForm();
  };

  const handleManualResultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualStudentId.trim() || !manualStudentName.trim() || !manualRollNo.trim() || !manualPos.trim()) {
      setResultNotice({ type: 'error', message: 'Please fill in core student registration details (Student ID, Name, Roll No, Position).' });
      setTimeout(() => setResultNotice(null), 4000);
      return;
    }

    if (editingResultId) {
      const studentNameUpdated = manualStudentName.trim();
      if (editResult) {
        editResult(editingResultId, {
          studentId: manualStudentId.trim(),
          studentName: studentNameUpdated,
          classLevel: manualClass,
          term: manualTerm,
          academicSession: manualSession,
          gender: manualGender,
          rollNumber: manualRollNo,
          position: manualPos,
          attendance: manualAttendance || "85 of 85 Days",
          principalRemarks: manualPrincipalComment || "Hardworking and highly disciplined.",
          teacherRemarks: manualTeacherComment || "An exemplary student. Keep it up.",
          subjectScores: subjectScoresInput,
          accessPassword: manualAccessPassword.trim() || undefined
        });
      }
      setEditingResultId(null);
      resetManualResultForm();
      setResultNotice({
        type: 'success',
        message: `Published student result sheet for "${studentNameUpdated}" was successfully updated! All changes are live on the student portal.`
      });
      setTimeout(() => setResultNotice(null), 6000);
      return;
    }

    const res: StudentResult = {
      id: `res-${Date.now()}`,
      studentId: manualStudentId.trim(),
      studentName: manualStudentName.trim(),
      classLevel: manualClass,
      term: manualTerm,
      academicSession: manualSession,
      gender: manualGender,
      rollNumber: manualRollNo,
      position: manualPos,
      attendance: manualAttendance || "85 of 85 Days",
      principalRemarks: manualPrincipalComment || "Hardworking and highly disciplined.",
      teacherRemarks: manualTeacherComment || "An exemplary student. Keep it up.",
      subjectScores: subjectScoresInput,
      accessPassword: manualAccessPassword.trim() || undefined
    };

    addResult(res);
    resetManualResultForm();
    setResultNotice({
      type: 'success',
      message: `New student report card record for "${res.studentName}" has been successfully published!`
    });
    setTimeout(() => setResultNotice(null), 6000);
  };

  // CSV Import Parser
  const handleImportCsv = () => {
    setResultParseError('');
    setResultParseSuccess('');

    if (!csvRawText.trim()) {
      setResultParseError('Please paste valid CSV content first.');
      return;
    }

    try {
      const lines = csvRawText.trim().split('\n');
      if (lines.length < 2) {
        setResultParseError('CSV must include at least 1 header line and 1 data line.');
        return;
      }

      // Quick check: let's expect a structure like:
      // studentId,studentName,classLevel,term,academicSession,gender,rollNumber,position,attendance,teacherRemarks,principalRemarks,subject,testScore,examScore
      
      const newResults: StudentResult[] = [];
      const studentMap = new Map<string, StudentResult>();

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Split CSV handling commas
        const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));

        if (cols.length < 14) {
          setResultParseError(`Row ${i + 1} has insufficient columns. Required at least 14.`);
          return;
        }

        const [
          sId, sName, cLevel, term, session, gender, roll, pos, att, tRemarks, pRemarks, 
          subject, test, exam, pass
        ] = cols;

        const testScore = Number(test) || 0;
        const examScore = Number(exam) || 0;
        const totalScore = testScore + examScore;
        const grading = calculateGradeAndRemarks(totalScore);

        const subScore: SubjectScore = {
          subject,
          testScore,
          examScore,
          totalScore,
          grade: grading.grade,
          remarks: grading.remarks
        };

        const key = `${sId}-${term}-${session}`;

        if (studentMap.has(key)) {
          const existing = studentMap.get(key)!;
          existing.subjectScores.push(subScore);
          if (pass && !existing.accessPassword) {
            existing.accessPassword = pass.trim();
          }
        } else {
          const record: StudentResult = {
            id: `res-csv-${Date.now()}-${i}`,
            studentId: sId,
            studentName: sName,
            classLevel: cLevel,
            term: term,
            academicSession: session,
            gender: gender,
            rollNumber: roll,
            position: pos,
            attendance: att,
            teacherRemarks: tRemarks,
            principalRemarks: pRemarks,
            accessPassword: pass ? pass.trim() : undefined,
            subjectScores: [subScore]
          };
          studentMap.set(key, record);
        }
      }

      // Add all processed map results to results
      const importedRecords = Array.from(studentMap.values());
      
      // Merge with existing
      const combined = [...results];
      importedRecords.forEach((imported) => {
        // filter out old duplicates
        const index = combined.findIndex(r => r.studentId === imported.studentId && r.term === imported.term && r.academicSession === imported.academicSession);
        if (index > -1) {
          combined[index] = imported;
        } else {
          combined.push(imported);
        }
      });

      importResultsList(combined);
      setResultParseSuccess(`Successfully imported ${importedRecords.length} student terminal records!`);
      setCsvRawText('');
    } catch (e: any) {
      setResultParseError(`Parse error occurred: ${e.message}`);
    }
  };

  // Export Results to JSON copy/download
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `HGASS_Student_Results_Export_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // --- SUPABASE SYNCHRONIZATION EVENT HANDLERS ---
  const handleSaveSupabaseCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('hgass_supabase_url', inputSupabaseUrl.trim());
      localStorage.setItem('hgass_supabase_anon_key', inputSupabaseKey.trim());
      if (onConnectSupabase) {
        setSyncMessage({
          text: 'Linking and syncing with Supabase PostgreSQL cloud database...',
          type: 'info'
        });
        const res = await onConnectSupabase(inputSupabaseUrl.trim(), inputSupabaseKey.trim());
        if (res.success) {
          setSyncMessage({
            text: 'Successfully linked and synchronized with Supabase cloud database!',
            type: 'success'
          });
        } else {
          setSyncMessage({
            text: `Supabase credentials saved. Verification note: ${res.error || 'Check table access & policies'}`,
            type: 'error'
          });
        }
      } else {
        setSyncMessage({
          text: 'Credentials updated successfully in local configuration.',
          type: 'success'
        });
      }
    } catch (err: any) {
      setSyncMessage({
        text: `Failed to save configuration: ${err.message}`,
        type: 'error'
      });
    }
  };

  const handleClearSupabaseCredentials = () => {
    try {
      localStorage.removeItem('hgass_supabase_url');
      localStorage.removeItem('hgass_supabase_anon_key');
      setInputSupabaseUrl('');
      setInputSupabaseKey('');
      setIsDisconnectConfirming(false);
      if (onDisconnectSupabase) {
        onDisconnectSupabase();
      }
      setSyncMessage({
        text: 'Supabase database disconnected successfully. The portal has returned to local storage mode.',
        type: 'info'
      });
    } catch (err: any) {
      setSyncMessage({
        text: `Error disconnecting from Supabase: ${err.message}`,
        type: 'error'
      });
    }
  };

  const handlePushSync = async () => {
    setIsSyncing(true);
    setSyncMessage({ text: 'Migrating and pushing local records to Supabase tables...', type: 'info' });
    const res = await pushAllLocalToSupabase();
    setIsSyncing(false);
    if (res.success) {
      setSyncMessage({ text: 'All local announcements, projects, galleries, results and messages have been pushed successfully to your Supabase PostgreSQL database!', type: 'success' });
    } else {
      setSyncMessage({ text: `Sync push failed: ${res.error || 'Ensure tables exist and columns match.'}`, type: 'error' });
    }
  };

  const handlePullSync = async () => {
    setIsSyncing(true);
    setSyncMessage({ text: 'Fetching and pulling tables from Supabase database...', type: 'info' });
    const res = await pullAllFromSupabase();
    setIsSyncing(false);
    if (res.success) {
      setSyncMessage({ text: 'Diocesan portal cached state has been fully refreshed from the latest Supabase database rows!', type: 'success' });
    } else {
      setSyncMessage({ text: `Sync pull failed: ${res.error || 'Ensure tables exist and RLS allows select operations.'}`, type: 'error' });
    }
  };

  // --- RENDERING VIEWS ---

  // CASE A: NOT LOGGED IN - Secure Access Card
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center bg-slate-100/50 px-4">
        <div className="max-w-sm w-full bg-white rounded-lg border border-slate-200 shadow-md p-6 space-y-4 relative overflow-hidden">
          
          {/* Top colored highlight */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-brand-oxblood" />

          <div className="text-center space-y-1">
            <div className="mx-auto w-12 h-12 bg-brand-oxblood/10 rounded-full flex items-center justify-center border border-brand-oxblood/15 text-brand-oxblood">
              <ShieldCheck className="w-6 h-6 text-brand-oxblood animate-pulse" />
            </div>
            <h2 className="text-lg font-black font-heading text-brand-green uppercase tracking-tight">Admin Portal</h2>
            <p className="text-[11px] text-slate-400">Provide credentials to access administrative systems.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            {loginError && (
              <p className="text-xs font-semibold text-red-600 bg-red-50 p-2 rounded border border-red-100 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1 text-red-600 shrink-0" />
                {loginError}
              </p>
            )}

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">Enter Admin Password</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="block w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs focus:ring-2 focus:ring-brand-green/35 focus:outline-hidden"
              />
              <p className="text-[9px] text-slate-400 italic">Default specification: <strong className="text-brand-oxblood">HGASS@25</strong></p>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-green hover:bg-brand-green-dark text-white py-2.5 rounded text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-sm"
            >
              Sign In to Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // CASE B: LOGGED IN - Full Administration Dashboard
  return (
    <div className="font-sans text-gray-700 bg-slate-50 min-h-screen">
      
      {/* Top Admin Bar */}
      <div className="bg-brand-green text-white px-4 py-2.5 md:px-6 border-b border-brand-yellow/30 shadow-xs flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-brand-yellow">
            <Database className="w-4.5 h-4.5 text-brand-yellow" />
          </div>
          <div>
            <h3 className="text-xs font-black font-heading text-brand-yellow uppercase">HGASS Central Administration Node</h3>
            <p className="text-[9px] text-green-200 uppercase tracking-widest font-bold">Pentecostal Church Board, Anambra State</p>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          className="bg-brand-oxblood hover:bg-brand-oxblood/90 text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition flex items-center space-x-1 cursor-pointer border border-brand-yellow/20"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Lock Console</span>
        </button>
      </div>

      {/* Main Grid: Left Tabs Sidebar, Right Tab Canvas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* TABS SIDEBAR (Left) */}
          <div className="lg:col-span-3 bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs space-y-1">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: Database },
              { id: 'milestones', label: 'School Key Statistics', icon: Award },
              { id: 'staff', label: 'Administrative Board & Staff', icon: Users, badge: staff.length },
              { id: 'payments', label: 'Payments & Fees (UBA)', icon: CreditCard, badge: stats.pendingPayments },
              { id: 'supabase', label: 'Supabase Integration', icon: RefreshCw },
              { id: 'news', label: 'News & Announcements', icon: FileText },
              { id: 'projects', label: 'Ongoing Projects', icon: Layers },
              { id: 'images', label: 'Image Management', icon: ImageIcon },
              { id: 'videos', label: 'Video Catalog', icon: Film },
              { id: 'documents', label: 'Document Library', icon: FileSpreadsheet },
              { id: 'results', label: 'Academic Grade Book Registrar', icon: FileText, badge: results.length },
              { id: 'messages', label: 'Contact Messages', icon: MessageSquare, badge: stats.unreadMessages }
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full text-left px-3 py-2 rounded text-xs font-bold tracking-wide flex items-center justify-between transition cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-brand-green text-white font-black shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-brand-green'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <TabIcon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </span>
                  {tab.badge && tab.badge > 0 ? (
                    <span className="bg-brand-oxblood text-brand-yellow text-[8px] font-bold px-1.5 py-0.5 rounded border border-brand-yellow/20">
                      {tab.badge}
                    </span>
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 opacity-30" />
                  )}
                </button>
              );
            })}
          </div>

          {/* DYNAMIC TAB CANVAS (Right) */}
          <div className="lg:col-span-9 bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
            
            {/* T-1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-0.5">
                  <h3 className="text-lg font-black font-heading text-brand-green uppercase tracking-tight">Console Control Overview</h3>
                  <p className="text-xs text-slate-400">Inspect system stat metrics and manage client-side portal libraries.</p>
                </div>

                {/* Stat Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Total Students', value: stats.totalStudents, icon: Database, color: 'border-l-2 border-brand-green text-brand-green bg-brand-green/5' },
                    { label: 'Total Remittances', value: payments.length, icon: CreditCard, color: 'border-l-2 border-red-600 text-red-700 bg-red-50' },
                    { label: 'Pending Verification', value: stats.pendingPayments || 0, icon: CreditCard, color: 'border-l-2 border-amber-500 text-amber-700 bg-amber-50' },
                    { label: 'Verified Inflow', value: `₦${((stats.verifiedRevenue || 0) / 1000).toFixed(0)}k`, icon: CreditCard, color: 'border-l-2 border-brand-green text-brand-green bg-brand-green/5' },
                    { label: 'Total Images', value: stats.totalImages, icon: ImageIcon, color: 'border-l-2 border-brand-oxblood text-brand-oxblood bg-brand-oxblood/5' },
                    { label: 'Total Videos', value: stats.totalVideos, icon: Film, color: 'border-l-2 border-brand-yellow text-amber-600 bg-amber-50' },
                    { label: 'Total Documents', value: stats.totalDocuments, icon: FileSpreadsheet, color: 'border-l-2 border-brand-green text-brand-green bg-brand-green/5' },
                    { label: 'Ongoing Projects', value: stats.totalProjects, icon: Layers, color: 'border-l-2 border-brand-oxblood text-brand-oxblood bg-brand-oxblood/5' },
                    { label: 'News Publications', value: stats.totalNewsPosts, icon: FileText, color: 'border-l-2 border-brand-green text-brand-green bg-brand-green/5' },
                    { label: 'Contact Messages', value: messages.length, icon: MessageSquare, color: 'border-l-2 border-brand-yellow text-amber-600 bg-amber-50' }
                  ].map((statCard, index) => {
                    const CardIcon = statCard.icon;
                    return (
                      <div key={index} className={`p-3 rounded border border-slate-100 flex flex-col justify-between ${statCard.color}`}>
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] uppercase font-bold tracking-wider leading-none text-slate-400">{statCard.label}</span>
                          <CardIcon className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        </div>
                        <h4 className="text-xl font-black font-heading mt-1">{statCard.value}</h4>
                      </div>
                    );
                  })}
                </div>

                {/* Homepage Key Milestone Counters Editor in Overview */}
                <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Award className="w-5 h-5 text-brand-yellow" />
                        <h4 className="font-bold text-sm font-heading text-brand-green uppercase tracking-tight">
                          Homepage Milestone Statistics
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Manage the 4 official statistical counters displayed on the public homepage banner.
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab('milestones')}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Dedicated View</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveMilestoneStats}
                        className="px-3 py-1.5 bg-brand-green hover:bg-brand-green-dark text-white rounded text-xs font-bold transition flex items-center space-x-1 cursor-pointer shadow-xs"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>

                  {statsSavedMessage && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-xs flex items-center space-x-2 animate-fade-in font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Milestone statistics updated successfully! Public homepage is now synchronized.</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveMilestoneStats} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    <div className="space-y-1.5 bg-slate-50 p-3 rounded border border-slate-200">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
                        <Users className="w-4 h-4 text-brand-green" />
                        <span>Enrolled Students</span>
                      </div>
                      <input
                        type="text"
                        value={editEnrolled}
                        onChange={(e) => setEditEnrolled(e.target.value)}
                        placeholder="e.g. 450+"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-brand-green/30 focus:outline-hidden"
                      />
                      <span className="text-[10px] text-slate-400 block">Active student population (e.g. 450+, 500)</span>
                    </div>

                    <div className="space-y-1.5 bg-slate-50 p-3 rounded border border-slate-200">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
                        <GraduationCap className="w-4 h-4 text-brand-oxblood" />
                        <span>Professional Educators</span>
                      </div>
                      <input
                        type="text"
                        value={editEducators}
                        onChange={(e) => setEditEducators(e.target.value)}
                        placeholder="e.g. 38"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-brand-green/30 focus:outline-hidden"
                      />
                      <span className="text-[10px] text-slate-400 block">Qualified faculty & teachers (e.g. 38, 42)</span>
                    </div>

                    <div className="space-y-1.5 bg-slate-50 p-3 rounded border border-slate-200">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <span>Exemplary Graduates</span>
                      </div>
                      <input
                        type="text"
                        value={editGraduates}
                        onChange={(e) => setEditGraduates(e.target.value)}
                        placeholder="e.g. 1,200+"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-brand-green/30 focus:outline-hidden"
                      />
                      <span className="text-[10px] text-slate-400 block">Graduated academy alumni (e.g. 1,200+)</span>
                    </div>

                    <div className="space-y-1.5 bg-slate-50 p-3 rounded border border-slate-200">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
                        <Award className="w-4 h-4 text-brand-green" />
                        <span>State & National Awards</span>
                      </div>
                      <input
                        type="text"
                        value={editAwards}
                        onChange={(e) => setEditAwards(e.target.value)}
                        placeholder="e.g. 15"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-brand-green/30 focus:outline-hidden"
                      />
                      <span className="text-[10px] text-slate-400 block">Honors & competition titles (e.g. 15, 20)</span>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-4 flex items-center justify-end space-x-3 pt-1">
                      <button
                        type="button"
                        onClick={handleResetMilestoneStats}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reset to Defaults</span>
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-brand-green hover:bg-brand-green-dark text-white rounded text-xs font-bold transition flex items-center space-x-1 cursor-pointer shadow-xs"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Milestone Statistics</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Administrative Board & Staff Registry Overview Card */}
                <div className="bg-white rounded p-4 border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-lg bg-brand-oxblood/10 flex items-center justify-center text-brand-oxblood font-bold shrink-0">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-800 uppercase tracking-tight">Administrative Board & Staff Registry</h4>
                        <p className="text-[10px] text-slate-400">Total {staff.length} active registered faculty, leadership, and governing board members</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={handleStartAddStaff}
                        className="px-3 py-1 bg-brand-oxblood hover:bg-brand-oxblood-dark text-white rounded text-[11px] font-bold uppercase transition flex items-center space-x-1 cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5 mr-1" />
                        <span>Add New Member</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('staff')}
                        className="px-3 py-1 bg-brand-green hover:bg-brand-green-dark text-white rounded text-[11px] font-bold uppercase transition flex items-center space-x-1 cursor-pointer"
                      >
                        <span>Manage Registry</span>
                        <ChevronRight className="w-3 h-3 ml-0.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div 
                      onClick={() => { setStaffCategoryFilter('Administrative Board'); setActiveTab('staff'); }}
                      className="p-2.5 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer transition flex items-center justify-between"
                    >
                      <div>
                        <p className="text-[10px] uppercase font-bold text-brand-oxblood">Administrative Board</p>
                        <p className="text-lg font-black font-heading text-slate-800">{staff.filter(s => s.category === 'Administrative Board').length}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>

                    <div 
                      onClick={() => { setStaffCategoryFilter('Academic Staff'); setActiveTab('staff'); }}
                      className="p-2.5 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer transition flex items-center justify-between"
                    >
                      <div>
                        <p className="text-[10px] uppercase font-bold text-brand-green">Academic Staff</p>
                        <p className="text-lg font-black font-heading text-slate-800">{staff.filter(s => s.category === 'Academic Staff').length}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>

                    <div 
                      onClick={() => { setStaffCategoryFilter('Non-Academic Staff'); setActiveTab('staff'); }}
                      className="p-2.5 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer transition flex items-center justify-between"
                    >
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-600">Non-Academic Staff</p>
                        <p className="text-lg font-black font-heading text-slate-800">{staff.filter(s => s.category === 'Non-Academic Staff').length}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* Informational helpful tips */}
                <div className="bg-slate-50 rounded p-4 border border-slate-200 space-y-1.5 text-[11px] text-slate-500">
                  <h4 className="font-bold text-xs text-brand-green font-heading uppercase flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-brand-green mr-1.5 shrink-0" />
                    Secure Local-Persistence Module
                  </h4>
                  <p className="leading-relaxed">
                    This administrative portal uses high-speed secure client-side storage to manage content dynamically. Images uploaded are converted instantly into data streams, allowing immediate preview without complex external database delays. 
                  </p>
                  <p className="leading-relaxed font-semibold">
                    You can manage images in Gallery, publish new stories, update project completion benchmarks, input students scores, and download records. To clear all mock edits and return to diocesan seeded data, clear your browser local storage or session cache.
                  </p>
                </div>
              </div>
            )}

            {/* T-MILESTONES: SCHOOL KEY STATISTICS */}
            {activeTab === 'milestones' && (
              <div className="space-y-6 animate-fade-in font-sans">
                {/* Header banner */}
                <div className="bg-gradient-to-r from-brand-green to-brand-green-dark text-white rounded-lg p-6 shadow-sm border border-brand-yellow/30">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Award className="w-6 h-6 text-brand-yellow shrink-0" />
                        <h3 className="text-xl font-black font-heading text-white tracking-tight">
                          School Key Statistics & Milestone Counters
                        </h3>
                      </div>
                      <p className="text-xs text-green-100 max-w-2xl leading-relaxed">
                        Customize the four official achievement figures highlighted on the Holy Ghost Academy homepage banner. Changes persist in local storage and instantly update the public visitor view.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleResetMilestoneStats}
                        className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-bold uppercase tracking-wider transition cursor-pointer border border-white/20 flex items-center space-x-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reset Defaults</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveMilestoneStats}
                        className="px-4 py-2 bg-brand-yellow hover:bg-amber-400 text-brand-green-dark rounded text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-sm flex items-center space-x-1.5"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Feedback Toast */}
                {statsSavedMessage && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm flex items-center space-x-3 shadow-xs animate-fade-in font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold">Milestone Statistics Saved Successfully!</p>
                      <p className="text-xs font-normal text-emerald-700 mt-0.5">The public homepage banner counters have been updated with your new values.</p>
                    </div>
                  </div>
                )}

                {/* Edit Form Grid */}
                <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-xs space-y-6">
                  <div className="border-b border-slate-100 pb-3">
                    <h4 className="font-bold text-sm text-slate-800 font-heading uppercase tracking-wide">
                      Edit Public Metric Values
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Enter the exact figures you wish to display. You can include standard symbols like "+" or "," (e.g. 450+, 1,200+).
                    </p>
                  </div>

                  <form onSubmit={handleSaveMilestoneStats} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* 1. Enrolled Students */}
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 hover:border-brand-green/50 transition">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center space-x-2">
                            <div className="w-7 h-7 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center">
                              <Users className="w-4 h-4" />
                            </div>
                            <span>Enrolled Students</span>
                          </label>
                          <span className="text-[10px] uppercase font-bold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded">Metric 1</span>
                        </div>
                        <input
                          type="text"
                          value={editEnrolled}
                          onChange={(e) => setEditEnrolled(e.target.value)}
                          placeholder="e.g. 450+"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-md text-sm font-bold text-slate-900 focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green focus:outline-hidden"
                        />
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Represents active registered learners across Junior and Senior secondary classes.
                        </p>
                      </div>

                      {/* 2. Professional Educators */}
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 hover:border-brand-oxblood/50 transition">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center space-x-2">
                            <div className="w-7 h-7 rounded-full bg-brand-oxblood/10 text-brand-oxblood flex items-center justify-center">
                              <GraduationCap className="w-4 h-4" />
                            </div>
                            <span>Professional Educators</span>
                          </label>
                          <span className="text-[10px] uppercase font-bold text-brand-oxblood bg-brand-oxblood/10 px-2 py-0.5 rounded">Metric 2</span>
                        </div>
                        <input
                          type="text"
                          value={editEducators}
                          onChange={(e) => setEditEducators(e.target.value)}
                          placeholder="e.g. 38"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-md text-sm font-bold text-slate-900 focus:ring-2 focus:ring-brand-oxblood/40 focus:border-brand-oxblood focus:outline-hidden"
                        />
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Certified subject educators, laboratory technicians, and specialized academic counselors.
                        </p>
                      </div>

                      {/* 3. Exemplary Graduates */}
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 hover:border-amber-400 transition">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center space-x-2">
                            <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                              <Trophy className="w-4 h-4" />
                            </div>
                            <span>Exemplary Graduates</span>
                          </label>
                          <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">Metric 3</span>
                        </div>
                        <input
                          type="text"
                          value={editGraduates}
                          onChange={(e) => setEditGraduates(e.target.value)}
                          placeholder="e.g. 1,200+"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-md text-sm font-bold text-slate-900 focus:ring-2 focus:ring-amber-400/40 focus:border-amber-500 focus:outline-hidden"
                        />
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Distinguished alumni excelling in tertiary universities, medicine, engineering, and civic service.
                        </p>
                      </div>

                      {/* 4. State & National Awards */}
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 hover:border-brand-green/50 transition">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center space-x-2">
                            <div className="w-7 h-7 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center">
                              <Award className="w-4 h-4" />
                            </div>
                            <span>State & National Awards</span>
                          </label>
                          <span className="text-[10px] uppercase font-bold text-brand-green bg-brand-green/10 px-2 py-0.5 rounded">Metric 4</span>
                        </div>
                        <input
                          type="text"
                          value={editAwards}
                          onChange={(e) => setEditAwards(e.target.value)}
                          placeholder="e.g. 15"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-md text-sm font-bold text-slate-900 focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green focus:outline-hidden"
                        />
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Accredited state competitions, STEM championships, and academic quiz trophies.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handleResetMilestoneStats}
                        className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center space-x-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reset to Factory Defaults</span>
                      </button>
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-6 py-2.5 bg-brand-green hover:bg-brand-green-dark text-white rounded text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-sm flex items-center justify-center space-x-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save & Publish to Homepage</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Live Ribbon Preview */}
                <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-brand-green" />
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 font-heading">
                        Real-Time Homepage Banner Preview
                      </h4>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded uppercase">
                      Live Preview
                    </span>
                  </div>

                  {/* Public Ribbon Simulation */}
                  <div className="bg-brand-oxblood text-white rounded-xl p-6 sm:p-8 shadow-md border border-brand-yellow/20">
                    <div className="text-center mb-6">
                      <span className="text-[10px] uppercase font-bold text-brand-yellow tracking-widest bg-black/20 px-3 py-1 rounded-full border border-brand-yellow/20">
                        HOLY GHOST ACADEMY MILESTONES
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                      <div className="space-y-1.5 p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="w-8 h-8 rounded-full bg-white/10 text-brand-yellow flex items-center justify-center mx-auto">
                          <Users className="w-4 h-4" />
                        </div>
                        <h4 className="text-2xl sm:text-3xl font-black font-heading text-brand-yellow">
                          {editEnrolled || '450+'}
                        </h4>
                        <p className="text-[11px] uppercase font-bold tracking-wider text-slate-200">
                          Enrolled Students
                        </p>
                      </div>

                      <div className="space-y-1.5 p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="w-8 h-8 rounded-full bg-white/10 text-brand-yellow flex items-center justify-center mx-auto">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <h4 className="text-2xl sm:text-3xl font-black font-heading text-brand-yellow">
                          {editEducators || '38'}
                        </h4>
                        <p className="text-[11px] uppercase font-bold tracking-wider text-slate-200">
                          Professional Educators
                        </p>
                      </div>

                      <div className="space-y-1.5 p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="w-8 h-8 rounded-full bg-white/10 text-brand-yellow flex items-center justify-center mx-auto">
                          <Trophy className="w-4 h-4" />
                        </div>
                        <h4 className="text-2xl sm:text-3xl font-black font-heading text-brand-yellow">
                          {editGraduates || '1,200+'}
                        </h4>
                        <p className="text-[11px] uppercase font-bold tracking-wider text-slate-200">
                          Exemplary Graduates
                        </p>
                      </div>

                      <div className="space-y-1.5 p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="w-8 h-8 rounded-full bg-white/10 text-brand-yellow flex items-center justify-center mx-auto">
                          <Award className="w-4 h-4" />
                        </div>
                        <h4 className="text-2xl sm:text-3xl font-black font-heading text-brand-yellow">
                          {editAwards || '15'}
                        </h4>
                        <p className="text-[11px] uppercase font-bold tracking-wider text-slate-200">
                          State & National Awards
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* T-STAFF: ADMINISTRATIVE BOARD & STAFF MANAGEMENT */}
            {activeTab === 'staff' && (
              <div className="space-y-6 animate-fade-in font-sans">
                {/* Header & Quick Action */}
                <div className="bg-gradient-to-r from-brand-oxblood via-brand-oxblood-dark to-slate-900 text-white rounded-lg p-5 shadow-sm border border-brand-yellow/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-brand-yellow shrink-0" />
                      <h3 className="text-lg font-black font-heading text-white tracking-tight uppercase">
                        Administrative Board & Staff Registry
                      </h3>
                    </div>
                    <p className="text-xs text-slate-200 max-w-xl font-light leading-relaxed">
                      Register and edit members of the school governing board, academic faculty educators, and support staff. Changes are automatically reflected live on the public About page.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleStartAddStaff}
                    className="px-4 py-2 bg-brand-yellow hover:bg-yellow-400 text-brand-oxblood-dark rounded-md text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-sm flex items-center justify-center space-x-1.5 shrink-0"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add New Member</span>
                  </button>
                </div>

                {/* Success Notification Alert */}
                {staffSuccessNotice && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-emerald-800 text-xs font-semibold flex items-center justify-between animate-fade-in">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{staffSuccessNotice}</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setStaffSuccessNotice(null)}
                      className="text-emerald-700 hover:text-emerald-950 p-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Add / Edit Form Drawer */}
                {isStaffFormOpen && (
                  <div 
                    ref={staffFormRef}
                    className={`p-5 rounded-lg border transition space-y-4 shadow-sm ${
                      editingStaffId 
                        ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/25' 
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                      <div className="flex items-center space-x-2">
                        {editingStaffId ? (
                          <div className="p-1.5 rounded bg-amber-200 text-amber-900">
                            <Edit className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="p-1.5 rounded bg-brand-green text-white">
                            <UserPlus className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-sm text-slate-800 uppercase tracking-tight">
                            {editingStaffId ? `Edit Staff Member: ${staffName || 'Selected Member'}` : 'Register New Staff or Board Member'}
                          </h4>
                          <p className="text-[10px] text-slate-500">
                            {editingStaffId 
                              ? 'Modify member role, category, credentials, or bio. Click "Update Member Profile" to save.' 
                              : 'Complete the form below to add a new member to the school board or staff directory.'}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => { resetStaffForm(); setIsStaffFormOpen(false); }}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200 cursor-pointer"
                        title="Close Form"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleStaffFormSubmit} className="space-y-4">
                      {/* Top Row: Category, Name, Role */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                            Staff / Board Category <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={staffCategory}
                            onChange={(e) => setStaffCategory(e.target.value as StaffCategory)}
                            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-brand-green/30 focus:outline-hidden cursor-pointer"
                          >
                            <option value="Administrative Board">Administrative Board</option>
                            <option value="Academic Staff">Academic Staff</option>
                            <option value="Non-Academic Staff">Non-Academic Staff</option>
                          </select>
                          <p className="text-[9px] text-slate-400">Determines grouping tab on the public About page</p>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                            Full Name & Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Rev. Fr. Dr. Bartholomew Oguejiofor"
                            value={staffName}
                            onChange={(e) => setStaffName(e.target.value)}
                            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-brand-green/30 focus:outline-hidden"
                          />
                          <p className="text-[9px] text-slate-400">Include clerical or academic prefixes if any</p>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                            Official Role / Designation <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Manager / Spiritual Director, Principal"
                            value={staffRole}
                            onChange={(e) => setStaffRole(e.target.value)}
                            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-brand-green/30 focus:outline-hidden"
                          />
                          <p className="text-[9px] text-slate-400">e.g. Vice Principal (Academics), HOD Chemistry</p>
                        </div>
                      </div>

                      {/* Row 2: Qualifications, Email, Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1">
                            <GraduationCap className="w-3 h-3 text-brand-green" />
                            <span>Qualifications & Degrees</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. B.Th (Rome), M.Sc (Educ. Mgt), Ph.D"
                            value={staffQualifications}
                            onChange={(e) => setStaffQualifications(e.target.value)}
                            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-brand-green/30 focus:outline-hidden"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1">
                            <Mail className="w-3 h-3 text-brand-oxblood" />
                            <span>Official Email (Optional)</span>
                          </label>
                          <input
                            type="email"
                            placeholder="e.g. manager@holyghostacademy.ng"
                            value={staffEmail}
                            onChange={(e) => setStaffEmail(e.target.value)}
                            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:ring-2 focus:ring-brand-green/30 focus:outline-hidden"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1">
                            <Phone className="w-3 h-3 text-brand-green" />
                            <span>Office Phone (Optional)</span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. +234 803 123 4567"
                            value={staffPhone}
                            onChange={(e) => setStaffPhone(e.target.value)}
                            className="block w-full px-3 py-2 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:ring-2 focus:ring-brand-green/30 focus:outline-hidden"
                          />
                        </div>
                      </div>

                      {/* Row 3: Photo Management (URL, Device Upload, Presets, Preview) */}
                      <div className="space-y-2 bg-white p-3.5 rounded border border-slate-200">
                        <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1">
                          <ImageIcon className="w-3.5 h-3.5 text-brand-green" />
                          <span>Member Portrait Photo</span>
                        </label>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                          {/* Live preview */}
                          <div className="md:col-span-2 flex flex-col items-center justify-center p-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-brand-green/30 bg-slate-200 flex items-center justify-center">
                              {staffImage ? (
                                <img
                                  src={staffImage}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <Users className="w-8 h-8 text-slate-400" />
                              )}
                            </div>
                            <span className="text-[9px] text-slate-400 font-bold uppercase mt-1">Preview</span>
                          </div>

                          {/* Inputs: URL or Device File */}
                          <div className="md:col-span-10 space-y-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <span className="block text-[9px] font-bold text-slate-400 uppercase">Option 1: Paste Image URL</span>
                                <input
                                  type="url"
                                  placeholder="https://images.unsplash.com/..."
                                  value={staffImage}
                                  onChange={(e) => setStaffImage(e.target.value)}
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono text-slate-700 focus:ring-2 focus:ring-brand-green/30 focus:outline-hidden"
                                />
                              </div>

                              <div>
                                <span className="block text-[9px] font-bold text-slate-400 uppercase">Option 2: Upload from Device</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleStaffImageUpload}
                                  className="block w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-brand-green/10 file:text-brand-green file:cursor-pointer"
                                />
                              </div>
                            </div>

                            {/* Preset Buttons */}
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold text-slate-400 uppercase block">Or choose standard portrait avatar:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {STAFF_IMAGE_PRESETS.map((preset, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setStaffImage(preset.url)}
                                    className={`text-[10px] px-2 py-0.5 rounded border transition cursor-pointer ${
                                      staffImage === preset.url 
                                        ? 'bg-brand-green text-white border-brand-green font-bold' 
                                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                                    }`}
                                  >
                                    {preset.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Row 4: Bio / Responsibilities */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                          Member Profile Summary & Responsibilities
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Provide a brief biography, administrative purview, or teaching subjects..."
                          value={staffDesc}
                          onChange={(e) => setStaffDesc(e.target.value)}
                          className="block w-full p-2.5 bg-white border border-slate-300 rounded text-xs text-slate-700 leading-relaxed focus:ring-2 focus:ring-brand-green/30 focus:outline-hidden"
                        />
                      </div>

                      {/* Submit and Cancel Buttons */}
                      <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={() => { resetStaffForm(); setIsStaffFormOpen(false); }}
                          className="w-full sm:w-auto px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className={`w-full sm:w-auto px-5 py-2 text-white rounded text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center space-x-1.5 shadow-sm ${
                            editingStaffId 
                              ? 'bg-amber-600 hover:bg-amber-700 border border-amber-700' 
                              : 'bg-brand-green hover:bg-brand-green-dark border border-brand-green'
                          }`}
                        >
                          {editingStaffId ? <Save className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                          <span>{editingStaffId ? 'Update Member Profile' : 'Save Member to Directory'}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Filter and Search Bar */}
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Category Pills */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(['All', 'Administrative Board', 'Academic Staff', 'Non-Academic Staff'] as const).map((cat) => {
                      const count = cat === 'All' 
                        ? staff.length 
                        : staff.filter(s => s.category === cat).length;
                      const isSelected = staffCategoryFilter === cat;

                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setStaffCategoryFilter(cat)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 ${
                            isSelected
                              ? 'bg-brand-green text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <span>{cat}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Search Query */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by name, role, qualification..."
                      value={staffSearchQuery}
                      onChange={(e) => setStaffSearchQuery(e.target.value)}
                      className="w-full sm:w-64 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-brand-green/30 focus:outline-hidden"
                    />
                    {staffSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setStaffSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Staff Cards Roster */}
                {(() => {
                  const filteredList = staff.filter((m) => {
                    const matchesCategory = staffCategoryFilter === 'All' || m.category === staffCategoryFilter;
                    if (!matchesCategory) return false;
                    if (!staffSearchQuery.trim()) return true;
                    const q = staffSearchQuery.toLowerCase();
                    return (
                      m.name.toLowerCase().includes(q) ||
                      m.role.toLowerCase().includes(q) ||
                      (m.qualifications && m.qualifications.toLowerCase().includes(q)) ||
                      (m.desc && m.desc.toLowerCase().includes(q))
                    );
                  });

                  if (filteredList.length === 0) {
                    return (
                      <div className="p-8 text-center bg-white rounded-lg border border-slate-200 space-y-3">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                          <Users className="w-6 h-6" />
                        </div>
                        <div className="space-y-1 max-w-sm mx-auto">
                          <p className="text-xs font-bold text-slate-700 uppercase">No Staff Members Found</p>
                          <p className="text-[11px] text-slate-400">
                            {staffSearchQuery 
                              ? `No staff or board member matches "${staffSearchQuery}". Try clearing search filter.`
                              : `No records under "${staffCategoryFilter}". Click "Add New Member" to register one.`}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleStartAddStaff}
                          className="px-3.5 py-1.5 bg-brand-green hover:bg-brand-green-dark text-white rounded text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                        >
                          + Add Member Now
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {filteredList.map((member) => {
                        const isEditingThis = editingStaffId === member.id;
                        const isBoard = member.category === 'Administrative Board';
                        const isAcademic = member.category === 'Academic Staff';

                        return (
                          <div 
                            key={member.id}
                            className={`bg-white rounded-lg border transition-all p-4 flex flex-col justify-between space-y-3 relative overflow-hidden ${
                              isEditingThis 
                                ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-md bg-amber-50/40' 
                                : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                            }`}
                          >
                            {/* Accent indicator bar */}
                            <div className={`absolute top-0 inset-x-0 h-1 ${
                              isBoard ? 'bg-brand-oxblood' : isAcademic ? 'bg-brand-green' : 'bg-slate-400'
                            }`} />

                            <div className="space-y-3">
                              {/* Top Profile Header */}
                              <div className="flex items-start space-x-3 pt-1">
                                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-200 bg-slate-100 shrink-0">
                                  <img
                                    src={member.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'}
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                </div>

                                <div className="space-y-1 min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                                      isBoard
                                        ? 'bg-brand-oxblood/10 text-brand-oxblood border-brand-oxblood/20'
                                        : isAcademic
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                        : 'bg-slate-100 text-slate-700 border-slate-200'
                                    }`}>
                                      {member.category}
                                    </span>
                                    {isEditingThis && (
                                      <span className="text-[8px] font-bold uppercase bg-amber-200 text-amber-950 px-1.5 py-0.2 rounded font-mono">
                                        Editing
                                      </span>
                                    )}
                                  </div>

                                  <h4 className="font-black text-sm text-slate-800 uppercase leading-snug tracking-tight truncate">
                                    {member.name}
                                  </h4>

                                  <p className="text-xs font-bold text-brand-green truncate">
                                    {member.role}
                                  </p>
                                </div>
                              </div>

                              {/* Qualifications badge */}
                              {member.qualifications && (
                                <div className="flex items-center space-x-1.5 text-[10px] text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-200/80 font-mono">
                                  <GraduationCap className="w-3.5 h-3.5 text-brand-oxblood shrink-0" />
                                  <span className="truncate font-semibold">{member.qualifications}</span>
                                </div>
                              )}

                              {/* Bio excerpt */}
                              <p className="text-[11px] text-slate-500 leading-relaxed font-sans line-clamp-3">
                                {member.desc || 'Dedicated academic leader and mentor committed to educational discipline and standard excellence.'}
                              </p>

                              {/* Contact info pills */}
                              {(member.email || member.phone) && (
                                <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-100">
                                  {member.email && (
                                    <span className="text-[9.5px] text-slate-500 flex items-center space-x-1 font-mono">
                                      <Mail className="w-3 h-3 text-brand-oxblood" />
                                      <span className="truncate max-w-[150px]">{member.email}</span>
                                    </span>
                                  )}
                                  {member.phone && (
                                    <span className="text-[9.5px] text-slate-500 flex items-center space-x-1 font-mono">
                                      <Phone className="w-3 h-3 text-brand-green" />
                                      <span>{member.phone}</span>
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Actions bar */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
                              <button
                                type="button"
                                onClick={() => handleStartEditStaff(member)}
                                className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center space-x-1 border ${
                                  isEditingThis
                                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                                }`}
                              >
                                <Edit className="w-3 h-3" />
                                <span>{isEditingThis ? 'Editing Now' : 'Edit Member'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteStaff(member)}
                                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded border border-transparent hover:border-red-200 cursor-pointer transition"
                                title="Delete this member"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

              </div>
            )}

            {/* T-SUPABASE: INTEGRATION SETTINGS */}
            {activeTab === 'supabase' && (
              <div className="space-y-6 animate-fade-in font-sans">
                <div className="space-y-1">
                  <h3 className="text-base font-black font-heading text-brand-green uppercase tracking-tight">Supabase Database Integration</h3>
                  <p className="text-xs text-slate-400">Connect your school portal directly to your cloud hosted Supabase database for persistent data storage.</p>
                </div>

                {/* Connection Status Banner */}
                <div className="p-4 rounded border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50 border-slate-200">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Current Database Status</span>
                    <div className="flex items-center space-x-2">
                      {supabaseStatus === 'connected' ? (
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded">
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <span>CONNECTED TO SUPABASE CLOUD</span>
                        </div>
                      ) : supabaseStatus === 'error' ? (
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          <span>CONNECTION ERROR / STALE RULES</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded">
                          <span className="w-2 h-2 rounded-full bg-slate-400" />
                          <span>LOCAL DISCONNECTED MODE</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <p className="text-[10.5px] text-slate-400 max-w-xs leading-relaxed sm:text-right">
                      {supabaseStatus === 'connected' 
                        ? 'The portal is actively querying and synchronizing with your remote PostgreSQL tables.'
                        : 'The portal is currently using client-side secure localStorage cache. Set credentials to link Supabase.'}
                    </p>
                    {supabaseStatus !== 'idle' && (
                      <button
                        type="button"
                        id="btn-banner-disconnect-supabase"
                        onClick={handleClearSupabaseCredentials}
                        className="shrink-0 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded transition cursor-pointer flex items-center space-x-1"
                        title="Disconnect Supabase and switch to local offline storage"
                      >
                        <Unlink className="w-3 h-3" />
                        <span>Disconnect</span>
                      </button>
                    )}
                  </div>
                </div>

                {syncMessage && (
                  <div className={`p-3 rounded border text-xs font-medium leading-relaxed ${
                    syncMessage.type === 'success' 
                      ? 'bg-green-50 border-green-200 text-green-800' 
                      : syncMessage.type === 'error'
                      ? 'bg-red-50 border-red-200 text-red-800'
                      : 'bg-blue-50 border-blue-200 text-blue-800'
                  }`}>
                    {syncMessage.text}
                  </div>
                )}

                {/* Form to insert links */}
                <form onSubmit={handleSaveSupabaseCredentials} className="bg-slate-50 p-4 rounded border border-slate-200 space-y-4">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-xs text-brand-green font-heading uppercase flex items-center">
                      <Database className="w-4.5 h-4.5 mr-1 text-brand-green shrink-0" />
                      Configure API Connection Credentials
                    </h4>
                    <p className="text-[10px] text-slate-400">Copy-paste the credentials directly from your Supabase Project Settings under <strong>Settings &rarr; API</strong>.</p>
                  </div>

                  <div className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide">Project URL</label>
                      <input
                        type="url"
                        required
                        placeholder="https://your-project-id.supabase.co"
                        value={inputSupabaseUrl}
                        onChange={(e) => setInputSupabaseUrl(e.target.value)}
                        className="block w-full px-3 py-2 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-brand-green/35 focus:outline-hidden font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide">Anon Public API Key (anon key)</label>
                      <input
                        type="text"
                        required
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        value={inputSupabaseKey}
                        onChange={(e) => setInputSupabaseKey(e.target.value)}
                        className="block w-full px-3 py-2 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-brand-green/35 focus:outline-hidden font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-between items-center gap-2 pt-1.5">
                    {(Boolean(inputSupabaseUrl) || Boolean(localStorage.getItem('hgass_supabase_url')) || supabaseStatus !== 'idle') && (
                      !isDisconnectConfirming ? (
                        <button
                          type="button"
                          id="btn-disconnect-supabase"
                          onClick={() => setIsDisconnectConfirming(true)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded text-[10px] font-bold uppercase tracking-wider transition cursor-pointer flex items-center space-x-1.5"
                        >
                          <Unlink className="w-3.5 h-3.5" />
                          <span>Disconnect Database</span>
                        </button>
                      ) : (
                        <div className="flex items-center space-x-2 bg-red-50 border border-red-200 px-2.5 py-1.5 rounded animate-fade-in">
                          <span className="text-[10px] font-bold text-red-700">Disconnect Supabase?</span>
                          <button
                            type="button"
                            id="btn-confirm-disconnect"
                            onClick={handleClearSupabaseCredentials}
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[9px] font-bold uppercase tracking-wider transition cursor-pointer"
                          >
                            Yes, Disconnect
                          </button>
                          <button
                            type="button"
                            id="btn-cancel-disconnect"
                            onClick={() => setIsDisconnectConfirming(false)}
                            className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded text-[9px] font-bold uppercase tracking-wider transition cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      )
                    )}
                    <button
                      type="submit"
                      disabled={isSyncing}
                      className="ml-auto px-4 py-2 bg-brand-green hover:bg-brand-green-dark text-white rounded text-[10px] font-bold uppercase tracking-wider transition shadow-sm cursor-pointer flex items-center space-x-1 border border-brand-green"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save & Link Database</span>
                    </button>
                  </div>
                </form>

                {/* Step-by-Step SQL Instructions for complete clarity */}
                <div className="bg-slate-50/50 rounded p-4 border border-slate-200 space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-brand-oxblood font-heading uppercase">
                      Setup Instructions (SQL Schema Execution)
                    </h4>
                    <p className="text-[10.5px] text-slate-500 leading-relaxed">
                      Before syncing, you must ensure that your Supabase project contains the expected tables and columns. We have provided a complete script at <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[9.5px]">/supabase/schema.sql</code>.
                    </p>
                  </div>

                  <ol className="list-decimal list-inside text-[10.5px] text-slate-500 space-y-2.5 pl-1.5 leading-relaxed">
                    <li>
                      Go to your <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-brand-green font-bold underline hover:text-brand-green-dark">Supabase Dashboard</a> and open your project.
                    </li>
                    <li>
                      Navigate to the <strong>SQL Editor</strong> tab on the left sidebar navigation.
                    </li>
                    <li>
                      Create a <strong>New Query</strong> and paste the contents of the generated schema file <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[9.5px]">/supabase/schema.sql</code> (located in the workspace).
                    </li>
                    <li>
                      Click <strong>Run</strong> (or press Command + Enter) to execute. This creates your <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[9.5px]">news</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[9.5px]">projects</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[9.5px]">gallery</code>, <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[9.5px]">student_results</code>, and <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[9.5px]">contact_messages</code> tables, and secures them with RLS policies automatically.
                    </li>
                  </ol>
                </div>

                {/* Synchronization Management Panel */}
                {localStorage.getItem('hgass_supabase_url') && (
                  <div className="bg-white p-4.5 rounded border border-slate-200 space-y-4">
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-xs text-brand-green font-heading uppercase flex items-center">
                        <RefreshCw className={`w-4 h-4 mr-1 text-brand-green shrink-0 ${isSyncing ? 'animate-spin' : ''}`} />
                        Bulk Synchronization Board
                      </h4>
                      <p className="text-[10px] text-slate-400">Perform bulk manual pushes and pulls to align your local cached changes with the live Supabase cloud database.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Push to cloud block */}
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded flex flex-col justify-between space-y-3.5">
                        <div className="space-y-1">
                          <h5 className="font-bold text-xs text-slate-700 uppercase">Push State to Supabase</h5>
                          <p className="text-[10.5px] text-slate-400 leading-relaxed">
                            Upload all announcements, project logs, gallery images, documents, and student results currently saved in your browser cache directly into your empty Supabase tables. Perfect for migrating initial offline data to the cloud.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handlePushSync}
                          disabled={isSyncing || supabaseStatus === 'idle'}
                          className="w-full bg-brand-green hover:bg-brand-green-dark text-white py-2 rounded text-[10px] font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center space-x-1 shadow-sm disabled:opacity-50"
                        >
                          <Upload className="w-3.5 h-3.5 mr-1" />
                          <span>Push Cached Data to Cloud</span>
                        </button>
                      </div>

                      {/* Pull from cloud block */}
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded flex flex-col justify-between space-y-3.5">
                        <div className="space-y-1">
                          <h5 className="font-bold text-xs text-slate-700 uppercase">Pull State from Supabase</h5>
                          <p className="text-[10.5px] text-slate-400 leading-relaxed">
                            Retrieve fresh live data rows directly from your Supabase PostgreSQL tables and update this browser cache. <strong>Warning:</strong> This will override any unsynchronized offline changes in your browser state.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handlePullSync}
                          disabled={isSyncing || supabaseStatus === 'idle'}
                          className="w-full bg-brand-oxblood hover:bg-brand-oxblood-dark text-white py-2 rounded text-[10px] font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center space-x-1 shadow-sm disabled:opacity-50"
                        >
                          <Download className="w-3.5 h-3.5 mr-1" />
                          <span>Pull Cloud Data to Cache</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* T-2: NEWS MANAGEMENT */}
            {activeTab === 'news' && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-0.5">
                  <h3 className="text-base font-black font-heading text-brand-green uppercase tracking-tight">News & Announcements Board</h3>
                  <p className="text-[11px] text-slate-400">Publish fresh events, state championships, holiday calendars, or general diocesan advisories.</p>
                </div>

                {/* Form to Create/Edit */}
                <form onSubmit={handleSaveNews} className="bg-slate-50 p-4 rounded border border-slate-200 space-y-3">
                  <h4 className="font-bold text-xs text-brand-green font-heading uppercase flex items-center">
                    {editingNewsId ? <Edit className="w-3.5 h-3.5 mr-1" /> : <Plus className="w-3.5 h-3.5 mr-1" />}
                    {editingNewsId ? 'Edit Selected News Story' : 'Publish New Announcement'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide">News Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Resumption Announcement for 1st Term..."
                        value={newsTitle}
                        onChange={(e) => setNewsTitle(e.target.value)}
                        className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-brand-green/35 focus:outline-hidden font-sans"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide">Category</label>
                      <select
                        value={newsCategory}
                        onChange={(e) => setNewsCategory(e.target.value)}
                        className="block w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-brand-green/35 focus:outline-hidden cursor-pointer font-sans"
                      >
                        <option value="Academic">Academic</option>
                        <option value="Announcement">Announcement</option>
                        <option value="Sports">Sports</option>
                        <option value="Event">Event</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide">Image URL (Unsplash or web link)</label>
                    <input
                      type="url"
                      placeholder="e.g. https://images.unsplash.com/photo-..."
                      value={newsImageUrl}
                      onChange={(e) => setNewsImageUrl(e.target.value)}
                      className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-brand-green/35 focus:outline-hidden font-mono"
                    />
                  </div>

                  {/* Rich Text area simulated */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide">News Content (Markdown/Rich Text support)</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Type details of your school story here..."
                      value={newsContent}
                      onChange={(e) => setNewsContent(e.target.value)}
                      className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-brand-green/35 focus:outline-hidden font-sans"
                    />
                  </div>

                  <div className="flex justify-end space-x-1.5 pt-1">
                    {editingNewsId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingNewsId(null);
                          setNewsTitle('');
                          setNewsContent('');
                          setNewsImageUrl('');
                        }}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-brand-green hover:bg-brand-green-dark text-white rounded text-xs font-bold uppercase tracking-wider transition flex items-center space-x-1 cursor-pointer border border-brand-green shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{editingNewsId ? 'Save Changes' : 'Publish Article'}</span>
                    </button>
                  </div>
                </form>

                {/* Published List */}
                <div className="space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-brand-oxblood">Published Publications ({news.length})</h4>
                  <div className="space-y-1.5">
                    {news.map((item) => (
                      <div key={item.id} className="p-2.5 bg-white border border-slate-200 rounded flex justify-between items-center text-xs">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-[8px] font-bold text-brand-green bg-green-50 border border-green-100 px-1.5 py-0.5 rounded uppercase">
                              {item.category}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{item.date}</span>
                          </div>
                          <p className="font-bold text-slate-800 uppercase mt-0.5 leading-tight">{item.title}</p>
                        </div>
                        <div className="flex space-x-1.5 shrink-0">
                          <button
                            onClick={() => handleStartEditNews(item)}
                            className="p-1 border border-slate-200 rounded text-brand-green hover:bg-green-50 transition cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setConfirmModal({
                                title: 'Delete Publication',
                                message: `Are you sure you want to delete "${item.title}"?`,
                                confirmText: 'Delete Publication',
                                onConfirm: () => deleteNews(item.id)
                              });
                            }}
                            className="p-1 border border-slate-200 rounded text-red-600 hover:bg-red-50 transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* T-3: PROJECTS MANAGEMENT */}
            {activeTab === 'projects' && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-0.5">
                  <h3 className="text-base font-black font-heading text-brand-green uppercase tracking-tight">Campus Infrastructure & Projects Manager</h3>
                  <p className="text-[11px] text-slate-400">Launch new renovations, define estimates, and update structural completion progress bars.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSaveProject} className="bg-slate-50 p-4 rounded border border-slate-200 space-y-3">
                  <h4 className="font-bold text-xs text-brand-green font-heading uppercase">
                    {editingProjectId ? 'Modify Selected Project' : 'Register New Campus Project'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide">Project Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Modern Physics Laboratory Overhaul"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-brand-green/35 focus:outline-hidden font-sans"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide">Project Budget (₦)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. ₦12,500,000"
                        value={projectBudget}
                        onChange={(e) => setProjectBudget(e.target.value)}
                        className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-bold text-brand-green focus:ring-1 focus:ring-brand-green/35 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide">Start Date</label>
                      <input
                        type="date"
                        required
                        value={projectStart}
                        onChange={(e) => setProjectStart(e.target.value)}
                        className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-brand-green/35 focus:outline-hidden cursor-pointer font-sans"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide">Expected End Date</label>
                      <input
                        type="date"
                        required
                        value={projectEnd}
                        onChange={(e) => setProjectEnd(e.target.value)}
                        className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-brand-green/35 focus:outline-hidden cursor-pointer font-sans"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide">Completion Benchmark ({projectProgress}%)</label>
                      <div className="flex items-center space-x-2 pt-1.5">
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={projectProgress}
                          onChange={(e) => setProjectProgress(Number(e.target.value))}
                          className="w-full h-1 bg-slate-200 rounded appearance-none cursor-pointer accent-brand-green"
                        />
                        <span className="font-mono text-xs font-bold shrink-0">{projectProgress}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide">Representative Image URL</label>
                    <input
                      type="url"
                      placeholder="e.g. https://images.unsplash.com/photo-..."
                      value={projectImg}
                      onChange={(e) => setProjectImg(e.target.value)}
                      className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-brand-green/35 focus:outline-hidden font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide">Project Description</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Type details regarding material supplies, structural changes, and partner involvement..."
                      value={projectDesc}
                      onChange={(e) => setProjectDesc(e.target.value)}
                      className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-brand-green/35 focus:outline-hidden font-sans"
                    />
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-brand-green hover:bg-brand-green-dark text-white rounded text-xs font-bold uppercase tracking-wider transition cursor-pointer border border-brand-green shadow-xs"
                    >
                      {editingProjectId ? 'Save Project Details' : 'Register Project'}
                    </button>
                  </div>
                </form>

                {/* Project items list */}
                <div className="space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-brand-oxblood">Active registered Projects ({projects.length})</h4>
                  <div className="space-y-1.5">
                    {projects.map((proj) => (
                      <div key={proj.id} className="p-2.5 bg-white border border-slate-200 rounded flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-slate-800 uppercase leading-none">{proj.title}</p>
                          <p className="text-[10px] text-slate-400 mt-1 font-mono">Budget: <span className="font-bold text-brand-green">{proj.budget}</span>  |  Progress: <span className="font-bold text-brand-oxblood">{proj.percentageCompletion}%</span></p>
                        </div>
                        <div className="flex space-x-1.5 shrink-0">
                          <button
                            onClick={() => handleStartEditProject(proj)}
                            className="p-1 border border-slate-200 rounded text-brand-green hover:bg-green-50 cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setConfirmModal({
                                title: 'Delete Project',
                                message: `Are you sure you want to delete "${proj.title}"?`,
                                confirmText: 'Delete Project',
                                onConfirm: () => deleteProject(proj.id)
                              });
                            }}
                            className="p-1 border border-slate-200 rounded text-red-600 hover:bg-red-50 cursor-pointer"
                            title="Delete"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* T-4: IMAGE MANAGEMENT */}
            {activeTab === 'images' && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-0.5">
                  <h3 className="text-base font-black font-heading text-brand-green uppercase tracking-tight">School Gallery & Image Upload</h3>
                  <p className="text-[11px] text-slate-400">Upload JPG, PNG, or WEBP photos representing graduation events, classroom sessions, or athletics.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Upload Form */}
                  <form onSubmit={handleAddGallerySubmit} className="bg-slate-50 p-4 rounded border border-slate-200 space-y-3">
                    <h4 className="font-bold text-xs text-brand-green font-heading uppercase flex items-center">
                      <Upload className="w-3.5 h-3.5 mr-1" /> Register Image Details
                    </h4>

                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide">Image Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Cultural Dance Group Anambra 2026"
                        value={galleryTitle}
                        onChange={(e) => setGalleryTitle(e.target.value)}
                        className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-brand-green/35 focus:outline-hidden font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide">Category</label>
                      <select
                        value={galleryCat}
                        onChange={(e) => setGalleryCat(e.target.value)}
                        className="block w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-brand-green/35 focus:outline-hidden cursor-pointer font-sans"
                      >
                        <option value="School Activities">School Activities</option>
                        <option value="Sports">Sports</option>
                        <option value="Academics">Academics</option>
                        <option value="Graduation">Graduation</option>
                        <option value="Cultural Events">Cultural Events</option>
                        <option value="Projects">Projects</option>
                      </select>
                    </div>

                    {/* Drag-drop File Selector or Paste Link option */}
                    <div className="space-y-3 pt-0.5">
                      <div className="space-y-1">
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide">Option A: Upload Local Image File</label>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp"
                          onChange={(e) => handleFileUploadBase64(e, 'gallery')}
                          className="block w-full text-xs text-slate-500 file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-brand-green/10 file:text-brand-green file:cursor-pointer"
                        />
                        <p className="text-[9px] text-slate-400">JPG, PNG, WEBP. Max size: 2MB.</p>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide">Option B: Paste Image URL</label>
                        <input
                          type="url"
                          placeholder="e.g. https://images.unsplash.com/..."
                          value={galleryUrl}
                          onChange={(e) => setGalleryUrl(e.target.value)}
                          className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-brand-green/35 focus:outline-hidden font-mono"
                        />
                      </div>
                    </div>

                    {/* Preview box if available */}
                    {galleryUrl && (
                      <div className="space-y-1">
                        <p className="text-[9px] text-brand-green uppercase font-bold">Image Source Stream Selected ✔</p>
                        <div className="h-20 rounded overflow-hidden border border-slate-200 bg-slate-50">
                          <img
                            src={galleryUrl}
                            alt="Upload preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full px-3.5 py-1.5 bg-brand-green hover:bg-brand-green-dark text-white rounded text-xs font-bold uppercase tracking-wider transition cursor-pointer border border-brand-green shadow-xs"
                    >
                      Add Image to Catalog
                    </button>
                  </form>

                  {/* Active list */}
                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-brand-oxblood">Catalog Images ({gallery.length})</h4>
                    <div className="space-y-1.5">
                      {gallery.map((img) => (
                        <div key={img.id} className="p-2 bg-white border border-slate-200 rounded flex items-center justify-between text-xs gap-3">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-9 h-9 rounded overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                              <img
                                src={img.imageUrl}
                                alt={img.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 uppercase leading-snug line-clamp-1">{img.title}</p>
                              <p className="text-[9px] text-brand-green font-bold uppercase mt-0.5">{img.category}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setConfirmModal({
                                title: 'Delete Gallery Image',
                                message: `Are you sure you want to delete "${img.title}" from the photo gallery?`,
                                confirmText: 'Delete Image',
                                onConfirm: () => deleteGalleryItem(img.id)
                              });
                            }}
                            className="p-1 border border-slate-200 rounded text-red-600 hover:bg-red-50 cursor-pointer shrink-0"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* T-5: VIDEO CATALOG */}
            {activeTab === 'videos' && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-0.5">
                  <h3 className="text-base font-black font-heading text-brand-green uppercase tracking-tight">School Video Library URL Manager</h3>
                  <p className="text-[11px] text-slate-400">Accepts YouTube or Google Drive share links. Embedded clips automatically render on the public board.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Upload Form */}
                  <form onSubmit={handleAddVideoSubmit} className="bg-slate-50 p-4 rounded border border-slate-200 space-y-3">
                    <h4 className="font-bold text-xs text-brand-green font-heading uppercase">Add Video Resource</h4>

                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide">Video Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Highlights of 2025 Graduation Ceremony"
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-brand-green/35 focus:outline-hidden font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide">YouTube or GDrive Share Link</label>
                      <input
                        type="url"
                        required
                        placeholder="e.g. https://www.youtube.com/watch?v=..."
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-brand-green/35 focus:outline-hidden font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide">Brief Video Description</label>
                      <textarea
                        rows={2}
                        placeholder="Explain what events, student actions or speeches are highlighted in this video stream..."
                        value={videoDesc}
                        onChange={(e) => setVideoDesc(e.target.value)}
                        className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-brand-green/35 focus:outline-hidden font-sans"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full px-3.5 py-1.5 bg-brand-green hover:bg-brand-green-dark text-white rounded text-xs font-bold uppercase tracking-wider transition cursor-pointer border border-brand-green shadow-xs"
                    >
                      Publish Video to Portal
                    </button>
                  </form>

                  {/* Active List */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-brand-oxblood">Registered Videos ({videos.length})</h4>
                    <div className="space-y-1.5">
                      {videos.map((vid) => (
                        <div key={vid.id} className="p-2.5 bg-white border border-slate-200 rounded flex items-center justify-between text-xs gap-3">
                          <div>
                            <p className="font-bold text-slate-800 uppercase leading-snug line-clamp-1">{vid.title}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-xs font-mono">{vid.url}</p>
                          </div>
                          <button
                            onClick={() => {
                              setConfirmModal({
                                title: 'Delete Video',
                                message: `Are you sure you want to delete "${vid.title}"?`,
                                confirmText: 'Delete Video',
                                onConfirm: () => deleteVideo(vid.id)
                              });
                            }}
                            className="p-1 border border-slate-200 rounded text-red-600 hover:bg-red-50 cursor-pointer shrink-0"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* T-6: DOCUMENT LIBRARY */}
            {activeTab === 'documents' && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-0.5">
                  <h3 className="text-base font-black font-heading text-brand-green uppercase tracking-tight">Downloads & PDF Document Library</h3>
                  <p className="text-[11px] text-slate-400">Upload school calendars, admission prospectus manuals, rules, regulations, or examination book lists.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Upload Form */}
                  <form onSubmit={handleAddDocumentSubmit} className="bg-slate-50 p-4 rounded border border-slate-200 space-y-3">
                    <h4 className="font-bold text-xs text-brand-green font-heading uppercase flex items-center">
                      <Upload className="w-3.5 h-3.5 mr-1" /> Register Document File
                    </h4>

                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide">Document / File Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Academic Calendar First Term 2026/2027"
                        value={documentTitle}
                        onChange={(e) => setDocumentTitle(e.target.value)}
                        className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-brand-green/35 focus:outline-hidden font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide">Document Type</label>
                      <select
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                        className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-brand-green/35 focus:outline-hidden cursor-pointer font-sans"
                      >
                        <option value="pdf">PDF File (.pdf)</option>
                        <option value="docx">Word Document (.docx)</option>
                        <option value="xlsx">Excel Spreadsheet (.xlsx)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide font-sans">Select File from Device</label>
                      <input
                        type="file"
                        accept=".pdf,.docx,.xlsx"
                        onChange={(e) => handleFileUploadBase64(e, 'document')}
                        className="block w-full text-xs text-slate-500 file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-brand-green/10 file:text-brand-green file:cursor-pointer"
                      />
                      <p className="text-[9px] text-slate-400">Stored in local database. Max: 2MB.</p>
                    </div>

                    <div className="space-y-1 bg-amber-50/70 p-2 rounded border border-amber-200/80">
                      <div className="flex items-center justify-between">
                        <label className="block text-[9px] font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1">
                          <Key className="w-2.5 h-2.5 text-amber-700" />
                          <span>Assign File Access Password (Optional)</span>
                        </label>
                        <span className="text-[8.5px] text-amber-700/80 font-medium">Leave blank if public</span>
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. HGASS-DOC-2026"
                        value={documentPassword}
                        onChange={(e) => setDocumentPassword(e.target.value)}
                        className="block w-full px-2 py-1 bg-white border border-amber-300 rounded text-xs font-mono font-bold text-amber-900 focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
                      />
                      <p className="text-[8.5px] text-amber-800">Assign a secret PIN so only authorized students or parents with this password can download this file.</p>
                    </div>

                    <button
                      type="submit"
                      className="w-full px-3.5 py-1.5 bg-brand-green hover:bg-brand-green-dark text-white rounded text-xs font-bold uppercase tracking-wider transition cursor-pointer border border-brand-green shadow-xs"
                    >
                      Register Document to Library
                    </button>
                  </form>

                  {/* Active List */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-brand-oxblood">Registered Documents ({documents.length})</h4>
                    <div className="space-y-1.5">
                      {documents.map((doc) => (
                        <div key={doc.id} className="p-2.5 bg-white border border-slate-200 rounded flex items-center justify-between text-xs gap-3 animate-fade-in">
                          <div className="flex items-center space-x-2">
                            <span className="p-1.5 bg-slate-50 text-brand-green border border-slate-100 rounded shrink-0">
                              <FileText className="w-4 h-4 text-brand-green" />
                            </span>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="font-bold text-slate-800 uppercase leading-snug line-clamp-1">{doc.title}</p>
                                {doc.accessPassword ? (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[8.5px] font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200 shrink-0">
                                    <Key className="w-2 h-2 text-amber-700" />
                                    PIN: {doc.accessPassword}
                                  </span>
                                ) : (
                                  <span className="text-[8px] text-slate-400 bg-slate-100 px-1 py-0.2 rounded shrink-0">
                                    Public
                                  </span>
                                )}
                              </div>
                              <p className="text-[9px] text-slate-400 mt-0.5 uppercase font-mono">Format: <span className="font-bold">{doc.fileType}</span>  |  Size: {doc.fileSize}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setConfirmModal({
                                title: 'Delete Document',
                                message: `Are you sure you want to delete "${doc.title}"?`,
                                confirmText: 'Delete Document',
                                onConfirm: () => deleteDocument(doc.id)
                              });
                            }}
                            className="p-1 border border-slate-200 rounded text-red-600 hover:bg-red-50 cursor-pointer shrink-0"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* T-7: RESULTS SHEET MANAGER */}
            {activeTab === 'results' && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-0.5">
                  <h3 className="text-base font-black font-heading text-brand-green uppercase tracking-tight">Academic Grade Book Registrar & Results Desk</h3>
                  <p className="text-[11px] text-slate-400">Register student terminal grades, assign confidential access passwords for each student report sheet file, or import bulk records via CSV.</p>
                </div>

                {/* CSV IMPORT DRAWER */}
                <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs text-brand-green font-heading uppercase flex items-center">
                      <FileSpreadsheet className="w-4 h-4 text-brand-green mr-1" /> Option A: Import Results via pasted CSV
                    </h4>
                    <button
                      onClick={handleExportJson}
                      className="text-[10px] font-bold text-brand-oxblood hover:underline uppercase flex items-center space-x-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Export All (JSON Backup)</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                    Paste raw CSV lines matching our diocesan column structure (with optional confidential student access password):
                    <code className="block bg-white p-1.5 border rounded border-slate-200 mt-1 text-[10px] font-mono break-all font-semibold overflow-x-auto text-slate-600">
                      studentId,studentName,classLevel,term,academicSession,gender,rollNumber,position,attendance,teacherRemarks,principalRemarks,subject,testScore,examScore,accessPassword
                    </code>
                  </p>

                  <textarea
                    rows={3}
                    placeholder="studentId,studentName,classLevel,term,academicSession,gender,rollNumber,position,attendance,teacherRemarks,principalRemarks,subject,testScore,examScore,accessPassword&#10;HGASS/2026/001,Chinedu Emmanuel Okafor,SS 2,3rd Term,2025/2026,Male,08,1st of 35,85 of 85 Days,Hardworking.,Excellent.,Physics,29,67,HGASS-PASS-001"
                    value={csvRawText}
                    onChange={(e) => setCsvRawText(e.target.value)}
                    className="block w-full p-2 bg-white border border-slate-200 rounded text-xs font-mono focus:ring-1 focus:ring-brand-green/35 focus:outline-hidden"
                  />

                  {resultParseError && <p className="text-xs font-bold text-red-600">{resultParseError}</p>}
                  {resultParseSuccess && <p className="text-xs font-bold text-green-700">{resultParseSuccess}</p>}

                  <button
                    type="button"
                    onClick={handleImportCsv}
                    className="px-3.5 py-1.5 bg-brand-green hover:bg-brand-green-dark text-white rounded text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center space-x-1 border border-brand-green shadow-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Parse & Merge CSV Records</span>
                  </button>
                </div>

                {/* MANUAL SCORE SHEET CONSTR / EDITOR */}
                <form 
                  ref={resultFormRef}
                  onSubmit={handleManualResultSubmit} 
                  className={`p-4 rounded border transition space-y-3 ${
                    editingResultId ? 'bg-amber-50/75 border-amber-300 ring-2 ring-amber-400/30 shadow-xs' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-200/80">
                    <h4 className="font-bold text-xs font-heading uppercase flex items-center">
                      {editingResultId ? (
                        <span className="flex items-center text-amber-900">
                          <Edit className="w-4 h-4 text-amber-700 mr-1.5" />
                          <span>Edit Published Student Result Sheet</span>
                        </span>
                      ) : (
                        <span className="flex items-center text-brand-green">
                          <Plus className="w-4 h-4 text-brand-green mr-1.5" />
                          <span>Option B: Academic Grade Book Registrar (Manual Entry)</span>
                        </span>
                      )}
                    </h4>
                    {editingResultId && (
                      <div className="flex items-center gap-2">
                        <span className="text-[9.5px] font-mono font-bold bg-amber-200 text-amber-950 px-2 py-0.5 rounded uppercase tracking-wider">
                          Edit Mode Active
                        </span>
                        <button
                          type="button"
                          onClick={cancelEditingResult}
                          className="text-[11px] font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 px-2 py-0.5 rounded cursor-pointer transition shadow-2xs hover:bg-slate-100"
                        >
                          ✕ Cancel Edit
                        </button>
                      </div>
                    )}
                  </div>

                  {editingResultId && (
                    <div className="bg-amber-100/90 border border-amber-300/90 rounded p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-start sm:items-center space-x-2">
                        <Edit className="w-4 h-4 text-amber-800 shrink-0 mt-0.5 sm:mt-0" />
                        <div>
                          <p className="text-xs font-bold text-amber-950 uppercase">
                            Editing Result Sheet: <span className="underline">{manualStudentName || 'Selected Student'}</span> ({manualStudentId})
                          </p>
                          <p className="text-[10.5px] text-amber-800">
                            Make your score updates, teacher/principal remarks, or PIN adjustments below, then click "Save Changes to Published Result".
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={cancelEditingResult}
                        className="px-2.5 py-1 bg-white border border-amber-300 text-amber-900 hover:bg-amber-50 rounded text-xs font-bold uppercase transition cursor-pointer self-end sm:self-auto shrink-0"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide">Student ID / Reg No</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. HGASS/2026/001"
                        value={manualStudentId}
                        onChange={(e) => setManualStudentId(e.target.value)}
                        className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-brand-green/35 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide">Student Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Chinedu Okafor"
                        value={manualStudentName}
                        onChange={(e) => setManualStudentName(e.target.value)}
                        className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-brand-green/35 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide">Class Level</label>
                      <select
                        value={manualClass}
                        onChange={(e) => setManualClass(e.target.value)}
                        className="block w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-brand-green/35 focus:outline-hidden cursor-pointer"
                      >
                        <option value="JSS 1">JSS 1</option>
                        <option value="JSS 2">JSS 2</option>
                        <option value="JSS 3">JSS 3</option>
                        <option value="SS 1">SS 1</option>
                        <option value="SS 2">SS 2</option>
                        <option value="SS 3">SS 3</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide">Session</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 2025/2026"
                        value={manualSession}
                        onChange={(e) => setManualSession(e.target.value)}
                        className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-brand-green/35 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide">Academic Term</label>
                      <select
                        value={manualTerm}
                        onChange={(e) => setManualTerm(e.target.value)}
                        className="block w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-brand-green/35 focus:outline-hidden cursor-pointer"
                      >
                        <option value="1st Term">1st Term</option>
                        <option value="2nd Term">2nd Term</option>
                        <option value="3rd Term">3rd Term</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide">Roll Number</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 08"
                        value={manualRollNo}
                        onChange={(e) => setManualRollNo(e.target.value)}
                        className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-brand-green/35 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide">Term Position</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 1st of 32"
                        value={manualPos}
                        onChange={(e) => setManualPos(e.target.value)}
                        className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-brand-green/35 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1 bg-amber-50/70 p-1.5 rounded border border-amber-200/80">
                      <div className="flex items-center justify-between">
                        <label className="block text-[9px] font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1">
                          <Key className="w-2.5 h-2.5 text-amber-700" />
                          <span>Assign PIN</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setManualAccessPassword(`HGASS-${Math.floor(1000 + Math.random() * 9000)}`)}
                          className="text-[8.5px] text-brand-green font-bold hover:underline cursor-pointer"
                          title="Generate Random PIN"
                        >
                          Auto PIN
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. HGASS-PASS-001"
                        value={manualAccessPassword}
                        onChange={(e) => setManualAccessPassword(e.target.value)}
                        className="block w-full px-2 py-1 bg-white border border-amber-300 rounded text-xs font-mono font-bold text-amber-900 focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Subject score builder dynamically */}
                  <div className="space-y-2 border-t border-slate-200 pt-3">
                    <div className="flex justify-between items-center">
                      <label className="block text-[11px] font-bold text-brand-green uppercase tracking-wide">Course Subject Evaluations</label>
                      <button
                        type="button"
                        onClick={addManualSubjectScoreField}
                        className="text-[10px] font-bold text-brand-oxblood hover:underline uppercase flex items-center space-x-1 cursor-pointer"
                      >
                        <span>+ Add Subject Row</span>
                      </button>
                    </div>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {subjectScoresInput.map((row, index) => (
                        <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-white p-2 rounded border border-slate-200 text-xs items-center animate-fade-in">
                          <div className="sm:col-span-4 space-y-1">
                            <input
                              type="text"
                              required
                              placeholder="e.g. Mathematics"
                              value={row.subject}
                              onChange={(e) => handleSubjectScoreChange(index, 'subject', e.target.value)}
                              className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded uppercase font-sans text-xs focus:ring-1 focus:ring-brand-green/35"
                            />
                          </div>
                          <div className="sm:col-span-3 flex items-center space-x-1.5">
                            <span className="text-slate-400 shrink-0 font-bold uppercase text-[8px] tracking-wide">CA(30):</span>
                            <input
                              type="number"
                              required
                              min={0}
                              max={30}
                              value={row.testScore}
                              onChange={(e) => handleSubjectScoreChange(index, 'testScore', e.target.value)}
                              className="w-full px-1.5 py-1 bg-slate-50 border border-slate-200 rounded font-mono text-center text-xs"
                            />
                          </div>
                          <div className="sm:col-span-3 flex items-center space-x-1.5">
                            <span className="text-slate-400 shrink-0 font-bold uppercase text-[8px] tracking-wide">Exam(70):</span>
                            <input
                              type="number"
                              required
                              min={0}
                              max={70}
                              value={row.examScore}
                              onChange={(e) => handleSubjectScoreChange(index, 'examScore', e.target.value)}
                              className="w-full px-1.5 py-1 bg-slate-50 border border-slate-200 rounded font-mono text-center text-xs"
                            />
                          </div>
                          <div className="sm:col-span-1 text-center font-bold text-brand-green font-mono">
                            {row.totalScore} <span className="text-[10px] text-slate-400">({row.grade})</span>
                          </div>
                          <div className="sm:col-span-1 text-right">
                            <button
                              type="button"
                              onClick={() => removeSubjectScoreField(index)}
                              className="p-1 border border-slate-100 rounded text-red-500 hover:bg-red-50 cursor-pointer"
                              title="Remove"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Remarks input blocks */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-200 pt-3">
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide font-sans">Class Teacher Remarks</label>
                      <input
                        type="text"
                        placeholder="An outstanding student..."
                        value={manualTeacherComment}
                        onChange={(e) => setManualTeacherComment(e.target.value)}
                        className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-brand-green/35"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide font-sans">Principal Stamp Remarks</label>
                      <input
                        type="text"
                        placeholder="Excellent outcome. Hardworking..."
                        value={manualPrincipalComment}
                        onChange={(e) => setManualPrincipalComment(e.target.value)}
                        className="block w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-brand-green/35"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end items-center gap-2 pt-2">
                    {editingResultId && (
                      <button
                        type="button"
                        onClick={cancelEditingResult}
                        className="w-full sm:w-auto px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                      >
                        Cancel Edit
                      </button>
                    )}
                    <button
                      type="submit"
                      className={`w-full ${
                        editingResultId ? 'sm:flex-1 bg-amber-600 hover:bg-amber-700 border-amber-700' : 'bg-brand-green hover:bg-brand-green-dark border-brand-green'
                      } px-4 py-2 text-white rounded text-xs font-bold uppercase tracking-wider transition cursor-pointer border shadow-xs flex items-center justify-center space-x-1.5`}
                    >
                      {editingResultId ? <Save className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
                      <span>{editingResultId ? 'Save Changes to Published Result' : 'Save Student Report Card Record'}</span>
                    </button>
                  </div>
                </form>

                {/* List of active sheets with search & edit capabilities */}
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-brand-oxblood">
                        Published Student Records ({results.length})
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        Click "Edit Result" on any student to modify their published scores, remarks, or assigned access PIN.
                      </p>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search by name, ID or class..."
                        value={resultsSearchQuery}
                        onChange={(e) => setResultsSearchQuery(e.target.value)}
                        className="w-full sm:w-64 px-2.5 py-1 text-xs bg-white border border-slate-200 rounded focus:ring-1 focus:ring-brand-green/40 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {results
                      .filter((res) => {
                        if (!resultsSearchQuery.trim()) return true;
                        const q = resultsSearchQuery.toLowerCase();
                        return (
                          res.studentName.toLowerCase().includes(q) ||
                          res.studentId.toLowerCase().includes(q) ||
                          res.classLevel.toLowerCase().includes(q) ||
                          res.term.toLowerCase().includes(q) ||
                          res.academicSession.toLowerCase().includes(q)
                        );
                      })
                      .map((res) => {
                        const isCurrentlyEditing = editingResultId === res.id;
                        return (
                          <div 
                            key={res.id} 
                            className={`p-3 rounded border transition flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
                              isCurrentlyEditing 
                                ? 'bg-amber-50/90 border-amber-300 ring-2 ring-amber-400/30' 
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-bold text-slate-800 uppercase leading-none">{res.studentName}</p>
                                {res.accessPassword ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9.5px] font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200">
                                    <Key className="w-2.5 h-2.5 text-amber-700" />
                                    <span>PIN: {res.accessPassword}</span>
                                  </span>
                                ) : (
                                  <span className="text-[9px] text-slate-400 italic bg-slate-100 px-1.5 py-0.5 rounded">
                                    Public (No PIN)
                                  </span>
                                )}
                                {isCurrentlyEditing && (
                                  <span className="text-[9px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-1.5 py-0.2 rounded uppercase">
                                    Editing Now
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-400 mt-1.5 font-mono text-[10px]">
                                ID: <span className="font-bold text-brand-oxblood">{res.studentId}</span>  |  Class: {res.classLevel}  |  Term: {res.term} ({res.academicSession})  |  Rank: {res.position}  |  Subjects: {res.subjectScores?.length || 0}
                              </p>
                            </div>

                            <div className="flex items-center space-x-1.5 self-end sm:self-auto shrink-0">
                              <button
                                type="button"
                                onClick={() => startEditingResult(res)}
                                className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center space-x-1 border ${
                                  isCurrentlyEditing
                                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-300'
                                }`}
                                title="Edit this student result"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                <span>{isCurrentlyEditing ? 'Editing' : 'Edit Result'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setConfirmModal({
                                    title: 'Delete Student Result',
                                    message: `Are you sure you want to delete the terminal result sheet for ${res.studentName} (${res.term} - ${res.academicSession})?`,
                                    confirmText: 'Delete Result',
                                    onConfirm: () => {
                                      if (editingResultId === res.id) {
                                        cancelEditingResult();
                                      }
                                      deleteResult(res.id);
                                    }
                                  });
                                }}
                                className="p-1.5 border border-slate-200 rounded text-red-600 hover:bg-red-50 cursor-pointer"
                                title="Delete Record"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}

                    {results.length > 0 && results.filter((res) => {
                      if (!resultsSearchQuery.trim()) return true;
                      const q = resultsSearchQuery.toLowerCase();
                      return (
                        res.studentName.toLowerCase().includes(q) ||
                        res.studentId.toLowerCase().includes(q) ||
                        res.classLevel.toLowerCase().includes(q) ||
                        res.term.toLowerCase().includes(q) ||
                        res.academicSession.toLowerCase().includes(q)
                      );
                    }).length === 0 && (
                      <div className="p-6 bg-white border border-slate-200 rounded text-center text-xs text-slate-400">
                        No published student results match your search "{resultsSearchQuery}".
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* T-8: MESSAGES INBOX */}
            {activeTab === 'messages' && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-0.5">
                  <h3 className="text-base font-black font-heading text-brand-green uppercase tracking-tight">Parent & Public Contact Inbox</h3>
                  <p className="text-[11px] text-slate-400">View direct messages, inquiries regarding boarding, admissions, or alumni collaborations.</p>
                </div>

                <div className="space-y-3">
                  {messages.length > 0 ? (
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <div 
                          key={msg.id} 
                          className={`p-4 rounded border transition flex flex-col justify-between gap-3 ${
                            msg.isRead 
                              ? 'bg-white border-slate-200 shadow-2xs' 
                              : 'bg-brand-green/5 border-brand-green/30 shadow-xs'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="space-y-0.5">
                              <div className="flex items-center space-x-1.5 flex-wrap gap-y-0.5">
                                <span className="font-bold text-slate-900 text-xs">{msg.name}</span>
                                <span className="text-[9px] text-slate-400 font-mono">({msg.date})</span>
                                {!msg.isRead && (
                                  <span className="text-[8px] font-black text-white bg-brand-oxblood px-1.5 py-0.5 rounded uppercase tracking-wider">
                                    NEW
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-brand-green font-bold font-mono uppercase">{msg.email}  |  {msg.phone}</p>
                            </div>
                            
                            <div className="flex space-x-1.5 shrink-0">
                              {!msg.isRead && (
                                <button
                                  onClick={() => markMessageRead(msg.id)}
                                  className="px-2 py-1 bg-brand-green hover:bg-brand-green-dark text-white rounded text-[9px] font-bold uppercase tracking-wider transition cursor-pointer"
                                  title="Mark as Read"
                                >
                                  Read
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setConfirmModal({
                                    title: 'Delete Message',
                                    message: `Are you sure you want to permanently delete this message from ${msg.name}?`,
                                    confirmText: 'Delete Message',
                                    onConfirm: () => deleteMessage(msg.id)
                                  });
                                }}
                                className="p-1 border border-slate-200 rounded text-red-600 hover:bg-red-50 cursor-pointer transition"
                                title="Delete permanently"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed font-sans bg-slate-50 p-2.5 rounded border border-slate-100 whitespace-pre-wrap">
                            {msg.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-slate-50 rounded border border-slate-100 space-y-1">
                      <p className="text-slate-400 text-xs font-semibold">Inbox is completely clear! No messages yet.</p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* T-PAYMENTS: SCHOOL FEES & BANK TRANSACTIONS (UBA) */}
            {activeTab === 'payments' && (
              <div className="space-y-6 animate-fade-in font-sans">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4">
                  <div className="space-y-0.5">
                    <div className="inline-flex items-center space-x-1.5 bg-red-100 text-red-800 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase">
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>UBA Account: 1027146728</span>
                    </div>
                    <h3 className="text-lg font-black font-heading text-slate-900 uppercase tracking-tight">
                      School Fees & Bank Remittances Ledger
                    </h3>
                    <p className="text-xs text-slate-500">
                      Audit, verify, and reconcile submitted bank payments into Holy Ghost Academy's designated UBA corporate account.
                    </p>
                  </div>

                  {/* Export CSV action */}
                  <button
                    type="button"
                    onClick={() => {
                      const csvRows = [
                        ['Reference ID', 'Student Name', 'Reg ID', 'Class', 'Payer Name', 'Payer Phone', 'Purpose', 'Amount (NGN)', 'Payment Date', 'Channel', 'Bank Reference', 'Status'],
                        ...payments.map(p => [
                          p.referenceNumber,
                          `"${p.studentName}"`,
                          p.studentId || 'N/A',
                          p.classLevel,
                          `"${p.payerName}"`,
                          p.payerPhone,
                          `"${p.purpose}"`,
                          p.amount,
                          p.paymentDate,
                          `"${p.paymentMethod}"`,
                          `"${p.bankReference}"`,
                          p.status
                        ])
                      ];
                      const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", `HGA_UBA_Payment_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      link.remove();
                    }}
                    className="bg-brand-green hover:bg-brand-green-dark text-white px-3.5 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer shadow-xs shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Ledger CSV</span>
                  </button>
                </div>

                {/* KPI Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Verified Inflow</span>
                    <span className="text-lg font-black font-mono text-brand-green">
                      ₦{payments.filter(p => p.status === 'Verified').reduce((sum, p) => sum + (Number(p.amount) || 0), 0).toLocaleString('en-NG')}
                    </span>
                  </div>
                  <div className="p-3 bg-amber-50/70 rounded border border-amber-200">
                    <span className="text-[10px] uppercase font-bold text-amber-800 block">Pending Verification</span>
                    <span className="text-lg font-black font-mono text-amber-900">
                      {payments.filter(p => p.status === 'Pending Verification').length} Transactions
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Remittances Recorded</span>
                    <span className="text-lg font-black font-mono text-slate-800">
                      {payments.length} Records
                    </span>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="flex flex-wrap gap-1.5">
                    {(['ALL', 'Pending Verification', 'Verified', 'Rejected'] as const).map(status => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setPaymentFilterStatus(status)}
                        className={`text-xs px-3 py-1 rounded font-bold uppercase tracking-wider transition cursor-pointer ${
                          paymentFilterStatus === status
                            ? 'bg-slate-900 text-white'
                            : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="Search student, payer, or ref..."
                    value={paymentSearch}
                    onChange={(e) => setPaymentSearch(e.target.value)}
                    className="w-full sm:w-64 px-3 py-1.5 bg-white border border-slate-200 rounded text-xs focus:ring-1 focus:ring-brand-green focus:outline-hidden"
                  />
                </div>

                {/* Payments Table */}
                {payments.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded border border-slate-200 space-y-1">
                    <CreditCard className="w-8 h-8 mx-auto text-slate-400" />
                    <p className="text-slate-500 text-xs font-semibold">No payment records logged yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-heading uppercase text-[10px]">
                          <th className="py-2.5 px-3">Reference ID</th>
                          <th className="py-2.5 px-3">Student / Class</th>
                          <th className="py-2.5 px-3">Payer Info</th>
                          <th className="py-2.5 px-3">Purpose</th>
                          <th className="py-2.5 px-3">Amount (₦)</th>
                          <th className="py-2.5 px-3">Bank Ref / Channel</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {payments
                          .filter(p => {
                            if (paymentFilterStatus !== 'ALL' && p.status !== paymentFilterStatus) return false;
                            if (paymentSearch) {
                              const q = paymentSearch.toLowerCase();
                              return (
                                p.referenceNumber.toLowerCase().includes(q) ||
                                p.studentName.toLowerCase().includes(q) ||
                                p.payerName.toLowerCase().includes(q) ||
                                p.bankReference.toLowerCase().includes(q)
                              );
                            }
                            return true;
                          })
                          .map((payment) => (
                            <tr key={payment.id} className="hover:bg-slate-50/80 transition">
                              <td className="py-3 px-3">
                                <span className="font-mono font-bold text-slate-900 block">{payment.referenceNumber}</span>
                                <span className="text-[10px] text-slate-400 font-mono">{payment.createdAt}</span>
                              </td>
                              <td className="py-3 px-3">
                                <span className="font-bold text-slate-900 block">{payment.studentName}</span>
                                <span className="text-[10px] text-slate-500">{payment.classLevel} {payment.studentId ? `• ${payment.studentId}` : ''}</span>
                              </td>
                              <td className="py-3 px-3">
                                <span className="font-semibold text-slate-800 block">{payment.payerName}</span>
                                <span className="text-[10px] text-slate-500 font-mono">{payment.payerPhone}</span>
                              </td>
                              <td className="py-3 px-3 text-slate-700">
                                <span className="block font-medium">{payment.purpose}</span>
                                {payment.remarks && <span className="text-[10px] text-slate-400 italic block">{payment.remarks}</span>}
                              </td>
                              <td className="py-3 px-3 font-mono font-black text-brand-green">
                                ₦{Number(payment.amount).toLocaleString('en-NG')}
                              </td>
                              <td className="py-3 px-3">
                                <span className="font-mono text-[10.5px] text-slate-700 block">{payment.bankReference}</span>
                                <span className="text-[9.5px] text-slate-400">{payment.paymentMethod}</span>
                              </td>
                              <td className="py-3 px-3">
                                <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                  payment.status === 'Verified'
                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                    : payment.status === 'Pending Verification'
                                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                    : 'bg-red-100 text-red-800 border border-red-200'
                                }`}>
                                  {payment.status}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right">
                                <div className="flex items-center justify-end space-x-1">
                                  {payment.status !== 'Verified' && onVerifyPayment && (
                                    <button
                                      type="button"
                                      onClick={() => onVerifyPayment(payment.id, 'Verified')}
                                      className="bg-brand-green hover:bg-brand-green-dark text-white px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider cursor-pointer"
                                      title="Approve & Mark Verified"
                                    >
                                      Approve
                                    </button>
                                  )}
                                  {payment.status === 'Verified' && onVerifyPayment && (
                                    <button
                                      type="button"
                                      onClick={() => onVerifyPayment(payment.id, 'Pending Verification')}
                                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider cursor-pointer border"
                                      title="Revert to Pending"
                                    >
                                      Revert
                                    </button>
                                  )}
                                  {onDeletePayment && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setConfirmModal({
                                          title: 'Delete Payment Record',
                                          message: `Are you sure you want to delete payment record ${payment.referenceNumber} (${payment.payerName} - ₦${payment.amount.toLocaleString()})?`,
                                          confirmText: 'Delete Payment',
                                          onConfirm: () => onDeletePayment(payment.id)
                                        });
                                      }}
                                      className="p-1 border border-slate-200 rounded text-red-600 hover:bg-red-50 cursor-pointer transition"
                                      title="Delete payment record"
                                    >
                                      <Trash className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>
      </div>

      {/* Interactive In-App Confirmation Modal (iframe-safe alternative to window.confirm) */}
      {confirmModal && (
        <div 
          id="admin-confirm-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in"
        >
          <div className="bg-white rounded-lg p-5 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-start space-x-3">
              <div className="p-2.5 bg-red-100 text-red-600 rounded-full shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-black text-sm text-slate-900 uppercase tracking-tight">
                  {confirmModal.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  {confirmModal.message}
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                id="btn-cancel-modal"
                onClick={() => setConfirmModal(null)}
                className="px-3.5 py-1.5 border border-slate-200 rounded text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer uppercase tracking-wider font-sans"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-confirm-modal-action"
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal(null);
                }}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold transition cursor-pointer uppercase tracking-wider font-sans shadow-xs"
              >
                {confirmModal.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
