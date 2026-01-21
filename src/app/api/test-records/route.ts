import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken, getTokenFromRequest, getTokenFromCookie } from '@/lib/jwt'

// 验证管理员权限
function verifyAdmin(request: NextRequest) {
  // 先尝试从 Authorization header 获取
  let token = getTokenFromRequest(request.headers.get('authorization'))

  // 如果没有，尝试从 cookie 获取
  if (!token) {
    token = getTokenFromCookie(request.headers.get('cookie'))
  }

  if (!token) return null
  return verifyToken(token)
}

// GET - 获取所有测试记录
export async function GET(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const testRecords = await prisma.testRecord.findMany({
      orderBy: { completedAt: 'desc' },
      include: {
        inviteCode: {
          select: { code: true },
        },
      },
      take: 100,
    })

    return NextResponse.json(testRecords)
  } catch (error) {
    console.error('Get test records error:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
