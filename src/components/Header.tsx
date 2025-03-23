import React from "react";
import { Terminal, Code, Sparkles } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="py-8 relative">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center">
        <div className="flex items-center gap-3 mb-4 animate-fade-in">
          <Terminal size={32} className="text-primary" />
          <Code size={24} className="text-primary" />
          <Sparkles size={20} className="text-yellow-500" />
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-center mb-4 matrix-code animate-fade-in">
          BLINDATHON
        </h1>

        <div className="flex items-center justify-center gap-2 mb-6 animate-fade-in animate-delay-200">
          <div className="h-px w-12 bg-primary/50"></div>
          <span className="text-slate-400 font-mono tracking-widest text-sm">
            BLIND CODING CHALLENGE
          </span>
          <div className="h-px w-12 bg-primary/50"></div>
        </div>

        <p className="max-w-2xl text-center text-slate-400 animate-fade-in animate-delay-300">
          Put your coding skills to the ultimate test. Solve challenges without
          seeing what you type.
          <br />
          <span className="font-mono text-primary">
            Trust your instincts. Code blind. Excel.
          </span>
        </p>
      </div>

      {/* Terminal line animation */}
      <div className="w-full mt-8">
        <div className="progress-line"></div>
      </div>
    </header>
  );
};

export default Header;
