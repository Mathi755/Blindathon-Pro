
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ArrowRight, Code, Send, Terminal, Sparkles, Lock, Server, Zap, FileCode2 } from 'lucide-react';
import ProgressIndicator from './ProgressIndicator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import MatrixEffect from './MatrixEffect';

interface Question {
  problemStatement: string;
  testCases: {
    input: string;
    output: string;
  }[];
}

interface CodeFormProps {
  questions: Question[];
  onSubmitForm: (formData: any) => Promise<void>;
}

const CodeForm: React.FC<CodeFormProps> = ({ questions, onSubmitForm }) => {
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [language, setLanguage] = useState('C++');
  const [code, setCode] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [typingEffect, setTypingEffect] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [lineNumbers, setLineNumbers] = useState<string[]>(['1']);
  const [terminalActivity, setTerminalActivity] = useState<string[]>([]);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  // Update line numbers when code changes
  useEffect(() => {
    const lines = code.split('\n');
    const newLineNumbers = Array.from({ length: lines.length }, (_, i) => String(i + 1));
    setLineNumbers(newLineNumbers);
  }, [code]);

  useEffect(() => {
    // Cursor blinking effect
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    // Reset typing effect when question changes
    setTypingEffect('');
    
    if (!currentQuestion) return;
    
    // Terminal activity simulation
    setTerminalActivity([
      'Initializing challenge environment...',
      `Loading challenge ${currentQuestionIndex + 1}/${questions.length}...`,
      'Compiling test cases...',
      'Environment ready. Begin coding.'
    ]);
    
    // Typing effect for problem statement
    let index = 0;
    const statement = currentQuestion.problemStatement;
    const typingInterval = setInterval(() => {
      setTypingEffect(statement.substring(0, index));
      index++;
      
      if (index > statement.length) {
        clearInterval(typingInterval);
      }
    }, 30);
    
    return () => clearInterval(typingInterval);
  }, [currentQuestion, currentQuestionIndex, questions.length]);

  // Prevent dragging on any element
  useEffect(() => {
    const preventDrag = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('dragstart', preventDrag);
    return () => {
      document.removeEventListener('dragstart', preventDrag);
    };
  }, []);

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.trim().length < 10) {
      toast.error('Please write a more substantial solution');
      return;
    }
    
    // Show the confirmation dialog with the code
    setShowSubmitDialog(true);
  };

  const handleFinalSubmit = async () => {
    setShowSubmitDialog(false);
    setIsSubmitting(true);
    
    try {
      const timestamp = new Date().toLocaleString();
      
      await onSubmitForm({
        name,
        college,
        language,
        code,
        timestamp,
        questionIndex: currentQuestionIndex
      });
      
      // Success handling
      toast.success('Solution submitted successfully!', {
        icon: <Zap className="text-yellow-500" />
      });
      
      if (currentQuestionIndex < questions.length - 1) {
        // Automatically move to the next question
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setCode('');
      } else {
        // Show completion message after the final question
        setShowCompletionMessage(true);
        toast('Congratulations! You completed all challenges.', {
          icon: <Sparkles className="text-yellow-500" />
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error('There was a problem with your submission');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container relative">
      <div className="absolute -top-4 right-4 bg-slate-800 px-3 py-1 rounded-full text-xs font-mono flex items-center gap-1 border border-slate-700 shadow-lg">
        <Lock size={12} className="text-green-500" />
        <span className="text-green-500">BLIND MODE ACTIVE</span>
      </div>
      
      <ProgressIndicator 
        currentStep={currentQuestionIndex + 1} 
        totalSteps={questions.length} 
      />
      
      {/* Completion Message Dialog */}
      <Dialog open={showCompletionMessage} onOpenChange={setShowCompletionMessage}>
        <DialogContent className="bg-slate-900 border border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl">🎉 Challenge Complete!</DialogTitle>
            <DialogDescription className="text-slate-400">
              Congratulations on completing all the coding challenges.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
              <h3 className="text-xl font-medium text-primary mb-4">Thank you for participating!</h3>
              <p className="text-slate-300 mb-2">Your solutions have been received and recorded.</p>
              <p className="text-slate-300 mb-4">Results will be announced soon by the organizing team.</p>
              
              <div className="flex items-center gap-2 p-3 bg-slate-900 rounded-lg">
                <Sparkles size={18} className="text-yellow-500" />
                <p className="text-sm text-slate-400">Stay tuned for updates and announcements!</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <form onSubmit={handlePreSubmit} className="space-y-6" onCopy={(e) => e.preventDefault()} onPaste={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group animate-slide-up">
            <label className="block mb-2 text-sm font-medium text-slate-400">Name</label>
            <input
              type="text"
              className="input-field bg-slate-800 border-slate-700 text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
              onCopy={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
            />
          </div>

          <div className="form-group animate-slide-up animate-delay-100">
            <label className="block mb-2 text-sm font-medium text-slate-400">College</label>
            <input
              type="text"
              className="input-field bg-slate-800 border-slate-700 text-white"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="Your institution"
              required
              onCopy={(e) => e.preventDefault()}
              onPaste={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
            />
          </div>
        </div>

        <div className="form-group animate-slide-up animate-delay-200">
          <label className="block mb-2 text-sm font-medium text-slate-400">Programming Language</label>
          <select
            className="input-field bg-slate-800 border-slate-700 text-white"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            required
            onCopy={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
          >
            <option value="C++">C++</option>
            <option value="Java">Java</option>
            <option value="Python">Python</option>
            <option value="JavaScript">JavaScript</option>
          </select>
        </div>

        {currentQuestion && (
          <div className="form-group animate-slide-up animate-delay-300">
            <div className="terminal-header">
              <div className="terminal-dot bg-red-500"></div>
              <div className="terminal-dot bg-yellow-500"></div>
              <div className="terminal-dot bg-green-500"></div>
              <span className="text-xs font-mono text-slate-400 ml-2">challenge-terminal</span>
            </div>
            
            <div className="bg-slate-900 p-4 border border-slate-700 rounded-b-lg">
              <div className="mb-4">
                {terminalActivity.map((line, index) => (
                  <div key={index} className="text-xs font-mono text-green-500 mb-1 flex">
                    <span className="text-slate-500 mr-2">$</span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
              
              <div className="question-text" onCopy={(e) => e.preventDefault()}>
                <div className="flex items-center gap-2 mb-4">
                  <Server size={16} className="text-primary" />
                  <p className="text-slate-300 font-medium">
                    Challenge {currentQuestionIndex + 1}: {typingEffect}
                    {showCursor && <span className="text-primary typing-cursor">|</span>}
                  </p>
                </div>
                
                <div className="mt-4 space-y-3">
                  <p className="text-xs uppercase font-semibold text-slate-500">Test Cases</p>
                  <div className="grid grid-cols-1 gap-2">
                    {currentQuestion.testCases.map((testCase, index) => (
                      <div key={index} className="bg-slate-800/50 p-3 rounded text-sm" onCopy={(e) => e.preventDefault()}>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-primary">{index + 1}</span>
                          <span className="text-slate-400">Input: <code className="font-mono text-slate-300">{testCase.input}</code></span>
                          <ArrowRight size={12} className="text-slate-500" />
                          <span className="text-slate-400">Output: <code className="font-mono text-slate-300">{testCase.output}</code></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="form-group animate-slide-up animate-delay-400">
          <div className="terminal-header">
            <div className="terminal-dot bg-red-500"></div>
            <div className="terminal-dot bg-yellow-500"></div>
            <div className="terminal-dot bg-green-500"></div>
            <div className="flex items-center gap-2 ml-2">
              <FileCode2 size={14} className="text-primary" />
              <span className="text-xs font-mono text-slate-400">blindcode.{language === 'C++' ? 'cpp' : language === 'Java' ? 'java' : language === 'Python' ? 'py' : 'js'}</span>
            </div>
          </div>
          
          <div className="flex bg-slate-900 border border-slate-700 rounded-b-lg">
            <div className="code-line-numbers pt-4 pl-2 font-mono text-xs">
              {lineNumbers.map((num, i) => (
                <div key={i}>{num}</div>
              ))}
            </div>
            
            <textarea
              className="code-editor flex-1 bg-transparent border-none font-mono"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`// Write your ${language} code here...`}
              required
              onCopy={(e) => {
                e.preventDefault();
                toast("Copying is disabled for this challenge", { 
                  description: "Show your true coding skills without copying solutions!" 
                });
              }}
              onPaste={(e) => {
                e.preventDefault();
                toast("Pasting is disabled for this challenge", { 
                  description: "Try solving the problem without external code!" 
                });
              }}
              onCut={(e) => {
                e.preventDefault();
                toast("Cutting is disabled for this challenge", { 
                  description: "No shortcuts allowed!" 
                });
              }}
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="button-primary w-full flex items-center justify-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <span>Submit Solution</span>
              <Send size={16} />
            </>
          )}
        </button>
      </form>
      
      {/* Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="bg-slate-900 border border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Confirm Your Submission</DialogTitle>
            <DialogDescription className="text-slate-400">
              Review your code before final submission
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <div className="bg-slate-800 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Code size={16} className="text-primary" />
                  <span className="text-sm font-medium">Your Solution</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">{language}</span>
              </div>
              
              <pre className="overflow-auto p-2 font-mono text-sm text-white whitespace-pre-wrap">
                {code}
              </pre>
            </div>
            
            <div className="flex gap-4 justify-end mt-4">
              <button 
                className="px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700"
                onClick={() => setShowSubmitDialog(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleFinalSubmit}
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CodeForm;
