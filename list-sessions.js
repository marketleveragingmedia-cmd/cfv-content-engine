const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.POSTGRES_PRISMA_URL
    }
  }
})

async function main() {
  const sessions = await prisma.visionSession.findMany({
    select: {
      id: true,
      sessionId: true,
      workingTitle: true,
      finalTitle: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { assets: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
  
  console.log(`\nTotal sessions: ${sessions.length}\n`)
  sessions.forEach((s, i) => {
    console.log(`${i + 1}. ${s.sessionId}`)
    console.log(`   Title: ${s.finalTitle || s.workingTitle}`)
    console.log(`   Assets: ${s._count.assets}`)
    console.log(`   Created: ${s.createdAt.toISOString()}`)
    console.log(`   Database ID: ${s.id}`)
    console.log()
  })
}

main().finally(() => prisma.$disconnect())
