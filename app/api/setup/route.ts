import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function GET(req: NextRequest) {
  try {
    // Run migrations
    const { stdout, stderr } = await execAsync('npx prisma migrate deploy')
    
    return NextResponse.json({
      success: true,
      message: 'Migrations completed',
      stdout,
      stderr
    })
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        stdout: error.stdout,
        stderr: error.stderr
      },
      { status: 500 }
    )
  }
}
