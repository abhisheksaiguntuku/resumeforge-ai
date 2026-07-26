'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FileText, Loader2 } from 'lucide-react'
import { signIn } from 'next-auth/react'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Super simple password strength (0-4)
  const calculateStrength = (p: string) => {
    let s = 0
    if (p.length > 5) s++
    if (p.length > 8) s++
    if (/[A-Z]/.test(p)) s++
    if (/[0-9]/.test(p) || /[^A-Za-z0-9]/.test(p)) s++
    return s
  }

  const strength = calculateStrength(password)
  const strengthColors = ['bg-slate-700', 'bg-red-500', 'bg-yellow-500', 'bg-green-400', 'bg-green-500']
  const strengthColor = strength === 0 && password.length === 0 ? 'bg-slate-700' : strengthColors[strength]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!acceptTerms) {
      setError('You must accept the terms and conditions')
      return
    }
    
    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Registration failed')
      } else {
        // Auto sign in after registration
        const signInRes = await signIn('credentials', {
          email,
          password,
          redirect: false
        })
        
        if (signInRes?.error) {
          setError('Registered successfully, but auto-login failed. Please sign in.')
        } else {
          router.push('/dashboard')
          router.refresh()
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl">
      <div className="flex justify-center mb-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">ResumeForge<span className="text-indigo-500">.AI</span></span>
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
        <p className="text-slate-400">Join thousands of job seekers today</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
          <input 
            type="text" 
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="John Doe"
          />
        </div>
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
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
          <input 
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="••••••••"
          />
          {/* Password strength indicator */}
          <div className="mt-2 flex gap-1 h-1.5 w-full">
            {[1, 2, 3, 4].map((level) => (
              <div 
                key={level} 
                className={`flex-1 rounded-full transition-colors duration-300 ${password.length > 0 && strength >= level ? strengthColor : 'bg-slate-700'}`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center mt-4">
          <input 
            id="terms" 
            type="checkbox" 
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="w-4 h-4 rounded border-slate-700 bg-slate-950/50 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900" 
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-slate-400">
            I accept the <Link href="/terms" className="text-indigo-400 hover:text-indigo-300">Terms of Service</Link> and <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300">Privacy Policy</Link>
          </label>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-center relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-700"></div>
        </div>
        <div className="relative px-4 bg-transparent backdrop-blur-xl">
          <span className="text-sm text-slate-500">or</span>
        </div>
      </div>

      <button 
        onClick={handleGoogleSignIn}
        className="mt-6 w-full bg-white hover:bg-slate-100 text-slate-900 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Sign up with Google
      </button>

      <p className="mt-8 text-center text-sm text-slate-400">
        Already have an account? <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</Link>
      </p>
    </div>
  )
}
