'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ResumesPage() {
  const [resumes, setResumes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/resume')
      .then(res => res.json())
      .then(data => {
        if (data.resumes) {
          const mapped = data.resumes.map((r: any) => ({
            id: r.id,
            name: r.name || 'Untitled Resume',
            targetJob: r.jobDescription?.title || 'General',
            company: r.jobDescription?.company || '',
            templateId: r.templateId || 'Standard',
            score: 0, 
            updatedAt: r.updatedAt
          }))
          setResumes(mapped)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleDeleteResume = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return

    try {
      const res = await fetch(`/api/resume?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      
      const newResumes = resumes.filter(r => r.id !== id)
      setResumes(newResumes)

      if (newResumes.length === 0) {
        if (confirm('Since you deleted your last resume, would you also like to wipe your extracted Career Profile to start completely fresh?')) {
          await fetch('/api/profile/wipe', { method: 'DELETE' })
          alert('Career profile wiped successfully!')
        }
      }
    } catch (err) {
      alert('Error deleting resume')
    }
  }

  const filteredResumes = resumes.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.targetJob?.toLowerCase().includes(search.toLowerCase()) || 
    r.company?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Resumes</h1>
          <p className="text-gray-500 mt-2">Manage and track your generated resumes.</p>
        </div>
        <Link href="/templates" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Build New Resume
        </Link>
      </div>

      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Search by job title or company..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : filteredResumes.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes found</h3>
          <p className="text-gray-500 mb-6">Build your first resume to get started.</p>
          <div className="flex justify-center gap-4">
            <Link href="/templates" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Build Your First Resume
            </Link>
            <button onClick={async () => {
              if (confirm('Are you sure you want to completely wipe your Career Profile?')) {
                await fetch('/api/profile/wipe', { method: 'DELETE' })
                alert('Profile wiped!')
              }
            }} className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50">
              Wipe Career Profile
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 font-medium text-gray-600">Name</th>
                <th className="p-4 font-medium text-gray-600">Target Job / Company</th>
                <th className="p-4 font-medium text-gray-600">Score</th>
                <th className="p-4 font-medium text-gray-600">Updated</th>
                <th className="p-4 font-medium text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResumes.map(resume => (
                <tr key={resume.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4 font-medium">{resume.name}</td>
                  <td className="p-4 text-gray-600">
                    {resume.targetJob} {resume.company && `at ${resume.company}`}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${resume.score >= 80 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {resume.score}/100
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 text-sm">
                    {new Date(resume.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right space-x-2 flex justify-end items-center">
                    <Link href={`/resume/${resume.id}`} className="text-blue-600 hover:underline text-sm px-2 border-r">Edit</Link>
                    <Link href={`/resume/${resume.id}/analysis`} className="text-blue-600 hover:underline text-sm px-2 border-r">Analysis</Link>
                    <a href={`/api/export/pdf?id=${resume.id}`} className="text-gray-600 hover:underline text-sm px-2 border-r">PDF</a>
                    <a href={`/api/export/docx?id=${resume.id}`} className="text-gray-600 hover:underline text-sm px-2 border-r">DOCX</a>
                    <button onClick={() => handleDeleteResume(resume.id)} className="text-red-600 hover:underline text-sm pl-2">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
