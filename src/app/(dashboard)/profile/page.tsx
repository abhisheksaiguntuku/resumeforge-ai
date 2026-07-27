'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CareerProfilePage() {
  const [activeTab, setActiveTab] = useState('Personal')
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'education' | 'experience' | 'project' | 'skill' | null>(null)
  const [editingItem, setEditingItem] = useState<any>(null)

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

  const handleDelete = async (id: string, type: string) => {
    if (!confirm('Are you sure you want to delete this?')) return
    try {
      const res = await fetch(`/api/profile/entity?id=${id}&type=${type}`, { method: 'DELETE' })
      if (res.ok) {
        // Optimistically remove from state
        setProfile((prev: any) => ({
          ...prev,
          [type === 'skill' ? 'skills' : type]: prev[type === 'skill' ? 'skills' : type].filter((item: any) => item.id !== id)
        }))
      } else {
        alert('Failed to delete')
      }
    } catch (err) {
      alert('Error deleting item')
    }
  }

  const handleSave = async (data: any) => {
    if (!modalType) return
    const method = editingItem ? 'PATCH' : 'POST'
    const body = editingItem ? { id: editingItem.id, type: modalType, data } : { type: modalType, data }
    
    try {
      const res = await fetch('/api/profile/entity', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (res.ok) {
        setIsModalOpen(false)
        fetchProfile() // Refresh to get the clean DB data
      } else {
        alert('Failed to save')
      }
    } catch (err) {
      alert('Error saving data')
    }
  }

  const openModal = (type: 'education' | 'experience' | 'project' | 'skill', item?: any) => {
    setModalType(type)
    setEditingItem(item || null)
    setIsModalOpen(true)
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
            {activeTab === 'Education' && <EducationTab profile={profile} onDelete={handleDelete} onOpenModal={openModal} />}
            {activeTab === 'Experience' && <ExperienceTab profile={profile} onDelete={handleDelete} onOpenModal={openModal} />}
            {activeTab === 'Projects' && <ProjectsTab profile={profile} onDelete={handleDelete} onOpenModal={openModal} />}
            {activeTab === 'Skills' && <SkillsTab profile={profile} onDelete={handleDelete} onOpenModal={openModal} />}
            {!['Personal', 'Education', 'Experience', 'Projects', 'Skills'].includes(activeTab) && (
              <div className="p-4 bg-gray-50 rounded-lg">Content for {activeTab} coming soon.</div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {isModalOpen && modalType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">{editingItem ? 'Edit' : 'Add'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
            </div>
            <div className="p-6">
              {modalType === 'education' && <EducationForm initialData={editingItem} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />}
              {modalType === 'experience' && <ExperienceForm initialData={editingItem} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />}
              {modalType === 'project' && <ProjectForm initialData={editingItem} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />}
              {modalType === 'skill' && <SkillForm initialData={editingItem} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />}
            </div>
          </div>
        </div>
      )}
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

function EducationTab({ profile, onDelete, onOpenModal }: { profile: any, onDelete: (id: string, type: string) => void, onOpenModal: (type: 'education', item?: any) => void }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Education</h2>
        <button onClick={() => onOpenModal('education')} className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700">Add New</button>
      </div>
      <div className="space-y-4">
        {profile.education?.map((edu: any) => (
          <div key={edu.id} className="p-4 border rounded-lg flex justify-between items-start hover:shadow-sm transition-shadow">
            <div>
              <div className="font-semibold">{edu.institution} {edu.verificationStatus === 'EXTRACTED' && <span className="text-xs ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified ✓</span>}</div>
              <div className="text-gray-600">{edu.degree} in {edu.fieldOfStudy}</div>
              <div className="text-sm text-gray-500">{edu.startDate} - {edu.isCurrent ? 'Present' : edu.endDate}</div>
              {edu.cgpa && <div className="text-sm text-gray-500">CGPA: {edu.cgpa}</div>}
            </div>
            <div className="space-x-2 flex">
              <button onClick={() => onOpenModal('education', edu)} className="text-blue-600 hover:text-blue-800 text-sm px-2">Edit</button>
              <button onClick={() => onDelete(edu.id, 'education')} className="text-red-600 hover:text-red-800 text-sm px-2">Delete</button>
            </div>
          </div>
        ))}
        {(!profile.education || profile.education.length === 0) && <p className="text-gray-500">No education entries found.</p>}
      </div>
    </div>
  )
}

function ExperienceTab({ profile, onDelete, onOpenModal }: { profile: any, onDelete: (id: string, type: string) => void, onOpenModal: (type: 'experience', item?: any) => void }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Experience</h2>
        <button onClick={() => onOpenModal('experience')} className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700">Add New</button>
      </div>
      <div className="space-y-4">
        {profile.experience?.map((exp: any) => (
          <div key={exp.id} className="p-4 border rounded-lg flex justify-between items-start hover:shadow-sm transition-shadow">
            <div>
              <div className="font-semibold">{exp.jobTitle} at {exp.company} {exp.verificationStatus === 'EXTRACTED' && <span className="text-xs ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified ✓</span>}</div>
              <div className="text-sm text-gray-500">{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</div>
              <ul className="list-disc pl-5 mt-2 text-sm text-gray-700">
                {exp.bullets?.map((bullet: string, i: number) => <li key={i}>{bullet}</li>)}
              </ul>
            </div>
            <div className="space-x-2 flex">
              <button onClick={() => onOpenModal('experience', exp)} className="text-blue-600 hover:text-blue-800 text-sm px-2">Edit</button>
              <button onClick={() => onDelete(exp.id, 'experience')} className="text-red-600 hover:text-red-800 text-sm px-2">Delete</button>
            </div>
          </div>
        ))}
        {(!profile.experience || profile.experience.length === 0) && <p className="text-gray-500">No experience entries found.</p>}
      </div>
    </div>
  )
}

function ProjectsTab({ profile, onDelete, onOpenModal }: { profile: any, onDelete: (id: string, type: string) => void, onOpenModal: (type: 'project', item?: any) => void }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Projects</h2>
        <button onClick={() => onOpenModal('project')} className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700">Add New</button>
      </div>
      <div className="space-y-4">
        {profile.projects?.map((proj: any) => (
          <div key={proj.id} className="p-4 border rounded-lg flex justify-between items-start hover:shadow-sm transition-shadow">
            <div>
              <div className="font-semibold">{proj.name} {proj.verificationStatus === 'EXTRACTED' && <span className="text-xs ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified ✓</span>}</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {proj.technologies?.map((tech: string, i: number) => (
                  <span key={i} className="text-xs bg-gray-200 px-2 py-1 rounded">{tech}</span>
                ))}
              </div>
              <ul className="list-disc pl-5 mt-2 text-sm text-gray-700">
                {proj.bullets?.map((bullet: string, i: number) => <li key={i}>{bullet}</li>)}
              </ul>
            </div>
            <div className="space-x-2 flex">
              <button onClick={() => onOpenModal('project', proj)} className="text-blue-600 hover:text-blue-800 text-sm px-2">Edit</button>
              <button onClick={() => onDelete(proj.id, 'project')} className="text-red-600 hover:text-red-800 text-sm px-2">Delete</button>
            </div>
          </div>
        ))}
        {(!profile.projects || profile.projects.length === 0) && <p className="text-gray-500">No projects found.</p>}
      </div>
    </div>
  )
}

function SkillsTab({ profile, onDelete, onOpenModal }: { profile: any, onDelete: (id: string, type: string) => void, onOpenModal: (type: 'skill', item?: any) => void }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Skills</h2>
        <button onClick={() => onOpenModal('skill')} className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700">Add New</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {profile.skills?.map((skill: any) => (
          <div key={skill.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center hover:bg-blue-200 transition-colors">
            <span onClick={() => onOpenModal('skill', skill)} className="cursor-pointer font-medium">{skill.name}</span>
            <button onClick={() => onDelete(skill.id, 'skill')} className="ml-2 text-blue-600 hover:text-red-600 font-bold">&times;</button>
          </div>
        ))}
        {(!profile.skills || profile.skills.length === 0) && <p className="text-gray-500">No skills found.</p>}
      </div>
    </div>
  )
}

// --- Form Components ---

function EducationForm({ initialData, onSave, onCancel }: { initialData?: any, onSave: (data: any) => void, onCancel: () => void }) {
  const [data, setData] = useState(initialData || { institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', isCurrent: false, cgpa: '', location: '' })
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(data) }} className="space-y-4">
      <div><label className="block text-sm font-medium">Institution</label><input required className="w-full border rounded p-2" value={data.institution} onChange={e => setData({...data, institution: e.target.value})} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium">Degree</label><input required className="w-full border rounded p-2" value={data.degree} onChange={e => setData({...data, degree: e.target.value})} /></div>
        <div><label className="block text-sm font-medium">Field of Study</label><input className="w-full border rounded p-2" value={data.fieldOfStudy} onChange={e => setData({...data, fieldOfStudy: e.target.value})} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium">Start Date</label><input required placeholder="e.g. Sep 2020" className="w-full border rounded p-2" value={data.startDate} onChange={e => setData({...data, startDate: e.target.value})} /></div>
        <div>
          <label className="block text-sm font-medium">End Date</label>
          <input disabled={data.isCurrent} placeholder="e.g. May 2024" className="w-full border rounded p-2 disabled:bg-gray-100" value={data.endDate} onChange={e => setData({...data, endDate: e.target.value})} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.isCurrent} onChange={e => setData({...data, isCurrent: e.target.checked, endDate: ''})} /> I currently study here</label>
      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
      </div>
    </form>
  )
}

function ExperienceForm({ initialData, onSave, onCancel }: { initialData?: any, onSave: (data: any) => void, onCancel: () => void }) {
  const [data, setData] = useState(initialData || { company: '', jobTitle: '', startDate: '', endDate: '', isCurrent: false, bullets: [] })
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(data) }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium">Company</label><input required className="w-full border rounded p-2" value={data.company} onChange={e => setData({...data, company: e.target.value})} /></div>
        <div><label className="block text-sm font-medium">Job Title</label><input required className="w-full border rounded p-2" value={data.jobTitle} onChange={e => setData({...data, jobTitle: e.target.value})} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium">Start Date</label><input required className="w-full border rounded p-2" value={data.startDate} onChange={e => setData({...data, startDate: e.target.value})} /></div>
        <div><label className="block text-sm font-medium">End Date</label><input disabled={data.isCurrent} className="w-full border rounded p-2 disabled:bg-gray-100" value={data.endDate} onChange={e => setData({...data, endDate: e.target.value})} /></div>
      </div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={data.isCurrent} onChange={e => setData({...data, isCurrent: e.target.checked, endDate: ''})} /> I currently work here</label>
      <div>
        <label className="block text-sm font-medium">Responsibilities (Bullet Points)</label>
        <textarea rows={4} className="w-full border rounded p-2" placeholder="One bullet per line..." value={data.bullets.join('\n')} onChange={e => setData({...data, bullets: e.target.value.split('\n').filter(Boolean)})} />
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
      </div>
    </form>
  )
}

function ProjectForm({ initialData, onSave, onCancel }: { initialData?: any, onSave: (data: any) => void, onCancel: () => void }) {
  const [data, setData] = useState(initialData || { name: '', description: '', technologies: [], bullets: [] })
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(data) }} className="space-y-4">
      <div><label className="block text-sm font-medium">Project Name</label><input required className="w-full border rounded p-2" value={data.name} onChange={e => setData({...data, name: e.target.value})} /></div>
      <div>
        <label className="block text-sm font-medium">Technologies (comma separated)</label>
        <input className="w-full border rounded p-2" value={data.technologies.join(', ')} onChange={e => setData({...data, technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} />
      </div>
      <div>
        <label className="block text-sm font-medium">Key Features (Bullet Points)</label>
        <textarea rows={4} className="w-full border rounded p-2" placeholder="One bullet per line..." value={data.bullets.join('\n')} onChange={e => setData({...data, bullets: e.target.value.split('\n').filter(Boolean)})} />
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
      </div>
    </form>
  )
}

function SkillForm({ initialData, onSave, onCancel }: { initialData?: any, onSave: (data: any) => void, onCancel: () => void }) {
  const [data, setData] = useState(initialData || { name: '', category: 'PROGRAMMING_LANGUAGES' })
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(data) }} className="space-y-4">
      <div><label className="block text-sm font-medium">Skill Name</label><input required className="w-full border rounded p-2" value={data.name} onChange={e => setData({...data, name: e.target.value})} /></div>
      <div>
        <label className="block text-sm font-medium">Category</label>
        <select className="w-full border rounded p-2" value={data.category} onChange={e => setData({...data, category: e.target.value})}>
          <option value="PROGRAMMING_LANGUAGES">Programming Languages</option>
          <option value="FRAMEWORKS">Frameworks</option>
          <option value="DATABASES">Databases</option>
          <option value="CLOUD">Cloud</option>
          <option value="DEV_TOOLS">Dev Tools</option>
          <option value="SOFT_SKILLS">Soft Skills</option>
          <option value="OTHER">Other</option>
        </select>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
      </div>
    </form>
  )
}
