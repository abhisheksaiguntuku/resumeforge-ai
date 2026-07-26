import { z } from 'zod'

export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const jobDescriptionSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  company: z.string().optional(),
  location: z.string().optional(),
  jobUrl: z.string().url().optional().or(z.literal('')),
  rawText: z.string().min(50, 'Job description must be at least 50 characters'),
})

export const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  cgpa: z.string().optional(),
  location: z.string().optional(),
})

export const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  employmentType: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  location: z.string().optional(),
  bullets: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
})

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  bullets: z.array(z.string()).default([]),
  projectUrl: z.string().optional(),
  githubUrl: z.string().optional(),
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type JobDescriptionInput = z.infer<typeof jobDescriptionSchema>
export type EducationInput = z.infer<typeof educationSchema>
export type ExperienceInput = z.infer<typeof experienceSchema>
export type ProjectInput = z.infer<typeof projectSchema>
