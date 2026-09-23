"use client";

import React from "react";
import { Mail } from "lucide-react";
import Reveal3D from "../Reveal3D";
import { contact } from "@/data/contact";

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function ContactSection() {
  return (
    <section className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <Reveal3D>
        <div className="text-center">
          <h3 className="text-5xl font-bold text-white mb-8">CONTINUE?</h3>
          
          <div className="flex items-center justify-center gap-6 sm:gap-8">
            
            {/* Tombol LinkedIn */}
            <a 
              href="https://www.linkedin.com/in/johan-hendrawan/" 
              target="_blank" 
              rel="noopener noreferrer"
              data-cursor="hover" 
              className="glass glass-hover p-6 rounded-lg flex flex-col items-center gap-4 group"
            >
              <div className="w-16 h-20 border-2 border-white/20 flex items-center justify-center group-hover:border-[#4cc9f0] transition-colors relative overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 h-0 bg-[#4cc9f0]/20 group-hover:h-full transition-all duration-500" />
                <LinkedinIcon className="text-white group-hover:text-[#4cc9f0] transition-colors relative z-10" />
              </div>
              <span className="tracking-wider font-bold text-sm text-slate-300 group-hover:text-white transition-colors">LINKEDIN</span>
            </a>

            <a 
              href={contact.mailtoLink} 
              data-cursor="hover" 
              className="glass glass-hover p-6 rounded-lg flex flex-col items-center gap-4 group"
            >
              <div className="w-16 h-20 border-2 border-white/20 flex items-center justify-center group-hover:border-[#f72585] transition-colors relative overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 h-0 bg-[#f72585]/20 group-hover:h-full transition-all duration-500" />
                <Mail className="text-white group-hover:text-[#f72585] transition-colors relative z-10" />
              </div>
              <span className="tracking-wider font-bold text-sm text-slate-300 group-hover:text-white transition-colors">EMAIL</span>
            </a>

          </div>
        </div>
      </Reveal3D>
    </section>
  );
}