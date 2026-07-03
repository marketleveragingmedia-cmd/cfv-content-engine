/**
 * Admin API: Cleanup Duplicate Imports
 * 
 * Delete duplicate imports, keep only the one with proper working title
 * 
 * POST /api/admin/cleanup-duplicates
 * Body: { "confirmCleanup": true }
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (body.confirmCleanup !== true) {
      return NextResponse.json(
        { error: 'Must confirm cleanup with confirmCleanup: true' },
        { status: 400 }
      );
    }

    console.log('🧹 Starting duplicate cleanup...');

    // Step 1: Get all sessions
    const allSessions = await prisma.visionSession.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        _count: {
          select: { assets: true, checklistItems: true }
        }
      }
    });

    const report = {
      before: {
        total: allSessions.length,
        sessions: allSessions.map(s => ({
          sessionId: s.sessionId,
          workingTitle: s.workingTitle,
          assets: s._count.assets,
          checklist: s._count.checklistItems
        }))
      },
      deleted: [] as string[],
      kept: [] as string[],
      renumbered: [] as { from: string; to: string }[],
      after: {
        total: 0,
        sessions: [] as any[]
      }
    };

    // Step 2: Identify duplicates (same source, keep the one with clean title)
    // Keep: "CFV VS 00001 Life Is Long Vision Session Package"
    // Delete: "CFV_VS_00001_Life_Is_Long_Vision_Session_Package---1ef198c5-12c6-4432-9112-7301a291d205"
    
    const sessionsToDelete = allSessions.filter(s => 
      s.workingTitle.includes('---') || s.workingTitle.includes('_')
    );

    const sessionsToKeep = allSessions.filter(s => 
      !s.workingTitle.includes('---') && !s.workingTitle.includes('_')
    );

    console.log(`🗑️  Deleting ${sessionsToDelete.length} duplicate imports...`);
    
    for (const session of sessionsToDelete) {
      // Delete related records first
      await prisma.checklistItem.deleteMany({
        where: { visionSessionId: session.id }
      });
      await prisma.publishingMatrixItem.deleteMany({
        where: { visionSessionId: session.id }
      });
      await prisma.asset.deleteMany({
        where: { visionSessionId: session.id }
      });
      
      // Delete session
      await prisma.visionSession.delete({
        where: { id: session.id }
      });
      
      report.deleted.push(session.sessionId);
      console.log(`   ✅ Deleted ${session.sessionId} (${session.workingTitle})`);
    }

    console.log(`✅ Kept ${sessionsToKeep.length} unique sessions`);
    sessionsToKeep.forEach(s => {
      report.kept.push(s.sessionId);
      console.log(`   ✅ Kept ${s.sessionId} (${s.workingTitle})`);
    });

    // Step 3: Renumber remaining sessions to match source filenames
    const remainingSessions = await prisma.visionSession.findMany({
      orderBy: { createdAt: 'asc' }
    });

    console.log('\n🔢 Renumbering sessions...');
    
    for (let i = 0; i < remainingSessions.length; i++) {
      const session = remainingSessions[i];
      const newSessionId = `CFV-VS-${String(i + 1).padStart(5, '0')}`;
      
      if (session.sessionId !== newSessionId) {
        await prisma.visionSession.update({
          where: { id: session.id },
          data: { sessionId: newSessionId }
        });
        report.renumbered.push({
          from: session.sessionId,
          to: newSessionId
        });
        console.log(`   ✅ ${session.sessionId} → ${newSessionId}`);
      }
    }

    // Step 4: Get final state
    const finalSessions = await prisma.visionSession.findMany({
      orderBy: { sessionId: 'asc' },
      include: {
        _count: {
          select: { assets: true, checklistItems: true }
        }
      }
    });

    report.after = {
      total: finalSessions.length,
      sessions: finalSessions.map(s => ({
        sessionId: s.sessionId,
        workingTitle: s.workingTitle,
        assets: s._count.assets,
        checklist: s._count.checklistItems,
        source: s.originalZipFilename
      }))
    };

    console.log('✅ Cleanup complete!');

    return NextResponse.json({
      success: true,
      message: 'Duplicates cleaned successfully',
      report
    });

  } catch (error: any) {
    console.error('❌ Cleanup failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message 
      },
      { status: 500 }
    );
  }
}
