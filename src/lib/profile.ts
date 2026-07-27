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

  // Add education entries
  const education = data.education as Array<Record<string, unknown>> | undefined
  if (education?.length) {
    for (const edu of education) {
      const instName = (edu.institution as string) || 'Unknown'
      const matchKey = instName.substring(0, 10)
      
      const existing = await prisma.education.findFirst({
        where: { careerProfileId: profile.id, institution: { contains: matchKey, mode: 'insensitive' } }
      })

      if (existing) {
        if (!existing.sourceResumeIds.includes(resumeId)) {
          await prisma.education.update({
            where: { id: existing.id },
            data: { sourceResumeIds: { push: resumeId } }
          })
        }
      } else {
        await prisma.education.create({
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
      const compName = (exp.company as string) || 'Unknown'
      const matchKey = compName.substring(0, 10)
      
      const existing = await prisma.experience.findFirst({
        where: { careerProfileId: profile.id, company: { contains: matchKey, mode: 'insensitive' } }
      })

      if (existing) {
        if (!existing.sourceResumeIds.includes(resumeId)) {
          await prisma.experience.update({
            where: { id: existing.id },
            data: { sourceResumeIds: { push: resumeId } }
          })
        }
      } else {
        await prisma.experience.create({
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
      }
    }
  }

  // Add projects
  const projects = data.projects as Array<Record<string, unknown>> | undefined
  if (projects?.length) {
    for (const proj of projects) {
      const projName = (proj.name as string) || 'Unknown'
      const matchKey = projName.substring(0, 10)
      
      const existing = await prisma.project.findFirst({
        where: { careerProfileId: profile.id, name: { contains: matchKey, mode: 'insensitive' } }
      })

      if (existing) {
        if (!existing.sourceResumeIds.includes(resumeId)) {
          await prisma.project.update({
            where: { id: existing.id },
            data: { sourceResumeIds: { push: resumeId } }
          })
        }
      } else {
        await prisma.project.create({
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
      }
    }
  }
}
