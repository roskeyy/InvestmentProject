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

// PATCH - 更新邀请码
export async function PATCH(
  request: NextRequest,
  { params }: { params: { codeId: string } }
) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    const { isActive, maxUses, validUntil } = await request.json()

    const inviteCode = await prisma.inviteCode.update({
      where: { id: params.codeId },
      data: {
        ...(isActive !== undefined && { isActive }),
        ...(maxUses && { maxUses }),
        ...(validUntil && { validUntil: new Date(validUntil) }),
      },
    })

    return NextResponse.json(inviteCode)
  } catch (error) {
    console.error('Update invite code error:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

// DELETE - 删除邀请码
export async function DELETE(
  request: NextRequest,
  { params }: { params: { codeId: string } }
) {
  const admin = verifyAdmin(request)
  if (!admin) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  try {
    await prisma.inviteCode.delete({
      where: { id: params.codeId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete invite code error:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
