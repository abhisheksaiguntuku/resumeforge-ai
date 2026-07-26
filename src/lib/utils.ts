import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Present'
  return dateStr
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '...'
}

export function generateResumeName(company: string, role: string, version: number): string {
  const co = company.trim() || 'Company'
  const r = role.trim() || 'Role'
  return `${co} - ${r} - V${version}`
}

export function calculateCompletionScore(profile: {
  fullName?: string | null
  email?: string | null
  phone?: string | null
  summary?: string | null
  education: { length: number }
  experience: { length: number }
  skills: { length: number }
  projects: { length: number }
}): number {
  let score = 0
  if (profile.fullName) score += 10
  if (profile.email) score += 10
  if (profile.phone) score += 5
  if (profile.summary) score += 10
  if (profile.education.length > 0) score += 15
  if (profile.experience.length > 0) score += 20
  if (profile.skills.length >= 5) score += 15
  if (profile.projects.length > 0) score += 15
  return Math.min(score, 100)
}
