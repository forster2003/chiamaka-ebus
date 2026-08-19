/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';

// Retrieve credentials from localStorage (user pasted via UI) or process env
export function getSupabaseCredentials() {
  let url = localStorage.getItem('hgass_supabase_url') || (import.meta.env.VITE_SUPABASE_URL as string) || '';
  const anonKey = localStorage.getItem('hgass_supabase_anon_key') || (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';
  
  url = url.trim();
  // Strip trailing REST endpoints if accidentally pasted by user
  if (url.endsWith('/rest/v1/')) {
    url = url.slice(0, -9);
  } else if (url.endsWith('/rest/v1')) {
    url = url.slice(0, -8);
  }
  
  return { url, anonKey: anonKey.trim() };
}

export function isSupabaseConfigured() {
  const { url, anonKey } = getSupabaseCredentials();
  return !!(url && anonKey);
}

export function getSupabaseClient() {
  const { url, anonKey } = getSupabaseCredentials();
  if (!url || !anonKey) return null;
  try {
    return createClient(url, anonKey);
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

// Map database column names (snake_case) to state properties (camelCase)
export function mapFromDb(table: string, row: any): any {
  if (!row) return row;
  const mapped: any = { ...row };

  if (table === 'news') {
    mapped.imageUrl = row.image_url;
    mapped.isPublished = row.is_published;
    delete mapped.image_url;
    delete mapped.is_published;
  } else if (table === 'projects') {
    mapped.imageUrl = row.image_url;
    mapped.startDate = row.start_date;
    mapped.expectedCompletionDate = row.expected_completion_date;
    mapped.percentageCompletion = row.percentage_completion;
    delete mapped.image_url;
    delete mapped.start_date;
    delete mapped.expected_completion_date;
    delete mapped.percentage_completion;
  } else if (table === 'gallery') {
    mapped.imageUrl = row.image_url;
    mapped.uploadDate = row.upload_date;
    delete mapped.image_url;
    delete mapped.upload_date;
  } else if (table === 'videos') {
    mapped.uploadDate = row.upload_date;
    delete mapped.upload_date;
  } else if (table === 'documents') {
    mapped.fileType = row.file_type;
    mapped.fileSize = row.file_size;
    mapped.downloadUrl = row.download_url;
    mapped.uploadDate = row.upload_date;
    delete mapped.file_type;
    delete mapped.file_size;
    delete mapped.download_url;
    delete mapped.upload_date;
  } else if (table === 'student_results') {
    mapped.studentId = row.student_id;
    mapped.studentName = row.student_name;
    mapped.classLevel = row.class_level;
    mapped.academicSession = row.academic_session;
    mapped.rollNumber = row.roll_number;
    mapped.principalRemarks = row.principal_remarks;
    mapped.teacherRemarks = row.teacher_remarks;
    mapped.subjectScores = typeof row.subject_scores === 'string' ? JSON.parse(row.subject_scores) : row.subject_scores;
    delete mapped.student_id;
    delete mapped.student_name;
    delete mapped.class_level;
    delete mapped.academic_session;
    delete mapped.roll_number;
    delete mapped.principal_remarks;
    delete mapped.teacher_remarks;
    delete mapped.subject_scores;
  } else if (table === 'contact_messages') {
    mapped.isRead = row.is_read;
    delete mapped.is_read;
  }

  return mapped;
}

export function mapToDb(table: string, item: any): any {
  if (!item) return item;
  const mapped: any = { ...item };

  if (table === 'news') {
    mapped.image_url = item.imageUrl || null;
    mapped.is_published = item.isPublished ?? true;
    delete mapped.imageUrl;
    delete mapped.isPublished;
  } else if (table === 'projects') {
    mapped.image_url = item.imageUrl || null;
    mapped.start_date = item.startDate;
    mapped.expected_completion_date = item.expectedCompletionDate;
    mapped.percentage_completion = item.percentageCompletion || 0;
    delete mapped.imageUrl;
    delete mapped.startDate;
    delete mapped.expectedCompletionDate;
    delete mapped.percentageCompletion;
  } else if (table === 'gallery') {
    mapped.image_url = item.imageUrl;
    mapped.upload_date = item.uploadDate || new Date().toISOString().split('T')[0];
    delete mapped.imageUrl;
    delete mapped.uploadDate;
  } else if (table === 'videos') {
    mapped.upload_date = item.uploadDate || new Date().toISOString().split('T')[0];
    delete mapped.uploadDate;
  } else if (table === 'documents') {
    mapped.file_type = item.fileType;
    mapped.file_size = item.fileSize;
    mapped.download_url = item.downloadUrl;
    mapped.upload_date = item.uploadDate || new Date().toISOString().split('T')[0];
    delete mapped.fileType;
    delete mapped.fileSize;
    delete mapped.downloadUrl;
    delete mapped.uploadDate;
  } else if (table === 'student_results') {
    mapped.student_id = item.studentId;
    mapped.student_name = item.studentName;
    mapped.class_level = item.classLevel;
    mapped.academic_session = item.academicSession;
    mapped.roll_number = item.rollNumber;
    mapped.principal_remarks = item.principalRemarks || null;
    mapped.teacher_remarks = item.teacherRemarks || null;
    mapped.subject_scores = item.subjectScores;
    delete mapped.studentId;
    delete mapped.studentName;
    delete mapped.classLevel;
    delete mapped.academicSession;
    delete mapped.rollNumber;
    delete mapped.principalRemarks;
    delete mapped.teacherRemarks;
    delete mapped.subjectScores;
  } else if (table === 'contact_messages') {
    mapped.is_read = item.isRead ?? false;
    delete mapped.isRead;
  }

  // Remove timestamp or calculated fields from local state before posting
  delete mapped.created_at;

  return mapped;
}
