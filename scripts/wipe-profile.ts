import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Wiping career profile nested entities...')
  await prisma.education.deleteMany({})
  await prisma.experience.deleteMany({})
  await prisma.project.deleteMany({})
  await prisma.skill.deleteMany({})
  
  // Also wipe the main profile strings
  await prisma.careerProfile.updateMany({
    data: {
      fullName: null,
      email: null,
      phone: null,
      summary: null,
      location: null
    }
  })
  
  console.log('Done wiping!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
