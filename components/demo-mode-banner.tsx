"use client";

import { useEffect, useState } from "react";
import { XCircle, Info, Database } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function DemoModeBanner() {
  const [isDemo, setIsDemo] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    // Check if we have a dummy token
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token && token.includes("dummy")) {
      setIsDemo(true);
    }

    // After 5 seconds, collapse the full message to show a minimized version
    const timer = setTimeout(() => {
      setIsExpanded(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!isDemo || isHidden) {
    return null;
  }

  return (
    <Alert className="fixed top-0 left-0 right-0 z-50 rounded-none border-y-0 border-l-0 border-r-0 border-b border-accent/50 bg-gradient-to-r from-primary to-accent text-white shadow-md transition-all duration-300">
      <div className="container flex items-center justify-between py-2">
        <div
          className="flex items-center gap-2 cursor-pointer transition-opacity duration-300"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex-shrink-0 bg-white/20 p-1.5 rounded-full">
            <Database className="h-4 w-4 text-white" />
          </div>
          <div className="flex items-center">
            {isExpanded ? (
              <AlertDescription className="text-sm font-medium animate-in fade-in slide-in-from-right-5 duration-300">
                <span className="font-bold">Demo Mode:</span> Using simulated
                data instead of API. All changes are temporary.
              </AlertDescription>
            ) : (
              <AlertDescription className="text-sm font-medium animate-in fade-in slide-in-from-left-5 duration-300">
                <span className="font-bold">Demo Mode</span>{" "}
                <span className="text-white/80">(click for details)</span>
              </AlertDescription>
            )}
          </div>
        </div>
        <button
          onClick={() => setIsHidden(true)}
          className="ml-2 text-white/80 hover:text-white transition-colors flex-shrink-0 rounded-full hover:bg-white/10 p-1"
          aria-label="Close demo mode notification"
        >
          <XCircle size={16} />
        </button>
      </div>
    </Alert>
  );
}
