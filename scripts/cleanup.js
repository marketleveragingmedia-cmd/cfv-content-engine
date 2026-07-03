/**
 * Cleanup duplicate CFV sessions
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔗 Connecting...\n');

  const all = await prisma.visionSession.findMany({
    orderBy: { createdAt: 'asc' },
    include: { _count: { select: { assets: true, checklistItems: true } } }
  });

  console.log(`📊 Found ${all.length} sessions\n`);

  const toDelete = all.filter(s => s.workingTitle.includes('---') || s.workingTitle.includes('_'));
  const toKeep = all.filter(s => !s.workingTitle.includes('---') && !s.workingTitle.includes('_'));

  console.log(`🗑️  Deleting ${toDelete.length} duplicates`);
  console.log(`✅ Keeping ${toKeep.length} unique\n`);

  for (const s of toDelete) {
    console.log(`Deleting ${s.sessionId}...`);
    await prisma.checklistItem.deleteMany({ where: { visionSessionId: s.id } });
    await prisma.publishingMatrixItem.deleteMany({ where: { visionSessionId: s.id } });
    await prisma.asset.deleteMany({ where: { visionSessionId: s.id } });
    await prisma.visionSession.delete({ where: { id: s.id } });
  }

  console.log('\n🔢 Renumbering...\n');
  const remaining = await prisma.visionSession.findMany({ orderBy: { createdAt: 'asc' } });

  for (let i = 0; i < remaining.length; i++) {
    const newId = `CFV-VS-${String(i + 1).padStart(5, '0')}`;
    if (remaining[i].sessionId !== newId) {
      await prisma.visionSession.update({
        where: { id: remaining[i].id },
        data: { sessionId: newId }
      });
      console.log(`${remaining[i].sessionId} → ${newId}`);
    }
  }

  const final = await prisma.visionSession.findMany({
    orderBy: { sessionId: 'asc' },
    include: { _count: { select: { assets: true, checklistItems: true } } }
  });

  console.log(`\n✅ Complete! Final state:\n`);
  final.forEach(s => {
    console.log(`${s.sessionId} - ${s.workingTitle.substring(0, 50)} (${s._count.assets} assets)`);
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => { console.error(e); process.exit(1); });
