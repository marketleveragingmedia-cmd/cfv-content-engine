/**
 * Admin API: Reset Session Numbers
 * 
 * DELETE test imports and renumber remaining sessions to match source filenames
 * CRITICAL: Session IDs must match external workflow filenames exactly
 * 
 * POST /api/admin/reset-sessions
 * Body: { "confirmReset": true }
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (body.confirmReset !== true) {
      return NextResponse.json(
        { error: 'Must confirm reset with confirmReset: true' },
        { status: 400 }
      );
    }

    console.log('🔄 Starting session reset...');

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
          assets: s._count.assets,
          checklist: s._count.checklistItems
        }))
      },
      deleted: [] as string[],
      renumbered: [] as { from: string; to: string }[],
      after: {
        total: 0,
        sessions: [] as any[]
      }
    };

    // Step 2: Delete test sessions (0 assets AND 0 checklist items) OR malformed titles
    const sessionsToDelete = allSessions.filter(s => 
      (s._count.assets === 0 && s._count.checklistItems === 0) ||
      (s.workingTitle && (s.workingTitle.includes('---') || s.workingTitle.includes('_')))
    );

    for (const session of sessionsToDelete) {
      await prisma.visionSession.delete({
        where: { id: session.id }
      });
      report.deleted.push(session.sessionId);
      console.log(`   ✅ Deleted ${session.sessionId}`);
    }

    // Step 3: Get remaining sessions
    const remainingSessions = await prisma.visionSession.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        _count: {
          select: { assets: true, checklistItems: true }
        }
      }
    });

    // Step 4: Renumber to match source filenames
    // CFV VS 00001 → CFV-VS-00001 (exact match required)
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

    // Step 5: Get final state
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

    console.log('✅ Reset complete!');

    return NextResponse.json({
      success: true,
      message: 'Session numbers reset successfully',
      report
    });

  } catch (error: any) {
    console.error('❌ Reset failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message 
      },
      { status: 500 }
    );
  }
}
