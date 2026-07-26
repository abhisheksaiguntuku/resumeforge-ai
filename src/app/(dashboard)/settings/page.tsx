'use client'

import { useState } from 'react'

export default function SettingsPage() {
  const [model, setModel] = useState('llama-3.3-70b-versatile')

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500 mt-2">Manage your account preferences and data.</p>
      </div>

      <div className="bg-white border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">Account</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
          <input type="text" className="w-full max-w-md px-3 py-2 border rounded-md" defaultValue="John Doe" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" disabled className="w-full max-w-md px-3 py-2 border rounded-md bg-gray-50" defaultValue="user@example.com" />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed for OAuth accounts.</p>
        </div>
        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Change Password</button>
      </div>

      <div className="bg-white border rounded-xl p-6 space-y-6">
        <h2 className="text-xl font-semibold">AI Settings</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Groq Model</label>
          <select 
            value={model} 
            onChange={e => setModel(e.target.value)}
            className="w-full max-w-md px-3 py-2 border rounded-md"
          >
            <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Higher quality, slower)</option>
            <option value="llama-3.1-8b-instant">llama-3.1-8b-instant (Faster, basic quality)</option>
          </select>
        </div>
      </div>

      <div className="bg-white border rounded-xl p-6 space-y-4 border-red-200">
        <h2 className="text-xl font-semibold text-red-600">Privacy & Data</h2>
        <p className="text-sm text-gray-600">Your resume files are used only for building your Career Profile. They are not shared or sold.</p>
        
        <div className="space-y-3 pt-4 border-t">
          <button className="block text-left text-red-600 hover:underline">Delete all uploaded resumes</button>
          <button className="block text-left text-red-600 hover:underline">Delete all generated resumes</button>
          <button className="block text-left text-red-600 hover:underline">Delete Career Profile</button>
          <button className="block text-left text-red-600 font-semibold hover:underline">Delete Account</button>
        </div>
      </div>
    </div>
  )
}
