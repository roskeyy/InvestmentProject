import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getTokenFromRequest, getTokenFromCookie } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  // 先尝试从 Authorization header 获取
  let token = getTokenFromRequest(request.headers.get('authorization'))

  // 如果没有，尝试从 cookie 获取
  if (!token) {
    token = getTokenFromCookie(request.headers.get('cookie'))
  }

  if (!token) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  const payload = verifyToken(token)
  if (!payload) {
    return NextResponse.json({ error: '未授权' }, { status: 401 })
  }

  return NextResponse.json({ valid: true, admin: payload })
}
