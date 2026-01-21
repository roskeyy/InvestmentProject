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

// GET - 获取所有邀请码
export async function GET(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const inviteCodes = await prisma.inviteCode.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        creator: {
          select: { username: true },
        },
        _count: {
          select: { testRecords: true },
        },
      },
    })

    return NextResponse.json(inviteCodes)
  } catch (error) {
    console.error('Get invite codes error:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

// POST - 创建新邀请码
export async function POST(request: NextRequest) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const { code, maxUses, validUntil } = await request.json()

    if (!code || !maxUses) {
      return NextResponse.json({ error: '参数错误' }, { status: 400 })
    }

    const inviteCode = await prisma.inviteCode.create({
      data: {
        code: code.toUpperCase(),
        maxUses,
        validUntil: validUntil ? new Date(validUntil) : null,
        createdBy: admin.adminId,
      },
    })

    return NextResponse.json(inviteCode)
  } catch (error: any) {
    console.error('Create invite code error:', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: '邀请码已存在' }, { status: 400 })
    }
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
