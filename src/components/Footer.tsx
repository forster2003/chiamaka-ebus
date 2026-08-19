/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GraduationCap, Phone, Mail, MapPin, Award, BookOpen } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export default function Footer({ setCurrentPage }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 font-sans border-t-4 border-brand-green">
      {/* Top Footer Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Column 1: School Identity */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-green text-white border border-brand-yellow">
                <GraduationCap className="w-5 h-5 text-brand-yellow" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg font-heading tracking-tight">HOLY GHOST ACADEMY</h3>
                <p className="text-brand-yellow text-xs uppercase font-semibold">Awka, Nigeria</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              An elite, faith-based educational institution dedicated to cultivating academic excellence, moral discipline, character formation, and innovative thinking in future leaders.
            </p>
            <div className="flex space-x-4 pt-2">
              <span className="flex items-center text-xs text-brand-yellow bg-brand-green/20 px-2.5 py-1 rounded-full border border-brand-green/30 font-semibold uppercase">
                <Award className="w-3.5 h-3.5 mr-1" /> Faith-Based
              </span>
              <span className="flex items-center text-xs text-brand-yellow bg-brand-oxblood/20 px-2.5 py-1 rounded-full border border-brand-oxblood/30 font-semibold uppercase">
                <BookOpen className="w-3.5 h-3.5 mr-1" /> Top-Tier
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-base font-heading mb-4 pb-2 border-b border-gray-800">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Home Portal', id: 'home' },
                { label: 'About History & Values', id: 'about' },
                { label: 'Mission & Vision', id: 'mission' },
                { label: 'Academic Syllabus', id: 'subjects' },
                { label: 'Ongoing School Projects', id: 'projects' },
                { label: 'School Gallery', id: 'gallery' },
                { label: 'Check Terminal Results', id: 'results' },
                { label: 'Contact Administration', id: 'contact' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => setCurrentPage(link.id)}
                    className="hover:text-brand-green hover:underline text-left transition duration-150 cursor-pointer text-gray-400"
                  >
                    &raquo; {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Academic & Subjects Summary */}
          <div>
            <h4 className="text-white font-semibold text-base font-heading mb-4 pb-2 border-b border-gray-800">
              Academic Paths
            </h4>
            <div className="space-y-3 text-sm text-gray-400">
              <div>
                <p className="text-white font-medium text-xs uppercase tracking-wider text-brand-yellow">Junior Secondary (JSS 1 - JSS 3)</p>
                <p className="text-xs text-gray-400 mt-1">Mathematics, English, Civic Ed, Basic Science, Agricultural Science, Computer Science, and CCA.</p>
              </div>
              <div>
                <p className="text-white font-medium text-xs uppercase tracking-wider text-brand-yellow">Senior Secondary (SS 1 - SS 3)</p>
                <p className="text-xs text-gray-400 mt-1">Physics, Chemistry, Biology, Economics, Government, Literature, Computer Science, and Geography.</p>
              </div>
            </div>
          </div>

          {/* Column 4: Contact details */}
          <div>
            <h4 className="text-white font-semibold text-base font-heading mb-4 pb-2 border-b border-gray-800">
              Get in Touch
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                <span className="text-gray-400 text-xs leading-relaxed">
                  Holy Ghost Academy Secondary School,<br />
                  Kamali Homes, Ngozika Housing Estate,<br />
                  Awka, Anambra State, Nigeria.
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4.5 h-4.5 text-brand-green shrink-0" />
                <span className="text-gray-400 text-xs">+234 803 456 7890, +234 812 345 6789</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4.5 h-4.5 text-brand-green shrink-0" />
                <span className="text-gray-400 text-xs">info@holyghostacademyawka.edu.ng</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Legal Credit Banner */}
      <div className="bg-gray-950 text-[10px] text-gray-500 py-3 text-center border-t border-gray-800/60 font-sans font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <p>&copy; {currentYear} Holy Ghost Academy Secondary School, Awka. Approved by Ministry of Education.</p>
          <div className="flex items-center space-x-3.5">
            <span className="text-brand-yellow/90 font-bold uppercase tracking-wider">Motto: Character, Faith & Excellence</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-bold uppercase text-[9px]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              School Server Online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
