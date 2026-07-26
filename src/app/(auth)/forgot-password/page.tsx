'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileText, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log(`Password reset link requested for ${email}`)
      setIsLoading(false)
      setIsSuccess(true)
    }, 1500)
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl">
      <div className="flex justify-center mb-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
        </Link>
      </div>

      {isSuccess ? (
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
          <p className="text-slate-400 mb-8">
            We've sent a password reset link to <br />
            <span className="font-medium text-slate-300">{email}</span>
          </p>
          <Link 
            href="/login" 
            className="inline-flex items-center justify-center w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Return to Login
          </Link>
        </div>
      ) : (
        <>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Forgot password?</h1>
            <p className="text-slate-400">No worries, we'll send you reset instructions.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading || !email}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/login" className="inline-flex items-center text-sm text-slate-400 hover:text-indigo-400 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
