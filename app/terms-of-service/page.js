"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 max-w-4xl mx-auto font-body">
      <Link href="/dashboard" className="text-rose hover:underline font-semibold mb-8 inline-block">
        ← Back to Dashboard
      </Link>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <h1 className="font-display text-4xl font-bold text-ink">Terms of Service</h1>
        <p className="text-ink/60 text-sm">Last updated: March 2026</p>
        
        <div className="space-y-4 text-ink/80 leading-relaxed">
          <h2 className="text-xl font-bold text-ink pt-4">1. Acceptance of Terms</h2>
          <p>By entering "Our Little World", you agree to cherish, respect, and keep all memories safe with love.</p>
          
          <h2 className="text-xl font-bold text-ink pt-4">2. Usage Rights</h2>
          <p>This platform is exclusively reserved for Aryan and Manshi's bond. No outside interference allowed!</p>
          
          <h2 className="text-xl font-bold text-ink pt-4">3. Lifetime Validity</h2>
          <p>The terms of this relationship and website are valid till forever and beyond ❤️.</p>
        </div>
      </motion.div>
    </div>
  );
}