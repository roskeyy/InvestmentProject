import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'aMUakAbzH2TCxw8G3fpA_j-97ihPtC3Aliql_qAY8rQ'
const JWT_ALGORITHM = process.env.JWT_ALGORITHM || 'HS256'
const ACCESS_TOKEN_EXPIRE_MINUTES = parseInt(process.env.ACCESS_TOKEN_EXPIRE_MINUTES || '10080')

export interface TokenPayload {
  adminId: string
  username: string
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    algorithm: JWT_ALGORITHM as jwt.Algorithm,
    expiresIn: `${ACCESS_TOKEN_EXPIRE_MINUTES}m`,
  })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET, {
      algorithms: [JWT_ALGORITHM as jwt.Algorithm],
    }) as TokenPayload
  } catch (error) {
    return null
  }
}

export function getTokenFromRequest(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7)
}

export function getTokenFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null
  const cookies = cookieHeader.split(';').map(c => c.trim())
  const tokenCookie = cookies.find(c => c.startsWith('admin_token='))
  if (!tokenCookie) return null
  return tokenCookie.substring('admin_token='.length)
}
