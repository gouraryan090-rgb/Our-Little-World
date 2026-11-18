"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 max-w-4xl mx-auto font-body">
      <Link href="/dashboard" className="text-rose hover:underline font-semibold mb-8 inline-block">
        ← Back to Dashboard
      </Link>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <h1 className="font-display text-4xl font-bold text-ink">Privacy Policy</h1>
        <p className="text-ink/60 text-sm">Last updated: March 2026</p>
        
        <div className="space-y-4 text-ink/80 leading-relaxed">
          <h2 className="text-xl font-bold text-ink pt-4">1. Your Privacy Matters</h2>
          <p>This little world created for Aryan and Manshi is entirely private. All memories, photos, and notes stored here are strictly secure and meant only for the two of you.</p>
          
          <h2 className="text-xl font-bold text-ink pt-4">2. Data Security</h2>
          <p>We use secure authentication and database storage to ensure no unauthorized person can access your personal space.</p>
          
          <h2 className="text-xl font-bold text-ink pt-4">3. Contact</h2>
          <p>If you have any questions about your private sanctuary, talk to your co-admin!</p>
        </div>
      </motion.div>
    </div>
  );
}