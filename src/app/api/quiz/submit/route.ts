import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { calculatePersonality } from '@/lib/quiz-logic'
import { Prisma } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const { inviteCodeId, answers } = await request.json()

    if (!inviteCodeId || !answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: '参数错误' }, { status: 400 })
    }

    if (answers.length !== 12) {
      return NextResponse.json({ error: '请完成所有12道题目' }, { status: 400 })
    }

    // 验证邀请码
    const inviteCode = await prisma.inviteCode.findUnique({
      where: { id: inviteCodeId },
    })

    if (!inviteCode) {
      return NextResponse.json({ error: '邀请码不存在' }, { status: 400 })
    }

    if (!inviteCode.isActive) {
      return NextResponse.json({ error: '邀请码已失效' }, { status: 400 })
    }

    if (inviteCode.usedCount >= inviteCode.maxUses) {
      return NextResponse.json({ error: '邀请码使用次数已达上限' }, { status: 400 })
    }

    if (inviteCode.validUntil && inviteCode.validUntil < new Date()) {
      return NextResponse.json({ error: '邀请码已过期' }, { status: 400 })
    }

    // 计算人格类型
    const { type: personalityType, scores } = calculatePersonality(answers)

    // 保存测试记录
    const testRecord = await prisma.testRecord.create({
      data: {
        inviteCodeId,
        answers: answers as unknown as Prisma.InputJsonValue,
        personalityType,
        scores: scores as unknown as Prisma.InputJsonValue,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    })

    // 更新邀请码使用次数
    await prisma.inviteCode.update({
      where: { id: inviteCodeId },
      data: { usedCount: { increment: 1 } },
    })

    return NextResponse.json({
      id: testRecord.id,
      personalityType,
      scores,
    })
  } catch (error) {
    console.error('Submit quiz error:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
