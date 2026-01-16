import Link from "next/link";
import { MapPin, Mail, Github, Heart } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8 text-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/genesys_icon.svg"
                alt="GeneSys Logo"
                width={50}
                height={50}
              />
              <span className="text-xl font-bold text-white tracking-tight">
                Gene<span className="text-bio-400">Sys</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Revolutionizing General Biology education through interactive game-based learning. Designed for the Filipino STEM curriculum.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/login" className="text-slate-400 hover:text-bio-400 transition-colors">
                  Teacher Login
                </Link>
              </li>
              <li>
                <Link href="/room" className="text-slate-400 hover:text-bio-400 transition-colors">
                  Student Join
                </Link>
              </li>
              <li>
                <Link href="/rooms" className="text-slate-400 hover:text-bio-400 transition-colors">
                  Live Rooms
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="text-slate-400 hover:text-bio-400 transition-colors">
                  Global Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Research Team (Academic Requirement) */}
          <div>
            <h3 className="text-white font-bold mb-4">Research Team</h3>
            <ul className="space-y-3 text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Ceniza, Carl John D.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-dna-500"></span>
                Bacay, Hannah D.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-bio-500"></span>
                Como, Anne Loraine R.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Delos Santos, Shane L.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-dna-500"></span>
                Sandoval, Jeny Jane F.
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-bio-500"></span>
                Vinas, Sophia Phoemela M.
              </li>
            </ul>
          </div>

          {/* Column 4: Institution Info */}
          <div>
            <h3 className="text-white font-bold mb-4">Institution</h3>
            <div className="space-y-4 text-slate-400">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p>
                  Puerto Galera National High School<br />
                  Puerto Galera, Oriental Mindoro<br />
                  Philippines
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                <p className="text-xs text-slate-500 mb-1">Research Period</p>
                <p className="text-slate-300 font-medium">A.Y. 2025–2026</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-center md:text-left">
            © {currentYear} GeneSys Project. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-slate-500">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Use</Link>
            <span className="flex items-center gap-1 text-xs bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
              Made by <Link href="https://github.com/JohnFilhmar" className="hover:text-slate-300 transition-colors">John Filhmar Ola</Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}