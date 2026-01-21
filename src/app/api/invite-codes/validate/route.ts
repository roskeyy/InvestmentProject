import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: '邀请码不能为空' }, { status: 400 })
    }

    const inviteCode = await prisma.inviteCode.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!inviteCode) {
      return NextResponse.json({ error: '邀请码不存在' }, { status: 404 })
    }

    if (!inviteCode.isActive) {
      return NextResponse.json({ error: '邀请码已失效' }, { status: 400 })
    }

    if (inviteCode.validUntil && inviteCode.validUntil < new Date()) {
      return NextResponse.json({ error: '邀请码已过期' }, { status: 400 })
    }

    if (inviteCode.usedCount >= inviteCode.maxUses) {
      return NextResponse.json({ error: '邀请码使用次数已达上限' }, { status: 400 })
    }

    return NextResponse.json({
      id: inviteCode.id,
      code: inviteCode.code,
      valid: true,
    })
  } catch (error) {
    console.error('Validate invite code error:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
