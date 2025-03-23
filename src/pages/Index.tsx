import React, { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import Header from '@/components/Header';
import CodeForm from '@/components/CodeForm';
import Footer from '@/components/Footer';
import BackgroundEffects from '@/components/BackgroundEffects';
import { useLockdown } from '@/components/LockdownProvider';
import { Shield, AlertCircle } from 'lucide-react';

const Index = () => {
  const { isLocked } = useLockdown();

  // Questions data
  const questions = [
    {
      problemStatement: "Write a function to reverse a string.",
      testCases: [
        { input: "hello", output: "olleh" },
        { input: "world", output: "dlrow" },
        { input: "12345", output: "54321" },
      ],
    },
    {
      problemStatement: "Write a function to check if a string is a palindrome.",
      testCases: [
        { input: "racecar", output: "true" },
        { input: "hello", output: "false" },
        { input: "madam", output: "true" },
      ],
    },
    {
      problemStatement: "Implement a function to find the longest substring without repeating characters.",
      testCases: [
        { input: "abcabcbb", output: "abc" },
        { input: "bbbbb", output: "b" },
        { input: "pwwkew", output: "wke" },
      ],
    },
  ];

  // Handle form submission
  const handleSubmitForm = async (formData: any) => {
    try {
      const response = await axios.post(
        "https://sheetdb.io/api/v1/k74u8n5i97uy4",
        { data: formData },
        {
          headers: {
            Authorization: "Bearer YOUR_API_KEY", // Replace with actual key
          },
        }
      );

      if (response.status !== 201) {
        throw new Error("Failed to submit form");
      }
      
      return response.data;
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred while submitting your solution");
      throw error;
    }
  };

  // Enhanced security measures
  useEffect(() => {
    if (!isLocked) return;

    // Disable right-click, copy, and paste
    const disableRightClick = (e: MouseEvent) => {
      e.preventDefault();
      toast("Right-click is disabled in secure mode", { 
        description: "This action has been logged" 
      });
    };

    const disableCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      toast("Copying and pasting are disabled for this challenge", { 
        description: "Show your true coding skills without copying solutions!" 
      });
    };

    const disableKeyboardShortcuts = (e: KeyboardEvent) => {
      // Disable common shortcuts for copy, paste, print, save, etc.
      if (e.ctrlKey && 
          ['c', 'v', 'x', 's', 'p', 'a', 'u'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        toast("Keyboard shortcuts are disabled in secure mode", { 
          description: "This action has been logged" 
        });
      }
      
      // Disable F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
        toast.error("Developer tools are disabled in secure mode", {
          description: "This action has been logged and reported"
        });
      }
      
      // Disable Alt+Tab like behavior
      if (e.altKey) {
        e.preventDefault();
      }
    };
    
    // Disable text selection via triple click
    const disableTripleClick = (e: MouseEvent) => {
      if (e.detail >= 3) {
        e.preventDefault();
      }
    };
    
    // Show secure environment notification
    toast(
      <div className="flex items-start gap-3">
        <Shield className="text-green-500 mt-0.5" />
        <div>
          <h3 className="font-semibold mb-1">Secure Coding Environment Active</h3>
          <p className="text-sm text-slate-400">
            You are now in a secure environment. Leaving requires admin approval.
          </p>
        </div>
      </div>,
      { duration: 5000 }
    );

    // Add event listeners
    document.addEventListener('contextmenu', disableRightClick);
    document.addEventListener('copy', disableCopyPaste);
    document.addEventListener('cut', disableCopyPaste);
    document.addEventListener('paste', disableCopyPaste);
    document.addEventListener('keydown', disableKeyboardShortcuts);
    document.addEventListener('mousedown', disableTripleClick);

    // Cleanup function
    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('copy', disableCopyPaste);
      document.removeEventListener('cut', disableCopyPaste);
      document.removeEventListener('paste', disableCopyPaste);
      document.removeEventListener('keydown', disableKeyboardShortcuts);
      document.removeEventListener('mousedown', disableTripleClick);
    };
  }, [isLocked]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <BackgroundEffects />
      
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <CodeForm 
          questions={questions} 
          onSubmitForm={handleSubmitForm} 
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
