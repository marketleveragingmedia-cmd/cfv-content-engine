import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Delete CFV-VS-00002 (the duplicate)
  const session = await prisma.visionSession.findUnique({
    where: { sessionId: 'CFV-VS-00002' }
  })
  
  if (session) {
    console.log('Deleting session:', session.sessionId, session.id)
    await prisma.visionSession.delete({ where: { id: session.id } })
    console.log('✅ Deleted CFV-VS-00002')
  } else {
    console.log('Session CFV-VS-00002 not found')
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
