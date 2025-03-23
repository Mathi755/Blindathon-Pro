
import React from 'react';
import MatrixEffect from './MatrixEffect';

const BackgroundEffects: React.FC = () => {
  return (
    <>
      <MatrixEffect />
      
      <div className="fixed inset-0 z-[-2] bg-grid-slate-900/[0.04] bg-[size:32px_32px] pointer-events-none"></div>
      
      <div className="fixed top-0 left-0 right-0 bottom-0 z-[-1] bg-slate-950 opacity-90"></div>
      
      <div className="fixed top-20 -left-20 w-96 h-96 rounded-full bg-primary opacity-20 blur-3xl"></div>
      <div className="fixed top-[50%] -right-20 w-96 h-96 rounded-full bg-indigo-500 opacity-20 blur-3xl"></div>
      <div className="fixed -bottom-20 left-[45%] w-60 h-60 rounded-full bg-sky-500 opacity-20 blur-3xl"></div>
    </>
  );
};

export default BackgroundEffects;
