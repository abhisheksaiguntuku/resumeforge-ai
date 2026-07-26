export interface TemplateConfig {
  id: string
  name: string
  description: string
  preview: string // emoji or color
  primaryColor: string
  fontFamily: string
  accentStyle: 'line' | 'block' | 'minimal'
  headingStyle: 'caps' | 'title' | 'bold'
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: 'classic_ats',
    name: 'Classic ATS',
    description: 'Maximum machine readability. Clean single-column layout preferred by most ATS systems.',
    preview: '📄',
    primaryColor: '#1a1a1a',
    fontFamily: 'Arial, sans-serif',
    accentStyle: 'line',
    headingStyle: 'caps',
  },
  {
    id: 'modern_minimal',
    name: 'Modern Minimal',
    description: 'Clean contemporary design with subtle accents. Great for tech and creative roles.',
    preview: '✨',
    primaryColor: '#2563eb',
    fontFamily: 'Inter, sans-serif',
    accentStyle: 'line',
    headingStyle: 'bold',
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Optimized for engineering and developer roles. Emphasizes technical skills and projects.',
    preview: '⚙️',
    primaryColor: '#0891b2',
    fontFamily: 'Roboto Mono, monospace',
    accentStyle: 'block',
    headingStyle: 'caps',
  },
  {
    id: 'graduate_fresher',
    name: 'Graduate / Fresher',
    description: 'Perfect for new graduates. Highlights education, projects, and internships.',
    preview: '🎓',
    primaryColor: '#7c3aed',
    fontFamily: 'Inter, sans-serif',
    accentStyle: 'minimal',
    headingStyle: 'title',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Executive and senior-level styling. Strong hierarchy and refined typography.',
    preview: '💼',
    primaryColor: '#1e3a5f',
    fontFamily: 'Georgia, serif',
    accentStyle: 'line',
    headingStyle: 'caps',
  },
  {
    id: 'academic_research',
    name: 'Academic / Research',
    description: 'For academic positions and research roles. Includes publications and research sections.',
    preview: '🔬',
    primaryColor: '#1a4731',
    fontFamily: 'Times New Roman, serif',
    accentStyle: 'minimal',
    headingStyle: 'bold',
  },
]

export function getTemplate(id: string): TemplateConfig {
  return TEMPLATES.find(t => t.id === id) ?? TEMPLATES[0]
}
