
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full glass p-8 rounded-2xl text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <AlertTriangle className="text-orange-500" size={28} />
        </div>
        
        <h1 className="text-4xl font-bold mb-2 text-gradient animate-fade-in">404</h1>
        
        <p className="text-lg text-slate-600 mb-6 animate-fade-in animate-delay-100">
          This page seems to have gone missing
        </p>
        
        <Link
          to="/"
          className="button-primary inline-block animate-fade-in animate-delay-200"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
