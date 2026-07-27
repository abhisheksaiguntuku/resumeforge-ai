import { prisma } from '@/lib/prisma'

export async function applyExtractionToProfile(resumeId: string, userId: string) {
  // Get the uploaded resume with extracted data
  const uploadedResume = await prisma.uploadedResume.findFirst({
    where: { id: resumeId, userId },
  })

  if (!uploadedResume || !uploadedResume.extractedData) {
    throw new Error('No extracted data found for this resume.')
  }

  // Ensure career profile exists
  let profile = await prisma.careerProfile.findUnique({ where: { userId } })
  if (!profile) {
    profile = await prisma.careerProfile.create({ data: { userId } })
  }

  const data = uploadedResume.extractedData as Record<string, unknown>
  const personal = data.personal as Record<string, string | null> | undefined
  const skills = data.skills as Record<string, string[]> | undefined

  // Update personal info if not already set
  const updates: Record<string, string | null> = {}
  if (!profile.fullName && personal?.fullName) updates.fullName = personal.fullName
  if (!profile.email && personal?.email) updates.email = personal.email
  if (!profile.phone && personal?.phone) updates.phone = personal.phone
  if (!profile.location && personal?.location) updates.location = personal.location
  if (!profile.linkedin && personal?.linkedin) updates.linkedin = personal.linkedin
  if (!profile.github && personal?.github) updates.github = personal.github
  if (!profile.summary && (data.summary as string | null)) updates.summary = data.summary as string

  if (Object.keys(updates).length > 0) {
    await prisma.careerProfile.update({ where: { id: profile.id }, data: updates })
  }

  // Fetch existing entities into memory for robust fuzzy matching
  const existingEdus = await prisma.education.findMany({ where: { careerProfileId: profile.id } })
  const existingExps = await prisma.experience.findMany({ where: { careerProfileId: profile.id } })
  const existingProjs = await prisma.project.findMany({ where: { careerProfileId: profile.id } })

  const normalize = (s: string) => s.replace(/\s+/g, '').toLowerCase()

  // Add education entries
  const education = data.education as Array<Record<string, unknown>> | undefined
  if (education?.length) {
    for (const edu of education) {
      let instName = (edu.institution as string) || 'Unknown'
      
      // Fix bad PDF parsing like "N a r a y a n a" by checking if it's mostly single characters
      if (instName.match(/^([a-zA-Z]\s){4,}[a-zA-Z]$/)) {
        instName = instName.replace(/\s+/g, '')
      }

      const normName = normalize(instName).substring(0, 15)
      
      const existing = existingEdus.find(e => normalize(e.institution).includes(normName))

      if (existing) {
        if (!existing.sourceResumeIds.includes(resumeId)) {
          await prisma.education.update({
            where: { id: existing.id },
            data: { sourceResumeIds: { push: resumeId } }
          })
          existing.sourceResumeIds.push(resumeId)
        }
      } else {
        const newEdu = await prisma.education.create({
          data: {
            careerProfileId: profile.id,
            institution: instName,
            degree: edu.degree as string | undefined,
            fieldOfStudy: edu.fieldOfStudy as string | undefined,
            startDate: edu.startDate as string | undefined,
            endDate: edu.endDate as string | undefined,
            isCurrent: (edu.isCurrent as boolean) || false,
            cgpa: edu.cgpa as string | undefined,
            location: edu.location as string | undefined,
            sourceResumeIds: [resumeId],
            verificationStatus: 'EXTRACTED',
          },
        })
        existingEdus.push(newEdu)
      }
    }
  }

  // Add skills (deduplicated)
  if (skills) {
    const skillMap = [
      { keys: skills.programmingLanguages ?? [], cat: 'PROGRAMMING_LANGUAGES' },
      { keys: skills.frameworks ?? [], cat: 'FRAMEWORKS' },
      { keys: skills.libraries ?? [], cat: 'LIBRARIES' },
      { keys: skills.databases ?? [], cat: 'DATABASES' },
      { keys: skills.cloud ?? [], cat: 'CLOUD' },
      { keys: skills.aiMl ?? [], cat: 'AI_ML' },
      { keys: skills.devTools ?? [], cat: 'DEV_TOOLS' },
      { keys: skills.platforms ?? [], cat: 'PLATFORMS' },
      { keys: skills.softSkills ?? [], cat: 'SOFT_SKILLS' },
      { keys: skills.other ?? [], cat: 'OTHER' },
    ]
    for (const { keys, cat } of skillMap) {
      for (const name of keys) {
        if (!name) continue
        await prisma.skill.upsert({
          where: { careerProfileId_name: { careerProfileId: profile.id, name } },
          update: { sourceResumeIds: { push: resumeId } },
          create: {
            careerProfileId: profile.id,
            name,
            category: cat as any,
            sourceResumeIds: [resumeId],
            verificationStatus: 'EXTRACTED',
          },
        })
      }
    }
  }

  // Add experience
  const experience = data.experience as Array<Record<string, unknown>> | undefined
  if (experience?.length) {
    for (const exp of experience) {
      let compName = (exp.company as string) || 'Unknown'
      
      if (compName.match(/^([a-zA-Z]\s){4,}[a-zA-Z]$/)) {
        compName = compName.replace(/\s+/g, '')
      }

      const normName = normalize(compName).substring(0, 15)
      
      const existing = existingExps.find(e => normalize(e.company).includes(normName))

      if (existing) {
        if (!existing.sourceResumeIds.includes(resumeId)) {
          await prisma.experience.update({
            where: { id: existing.id },
            data: { sourceResumeIds: { push: resumeId } }
          })
          existing.sourceResumeIds.push(resumeId)
        }
      } else {
        const newExp = await prisma.experience.create({
          data: {
            careerProfileId: profile.id,
            company: compName,
            jobTitle: (exp.jobTitle as string) || 'Unknown',
            employmentType: exp.employmentType as string | undefined,
            startDate: exp.startDate as string | undefined,
            endDate: exp.endDate as string | undefined,
            isCurrent: (exp.isCurrent as boolean) || false,
            location: exp.location as string | undefined,
            bullets: (exp.bullets as string[]) || [],
            technologies: (exp.technologies as string[]) || [],
            sourceResumeIds: [resumeId],
            verificationStatus: 'EXTRACTED',
          },
        })
        existingExps.push(newExp)
      }
    }
  }

  // Add projects
  const projects = data.projects as Array<Record<string, unknown>> | undefined
  if (projects?.length) {
    for (const proj of projects) {
      let projName = (proj.name as string) || 'Unknown'
      
      if (projName.match(/^([a-zA-Z]\s){4,}[a-zA-Z]$/)) {
        projName = projName.replace(/\s+/g, '')
      }

      const normName = normalize(projName).substring(0, 15)
      
      const existing = existingProjs.find(e => normalize(e.name).includes(normName))

      if (existing) {
        if (!existing.sourceResumeIds.includes(resumeId)) {
          await prisma.project.update({
            where: { id: existing.id },
            data: { sourceResumeIds: { push: resumeId } }
          })
          existing.sourceResumeIds.push(resumeId)
        }
      } else {
        const newProj = await prisma.project.create({
          data: {
            careerProfileId: profile.id,
            name: projName,
            description: proj.description as string | undefined,
            technologies: (proj.technologies as string[]) || [],
            bullets: (proj.bullets as string[]) || [],
            projectUrl: proj.projectUrl as string | undefined,
            githubUrl: proj.githubUrl as string | undefined,
            sourceResumeIds: [resumeId],
            verificationStatus: 'EXTRACTED',
          },
        })
        existingProjs.push(newProj)
      }
    }
  }
}
