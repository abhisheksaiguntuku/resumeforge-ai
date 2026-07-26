'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function ResumeAnalysisPage() {
  const params = useParams()
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchAnalysis = async (force = false) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/resume/${params.id}/analyze`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Failed to analyze resume')
      const data = await res.json()
      setAnalysis(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalysis()
  }, [params.id])

  if (loading && !analysis) {
    return <div className="p-8 text-center">Loading analysis...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>
  }

  if (!analysis) return null

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-100'
    if (score >= 40) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
  }

  const getProgressColor = (score: number) => {
    if (score >= 70) return 'bg-green-500'
    if (score >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const scores = [
    { label: 'Parsing Safety', value: analysis.parsingSafety },
    { label: 'JD Coverage', value: analysis.jdCoverage },
    { label: 'Skills Alignment', value: analysis.skillsAlignment },
    { label: 'Section Completeness', value: analysis.sectionCompleteness },
    { label: 'Bullet Quality', value: analysis.bulletQuality },
    { label: 'Readability', value: analysis.readability },
    { label: 'Formatting Safety', value: analysis.formattingSafety },
    { label: 'Contact Info', value: analysis.contactInfo },
    { label: 'Education Complete', value: analysis.educationComplete },
    { label: 'Experience Relevance', value: analysis.experienceRelevance },
  ]

  const overallColor = getScoreColor(analysis.overallScore).split(' ')[0].replace('text-', '')

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Resume Analysis</h1>
          <p className="text-gray-500">Review actionable feedback to improve your resume.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => fetchAnalysis(true)} disabled={loading} className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50">
            {loading ? 'Analyzing...' : 'Run Analysis'}
          </button>
          <Link href={`/resume/${params.id}`} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Back to Editor
          </Link>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl border flex flex-col items-center justify-center">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-gray-200"
              strokeDasharray="100, 100"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              stroke="currentColor" strokeWidth="3" fill="none"
            />
            <path
              style={{ color: overallColor }}
              strokeDasharray={`${analysis.overallScore}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-4xl font-bold">{analysis.overallScore}</span>
            <span className="text-sm text-gray-500">/ 100</span>
          </div>
        </div>
        <h2 className="mt-4 text-xl font-semibold">Resume Readiness Score</h2>
        <p className="mt-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
          ⚠ This is an estimated score based on best practices. Actual ATS systems vary by employer.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {scores.map((s, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border">
            <div className="text-sm text-gray-600 mb-2">{s.label}</div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-lg">{s.value}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className={`h-2 rounded-full ${getProgressColor(s.value)}`} style={{ width: `${s.value}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl border">
        <h3 className="text-lg font-semibold mb-4">Issues & Suggestions</h3>
        <div className="space-y-4">
          {(analysis.issues as any[])?.map((issue: any, i: number) => (
            <div key={i} className={`p-4 rounded-lg flex items-start gap-4 border ${
              issue.severity === 'critical' ? 'border-red-200 bg-red-50' : 
              issue.severity === 'warning' ? 'border-orange-200 bg-orange-50' : 
              'border-blue-200 bg-blue-50'
            }`}>
              <div className="flex-1">
                <div className="font-semibold">{issue.message}</div>
                <div className="text-sm mt-1 opacity-80">{issue.suggestion}</div>
              </div>
              <Link href={`/resume/${params.id}`} className="px-3 py-1 bg-white border rounded text-sm hover:bg-gray-50 shrink-0">
                Fix
              </Link>
            </div>
          ))}
          {(!analysis.issues || analysis.issues.length === 0) && (
            <div className="text-gray-500 text-center py-4">No major issues found!</div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border">
        <h3 className="text-lg font-semibold mb-4">Keyword Coverage</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-green-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span> Matched
            </h4>
            <div className="flex flex-wrap gap-2">
              {(analysis.matchedKeywords as string[])?.map((kw: string, i: number) => (
                <span key={i} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">{kw}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-yellow-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Partial
            </h4>
            <div className="flex flex-wrap gap-2">
              {(analysis.partialKeywords as string[])?.map((kw: string, i: number) => (
                <span key={i} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">{kw}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-red-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> Missing
            </h4>
            <div className="flex flex-wrap gap-2 mb-2">
              {(analysis.missingKeywords as string[])?.map((kw: string, i: number) => (
                <span key={i} className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">{kw}</span>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 italic">Do not add these unless you genuinely possess the skill.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
