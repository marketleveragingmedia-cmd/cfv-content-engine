import { prisma } from './lib/prisma'

async function main() {
  const session = await prisma.visionSession.findFirst({
    where: { sessionId: 'CFV-VS-00001' }
  })
  if (session) {
    console.log('Session found:')
    console.log('ID:', session.id)
    console.log('SessionID:', session.sessionId)
    console.log('Title:', session.finalTitle || session.workingTitle || session.theme)
  } else {
    console.log('No session found - need to import first')
  }
}

main().finally(() => process.exit())
