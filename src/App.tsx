/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import AboutView from './components/AboutView';
import MissionView from './components/MissionView';
import SubjectsView from './components/SubjectsView';
import ProjectsView from './components/ProjectsView';
import GalleryView from './components/GalleryView';
import ResultsView from './components/ResultsView';
import ContactView from './components/ContactView';
import PaymentView from './components/PaymentView';
import AdminView from './components/AdminView';

import { useSchoolStore } from './useSchoolStore';
import { ArrowUp, BookOpen, ShieldCheck } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');

  // Load from school store
  const {
    isLoading,
    news,
    projects,
    gallery,
    videos,
    documents,
    results,
    messages,
    payments,
    isAdminLoggedIn,
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
    deleteGalleryItem,
    addVideo,
    deleteVideo,
    addDocument,
    deleteDocument,
    addResult,
    deleteResult,
    importResultsList,
    addMessage,
    markMessageRead,
    deleteMessage,
    addPayment,
    verifyPayment,
    deletePayment,
    supabaseStatus,
    pushAllLocalToSupabase,
    pullAllFromSupabase,
    disconnectSupabase,
    connectSupabase
  } = useSchoolStore();

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActiveView = () => {
    if (isLoading) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-brand-green border-t-brand-yellow animate-spin" />
          <p className="text-xs font-semibold text-brand-green uppercase tracking-widest font-sans">
            Loading Academy Portal Resources...
          </p>
        </div>
      );
    }

    switch (currentPage) {
      case 'home':
        return <HomeView news={news} projects={projects} setCurrentPage={setCurrentPage} />;
      case 'about':
        return <AboutView />;
      case 'mission':
        return <MissionView />;
      case 'subjects':
        return <SubjectsView />;
      case 'projects':
        return <ProjectsView projects={projects} />;
      case 'gallery':
        return <GalleryView gallery={gallery} videos={videos} />;
      case 'results':
        return <ResultsView results={results} />;
      case 'payment':
        return <PaymentView payments={payments} onAddPayment={addPayment} />;
      case 'contact':
        return <ContactView onSendMessage={addMessage} />;
      case 'admin':
        return (
          <AdminView
            isAdminLoggedIn={isAdminLoggedIn}
            onLogin={loginAdmin}
            onLogout={logoutAdmin}
            stats={stats}
            news={news}
            projects={projects}
            gallery={gallery}
            videos={videos}
            documents={documents}
            results={results}
            messages={messages}
            payments={payments}
            addNews={addNews}
            editNews={editNews}
            deleteNews={deleteNews}
            addProject={addProject}
            editProject={editProject}
            deleteProject={deleteProject}
            addGalleryItem={addGalleryItem}
            deleteGalleryItem={deleteGalleryItem}
            addVideo={addVideo}
            deleteVideo={deleteVideo}
            addDocument={addDocument}
            deleteDocument={deleteDocument}
            addResult={addResult}
            deleteResult={deleteResult}
            importResultsList={importResultsList}
            markMessageRead={markMessageRead}
            deleteMessage={deleteMessage}
            onVerifyPayment={verifyPayment}
            onDeletePayment={deletePayment}
            supabaseStatus={supabaseStatus}
            pushAllLocalToSupabase={pushAllLocalToSupabase}
            pullAllFromSupabase={pullAllFromSupabase}
            onDisconnectSupabase={disconnectSupabase}
            onConnectSupabase={connectSupabase}
          />
        );
      default:
        return <HomeView news={news} projects={projects} setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between selection:bg-brand-green/25 selection:text-brand-green-dark">
      
      {/* 1. Portal Header (Navigation block) */}
      <div className="no-print">
        <Header 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          isAdminLoggedIn={isAdminLoggedIn}
          onLogout={logoutAdmin}
        />
      </div>

      {/* 2. Main Portal Canvas (Renders selected pages dynamically) */}
      <main className="grow">
        {renderActiveView()}
      </main>

      {/* 3. Document Downloads Drawer (Floating widget only visible in downloads/home/about contexts, is fully integrated) */}
      {currentPage === 'home' && documents.length > 0 && (
        <section className="bg-brand-green/5 border-y border-brand-green/10 py-6 no-print">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="flex items-center space-x-2.5">
              <span className="p-1.5 bg-brand-green text-white rounded border border-brand-yellow/30">
                <BookOpen className="w-4 h-4 text-brand-yellow" />
              </span>
              <div>
                <h3 className="font-bold text-xs sm:text-sm font-heading text-brand-green uppercase tracking-wide">Downloads & Publications Board</h3>
                <p className="text-[10px] text-slate-400">Access official academic calendars, boarding requirements, syllabus regulations, and book lists instantly.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {documents.slice(0, 4).map((doc) => (
                <div 
                  key={doc.id} 
                  className="bg-white p-3 rounded border border-slate-200 shadow-2xs flex justify-between items-center text-xs hover:border-brand-green/30 hover:shadow-xs transition"
                >
                  <div className="space-y-0.5 pr-2">
                    <p className="font-bold text-slate-800 uppercase line-clamp-1 leading-snug">{doc.title}</p>
                    <p className="text-[9px] text-slate-400 uppercase font-mono">Format: <span className="font-bold text-brand-green">{doc.fileType}</span>  |  Size: {doc.fileSize}</p>
                  </div>
                  <a 
                    href={doc.downloadUrl}
                    download={doc.title}
                    className="p-1.5 bg-brand-green hover:bg-brand-green-dark text-white rounded cursor-pointer transition shrink-0 border border-brand-green flex items-center justify-center text-[10px]"
                    title="Download"
                  >
                    ⬇
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Portal Footer */}
      <div className="no-print">
        <Footer setCurrentPage={setCurrentPage} />
      </div>

      {/* 5. Floating Back-to-Top Button */}
      <button
        onClick={handleScrollTop}
        className="fixed bottom-6 right-6 z-40 bg-brand-oxblood hover:bg-brand-oxblood-dark text-brand-yellow p-3 rounded-full shadow-lg transition-all border border-brand-yellow/20 hover:scale-105 cursor-pointer no-print flex items-center justify-center"
        aria-label="Back to Top"
        title="Back to Top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

    </div>
  );
}
