import Link from 'next/link';
import { 
  Sparkles, Upload, FileText, Bot, FileCheck, FileSignature, FileKey,
  Database, Target, ShieldCheck, CheckCircle2, XCircle, LayoutTemplate, 
  ChevronDown, ArrowRight, Zap, Shield, FileUp 
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Navigation bar */}
      <nav className="fixed top-0 w-full z-50 glass-nav h-16 flex items-center">
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Sparkles className="text-indigo-500" size={24} />
            <span className="text-white">ResumeForge AI</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-[#94a3b8] hover:text-white transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm text-[#94a3b8] hover:text-white transition-colors">How It Works</Link>
            <Link href="#templates" className="text-sm text-[#94a3b8] hover:text-white transition-colors">Templates</Link>
            <Link href="#faq" className="text-sm text-[#94a3b8] hover:text-white transition-colors">FAQ</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/signin" className="text-sm font-medium text-white hover:text-indigo-400 transition-colors hidden sm:block">
              Sign In
            </Link>
            <Link href="/signup" className="text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full transition-colors">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-16">
        {/* 2. Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0a0a0f] to-[#0a0a0f] -z-10"></div>
          
          <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8 animate-fade-in">
              <Sparkles size={16} />
              AI-Powered Resume Intelligence
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight max-w-4xl animate-slide-up">
              One career.<br />
              <span className="text-[#94a3b8]">Different jobs.</span><br />
              <span className="text-gradient">Different resumes.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-[#94a3b8] max-w-2xl mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Upload your existing resumes, provide the job description, and generate a tailored ATS-friendly resume grounded entirely in your real experience.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link href="/signup" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-medium transition-all shadow-lg hover:shadow-indigo-500/25">
                Build My Resume <ArrowRight size={18} />
              </Link>
              <Link href="/signup" className="flex items-center gap-2 bg-[#1a1a26] hover:bg-[#2a2a3a] text-white px-8 py-4 rounded-full font-medium transition-colors border border-[#2a2a3a]">
                <Upload size={18} /> Upload Existing Resumes
              </Link>
            </div>

            <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl animate-slide-up" style={{ animationDelay: '0.4s' }}>
              {[
                { icon: Zap, title: '10x Faster', desc: 'Create tailored resumes in seconds' },
                { icon: CheckCircle2, title: 'ATS-Friendly', desc: 'Formats designed to pass scanners' },
                { icon: Shield, title: '100% Your Data', desc: 'We only use your real experience' },
              ].map((stat, i) => (
                <div key={i} className="glass-card p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 mb-4">
                    <stat.icon size={24} />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{stat.title}</h3>
                  <p className="text-sm text-[#94a3b8]">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. How It Works */}
        <section id="how-it-works" className="py-24 bg-[#0a0a0f]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-[#94a3b8] max-w-2xl mx-auto">From messy past resumes to a perfectly targeted PDF in minutes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
              {[
                { step: '01', title: 'Upload Resumes', icon: FileUp, desc: 'Upload your past resumes (PDF/DOCX).' },
                { step: '02', title: 'Build Career Profile', icon: Database, desc: 'We extract and map your master career history.' },
                { step: '03', title: 'Paste Job Description', icon: Target, desc: 'Drop in the JD for your target role.' },
                { step: '04', title: 'AI Analyzes & Matches', icon: Bot, desc: 'AI highlights the most relevant skills.' },
                { step: '05', title: 'Generate Tailored Resume', icon: Sparkles, desc: 'A custom ATS resume is generated.' },
                { step: '06', title: 'Edit & Export', icon: FileSignature, desc: 'Fine-tune and download as PDF/DOCX.' }
              ].map((item, i) => (
                <div key={i} className="bg-[#12121a] border border-[#2a2a3a] p-8 rounded-2xl hover:border-indigo-500/50 transition-colors relative group">
                  <div className="absolute top-6 right-6 text-5xl font-bold text-[#1a1a26] group-hover:text-[#2a2a3a] transition-colors">{item.step}</div>
                  <item.icon size={32} className="text-indigo-400 mb-6" />
                  <h3 className="text-xl font-semibold mb-3 relative z-10">{item.title}</h3>
                  <p className="text-[#94a3b8] relative z-10">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Features Section */}
        <section id="features" className="py-24 bg-[#12121a]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
              <p className="text-[#94a3b8] max-w-2xl mx-auto">Everything you need to land more interviews.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'Multi-Resume Intelligence', desc: 'Merge multiple old resumes into one master database of your career.', icon: Database },
                { title: 'Persistent Career Profile', desc: 'Your data is securely stored, ready for your next job application.', icon: FileKey },
                { title: 'JD-Specific Tailoring', desc: 'Automatically emphasize the exact skills the job description asks for.', icon: Target },
                { title: 'Anti-Hallucination AI', desc: 'Strictly bounded AI that only uses your provided facts. No made-up experience.', icon: ShieldCheck },
                { title: '6 ATS Templates', desc: 'Clean, professional templates guaranteed to parse correctly in ATS systems.', icon: LayoutTemplate },
                { title: 'PDF & DOCX Export', desc: 'Download in the format recruiters ask for, ready to submit.', icon: FileText }
              ].map((feat, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#1a1a26] border border-[#2a2a3a] rounded-xl flex items-center justify-center text-indigo-400">
                    <feat.icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{feat.title}</h3>
                    <p className="text-[#94a3b8] text-sm leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. ATS Section */}
        <section className="py-24 bg-[#0a0a0f]">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="flex-1">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Why ATS Formatting Matters</h2>
                <p className="text-[#94a3b8] mb-8 text-lg">
                  Applicant Tracking Systems (ATS) scan your resume for keywords. If your resume uses complex layouts, tables, or weird fonts, the scanner reads it as gibberish—and you get auto-rejected.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <XCircle className="text-red-400 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <strong className="block text-white">Problematic Formatting</strong>
                      <span className="text-[#94a3b8] text-sm">Multiple columns, invisible tables, graphic skill bars, and unusual fonts confuse parsers.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <strong className="block text-white">ResumeForge AI Formatting</strong>
                      <span className="text-[#94a3b8] text-sm">Clean hierarchy, standard fonts, standard section headers, and standard bullet points.</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="flex-1 w-full max-w-xl">
                <div className="glass-card p-2 bg-gradient-to-br from-[#1a1a26] to-[#12121a]">
                  <div className="border border-[#2a2a3a] rounded-xl p-8 bg-[#0a0a0f]">
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#2a2a3a]">
                      <FileCheck className="text-indigo-400" size={32} />
                      <div>
                        <h4 className="font-bold">ATS Parse Results</h4>
                        <p className="text-xs text-green-400">100% Data Extracted</p>
                      </div>
                    </div>
                    <div className="space-y-4 text-sm text-[#94a3b8] font-mono">
                      <div className="flex justify-between border-b border-[#2a2a3a]/50 pb-2">
                        <span>[Name]</span><span className="text-white">Detected</span>
                      </div>
                      <div className="flex justify-between border-b border-[#2a2a3a]/50 pb-2">
                        <span>[Email]</span><span className="text-white">Detected</span>
                      </div>
                      <div className="flex justify-between border-b border-[#2a2a3a]/50 pb-2">
                        <span>[Experience]</span><span className="text-white">3 Roles Found</span>
                      </div>
                      <div className="flex justify-between pb-2">
                        <span>[Keywords]</span><span className="text-white">14 Matched</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Templates Preview */}
        <section id="templates" className="py-24 bg-[#12121a]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional ATS Templates</h2>
              <p className="text-[#94a3b8] max-w-2xl mx-auto">Designed by recruiters, optimized for machines.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Executive', desc: 'Classic, serif-based template for leadership roles.' },
                { name: 'Modern Tech', desc: 'Clean, sans-serif layout perfect for software engineering.' },
                { name: 'Creative Minimal', desc: 'Elegant spacing for design and marketing positions.' }
              ].map((tpl, i) => (
                <div key={i} className="bg-[#1a1a26] border border-[#2a2a3a] rounded-2xl overflow-hidden group">
                  <div className="aspect-[1/1.4] bg-[#2a2a3a]/30 m-4 rounded-xl border border-[#2a2a3a] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-4 bg-white/5 rounded shadow-sm flex flex-col gap-2 p-4">
                      <div className="w-1/2 h-4 bg-white/20 rounded"></div>
                      <div className="w-1/3 h-2 bg-white/10 rounded mb-4"></div>
                      <div className="w-full h-12 bg-white/10 rounded"></div>
                      <div className="w-full h-12 bg-white/10 rounded"></div>
                      <div className="w-full h-12 bg-white/10 rounded"></div>
                    </div>
                  </div>
                  <div className="p-6 pt-2">
                    <h3 className="font-semibold text-lg mb-1">{tpl.name}</h3>
                    <p className="text-[#94a3b8] text-sm">{tpl.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Privacy Section */}
        <section className="py-24 bg-[#0a0a0f] border-t border-[#2a2a3a]">
          <div className="container mx-auto px-6 text-center max-w-4xl">
            <ShieldCheck size={48} className="mx-auto text-indigo-400 mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Your Data is Yours</h2>
            <p className="text-xl text-[#94a3b8] mb-8">
              We take privacy seriously. Your uploaded resumes are only used to build your personal career profile. We do not use your data to train public models, and you can delete your account and all associated data with one click.
            </p>
          </div>
        </section>

        {/* 8. FAQ Section */}
        <section id="faq" className="py-24 bg-[#12121a]">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {[
                { q: 'Is it really free?', a: 'You can build your career profile and generate your first tailored resume for free. We offer premium plans for unlimited generations and advanced templates.' },
                { q: 'Will the AI make up experience?', a: 'No. Our strict prompt architecture ensures the AI only reformats and highlights the truth found in your master career profile.' },
                { q: 'What formats can I upload?', a: 'You can upload your existing resumes in PDF or DOCX formats.' },
                { q: 'Can I export to Word?', a: 'Yes! You can download your generated resume as a perfectly formatted DOCX or PDF.' },
                { q: 'How does it pass ATS?', a: 'Our templates use standard XML structures (for DOCX) and text layers (for PDF) without invisible tables, columns, or graphics that confuse parsers.' },
                { q: 'Can I edit the generated resume?', a: 'Absolutely. We provide a full editor so you can tweak the AI output before downloading.' }
              ].map((faq, i) => (
                <details key={i} className="group bg-[#1a1a26] border border-[#2a2a3a] rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between p-6 cursor-pointer font-medium hover:text-indigo-400 transition-colors">
                    {faq.q}
                    <span className="transition group-open:rotate-180">
                      <ChevronDown size={20} />
                    </span>
                  </summary>
                  <div className="p-6 pt-0 text-[#94a3b8] leading-relaxed border-t border-[#2a2a3a]/50 mt-2">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 9. CTA Banner */}
        <section className="py-24 bg-gradient-to-t from-indigo-900/20 to-[#0a0a0f] border-t border-[#2a2a3a]">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to land your dream job?</h2>
            <p className="text-xl text-[#94a3b8] mb-10 max-w-2xl mx-auto">
              Stop sending the exact same resume to different jobs. Let AI perfectly tailor your experience in seconds.
            </p>
            <Link href="/signup" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-medium transition-all shadow-lg hover:shadow-indigo-500/25">
              Get Started for Free <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      {/* 10. Footer */}
      <footer className="bg-[#0a0a0f] border-t border-[#2a2a3a] py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Sparkles className="text-indigo-500" size={24} />
              <span className="font-bold text-xl">ResumeForge AI</span>
            </div>
            
            <div className="flex gap-8 text-sm text-[#94a3b8]">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
          
          <div className="mt-8 text-center md:text-left text-sm text-[#94a3b8]/60">
            &copy; {new Date().getFullYear()} ResumeForge AI. All rights reserved. Built for professionals.
          </div>
        </div>
      </footer>
    </div>
  );
}
