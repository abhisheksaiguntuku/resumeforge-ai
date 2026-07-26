'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function ResumeEditorPage() {
  const params = useParams()
  const id = params.id as string

  const [resume, setResume] = useState<any>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResumeData()
  }, [id])

  const fetchResumeData = async () => {
    try {
      const res = await fetch(`/api/resume/${id}`)
      if (res.ok) {
        const data = await res.json()
        setResume(data)
        setAnalysis(data.analysis)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-8">Loading editor...</div>
  if (!resume) return <div className="p-8">Resume not found</div>

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Left Panel */}
      <div className="w-full md:w-64 bg-gray-900 text-white p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Resume Settings</h2>
        
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase">Sections</h3>
          <div className="space-y-2">
            {['Personal', 'Education', 'Experience', 'Projects', 'Skills'].map(section => (
              <label key={section} className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded border-gray-600 bg-gray-700" />
                <span className="text-sm">{section}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase">Design</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500">Template</label>
              <select className="w-full bg-gray-800 border-gray-700 rounded p-1 text-sm mt-1">
                <option>Classic</option>
                <option>Modern</option>
                <option>Creative</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500">Font Family</label>
              <select className="w-full bg-gray-800 border-gray-700 rounded p-1 text-sm mt-1">
                <option>Inter</option>
                <option>Georgia</option>
                <option>Roboto Mono</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500">Font Size</label>
              <select className="w-full bg-gray-800 border-gray-700 rounded p-1 text-sm mt-1">
                <option>10</option>
                <option>11</option>
                <option>12</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-2">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium">Download PDF</button>
          <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded text-sm font-medium">Download DOCX</button>
        </div>
      </div>

      {/* Center Panel (Preview) */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-gray-200 flex justify-center">
        <div className="bg-white w-full max-w-3xl shadow-xl p-8 min-h-[1056px]">
          {/* Simulated Resume Render */}
          <div className="text-center mb-6 border-b pb-4">
            <h1 className="text-3xl font-bold">{resume.resumeData?.personalInfo?.fullName || 'Your Name'}</h1>
            <p className="text-sm text-gray-600">{resume.resumeData?.personalInfo?.email} | {resume.resumeData?.personalInfo?.phone}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-bold border-b border-gray-400 mb-2">EXPERIENCE</h2>
            <div className="mb-4">
              <div className="flex justify-between font-semibold">
                <span>Software Engineer</span>
                <span>Tech Corp</span>
              </div>
              <div className="text-sm text-gray-600 mb-1">Jan 2022 - Present</div>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li className="relative group hover:bg-yellow-50 p-1 rounded cursor-text" contentEditable suppressContentEditableWarning>
                  Developed scalable web applications using React and Node.js.
                  <div className="hidden group-hover:flex absolute right-0 top-0 -mt-6 bg-white shadow border rounded text-xs p-1 space-x-1 z-10">
                    <button className="hover:bg-gray-100 px-1 rounded text-blue-600">Improve</button>
                    <button className="hover:bg-gray-100 px-1 rounded text-blue-600">Concise</button>
                  </div>
                </li>
                <li className="relative group hover:bg-yellow-50 p-1 rounded cursor-text" contentEditable suppressContentEditableWarning>
                  Improved application performance by 30%.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel (Analysis) */}
      <div className="w-full md:w-80 bg-white border-l p-4 overflow-y-auto">
        <div className="flex space-x-2 border-b mb-4">
          <button className="pb-2 border-b-2 border-blue-600 font-medium text-sm text-blue-600">JD Match</button>
          <button className="pb-2 text-gray-500 font-medium text-sm">Analysis</button>
        </div>

        <div className="space-y-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Match Score</div>
            <div className="text-2xl font-bold text-green-600">Strong Match</div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Matched Keywords</h3>
            <div className="flex flex-wrap gap-1">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">React</span>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">TypeScript</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Missing Keywords</h3>
            <p className="text-xs text-red-500 mb-2 italic">Do not add unless you genuinely have this skill</p>
            <div className="flex flex-wrap gap-1">
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">GraphQL</span>
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Docker</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
