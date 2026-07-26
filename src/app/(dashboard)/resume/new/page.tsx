'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function NewResumeWizardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialJobId = searchParams.get('jobId')
  
  const [step, setStep] = useState(1)
  const [jobId, setJobId] = useState<string | null>(initialJobId)
  const [jobs, setJobs] = useState<any[]>([])
  
  const [template, setTemplate] = useState('classic_ats')
  const [pageLength, setPageLength] = useState('auto')
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [matchResult, setMatchResult] = useState<any>(null)

  useEffect(() => {
    if (initialJobId) {
      setStep(2) // Skip to step 2 if we came with a jobId
    }
  }, [initialJobId])

  useEffect(() => {
    if (step === 2) {
      fetch('/api/jobs')
        .then(res => res.json())
        .then(data => {
          if (data.jobs) setJobs(data.jobs)
        })
    }
    
    if (step === 3 && jobId) {
      // Simulate match analysis fetching
      setTimeout(() => {
        setMatchResult({ score: 'Strong', matched: ['React', 'Next.js', 'TypeScript'], missing: ['GraphQL', 'AWS'] })
      }, 1500)
    }
  }, [step, jobId])

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const res = await fetch('/api/resume/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescriptionId: jobId,
          templateId: template,
          pageLength
        })
      })
      const result = await res.json()
      if (result.success) {
        router.push(`/resume/${result.resumeVersionId}/editor`)
      } else {
        console.error(result.error)
        alert(result.error || 'Failed to generate resume')
      }
    } catch (err) {
      console.error(err)
      alert('An error occurred during resume generation')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Resume</h1>
      
      {/* Wizard Steps Navigation */}
      <div className="flex space-x-4 mb-8 border-b pb-4 overflow-x-auto">
        {[
          { s: 1, label: 'Career Info' },
          { s: 2, label: 'Target Job' },
          { s: 3, label: 'Analysis' },
          { s: 4, label: 'Options' },
          { s: 5, label: 'Generate' }
        ].map(({ s, label }) => (
          <div key={s} className={`flex items-center whitespace-nowrap ${step >= s ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
            <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-2 ${step >= s ? 'border-blue-600' : 'border-gray-400'}`}>
              {s}
            </span>
            {label}
            {s < 5 && <span className="mx-4 text-gray-300">/</span>}
          </div>
        ))}
      </div>

      <div className="bg-white text-slate-900 p-6 rounded-lg shadow-sm border">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Step 1: Career Information</h2>
            <div className="bg-blue-50 p-4 rounded mb-6">
              <p className="font-medium text-blue-900">Profile Completeness: 85%</p>
              <p className="text-blue-700 text-sm mt-1">Uploaded Resumes: 2</p>
            </div>
            <div className="flex space-x-4">
              <button onClick={() => setStep(2)} className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition">
                Use my Career Profile
              </button>
              <button onClick={() => setStep(2)} className="border border-gray-300 px-6 py-2 rounded font-medium hover:bg-gray-50 transition">
                Upload New Resumes
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Step 2: Target Job</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Select Saved Job</label>
              <select 
                value={jobId || ''} 
                onChange={(e) => setJobId(e.target.value)}
                className="w-full border border-gray-300 p-2.5 rounded focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Select a Job --</option>
                {jobs.map(job => (
                  <option key={job.id} value={job.id}>{job.title} {job.company ? `at ${job.company}` : ''}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500">Or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <button onClick={() => router.push('/jobs/new')} className="border border-gray-300 px-4 py-2 rounded font-medium w-full mb-8 hover:bg-gray-50 transition">
              + Add New Job Description
            </button>
            
            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(1)} className="text-gray-600 px-4 py-2">Back</button>
              <button 
                onClick={() => setStep(3)} 
                disabled={!jobId}
                className="bg-blue-600 text-white px-6 py-2 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
              >
                Continue to Analysis
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Step 3: Match Analysis</h2>
            {!matchResult ? (
              <div className="py-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Analyzing job match and identifying key skills...</p>
              </div>
            ) : (
              <div>
                <div className="mb-6 p-5 border rounded-lg bg-blue-50 border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg text-blue-900">Match Score</h3>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold text-sm">
                      {matchResult.score}
                    </span>
                  </div>
                  <p className="text-sm text-blue-700 mb-6">
                    This score reflects your profile's alignment with this JD. Real ATS results may vary.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded border border-blue-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Matched Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {matchResult.matched.map((skill: string) => (
                          <span key={skill} className="px-2 py-1 bg-green-50 text-green-700 rounded text-sm border border-green-200">{skill}</span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded border border-blue-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Missing Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {matchResult.missing.map((skill: string) => (
                          <span key={skill} className="px-2 py-1 bg-red-50 text-red-700 rounded text-sm border border-red-200">{skill}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button onClick={() => setStep(2)} className="text-gray-600 px-4 py-2">Back</button>
                  <button onClick={() => setStep(4)} className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition">
                    Continue to Template
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Step 4: Resume Options</h2>
            
            <div className="mb-8">
              <h3 className="font-medium mb-3 text-gray-700">Select Template</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { id: 'classic_ats', name: 'Classic ATS' },
                  { id: 'modern', name: 'Modern' },
                  { id: 'creative', name: 'Creative' }
                ].map(t => (
                  <div 
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    className={`border-2 p-4 rounded-lg cursor-pointer text-center transition ${
                      template === t.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="w-12 h-16 bg-gray-200 mx-auto mb-2 rounded shadow-sm flex flex-col p-1 space-y-1">
                      <div className="h-1 bg-gray-300 rounded w-1/2"></div>
                      <div className="h-0.5 bg-gray-300 rounded w-full mt-2"></div>
                      <div className="h-0.5 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-0.5 bg-gray-300 rounded w-full"></div>
                    </div>
                    <span className="font-medium text-sm">{t.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="font-medium mb-3 text-gray-700">Page Length</h3>
              <select 
                value={pageLength} 
                onChange={e => setPageLength(e.target.value)}
                className="w-full md:w-1/2 border border-gray-300 p-2.5 rounded focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="auto">Auto (Recommended)</option>
                <option value="1">Strictly 1 Page</option>
                <option value="2">Strictly 2 Pages</option>
              </select>
            </div>
            
            <div className="flex justify-between">
              <button onClick={() => setStep(3)} className="text-gray-600 px-4 py-2">Back</button>
              <button onClick={() => setStep(5)} className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition">
                Finalize Options
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Ready to Generate</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Our AI will now analyze your career profile and the job description to write a tailored, ATS-friendly resume.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={() => setStep(4)} className="text-gray-600 px-6 py-3" disabled={isGenerating}>
                Back
              </button>
              <button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Resume...
                  </>
                ) : 'Generate Resume Now'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function NewResumeWizard() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading wizard...</div>}>
      <NewResumeWizardContent />
    </Suspense>
  )
}
