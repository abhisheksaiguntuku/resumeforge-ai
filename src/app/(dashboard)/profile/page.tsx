'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CareerProfilePage() {
  const [activeTab, setActiveTab] = useState('Personal')
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const tabs = ['Personal', 'Education', 'Experience', 'Internships', 'Projects', 'Skills', 'Certifications', 'Achievements', 'Other']

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile')
      if (!res.ok) throw new Error('Failed to fetch profile')
      const data = await res.json()
      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error')
    } finally {
      setLoading(false)
    }
  }

  const calculateCompletion = (p: any) => {
    if (!p) return 0
    let score = 0
    if (p.fullName) score += 10
    if (p.email) score += 10
    if (p.phone) score += 5
    if (p.summary) score += 10
    if (p.education?.length > 0) score += 15
    if (p.experience?.length > 0) score += 20
    if (p.skills?.length >= 5) score += 15
    if (p.projects?.length > 0) score += 15
    return Math.min(score, 100)
  }

  if (loading) return <div className="p-8">Loading profile...</div>
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>
  if (!profile) return <div className="p-8">No profile found</div>

  const completionScore = calculateCompletion(profile)

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Career Profile</h1>
          <div className="text-sm text-gray-500 mt-1">Profile Completion: {completionScore}%</div>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Export Profile</button>
      </div>

      <div className="flex border-b mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 whitespace-nowrap ${activeTab === tab ? 'border-b-2 border-blue-600 font-semibold text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'Personal' && <PersonalTab profile={profile} />}
            {activeTab === 'Education' && <EducationTab profile={profile} />}
            {activeTab === 'Experience' && <ExperienceTab profile={profile} />}
            {activeTab === 'Projects' && <ProjectsTab profile={profile} />}
            {activeTab === 'Skills' && <SkillsTab profile={profile} />}
            {!['Personal', 'Education', 'Experience', 'Projects', 'Skills'].includes(activeTab) && (
              <div className="p-4 bg-gray-50 rounded-lg">Content for {activeTab} coming soon.</div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function PersonalTab({ profile }: { profile: any }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" defaultValue={profile.fullName || ''} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" defaultValue={profile.email || ''} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" defaultValue={profile.phone || ''} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" defaultValue={profile.location || ''} />
        </div>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4">Save Changes</button>
    </div>
  )
}

function EducationTab({ profile }: { profile: any }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Education</h2>
        <button className="bg-green-600 text-white px-3 py-1 rounded-md text-sm">Add New</button>
      </div>
      <div className="space-y-4">
        {profile.education?.map((edu: any) => (
          <div key={edu.id} className="p-4 border rounded-lg flex justify-between items-start">
            <div>
              <div className="font-semibold">{edu.institution} <span className="text-xs ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified ✓</span></div>
              <div className="text-gray-600">{edu.degree} in {edu.fieldOfStudy}</div>
              <div className="text-sm text-gray-500">{edu.startDate} - {edu.isCurrent ? 'Present' : edu.endDate}</div>
              {edu.cgpa && <div className="text-sm text-gray-500">CGPA: {edu.cgpa}</div>}
            </div>
            <div className="space-x-2">
              <button className="text-blue-600 text-sm">Edit</button>
              <button className="text-red-600 text-sm">Delete</button>
            </div>
          </div>
        ))}
        {(!profile.education || profile.education.length === 0) && <p className="text-gray-500">No education entries found.</p>}
      </div>
    </div>
  )
}

function ExperienceTab({ profile }: { profile: any }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Experience</h2>
        <button className="bg-green-600 text-white px-3 py-1 rounded-md text-sm">Add New</button>
      </div>
      <div className="space-y-4">
        {profile.experience?.map((exp: any) => (
          <div key={exp.id} className="p-4 border rounded-lg flex justify-between items-start">
            <div>
              <div className="font-semibold">{exp.title} at {exp.company}</div>
              <div className="text-sm text-gray-500">{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</div>
              <ul className="list-disc pl-5 mt-2 text-sm text-gray-700">
                {exp.bulletPoints?.map((bullet: string, i: number) => <li key={i}>{bullet}</li>)}
              </ul>
            </div>
            <div className="space-x-2">
              <button className="text-blue-600 text-sm">Edit</button>
              <button className="text-red-600 text-sm">Delete</button>
            </div>
          </div>
        ))}
        {(!profile.experience || profile.experience.length === 0) && <p className="text-gray-500">No experience entries found.</p>}
      </div>
    </div>
  )
}

function ProjectsTab({ profile }: { profile: any }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Projects</h2>
        <button className="bg-green-600 text-white px-3 py-1 rounded-md text-sm">Add New</button>
      </div>
      <div className="space-y-4">
        {profile.projects?.map((proj: any) => (
          <div key={proj.id} className="p-4 border rounded-lg flex justify-between items-start">
            <div>
              <div className="font-semibold">{proj.name}</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {proj.technologies?.map((tech: string, i: number) => (
                  <span key={i} className="text-xs bg-gray-200 px-2 py-1 rounded">{tech}</span>
                ))}
              </div>
              <ul className="list-disc pl-5 mt-2 text-sm text-gray-700">
                {proj.bulletPoints?.map((bullet: string, i: number) => <li key={i}>{bullet}</li>)}
              </ul>
            </div>
            <div className="space-x-2">
              <button className="text-blue-600 text-sm">Edit</button>
              <button className="text-red-600 text-sm">Delete</button>
            </div>
          </div>
        ))}
        {(!profile.projects || profile.projects.length === 0) && <p className="text-gray-500">No projects found.</p>}
      </div>
    </div>
  )
}

function SkillsTab({ profile }: { profile: any }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Skills</h2>
        <button className="bg-green-600 text-white px-3 py-1 rounded-md text-sm">Add New</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {profile.skills?.map((skill: any) => (
          <div key={skill.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
            {skill.name}
            <button className="ml-2 text-blue-600 hover:text-blue-800">&times;</button>
          </div>
        ))}
        {(!profile.skills || profile.skills.length === 0) && <p className="text-gray-500">No skills found.</p>}
      </div>
    </div>
  )
}
