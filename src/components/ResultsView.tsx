/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Search, Printer, Download, ShieldCheck, Award, FileText, User, GraduationCap, Calendar, CheckSquare, Key, Lock, Eye, EyeOff } from 'lucide-react';
import { StudentResult } from '../types';

interface ResultsViewProps {
  results: StudentResult[];
}

export default function ResultsView({ results }: ResultsViewProps) {
  const [studentIdInput, setStudentIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [sessionInput, setSessionInput] = useState('2025/2026');
  const [termInput, setTermInput] = useState('3rd Term');
  
  const [foundResult, setFoundResult] = useState<StudentResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState('');

  const reportCardRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    setSearchError('');
    setFoundResult(null);

    if (!studentIdInput.trim()) {
      setSearchError('Please provide a valid Student Registration Number.');
      return;
    }

    // Match ignore-case & remove spaces
    const cleanInput = studentIdInput.trim().toUpperCase();
    const cleanSession = sessionInput.trim();
    const cleanTerm = termInput.trim();

    const matched = results.find((res) => {
      const matchId = res.studentId.toUpperCase() === cleanInput;
      const matchSession = res.academicSession === cleanSession;
      const matchTerm = res.term === cleanTerm;
      return matchId && matchSession && matchTerm;
    });

    if (matched) {
      // Check password security gate if password is set by admin
      if (matched.accessPassword && matched.accessPassword.trim()) {
        const cleanPassword = passwordInput.trim();
        if (!cleanPassword) {
          setSearchError('This student result sheet is password protected. Please enter the Access Password / PIN provided by the school administrator.');
          return;
        }
        if (cleanPassword !== matched.accessPassword.trim()) {
          setSearchError('Invalid Access Password. Please verify the password provided to you by the admin/registrar and try again.');
          return;
        }
      }
      setFoundResult(matched);
    } else {
      setSearchError('No matching academic record found. Double-check the student ID, session, or term selections.');
    }
  };

  const calculateTotals = (result: StudentResult) => {
    let totalScore = 0;
    let totalMax = result.subjectScores.length * 100;
    
    result.subjectScores.forEach(sub => {
      totalScore += sub.totalScore;
    });

    const average = result.subjectScores.length > 0 
      ? Math.round((totalScore / result.subjectScores.length) * 10) / 10 
      : 0;

    return { totalScore, totalMax, average };
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="font-sans text-gray-700 bg-gray-50/50 min-h-screen pb-16">
      
      {/* 1. PRINT ONLY STYLES (Injected directly into page) */}
      <style>{`
        @media print {
          /* Hide non-print areas */
          header, footer, .no-print, button, form, .banner-badge, .sidebar, .floating-admin-btn {
            display: none !important;
          }
          body {
            background-color: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .print-container {
            width: 100% !important;
            max-width: 100% !important;
            padding: 10mm !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
          }
          .print-header {
            border-bottom: 3px double #2E7D32 !important;
            padding-bottom: 4px !important;
            margin-bottom: 20px !important;
          }
          .table-header {
            background-color: #f3f4f6 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      {/* Page Header */}
      <section className="bg-brand-oxblood text-white py-6 md:py-8 text-center border-b-4 border-brand-green relative overflow-hidden no-print">
        <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-1">
          <span className="text-brand-yellow font-bold text-[10px] uppercase tracking-widest flex items-center justify-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            <span>SECURE ACADEMIC DESK</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight uppercase">Terminal Results Checker</h2>
          <p className="text-[11px] sm:text-xs text-gray-200 max-w-xl mx-auto font-light leading-relaxed">
            Verify student report sheets, terminal grades, test evaluations, and principal recommendations instantly.
          </p>
        </div>
      </section>

      {/* Main Results Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SEARCH FORM PANEL (Left / no-print) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-6 no-print">
            <div className="space-y-1">
              <h3 className="font-bold text-base font-heading text-brand-green uppercase tracking-tight flex items-center">
                <Search className="w-5 h-5 text-brand-green mr-2 shrink-0" />
                Student Search Portal
              </h3>
              <p className="text-xs text-gray-400">Provide registration details to load structural grade indices.</p>
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">Student ID / Reg Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HGASS/2026/001"
                  value={studentIdInput}
                  onChange={(e) => setStudentIdInput(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-green/35 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">Academic Session</label>
                <select
                  value={sessionInput}
                  onChange={(e) => setSessionInput(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-green/35 focus:outline-hidden cursor-pointer"
                >
                  <option value="2025/2026">2025/2026 Session</option>
                  <option value="2026/2027">2026/2027 Session</option>
                  <option value="2027/2028">2027/2028 Session</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide">Academic Term</label>
                <select
                  value={termInput}
                  onChange={(e) => setTermInput(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-green/35 focus:outline-hidden cursor-pointer"
                >
                  <option value="1st Term">1st Term</option>
                  <option value="2nd Term">2nd Term</option>
                  <option value="3rd Term">3rd Term</option>
                </select>
              </div>

              <div className="space-y-1.5 bg-amber-50/60 p-3 rounded-xl border border-amber-200/80">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Access Password / PIN</span>
                  </label>
                  <span className="text-[10px] text-amber-700/80 font-medium">If assigned by Admin</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter PIN given by Admin (e.g. HGASS-PASS-001)"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="block w-full pl-3.5 pr-10 py-2.5 bg-white border border-amber-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10.5px] text-amber-800 leading-snug">
                  Required if your result sheet is locked with a confidential PIN.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-green hover:bg-brand-green-dark text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-sm shadow-brand-green/25 border border-brand-green"
              >
                Fetch Terminal Report
              </button>
            </form>
          </div>

          {/* DYNAMIC REPORT SHEET VIEW (Right) */}
          <div className="lg:col-span-8">
            
            {/* Case A: Result Found */}
            {foundResult ? (
              <div className="space-y-6">
                
                {/* Print & Download Options Toolbar (no-print) */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex justify-between items-center no-print">
                  <span className="text-xs text-brand-green font-bold uppercase tracking-wider flex items-center">
                    <FileText className="w-4.5 h-4.5 text-brand-green mr-1.5 shrink-0" />
                    Terminal Record Successfully Loaded
                  </span>
                  <div className="flex space-x-2.5">
                    <button
                      onClick={handlePrint}
                      className="bg-brand-oxblood hover:bg-brand-oxblood-dark text-brand-yellow px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center space-x-1.5 cursor-pointer shadow-xs border border-brand-yellow/20"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print Sheet / Save PDF</span>
                    </button>
                  </div>
                </div>

                {/* THE REPORT SHEET CANVAS (Print target) */}
                <div 
                  ref={reportCardRef}
                  className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200/90 shadow-md print-container relative space-y-8"
                >
                  {/* Diocesan Watermark (Stylized decorative background, subtle) */}
                  <div className="absolute inset-0 bg-[radial-gradient(#2E7D32_1px,transparent_1px)] [background-size:24px_24px] opacity-2 pointer-events-none rounded-2xl" />

                  {/* report card school header */}
                  <div className="print-header flex flex-col md:flex-row justify-between items-center pb-5 border-b-2 border-brand-green/40 gap-4">
                    <div className="flex items-center space-x-4 text-center md:text-left flex-col md:flex-row">
                      {/* Logo shield representation */}
                      <div className="w-16 h-16 rounded-full bg-brand-green text-white border-2 border-brand-yellow flex items-center justify-center shrink-0 shadow-xs">
                        <GraduationCap className="w-9 h-9 text-brand-yellow" />
                      </div>
                      <div className="space-y-0.5">
                        <h2 className="text-xl sm:text-2xl font-black font-heading text-brand-green uppercase tracking-tight leading-none">
                          Holy Ghost Academy Secondary School
                        </h2>
                        <p className="text-xs text-brand-oxblood font-bold tracking-widest uppercase">
                          Kamali Homes, Ngozika Estate, Awka, Anambra State
                        </p>
                        <p className="text-[10px] text-gray-500 font-medium">
                          Motto: Character, Faith & Excellence  |  Email: info@holyghostacademyawka.edu.ng
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-center md:text-right border-l-0 md:border-l border-gray-200 pl-0 md:pl-5">
                      <span className="inline-block text-[10px] font-bold text-white bg-brand-oxblood px-3 py-1.5 rounded-full uppercase tracking-widest">
                        Official Report Sheet
                      </span>
                      <p className="text-[11px] text-gray-400 font-mono mt-1 font-semibold">{foundResult.academicSession} Session</p>
                    </div>
                  </div>

                  {/* student metadata block */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-5 rounded-xl border border-gray-200/60 text-xs font-sans">
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-400 uppercase font-semibold">Student Name</p>
                      <p className="font-bold text-gray-800 text-sm flex items-center">
                        <User className="w-3.5 h-3.5 mr-1 text-brand-green" />
                        {foundResult.studentName}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-400 uppercase font-semibold">Student Reg ID</p>
                      <p className="font-bold text-brand-oxblood text-sm font-mono">{foundResult.studentId}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-400 uppercase font-semibold">Class Level</p>
                      <p className="font-bold text-gray-800 text-sm">{foundResult.classLevel}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-400 uppercase font-semibold">Term Checked</p>
                      <p className="font-bold text-gray-800 text-sm flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-brand-green" />
                        {foundResult.term}
                      </p>
                    </div>
                    
                    <div className="space-y-1 pt-3 border-t border-gray-200/50">
                      <p className="text-[10px] text-gray-400 uppercase font-semibold">Gender</p>
                      <p className="font-semibold text-gray-700">{foundResult.gender}</p>
                    </div>
                    <div className="space-y-1 pt-3 border-t border-gray-200/50">
                      <p className="text-[10px] text-gray-400 uppercase font-semibold">Roll Number</p>
                      <p className="font-semibold text-gray-700">{foundResult.rollNumber}</p>
                    </div>
                    <div className="space-y-1 pt-3 border-t border-gray-200/50">
                      <p className="text-[10px] text-gray-400 uppercase font-semibold">Term Position</p>
                      <p className="font-bold text-brand-green text-sm flex items-center">
                        <Award className="w-3.5 h-3.5 mr-1 text-brand-yellow shrink-0" />
                        {foundResult.position}
                      </p>
                    </div>
                    <div className="space-y-1 pt-3 border-t border-gray-200/50">
                      <p className="text-[10px] text-gray-400 uppercase font-semibold">Attendance Record</p>
                      <p className="font-semibold text-gray-700">{foundResult.attendance}</p>
                    </div>
                  </div>

                  {/* results core scores table */}
                  <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-xs">
                    <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm text-left">
                      <thead className="bg-gray-100 table-header">
                        <tr>
                          <th scope="col" className="px-4 py-3.5 font-bold uppercase tracking-wider text-brand-green font-heading text-[10px]">Subject Course</th>
                          <th scope="col" className="px-4 py-3.5 font-bold uppercase tracking-wider text-gray-500 font-heading text-[10px] text-center">CA Test (30)</th>
                          <th scope="col" className="px-4 py-3.5 font-bold uppercase tracking-wider text-gray-500 font-heading text-[10px] text-center">Exam (70)</th>
                          <th scope="col" className="px-4 py-3.5 font-bold uppercase tracking-wider text-brand-green font-heading text-[10px] text-center">Total (100)</th>
                          <th scope="col" className="px-4 py-3.5 font-bold uppercase tracking-wider text-gray-500 font-heading text-[10px] text-center">Grade</th>
                          <th scope="col" className="px-4 py-3.5 font-bold uppercase tracking-wider text-gray-500 font-heading text-[10px]">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {foundResult.subjectScores.map((score, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/60 transition">
                            <td className="px-4 py-3 font-semibold text-gray-800 uppercase tracking-tight">{score.subject}</td>
                            <td className="px-4 py-3 text-center text-gray-600 font-mono">{score.testScore}</td>
                            <td className="px-4 py-3 text-center text-gray-600 font-mono">{score.examScore}</td>
                            <td className="px-4 py-3 text-center font-bold text-brand-green font-mono">{score.totalScore}</td>
                            <td className="px-4 py-3 text-center font-bold">
                              <span className={`inline-block px-2.5 py-0.5 rounded text-xs uppercase font-bold ${
                                score.grade === 'A' ? 'bg-green-100 text-green-800' :
                                score.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                                score.grade === 'C' ? 'bg-indigo-100 text-indigo-800' :
                                score.grade === 'F' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {score.grade}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-500 font-light italic">{score.remarks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* totals evaluation stats panel */}
                  {(() => {
                    const { totalScore, totalMax, average } = calculateTotals(foundResult);
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-200 pt-5 text-sm">
                        <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-200/60 text-center">
                          <p className="text-[10px] text-gray-400 uppercase font-semibold leading-none">Cumulative Total Mark</p>
                          <p className="font-black text-brand-green text-lg mt-1 font-mono">{totalScore} <span className="text-xs text-gray-400 font-light">/ {totalMax}</span></p>
                        </div>
                        <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-200/60 text-center">
                          <p className="text-[10px] text-gray-400 uppercase font-semibold leading-none">Term Percentage Average</p>
                          <p className="font-black text-brand-oxblood text-lg mt-1 font-mono">{average}%</p>
                        </div>
                        <div className="bg-gray-50 p-3.5 rounded-lg border border-gray-200/60 text-center flex items-center justify-center">
                          <span className="flex items-center text-xs font-bold text-brand-green uppercase tracking-wider">
                            <CheckSquare className="w-4.5 h-4.5 text-brand-green mr-1.5 shrink-0" />
                            Approved by Acad Dean
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* admin & principal recommendations panel */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-6 text-xs sm:text-sm">
                    <div className="space-y-1 bg-gray-50/70 p-4 rounded-xl border border-gray-200/50">
                      <p className="text-[10px] font-bold text-brand-green uppercase tracking-wider">Class Teacher’s Comments</p>
                      <p className="text-gray-600 leading-relaxed font-light italic mt-1">"{foundResult.teacherRemarks}"</p>
                      <div className="pt-2 flex justify-between items-center text-[10px] text-gray-400">
                        <span>Sign: Class Counselor</span>
                        <span className="font-mono">ID: SEC-COUNCIL</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1 bg-gray-50/70 p-4 rounded-xl border border-gray-200/50">
                      <p className="text-[10px] font-bold text-brand-oxblood uppercase tracking-wider">Manager’s Assessment</p>
                      <p className="text-gray-600 leading-relaxed font-light italic mt-1">"{foundResult.principalRemarks}"</p>
                      <div className="pt-2 flex justify-between items-center text-[10px] text-gray-400">
                        <span>Sign: Rev. Fr. Manager</span>
                        <span className="font-mono">STAMP: HGASS-ADMIN</span>
                      </div>
                    </div>
                  </div>

                  {/* Pentecostal Church certification seal badge (subtle) */}
                  <div className="pt-6 border-t border-gray-200 text-center text-[10px] text-gray-400 font-sans tracking-wide">
                    This report sheet is a secure digital record compiled under the strict verification protocols of Awka Pentecostal Church Education Commission. 
                    <br />
                    <span className="font-semibold text-brand-green">Holy Ghost Academy Secondary School, Kamali Homes, Ngozika Housing Estate, Awka.</span>
                  </div>

                </div>

              </div>
            ) : (
              <div className="bg-white p-8 md:p-12 rounded-2xl border border-gray-200 shadow-xs text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="space-y-1.5 max-w-md mx-auto">
                  <h3 className="font-bold text-base font-heading text-gray-800 uppercase tracking-tight">Academic Sheet Waiting Selection</h3>
                  {hasSearched ? (
                    <p className="text-xs text-red-500 font-semibold">{searchError}</p>
                  ) : (
                    <p className="text-xs text-gray-400">Select academic term, session, and input student registration ID inside the sidebar form on the left to verify reports.</p>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
}
