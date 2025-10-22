import React from 'react';
import { Link } from 'react-router-dom';
import { Pin, Mail, Phone, MapPin, Clock, Trophy, Users, BarChart3, Facebook, Twitter, Instagram } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-tiger-primary-black via-tiger-neutral-900 to-tiger-neutral-800 text-white mt-20 relative overflow-hidden border-t-4 border-tiger-tiger-gold">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L30 60 M0 30 L60 30' stroke='%23ffffff' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-10 md:mb-12">

          {/* Column 1: About */}
          <div>
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <Pin className="w-8 h-8 text-tiger-tiger-gold" />
              <div>
                <div className="text-lg font-black leading-tight">WILLARD TIGERS</div>
                <div className="text-xs font-bold text-tiger-tiger-gold leading-tight">BOWLING</div>
              </div>
            </div>
            <p className="text-sm text-tiger-neutral-300 leading-relaxed mb-4">
              Building champions one frame at a time. Join the most dynamic high school bowling program in the region.
            </p>
            <div className="flex items-center gap-2 text-tiger-tiger-gold font-bold text-sm">
              <Trophy className="w-4 h-4" />
              <span>3x District Champions</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-base font-black mb-4 md:mb-6 text-tiger-tiger-gold">Quick Links</h3>
            <nav className="space-y-3">
              <Link to="/" className="flex items-center gap-2 text-sm text-tiger-neutral-300 hover:text-white hover:translate-x-1 transition-all group">
                <Pin className="w-4 h-4 text-tiger-tiger-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                <span>Home</span>
              </Link>
              <Link to="/roster" className="flex items-center gap-2 text-sm text-tiger-neutral-300 hover:text-white hover:translate-x-1 transition-all group">
                <Users className="w-4 h-4 text-tiger-tiger-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                <span>Team Roster</span>
              </Link>
              <Link to="/stats" className="flex items-center gap-2 text-sm text-tiger-neutral-300 hover:text-white hover:translate-x-1 transition-all group">
                <BarChart3 className="w-4 h-4 text-tiger-tiger-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                <span>Statistics</span>
              </Link>
              <Link to="/contact" className="flex items-center gap-2 text-sm text-tiger-neutral-300 hover:text-white hover:translate-x-1 transition-all group">
                <Mail className="w-4 h-4 text-tiger-tiger-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                <span>Join the Team</span>
              </Link>
            </nav>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-base font-black mb-4 md:mb-6 text-tiger-tiger-gold">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-tiger-tiger-gold mt-0.5 flex-shrink-0" />
                <a href="mailto:coach@willardtigers.com" className="text-tiger-neutral-300 hover:text-white transition-colors break-all">
                  coach@willardtigers.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-tiger-tiger-gold mt-0.5 flex-shrink-0" />
                <a href="tel:+1234567890" className="text-tiger-neutral-300 hover:text-white transition-colors">
                  (123) 456-7890
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-tiger-tiger-gold mt-0.5 flex-shrink-0" />
                <span className="text-tiger-neutral-300">
                  Willard High School<br />
                  Willard, Missouri
                </span>
              </div>
            </div>
          </div>

          {/* Column 4: Practice Schedule */}
          <div>
            <h3 className="text-base font-black mb-4 md:mb-6 text-tiger-tiger-gold">Practice Times</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-tiger-tiger-gold mt-0.5 flex-shrink-0" />
                <div className="text-tiger-neutral-300">
                  <div className="font-bold text-white mb-1">Monday & Wednesday</div>
                  <div>3:30 PM - 5:30 PM</div>
                  <div className="text-xs text-tiger-neutral-400 mt-1">Willard Lanes</div>
                </div>
              </div>
              <div className="pt-3 border-t border-tiger-neutral-700">
                <div className="text-tiger-neutral-300 text-xs leading-relaxed">
                  All skill levels welcome. Equipment provided. No experience necessary.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-tiger-neutral-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-tiger-neutral-400">
              © {new Date().getFullYear()} Willard Tigers Bowling Team. All rights reserved.
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-tiger-neutral-800 hover:bg-tiger-tiger-gold text-white hover:text-tiger-primary-black flex items-center justify-center transition-all transform hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-tiger-neutral-800 hover:bg-tiger-tiger-gold text-white hover:text-tiger-primary-black flex items-center justify-center transition-all transform hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-tiger-neutral-800 hover:bg-tiger-tiger-gold text-white hover:text-tiger-primary-black flex items-center justify-center transition-all transform hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>

            <div className="text-xs text-tiger-neutral-500 font-semibold">
              FOCUSED • CONNECTED • DRIVEN
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
