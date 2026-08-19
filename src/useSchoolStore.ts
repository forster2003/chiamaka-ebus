/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { NewsItem, SchoolProject, GalleryItem, VideoItem, DocumentItem, StudentResult, ContactMessage } from './types';
import { INITIAL_NEWS, INITIAL_PROJECTS, INITIAL_GALLERY, INITIAL_VIDEOS, INITIAL_DOCUMENTS, INITIAL_RESULTS, INITIAL_MESSAGES } from './defaultData';
import { isSupabaseConfigured, getSupabaseClient, mapFromDb, mapToDb } from './supabasePortal';

export function useSchoolStore() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [projects, setProjects] = useState<SchoolProject[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [results, setResults] = useState<StudentResult[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [supabaseStatus, setSupabaseStatus] = useState<'idle' | 'connected' | 'error'>('idle');

  // Load and sync from Supabase or localStorage
  useEffect(() => {
    async function loadData() {
      // 1. Initial immediate render from localStorage (fast client-side caching)
      try {
        const storedNews = localStorage.getItem('hgass_news');
        const storedProjects = localStorage.getItem('hgass_projects');
        const storedGallery = localStorage.getItem('hgass_gallery');
        const storedVideos = localStorage.getItem('hgass_videos');
        const storedDocuments = localStorage.getItem('hgass_documents');
        const storedResults = localStorage.getItem('hgass_results');
        const storedMessages = localStorage.getItem('hgass_messages');
        const storedAuth = localStorage.getItem('hgass_admin_auth');

        if (storedNews) setNews(JSON.parse(storedNews));
        else {
          setNews(INITIAL_NEWS);
          localStorage.setItem('hgass_news', JSON.stringify(INITIAL_NEWS));
        }

        if (storedProjects) setProjects(JSON.parse(storedProjects));
        else {
          setProjects(INITIAL_PROJECTS);
          localStorage.setItem('hgass_projects', JSON.stringify(INITIAL_PROJECTS));
        }

        if (storedGallery) setGallery(JSON.parse(storedGallery));
        else {
          setGallery(INITIAL_GALLERY);
          localStorage.setItem('hgass_gallery', JSON.stringify(INITIAL_GALLERY));
        }

        if (storedVideos) setVideos(JSON.parse(storedVideos));
        else {
          setVideos(INITIAL_VIDEOS);
          localStorage.setItem('hgass_videos', JSON.stringify(INITIAL_VIDEOS));
        }

        if (storedDocuments) setDocuments(JSON.parse(storedDocuments));
        else {
          setDocuments(INITIAL_DOCUMENTS);
          localStorage.setItem('hgass_documents', JSON.stringify(INITIAL_DOCUMENTS));
        }

        if (storedResults) setResults(JSON.parse(storedResults));
        else {
          setResults(INITIAL_RESULTS);
          localStorage.setItem('hgass_results', JSON.stringify(INITIAL_RESULTS));
        }

        if (storedMessages) setMessages(JSON.parse(storedMessages));
        else {
          setMessages(INITIAL_MESSAGES);
          localStorage.setItem('hgass_messages', JSON.stringify(INITIAL_MESSAGES));
        }

        if (storedAuth === 'true') {
          setIsAdminLoggedIn(true);
        }
      } catch (e) {
        console.error('Failed to parse cached local storage data:', e);
      }

      // 2. Fetch fresh remote streams from Supabase if configured
      if (isSupabaseConfigured()) {
        const supabase = getSupabaseClient();
        if (supabase) {
          try {
            setSupabaseStatus('connected');
            const [
              { data: dbNews, error: errNews },
              { data: dbProjects, error: errProj },
              { data: dbGallery, error: errGal },
              { data: dbVideos, error: errVid },
              { data: dbDocs, error: errDocs },
              { data: dbResults, error: errResults },
              { data: dbMsg, error: errMsg }
            ] = await Promise.all([
              supabase.from('news').select('*').order('date', { ascending: false }),
              supabase.from('projects').select('*').order('start_date', { ascending: false }),
              supabase.from('gallery').select('*').order('upload_date', { ascending: false }),
              supabase.from('videos').select('*').order('upload_date', { ascending: false }),
              supabase.from('documents').select('*').order('upload_date', { ascending: false }),
              supabase.from('student_results').select('*'),
              supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
            ]);

            if (errNews || errProj || errGal || errVid || errDocs || errResults || errMsg) {
              console.warn('Some Supabase select streams errored out. Check table access rules.');
              setSupabaseStatus('error');
            }

            if (!errNews && dbNews && dbNews.length > 0) {
              const mapped = dbNews.map(r => mapFromDb('news', r));
              setNews(mapped);
              localStorage.setItem('hgass_news', JSON.stringify(mapped));
            }
            if (!errProj && dbProjects && dbProjects.length > 0) {
              const mapped = dbProjects.map(r => mapFromDb('projects', r));
              setProjects(mapped);
              localStorage.setItem('hgass_projects', JSON.stringify(mapped));
            }
            if (!errGal && dbGallery && dbGallery.length > 0) {
              const mapped = dbGallery.map(r => mapFromDb('gallery', r));
              setGallery(mapped);
              localStorage.setItem('hgass_gallery', JSON.stringify(mapped));
            }
            if (!errVid && dbVideos && dbVideos.length > 0) {
              const mapped = dbVideos.map(r => mapFromDb('videos', r));
              setVideos(mapped);
              localStorage.setItem('hgass_videos', JSON.stringify(mapped));
            }
            if (!errDocs && dbDocs && dbDocs.length > 0) {
              const mapped = dbDocs.map(r => mapFromDb('documents', r));
              setDocuments(mapped);
              localStorage.setItem('hgass_documents', JSON.stringify(mapped));
            }
            if (!errResults && dbResults && dbResults.length > 0) {
              const mapped = dbResults.map(r => mapFromDb('student_results', r));
              setResults(mapped);
              localStorage.setItem('hgass_results', JSON.stringify(mapped));
            }
            if (!errMsg && dbMsg && dbMsg.length > 0) {
              const mapped = dbMsg.map(r => mapFromDb('contact_messages', r));
              setMessages(mapped);
              localStorage.setItem('hgass_messages', JSON.stringify(mapped));
            }
          } catch (e) {
            console.error('Supabase async fetching connection crash:', e);
            setSupabaseStatus('error');
          }
        }
      } else {
        setSupabaseStatus('idle');
      }

      setIsLoading(false);
    }

    loadData();
  }, []);

  // Sync state writes in the background to Supabase
  const syncWrite = async (table: string, action: 'insert' | 'update' | 'delete', data: any) => {
    if (!isSupabaseConfigured()) return;
    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      if (action === 'insert' || action === 'update') {
        const dbData = mapToDb(table, data);
        const { error } = await supabase.from(table).upsert([dbData]);
        if (error) {
          console.error(`Supabase upsert failure on ${table}:`, error);
          setSupabaseStatus('error');
        } else {
          setSupabaseStatus('connected');
        }
      } else if (action === 'delete') {
        const { error } = await supabase.from(table).delete().eq('id', data);
        if (error) {
          console.error(`Supabase delete failure on ${table}:`, error);
          setSupabaseStatus('error');
        } else {
          setSupabaseStatus('connected');
        }
      }
    } catch (e) {
      console.error(`Supabase transactional sync exception on ${table}:`, e);
      setSupabaseStatus('error');
    }
  };

  // Push all existing local storage elements to blank Supabase schema tables
  const pushAllLocalToSupabase = async (): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) return { success: false, error: 'Supabase credentials are not set.' };
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: 'Could not connect to Supabase.' };

    try {
      // Parallel batch uploads
      const uploads = [
        news.length > 0 ? supabase.from('news').upsert(news.map(x => mapToDb('news', x))) : Promise.resolve(),
        projects.length > 0 ? supabase.from('projects').upsert(projects.map(x => mapToDb('projects', x))) : Promise.resolve(),
        gallery.length > 0 ? supabase.from('gallery').upsert(gallery.map(x => mapToDb('gallery', x))) : Promise.resolve(),
        videos.length > 0 ? supabase.from('videos').upsert(videos.map(x => mapToDb('videos', x))) : Promise.resolve(),
        documents.length > 0 ? supabase.from('documents').upsert(documents.map(x => mapToDb('documents', x))) : Promise.resolve(),
        results.length > 0 ? supabase.from('student_results').upsert(results.map(x => mapToDb('student_results', x))) : Promise.resolve(),
        messages.length > 0 ? supabase.from('contact_messages').upsert(messages.map(x => mapToDb('contact_messages', x))) : Promise.resolve()
      ];

      const responses = await Promise.all(uploads);
      const errors = responses.filter((r: any) => r && r.error);
      if (errors.length > 0) {
        const errorMsg = errors.map((e: any) => e.error.message).join(' | ');
        return { success: false, error: errorMsg };
      }

      setSupabaseStatus('connected');
      return { success: true };
    } catch (err: any) {
      console.error('Push sync failure:', err);
      return { success: false, error: err?.message || 'Network transport failure.' };
    }
  };

  // Pull fresh streams and replace everything
  const pullAllFromSupabase = async (): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) return { success: false, error: 'Supabase credentials are not set.' };
    const supabase = getSupabaseClient();
    if (!supabase) return { success: false, error: 'Could not connect to Supabase.' };

    try {
      const [
        { data: dbNews, error: errNews },
        { data: dbProjects, error: errProj },
        { data: dbGallery, error: errGal },
        { data: dbVideos, error: errVid },
        { data: dbDocs, error: errDocs },
        { data: dbResults, error: errResults },
        { data: dbMsg, error: errMsg }
      ] = await Promise.all([
        supabase.from('news').select('*').order('date', { ascending: false }),
        supabase.from('projects').select('*').order('start_date', { ascending: false }),
        supabase.from('gallery').select('*').order('upload_date', { ascending: false }),
        supabase.from('videos').select('*').order('upload_date', { ascending: false }),
        supabase.from('documents').select('*').order('upload_date', { ascending: false }),
        supabase.from('student_results').select('*'),
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
      ]);

      if (errNews || errProj || errGal || errVid || errDocs || errResults || errMsg) {
        throw new Error('Some tables failed to sync. Make sure tables match the SQL schema and RLS allows select.');
      }

      if (dbNews) {
        const mapped = dbNews.map(r => mapFromDb('news', r));
        setNews(mapped);
        localStorage.setItem('hgass_news', JSON.stringify(mapped));
      }
      if (dbProjects) {
        const mapped = dbProjects.map(r => mapFromDb('projects', r));
        setProjects(mapped);
        localStorage.setItem('hgass_projects', JSON.stringify(mapped));
      }
      if (dbGallery) {
        const mapped = dbGallery.map(r => mapFromDb('gallery', r));
        setGallery(mapped);
        localStorage.setItem('hgass_gallery', JSON.stringify(mapped));
      }
      if (dbVideos) {
        const mapped = dbVideos.map(r => mapFromDb('videos', r));
        setVideos(mapped);
        localStorage.setItem('hgass_videos', JSON.stringify(mapped));
      }
      if (dbDocs) {
        const mapped = dbDocs.map(r => mapFromDb('documents', r));
        setDocuments(mapped);
        localStorage.setItem('hgass_documents', JSON.stringify(mapped));
      }
      if (dbResults) {
        const mapped = dbResults.map(r => mapFromDb('student_results', r));
        setResults(mapped);
        localStorage.setItem('hgass_results', JSON.stringify(mapped));
      }
      if (dbMsg) {
        const mapped = dbMsg.map(r => mapFromDb('contact_messages', r));
        setMessages(mapped);
        localStorage.setItem('hgass_messages', JSON.stringify(mapped));
      }

      setSupabaseStatus('connected');
      return { success: true };
    } catch (err: any) {
      console.error('Pull sync failed:', err);
      return { success: false, error: err?.message || 'Could not fetch tables' };
    }
  };

  // --- Auth Actions ---
  const loginAdmin = (password: string): boolean => {
    if (password === 'HGASS@25') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('hgass_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('hgass_admin_auth');
  };

  // --- News Actions ---
  const addNews = (item: Omit<NewsItem, 'id' | 'date'>) => {
    const newItem: NewsItem = {
      ...item,
      id: `news-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    const updated = [newItem, ...news];
    setNews(updated);
    localStorage.setItem('hgass_news', JSON.stringify(updated));
    syncWrite('news', 'insert', newItem);
  };

  const editNews = (id: string, updatedFields: Partial<NewsItem>) => {
    const updated = news.map(item => item.id === id ? { ...item, ...updatedFields } : item);
    setNews(updated);
    localStorage.setItem('hgass_news', JSON.stringify(updated));
    const target = updated.find(item => item.id === id);
    if (target) syncWrite('news', 'update', target);
  };

  const deleteNews = (id: string) => {
    const updated = news.filter(item => item.id !== id);
    setNews(updated);
    localStorage.setItem('hgass_news', JSON.stringify(updated));
    syncWrite('news', 'delete', id);
  };

  // --- Project Actions ---
  const addProject = (item: Omit<SchoolProject, 'id'>) => {
    const newItem: SchoolProject = {
      ...item,
      id: `proj-${Date.now()}`,
    };
    const updated = [...projects, newItem];
    setProjects(updated);
    localStorage.setItem('hgass_projects', JSON.stringify(updated));
    syncWrite('projects', 'insert', newItem);
  };

  const editProject = (id: string, updatedFields: Partial<SchoolProject>) => {
    const updated = projects.map(item => item.id === id ? { ...item, ...updatedFields } : item);
    setProjects(updated);
    localStorage.setItem('hgass_projects', JSON.stringify(updated));
    const target = updated.find(item => item.id === id);
    if (target) syncWrite('projects', 'update', target);
  };

  const deleteProject = (id: string) => {
    const updated = projects.filter(item => item.id !== id);
    setProjects(updated);
    localStorage.setItem('hgass_projects', JSON.stringify(updated));
    syncWrite('projects', 'delete', id);
  };

  // --- Gallery Actions ---
  const addGalleryItem = (item: Omit<GalleryItem, 'id' | 'uploadDate'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0],
    };
    const updated = [newItem, ...gallery];
    setGallery(updated);
    localStorage.setItem('hgass_gallery', JSON.stringify(updated));
    syncWrite('gallery', 'insert', newItem);
  };

  const editGalleryItem = (id: string, updatedFields: Partial<GalleryItem>) => {
    const updated = gallery.map(item => item.id === id ? { ...item, ...updatedFields } : item);
    setGallery(updated);
    localStorage.setItem('hgass_gallery', JSON.stringify(updated));
    const target = updated.find(item => item.id === id);
    if (target) syncWrite('gallery', 'update', target);
  };

  const deleteGalleryItem = (id: string) => {
    const updated = gallery.filter(item => item.id !== id);
    setGallery(updated);
    localStorage.setItem('hgass_gallery', JSON.stringify(updated));
    syncWrite('gallery', 'delete', id);
  };

  // --- Video Actions ---
  const addVideo = (item: Omit<VideoItem, 'id' | 'uploadDate'>) => {
    const newItem: VideoItem = {
      ...item,
      id: `vid-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0],
    };
    const updated = [newItem, ...videos];
    setVideos(updated);
    localStorage.setItem('hgass_videos', JSON.stringify(updated));
    syncWrite('videos', 'insert', newItem);
  };

  const editVideo = (id: string, updatedFields: Partial<VideoItem>) => {
    const updated = videos.map(item => item.id === id ? { ...item, ...updatedFields } : item);
    setVideos(updated);
    localStorage.setItem('hgass_videos', JSON.stringify(updated));
    const target = updated.find(item => item.id === id);
    if (target) syncWrite('videos', 'update', target);
  };

  const deleteVideo = (id: string) => {
    const updated = videos.filter(item => item.id !== id);
    setVideos(updated);
    localStorage.setItem('hgass_videos', JSON.stringify(updated));
    syncWrite('videos', 'delete', id);
  };

  // --- Document Actions ---
  const addDocument = (item: Omit<DocumentItem, 'id' | 'uploadDate'>) => {
    const newItem: DocumentItem = {
      ...item,
      id: `doc-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0],
    };
    const updated = [newItem, ...documents];
    setDocuments(updated);
    localStorage.setItem('hgass_documents', JSON.stringify(updated));
    syncWrite('documents', 'insert', newItem);
  };

  const deleteDocument = (id: string) => {
    const updated = documents.filter(item => item.id !== id);
    setDocuments(updated);
    localStorage.setItem('hgass_documents', JSON.stringify(updated));
    syncWrite('documents', 'delete', id);
  };

  // --- Result Actions ---
  const addResult = (item: StudentResult) => {
    const updated = [...results.filter(r => r.id !== item.id && !(r.studentId === item.studentId && r.term === item.term && r.academicSession === item.academicSession)), item];
    setResults(updated);
    localStorage.setItem('hgass_results', JSON.stringify(updated));
    syncWrite('student_results', 'insert', item);
  };

  const editResult = (id: string, updatedFields: Partial<StudentResult>) => {
    const updated = results.map(item => item.id === id ? { ...item, ...updatedFields } as StudentResult : item);
    setResults(updated);
    localStorage.setItem('hgass_results', JSON.stringify(updated));
    const target = updated.find(item => item.id === id);
    if (target) syncWrite('student_results', 'update', target);
  };

  const deleteResult = (id: string) => {
    const updated = results.filter(item => item.id !== id);
    setResults(updated);
    localStorage.setItem('hgass_results', JSON.stringify(updated));
    syncWrite('student_results', 'delete', id);
  };

  const importResultsList = (resultsList: StudentResult[]) => {
    const updated = [...resultsList];
    setResults(updated);
    localStorage.setItem('hgass_results', JSON.stringify(updated));

    // Upload in batch to Supabase
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const dbRows = resultsList.map(item => mapToDb('student_results', item));
        supabase.from('student_results').upsert(dbRows).then(({ error }) => {
          if (error) {
            console.error('Bulk result import failure in Supabase:', error);
            setSupabaseStatus('error');
          } else {
            setSupabaseStatus('connected');
          }
        });
      }
    }
  };

  // --- Contact Messages Actions ---
  const addMessage = (message: Omit<ContactMessage, 'id' | 'date' | 'isRead'>) => {
    const newMsg: ContactMessage = {
      ...message,
      id: `msg-${Date.now()}`,
      date: new Date().toLocaleString('en-US', { hour12: true, month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };
    const updated = [newMsg, ...messages];
    setMessages(updated);
    localStorage.setItem('hgass_messages', JSON.stringify(updated));
    syncWrite('contact_messages', 'insert', newMsg);
  };

  const markMessageRead = (id: string) => {
    const updated = messages.map(msg => msg.id === id ? { ...msg, isRead: true } : msg);
    setMessages(updated);
    localStorage.setItem('hgass_messages', JSON.stringify(updated));
    const target = updated.find(msg => msg.id === id);
    if (target) syncWrite('contact_messages', 'update', target);
  };

  const deleteMessage = (id: string) => {
    const updated = messages.filter(msg => msg.id !== id);
    setMessages(updated);
    localStorage.setItem('hgass_messages', JSON.stringify(updated));
    syncWrite('contact_messages', 'delete', id);
  };

  // Dynamic calculations for Stats
  const stats = {
    totalStudents: results.reduce((acc, current) => {
      if (!acc.includes(current.studentId)) {
        acc.push(current.studentId);
      }
      return acc;
    }, [] as string[]).length || 420,
    totalImages: gallery.length,
    totalVideos: videos.length,
    totalDocuments: documents.length,
    totalProjects: projects.length,
    totalNewsPosts: news.length,
    unreadMessages: messages.filter(m => !m.isRead).length,
  };

  return {
    isLoading,
    news,
    projects,
    gallery,
    videos,
    documents,
    results,
    messages,
    isAdminLoggedIn,
    supabaseStatus,
    stats,
    loginAdmin,
    logoutAdmin,
    addNews,
    editNews,
    deleteNews,
    addProject,
    editProject,
    deleteProject,
    addGalleryItem,
    editGalleryItem,
    deleteGalleryItem,
    addVideo,
    editVideo,
    deleteVideo,
    addDocument,
    deleteDocument,
    addResult,
    editResult,
    deleteResult,
    importResultsList,
    addMessage,
    markMessageRead,
    deleteMessage,
    pushAllLocalToSupabase,
    pullAllFromSupabase
  };
}
