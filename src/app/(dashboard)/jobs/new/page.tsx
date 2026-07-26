'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Briefcase, Loader2, Sparkles, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function NewJobPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    jobUrl: '',
    rawText: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!form.title.trim()) e.title = 'Job title is required'
    if (!form.rawText.trim()) e.rawText = 'Job description is required'
    if (form.rawText.trim().length < 50) e.rawText = 'Paste the full job description (min 50 characters)'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const result = await res.json()
      if (res.ok && result.success) {
        toast.success('Job description analyzed successfully!')
        router.push(`/resume/new?jobId=${result.jobId}`)
      } else {
        toast.error(result.error || 'Failed to save job description')
      }
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Briefcase className="w-5 h-5 text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Target a New Job</h1>
          </div>
          <p className="text-slate-400">
            Paste the job description and our AI will analyze it to tailor your resume perfectly.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div
            style={{ background: '#12121a', border: '1px solid #2a2a3a', borderRadius: '16px', padding: '24px' }}
          >
            {/* Job Title */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Job Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Senior Software Engineer"
                style={{
                  width: '100%',
                  background: '#1a1a26',
                  border: errors.title ? '1px solid #ef4444' : '1px solid #2a2a3a',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '14px',
                }}
              />
              {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Company + Location row */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Company Name</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                  placeholder="e.g. Google"
                  style={{
                    width: '100%',
                    background: '#1a1a26',
                    border: '1px solid #2a2a3a',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  placeholder="e.g. Remote, Bangalore"
                  style={{
                    width: '100%',
                    background: '#1a1a26',
                    border: '1px solid #2a2a3a',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '14px',
                  }}
                />
              </div>
            </div>

            {/* Job URL */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-300 mb-2">Job Posting URL (optional)</label>
              <input
                type="url"
                value={form.jobUrl}
                onChange={e => setForm(f => ({ ...f, jobUrl: e.target.value }))}
                placeholder="https://..."
                style={{
                  width: '100%',
                  background: '#1a1a26',
                  border: '1px solid #2a2a3a',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '14px',
                }}
              />
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Job Description <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.rawText}
                onChange={e => setForm(f => ({ ...f, rawText: e.target.value }))}
                placeholder="Paste the complete job description here. Include requirements, responsibilities, qualifications, and preferred skills for the best AI analysis..."
                rows={12}
                style={{
                  width: '100%',
                  background: '#1a1a26',
                  border: errors.rawText ? '1px solid #ef4444' : '1px solid #2a2a3a',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '14px',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.rawText
                  ? <p className="text-red-400 text-sm">{errors.rawText}</p>
                  : <p className="text-slate-500 text-sm">Paste the full job description for best AI results</p>
                }
                <span className="text-slate-500 text-xs">{form.rawText.length} chars</span>
              </div>
            </div>
          </div>

          {/* AI Analysis Steps */}
          {isLoading && (
            <div
              style={{ background: '#12121a', border: '1px solid #2a2a3a', borderRadius: '16px', padding: '20px' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                <span className="text-white font-medium">Analyzing job description...</span>
              </div>
              <div className="space-y-2 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                  Extracting required skills and keywords
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
                  Identifying experience requirements
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
                  Weighing keyword importance
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              background: isLoading ? '#4338ca80' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              color: '#fff',
              fontWeight: '600',
              fontSize: '16px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze & Continue to Resume Builder
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
