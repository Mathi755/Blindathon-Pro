
import React from 'react';
import { Github, Code, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 border-t border-slate-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="matrix-code text-lg font-semibold">BLINDATHON</span>
            <span className="text-xs px-2 py-1 bg-slate-800 rounded-md text-slate-400">v1.0</span>
          </div>
          
          <div className="flex items-center gap-4 text-slate-400">
            <div className="flex items-center gap-1">
              <Code size={16} className="text-primary" />
              <span className="text-sm">with</span>
              <Heart size={16} className="text-red-500" />
              <span className="text-sm">by TEAM INNOVENTURE</span>
            </div>
            
            <a href="#" className="p-2 rounded-full hover:bg-slate-800 transition-colors">
              <Github size={20} className="text-slate-400 hover:text-white" />
            </a>
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} BLINDATHON. All rights reserved.</p>
          <p className="mt-1">Challenge your coding skills in absolute darkness.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
