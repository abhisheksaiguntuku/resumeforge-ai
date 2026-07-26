'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, CheckCircle, XCircle, Loader2, Trash2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast' // Assumes you have react-hot-toast

type UploadedResume = {
  id: string
  originalName: string
  fileSize: number
  mimeType: string
  extractionStatus: 'PROCESSING' | 'COMPLETED' | 'FAILED'
  uploadedAt: string
  errorMessage?: string
}

export default function UploadPage() {
  const [resumes, setResumes] = useState<UploadedResume[]>([])
  const [loading, setLoading] = useState(true)

  const fetchResumes = async () => {
    try {
      const res = await fetch('/api/upload')
      if (res.ok) {
        const data = await res.json()
        setResumes(data.resumes)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResumes()
  }, [])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const formData = new FormData()
      formData.append('file', file)

      // Optimistic update for progress
      const tempId = Math.random().toString(36).substring(7)
      setResumes(prev => [
        {
          id: tempId,
          originalName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          extractionStatus: 'PROCESSING',
          uploadedAt: new Date().toISOString()
        },
        ...prev
      ])

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        const data = await res.json()
        
        if (!res.ok) {
          toast.error(data.error || 'Upload failed')
          // Remove temp
          setResumes(prev => prev.filter(r => r.id !== tempId))
          continue
        }
        
        toast.success(`Uploaded ${file.name}`)
        fetchResumes()
        
      } catch (err) {
        toast.error(`Upload failed for ${file.name}`)
        setResumes(prev => prev.filter(r => r.id !== tempId))
      }
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 10
  })

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/upload?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setResumes(prev => prev.filter(r => r.id !== id))
        toast.success('Resume deleted')
      } else {
        toast.error('Failed to delete')
      }
    } catch (err) {
      toast.error('Failed to delete')
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Upload Your Resumes</h1>
        <p className="text-gray-600 mt-2">
          Upload up to 10 past resumes. Our AI will extract and merge your experience into a single comprehensive career profile.
        </p>
      </div>

      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-colors cursor-pointer bg-white
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900">
          {isDragActive ? 'Drop resumes here...' : 'Drag & drop your resumes here'}
        </p>
        <p className="text-sm text-gray-500 mt-2">or click to browse files</p>
        <div className="flex gap-4 mt-4 text-xs text-gray-400">
          <span>Supported: PDF, DOCX</span>
          <span>Max size: 10MB</span>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Uploaded Resumes</h2>
        <span className="text-sm font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
          {resumes.length} / 10 used
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
          {resumes.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No resumes uploaded yet.
            </div>
          ) : (
            resumes.map(resume => (
              <div key={resume.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors animate-in fade-in">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 truncate max-w-xs sm:max-w-sm">
                      {resume.originalName}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {(resume.fileSize / 1024 / 1024).toFixed(2)} MB • {new Date(resume.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    {resume.extractionStatus === 'PROCESSING' && (
                      <span className="flex items-center gap-1.5 text-yellow-600 text-sm font-medium bg-yellow-50 px-2.5 py-1 rounded-full">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing
                      </span>
                    )}
                    {resume.extractionStatus === 'COMPLETED' && (
                      <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium bg-green-50 px-2.5 py-1 rounded-full">
                        <CheckCircle className="w-3.5 h-3.5" /> Completed
                      </span>
                    )}
                    {resume.extractionStatus === 'FAILED' && (
                      <span className="flex items-center gap-1.5 text-red-600 text-sm font-medium bg-red-50 px-2.5 py-1 rounded-full" title={resume.errorMessage}>
                        <XCircle className="w-3.5 h-3.5" /> Failed
                      </span>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => handleDelete(resume.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {resumes.some(r => r.extractionStatus === 'COMPLETED') && (
        <div className="mt-8 flex justify-end">
          <Link 
            href="/profile" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            Review Extracted Data <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
