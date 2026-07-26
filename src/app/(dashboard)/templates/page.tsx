'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TEMPLATES } from '@/lib/templates'

export default function TemplatesPage() {
  const [filter, setFilter] = useState('All')

  const filteredTemplates = TEMPLATES.filter(t => {
    if (filter === 'All') return true
    if (filter === 'ATS-Safe' && t.id === 'classic_ats') return true
    if (filter === 'Modern' && ['modern_minimal', 'graduate_fresher'].includes(t.id)) return true
    if (filter === 'Academic' && t.id === 'academic_research') return true
    return false
  })

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Resume Templates</h1>
          <p className="text-gray-500 mt-2">Choose a professional template to start building your resume.</p>
        </div>
      </div>

      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
        {['All', 'ATS-Safe', 'Modern', 'Academic'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(template => (
          <div key={template.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <div className="h-40 flex items-center justify-center bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 text-6xl">
              {template.preview}
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{template.name}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm flex-1 mb-6">{template.description}</p>
              
              <div className="flex gap-3 mt-auto">
                <button className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors">
                  Preview
                </button>
                <Link
                  href={`/resume/new?template=${template.id}`}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg text-sm font-medium transition-colors"
                >
                  Use Template
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
